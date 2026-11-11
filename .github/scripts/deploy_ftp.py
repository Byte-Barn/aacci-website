#!/usr/bin/env python3
"""Upload a built site to a web host over FTP, sending only what changed.

    deploy_ftp.py <local dir>

Uses only the Python standard library, so the CI runner needs nothing installed.

Environment:
    FTP_HOST, FTP_USERNAME, FTP_PASSWORD, FTP_PATH   required
    FTP_PROTOCOL     ftps (default, explicit TLS) or ftp
    FTP_PORT         default 21
    FTP_PARALLEL     simultaneous connections, default 6
    FTP_VERIFY_CERT  the server's TLS certificate is checked (default true).
                     Setting this to false turns the check off; only do that
                     knowingly, for a host whose certificate cannot be fixed.

A list of every file and its checksum is kept on the server as
.deploy-manifest. Each run compares the new build with that list, uploads new
and changed files, removes files that no longer exist, then replaces the list.
With no list on the server, everything is uploaded.

FTP_PATH must already exist on the server. It is never created, because a
wrong path would otherwise be silently filled with a copy of the site.
"""
from __future__ import annotations

import ftplib
import hashlib
import io
import os
import queue
import socket
import ssl
import sys
import threading
import time
from pathlib import Path

MANIFEST = ".deploy-manifest"
# Netlify-only files: meaningless on an FTP host, so not published.
SKIP = {"_redirects", "_headers", MANIFEST}
ATTEMPTS = 6
TIMEOUT = 60


def warn(message: str) -> None:
    print(f"::warning::{message}", flush=True)


def fail(message: str) -> "None":
    print(f"::error::{message}", flush=True)
    sys.exit(1)


def clean_host(raw: str, port: int) -> tuple[str, int]:
    """Reduce FTP_HOST to a bare server name, tolerating common paste mistakes
    and saying which one was found, without printing the value."""
    host = "".join(raw.split())
    if not host:
        fail("The FTP_HOST secret is empty.")
    if host != raw:
        warn("FTP_HOST contains whitespace; ignoring it.")
    if "://" in host:
        warn("FTP_HOST starts with a scheme such as ftp://; ignoring it.")
        host = host.split("://", 1)[1]
    if "/" in host:
        warn("FTP_HOST contains a path; ignoring it. Folders belong in FTP_PATH.")
        host = host.split("/", 1)[0]
    if "@" in host:
        warn("FTP_HOST contains user@; ignoring it.")
        host = host.rsplit("@", 1)[1]
    if ":" in host:
        warn("FTP_HOST contains a port; using it.")
        host, port_text = host.rsplit(":", 1)
        port = int(port_text)
    print(f"::add-mask::{host}", flush=True)
    try:
        socket.getaddrinfo(host, port)
    except socket.gaierror:
        if "." in host:
            fail("FTP_HOST looks like a server name but does not exist in DNS. "
                 "Check it for a typo, or use the server's IP address.")
        fail("FTP_HOST has no dot in it, so it is not a server name. "
             "It should look like ftp.example.org.")
    return host, port


class Server:
    """Connection settings, and a factory for logged-in connections."""

    def __init__(self) -> None:
        env = os.environ
        for name in ("FTP_HOST", "FTP_USERNAME", "FTP_PASSWORD", "FTP_PATH"):
            if not env.get(name):
                fail(f"The {name} secret is missing or empty.")
        self.protocol = env.get("FTP_PROTOCOL") or "ftps"
        if self.protocol not in ("ftps", "ftp"):
            fail("FTP_PROTOCOL must be ftps or ftp.")
        self.host, self.port = clean_host(env["FTP_HOST"], int(env.get("FTP_PORT") or 21))
        self.user = env["FTP_USERNAME"]
        self.password = env["FTP_PASSWORD"]
        self.verify = (env.get("FTP_VERIFY_CERT") or "true").lower() != "false"
        self.root = "/" + env["FTP_PATH"].strip().strip("/")
        self.parallel = max(1, int(env.get("FTP_PARALLEL") or 6))

    def path(self, relative: str) -> str:
        return f"{self.root.rstrip('/')}/{relative}"

    def connect(self) -> ftplib.FTP:
        if self.protocol == "ftps":
            context = ssl.create_default_context()
            if not self.verify:
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
            ftp: ftplib.FTP = ftplib.FTP_TLS(context=context, timeout=TIMEOUT)
        else:
            ftp = ftplib.FTP(timeout=TIMEOUT)
        ftp.connect(self.host, self.port)
        ftp.login(self.user, self.password)
        if isinstance(ftp, ftplib.FTP_TLS):
            ftp.prot_p()
        ftp.set_pasv(True)
        return ftp


def local_manifest(folder: Path) -> dict[str, str]:
    files: dict[str, str] = {}
    for path in sorted(folder.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(folder).as_posix()
        if relative in SKIP:
            continue
        files[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files


def parse_manifest(text: str) -> dict[str, str]:
    files: dict[str, str] = {}
    for line in text.splitlines():
        digest, _, relative = line.partition("  ")
        if digest and relative:
            files[relative] = digest
    return files


def format_manifest(files: dict[str, str]) -> bytes:
    return "".join(f"{digest}  {relative}\n" for relative, digest in sorted(files.items())).encode()


class Uploader:
    """Sends files over several connections, retrying each on network errors."""

    def __init__(self, server: Server, folder: Path, paths: list[str]) -> None:
        self.server = server
        self.folder = folder
        self.jobs: "queue.Queue[str]" = queue.Queue()
        for relative in paths:
            self.jobs.put(relative)
        self.total = len(paths)
        self.done = 0
        self.failed: list[str] = []
        self.made: set[str] = set()
        self.lock = threading.Lock()

    def ensure_folders(self, ftp: ftplib.FTP, relative: str) -> None:
        parts = relative.split("/")[:-1]
        for depth in range(1, len(parts) + 1):
            folder = "/".join(parts[:depth])
            with self.lock:
                if folder in self.made:
                    continue
            try:
                ftp.mkd(self.server.path(folder))
            except ftplib.error_perm:
                pass  # already there; a real problem shows up when the file is stored
            with self.lock:
                self.made.add(folder)

    def worker(self) -> None:
        ftp: ftplib.FTP | None = None
        while not self.failed:
            try:
                relative = self.jobs.get_nowait()
            except queue.Empty:
                break
            error: Exception | None = None
            for attempt in range(1, ATTEMPTS + 1):
                try:
                    if ftp is None:
                        ftp = self.server.connect()
                    self.ensure_folders(ftp, relative)
                    with open(self.folder / relative, "rb") as handle:
                        ftp.storbinary(f"STOR {self.server.path(relative)}", handle)
                    error = None
                    break
                except (ftplib.Error, OSError, EOFError) as exc:
                    error = exc
                    try:
                        if ftp is not None:
                            ftp.close()
                    finally:
                        ftp = None
                    time.sleep(min(5 * attempt, 30))
            with self.lock:
                if error is not None:
                    self.failed.append(f"{relative}: {error}")
                    break
                self.done += 1
                if self.done % 200 == 0 or self.done == self.total:
                    print(f"  uploaded {self.done} of {self.total}", flush=True)
        if ftp is not None:
            try:
                ftp.quit()
            except (ftplib.Error, OSError, EOFError):
                pass

    def run(self) -> None:
        threads = [threading.Thread(target=self.worker) for _ in range(self.server.parallel)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        if self.failed:
            fail(f"Upload failed after {self.done} of {self.total} files. {self.failed[0]}")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    folder = Path(sys.argv[1])
    if not folder.is_dir():
        fail(f"Nothing to deploy: {folder} is not a folder.")
    server = Server()

    try:
        ftp = server.connect()
    except ssl.SSLCertVerificationError as exc:
        fail(f"The server's TLS certificate could not be verified: {exc.verify_message}.")
    except ftplib.error_perm as exc:
        fail(f"The server refused the login: {exc}")
    except (ftplib.Error, OSError, EOFError) as exc:
        fail(f"Could not connect to the server: {exc}")

    try:
        ftp.cwd(server.root)
    except ftplib.error_perm:
        try:
            visible = sorted(name for name in ftp.nlst("/") if name not in (".", ".."))
        except (ftplib.Error, OSError, EOFError):
            visible = []
        hint = f" The account's top folder contains: {', '.join(visible[:20])}." if visible else ""
        fail("FTP_PATH does not exist on the server, as seen by this FTP account. "
             "It is not created automatically." + hint)

    new = local_manifest(folder)
    buffer = io.BytesIO()
    try:
        ftp.retrbinary(f"RETR {server.path(MANIFEST)}", buffer.write)
        old = parse_manifest(buffer.getvalue().decode())
        print("Found the list from the previous deploy.", flush=True)
    except ftplib.error_perm:
        old = {}
        print("No previous deploy list on the server: uploading everything.", flush=True)

    uploads = [relative for relative, digest in new.items() if old.get(relative) != digest]
    deletes = [relative for relative in old if relative not in new]
    print(f"Files in this build: {len(new)}. To upload: {len(uploads)}. To remove: {len(deletes)}.", flush=True)
    if not uploads and not deletes:
        print("The server is already up to date.")
        ftp.quit()
        return
    ftp.close()

    # Pages last, so they never point at scripts and styles not yet uploaded.
    uploads.sort(key=lambda relative: (relative.endswith((".html", ".txt")), relative))
    if uploads:
        Uploader(server, folder, uploads).run()

    try:
        ftp = server.connect()
        for relative in deletes:
            try:
                ftp.delete(server.path(relative))
            except ftplib.error_perm:
                pass  # already gone
        ftp.storbinary(f"STOR {server.path(MANIFEST)}", io.BytesIO(format_manifest(new)))
        ftp.quit()
    except (ftplib.Error, OSError, EOFError) as exc:
        fail(f"Uploaded the files, but could not finish cleaning up or save the deploy list: {exc}")

    print(f"Deployed: {len(uploads)} uploaded, {len(deletes)} removed.")


if __name__ == "__main__":
    main()
