#!/usr/bin/env bash

set -euo pipefail

# Every file this script creates holds Strapi's signing keys and the SMTP password, so none
# of them may be readable by other accounts on the host.
#
# umask rather than a chmod after the fact: the permissions are then correct from the moment
# the file exists, instead of for the window between the write and the fix — and a later edit
# that adds another output file inherits the restriction without anyone remembering to.
#
# This is not a one-off cleanup. The deploy recreates .env, so permissions set by hand on the
# server are reverted on the next run.
umask 077

# The intermediate file is written before it replaces .env; if awk fails, the '&&' below
# leaves it behind holding every secret it had merged so far.
trap 'rm -f .env.merged' EXIT

# awk reports a file it cannot open and then carries on with an exit status of 0, so a source
# that is present but unreadable produced a .env silently missing whatever was in it —
# dropping JWT_SECRET, for instance, which signs every admin session. Tightening these files
# to 600 makes that failure reachable: a deploy running as a different user than the one that
# owns them lands exactly here. So it is refused loudly instead.
#
# A file that is simply absent is not an error — the first deploy on a fresh host has no
# merged .env yet. It is passed as /dev/null rather than dropped, because the awk script
# identifies its inputs by position and removing one would shift the rest onto the wrong
# meaning.
inputs=()

for file in backend/.env frontend/.env .env; do
  if [ -e "$file" ] && [ ! -r "$file" ]; then
    echo "merge_env: $file exists but is not readable by $(id -un) — refusing to write a partial .env" >&2
    exit 1
  fi

  if [ -f "$file" ]; then
    inputs+=("$file")
  else
    echo "merge_env: $file not found, continuing without it" >&2
    inputs+=(/dev/null)
  fi
done

# Values are split on the FIRST '=' only. Splitting on every '=' (awk -F'=' with $2) silently
# truncated every base64 secret that carries '=' padding: APP_KEYS lost everything after its
# first key, and JWT_SECRET, API_TOKEN_SALT and ADMIN_JWT_SECRET each lost their trailing
# '=='. Strapi was being handed shortened keys on every deploy.
awk '
  /^[[:space:]]*($|#)/ { next }

  {
    eq = index($0, "=")
    if (eq == 0) next
    key = substr($0, 1, eq - 1)
    val = substr($0, eq + 1)
  }

  FILENAME == ARGV[1] {
    backend[key] = val; next
  }
  FILENAME == ARGV[2] {
    frontend[key] = val; next
  }
  FILENAME == ARGV[3] {
    original[key] = val; next
  }

  END {
    for (k in backend)   keys[k] = 1
    for (k in frontend)  keys[k] = 1
    for (k in original)  keys[k] = 1

    for (k in keys) {
      if (k in original) {
        print k "=" original[k]
      }
      else if ((k in backend) && (k in frontend)) {
        print k "_BACKEND=" backend[k]
        print k "_FRONTEND=" frontend[k]
      }
      else if (k in backend) {
        print k "=" backend[k]
      }
      else {
        print k "=" frontend[k]
      }
    }
  }
' "${inputs[@]}" > .env.merged \
  && mv .env.merged .env

# The sources are only read here, but this is the one step of the deploy that has all three in
# hand — and they carry the same secrets as the file it builds. Stated explicitly as well as
# through umask, because mv keeps the permissions of whatever it moves and a file that arrived
# on the server some other way would otherwise keep its own.
# An explicit `if`, not `[ -f ] && chmod`: under `set -e` that form makes a missing file the
# exit status of the loop body and stops the deploy.
for file in .env backend/.env frontend/.env; do
  if [ -f "$file" ]; then
    chmod 600 "$file"
  fi
done

echo "Merge .env successful (secrets restricted to the owner)"
