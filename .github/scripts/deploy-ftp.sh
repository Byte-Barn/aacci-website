#!/usr/bin/env bash
# Upload a built site to a web host over FTP, sending only what changed.
#
#   deploy-ftp.sh <local dir>
#
# Environment:
#   FTP_HOST, FTP_USERNAME, FTP_PASSWORD, FTP_PATH   required
#   FTP_PROTOCOL   ftps (default, explicit TLS) or ftp
#   FTP_PORT       default 21
#   FTP_PARALLEL   simultaneous connections, default 4
#   FTP_VERIFY_CERT  the server's TLS certificate is checked (default true).
#                    Setting this to false turns the check off; only do that
#                    knowingly, for a host whose certificate cannot be fixed.
#
# A list of every file and its checksum is kept on the server as
# .deploy-manifest. Each run compares the new build with that list, uploads
# new and changed files, removes files that no longer exist, then replaces the
# list. With no list on the server, everything is uploaded.
set -euo pipefail

local_dir="${1:?usage: deploy-ftp.sh <local dir>}"
: "${FTP_HOST:?}" "${FTP_USERNAME:?}" "${FTP_PASSWORD:?}" "${FTP_PATH:?}"
protocol="${FTP_PROTOCOL:-ftps}"
port="${FTP_PORT:-21}"
parallel="${FTP_PARALLEL:-4}"
verify="${FTP_VERIFY_CERT:-true}"
manifest_name=".deploy-manifest"
# Netlify-only files: meaningless on an FTP host, so not published.
skip_names=(_redirects _headers)

warn() { echo "::warning::$*"; }
fail() { echo "::error::$*"; exit 1; }

# --- FTP_HOST must end up as a bare server name. Tolerate common paste
# mistakes and say which one was found, without printing the value.
host="$(printf '%s' "$FTP_HOST" | tr -d '[:space:]')"
[ -n "$host" ] || fail "The FTP_HOST secret is empty."
[ "$host" = "$FTP_HOST" ] || warn "FTP_HOST contains whitespace; ignoring it."
case "$host" in *://*) warn "FTP_HOST starts with a scheme such as ftp://; ignoring it."; host="${host#*://}";; esac
case "$host" in */*) warn "FTP_HOST contains a path; ignoring it. Folders belong in FTP_PATH."; host="${host%%/*}";; esac
case "$host" in *@*) warn "FTP_HOST contains user@; ignoring it."; host="${host##*@}";; esac
case "$host" in *:*) warn "FTP_HOST contains a port; using it."; port="${host##*:}"; host="${host%%:*}";; esac
echo "::add-mask::$host"
if ! getent hosts "$host" > /dev/null; then
  case "$host" in
    *.*) fail "FTP_HOST looks like a server name but does not exist in DNS. Check it for a typo, or use the server's IP address.";;
    *) fail "FTP_HOST has no dot in it, so it is not a server name. It should look like ftp.example.org.";;
  esac
fi

remote_dir="${FTP_PATH%/}"
[ -n "$remote_dir" ] || remote_dir="/"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
export LFTP_PASSWORD="$FTP_PASSWORD"

# Quote a string for an lftp command file.
q() { local s="${1//\\/\\\\}"; printf '"%s"' "${s//\"/\\\"}"; }

# Run lftp commands (read from stdin) against the server.
ftp_run() {
  {
    echo "set cmd:fail-exit true"
    echo "set net:timeout 30"
    echo "set net:max-retries 6"
    echo "set net:reconnect-interval-base 5"
    echo "set net:reconnect-interval-max 30"
    echo "set ftp:passive-mode true"
    echo "set ssl:verify-certificate $verify"
    if [ "$protocol" = "ftp" ]; then
      echo "set ftp:ssl-allow false"
    else
      echo "set ftp:ssl-force true"
      echo "set ftp:ssl-protect-data true"
    fi
    echo "open -u $(q "$FTP_USERNAME") --env-password -p $(q "$port") $(q "$host")"
    cat
  } > "$work/commands"
  lftp -f "$work/commands"
}

# --- What this build contains.
cd "$local_dir"
for name in "${skip_names[@]}"; do rm -f "./$name"; done
rm -f "./$manifest_name"
find . -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum > "$work/new"
total="$(wc -l < "$work/new")"

# --- What the server has, according to the last deploy.
if echo "get $(q "$remote_dir/$manifest_name") -o $(q "$work/old")" | ftp_run 2> "$work/get.err"; then
  echo "Found the list from the previous deploy."
else
  # A missing file and a failed connection both land here. Check which.
  echo "cd $(q "$remote_dir")" | ftp_run > /dev/null \
    || fail "Could not connect, log in, or open FTP_PATH on the server. $(tail -n 1 "$work/get.err")"
  echo "No previous deploy list on the server: uploading everything."
  : > "$work/old"
fi

# Changed or new: lines in the new list that the old one lacks.
LC_ALL=C sort "$work/old" > "$work/old.sorted"
LC_ALL=C sort "$work/new" > "$work/new.sorted"
comm -13 "$work/old.sorted" "$work/new.sorted" | cut -c67- > "$work/upload"
# Removed: paths in the old list that the new one lacks.
comm -23 <(cut -c67- "$work/old.sorted" | LC_ALL=C sort) <(cut -c67- "$work/new.sorted" | LC_ALL=C sort) > "$work/delete"

uploads="$(wc -l < "$work/upload")"
deletes="$(wc -l < "$work/delete")"
echo "Files in this build: $total. To upload: $uploads. To remove: $deletes."

if [ "$uploads" -eq 0 ] && [ "$deletes" -eq 0 ]; then
  echo "The server is already up to date."
  exit 0
fi

# --- Upload. Changed files are hard-linked into a staging folder so one
# parallel mirror can send them and create any folders they need.
if [ "$uploads" -gt 0 ]; then
  mkdir "$work/stage"
  while IFS= read -r path; do
    mkdir -p "$work/stage/$(dirname "$path")"
    ln "$path" "$work/stage/$path" 2> /dev/null || cp "$path" "$work/stage/$path"
  done < "$work/upload"
  echo "mirror --reverse --parallel=$parallel --no-perms --no-umask --verbose=1 $(q "$work/stage/") $(q "$remote_dir/")" \
    | ftp_run || fail "Upload failed."
fi

# --- Remove files that are no longer part of the site, then record the new list.
{
  while IFS= read -r path; do
    echo "rm -f $(q "$remote_dir/${path#./}")"
  done < "$work/delete"
  echo "put $(q "$work/new") -o $(q "$remote_dir/$manifest_name")"
} | ftp_run || fail "Uploaded the files, but could not finish cleaning up or save the deploy list."

echo "Deployed: $uploads uploaded, $deletes removed."
