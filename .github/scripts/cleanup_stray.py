#!/usr/bin/env python3
"""One-off: remove a copy of the site that an early deploy put in the wrong folder.

    cleanup_stray.py <stray folder on the server>

Deletes only the files named in that folder's own .deploy-manifest, the
manifest itself, and folders that are empty afterwards (the server refuses to
remove a folder that still has anything in it). Refuses to touch FTP_PATH.
Connection settings come from the same environment as deploy_ftp.py.
"""
from __future__ import annotations

import ftplib
import io
import sys
import threading
from concurrent.futures import ThreadPoolExecutor

from deploy_ftp import MANIFEST, Server, fail, parse_manifest

ERRORS = (ftplib.Error, OSError, EOFError)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    stray = "/" + sys.argv[1].strip().strip("/")
    server = Server()
    live = server.root.rstrip("/")
    if stray == "/" or stray == live or stray.startswith(live + "/") or live.startswith(stray + "/"):
        fail("Refusing: the folder given is, contains, or is inside the live site folder (FTP_PATH).")

    ftp = server.connect()
    buffer = io.BytesIO()
    try:
        ftp.retrbinary(f"RETR {stray}/{MANIFEST}", buffer.write)
    except ftplib.error_perm:
        fail("No .deploy-manifest in that folder, so there is no list of what to remove. Nothing was deleted.")
    ftp.quit()
    files = sorted(parse_manifest(buffer.getvalue().decode()))
    print(f"Listed for removal: {len(files)} files.", flush=True)

    local = threading.local()
    lock = threading.Lock()
    count = {"removed": 0, "missing": 0, "failed": 0}

    def run(command: str, path: str) -> None:
        """Run DELE or RMD on its thread's own connection, reconnecting on network errors."""
        outcome = "failed"
        for _ in range(5):
            try:
                if getattr(local, "ftp", None) is None:
                    local.ftp = server.connect()
                local.ftp.voidcmd(f"{command} {path}")
                outcome = "removed"
                break
            except ftplib.error_perm:
                outcome = "missing"  # already gone, or a folder that is not empty
                break
            except ERRORS:
                local.ftp = None
        with lock:
            count[outcome] += 1
            done = sum(count.values())
            if done % 500 == 0:
                print(f"  processed {done}", flush=True)

    with ThreadPoolExecutor(max_workers=server.parallel) as pool:
        list(pool.map(lambda relative: run("DELE", f"{stray}/{relative}"), files))
        print(f"Files: {count['removed']} removed, {count['missing']} already gone, {count['failed']} failed.", flush=True)
        run("DELE", f"{stray}/{MANIFEST}")

        # Folders that held those files, deepest first, level by level.
        folders: set[str] = set()
        for relative in files:
            parts = relative.split("/")[:-1]
            folders.update("/".join(parts[:depth]) for depth in range(1, len(parts) + 1))
        count.update(removed=0, missing=0, failed=0)
        for depth in sorted({folder.count("/") for folder in folders}, reverse=True):
            level = [folder for folder in folders if folder.count("/") == depth]
            list(pool.map(lambda folder: run("RMD", f"{stray}/{folder}"), level))
        print(f"Folders: {count['removed']} removed, {count['missing']} kept (not empty or already gone), "
              f"{count['failed']} failed.", flush=True)

    # The stray folder itself, then each parent, stopping at the first that is not empty.
    ftp = server.connect()
    path = stray
    while path:
        try:
            ftp.rmd(path)
            print(f"Removed folder {path}")
        except ERRORS:
            print(f"Stopped at {path}: not empty, or not removable.")
            break
        path = path.rsplit("/", 1)[0]
    ftp.quit()
    if count["failed"]:
        fail("Some items could not be removed because of network errors. Run this again.")


if __name__ == "__main__":
    main()
