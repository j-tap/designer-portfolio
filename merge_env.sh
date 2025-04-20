#!/usr/bin/env bash

awk -F'=' '
  /^[[:space:]]*($|#)/ { next }

  FILENAME == ARGV[1] {
    backend[$1] = $2
    keys[$1] = 1
    next
  }

  FILENAME == ARGV[2] {
    frontend[$1] = $2
    keys[$1] = 1
    next
  }

  FILENAME == ARGV[3] {
    original[$1] = $2
    all_existing[$1] = 1
    next
  }

  END {
    for (key in keys) {
      if ((key in backend) && (key in frontend)) {
        print key "_BACKEND=" backend[key]
        print key "_FRONTEND=" frontend[key]
      } else if (key in backend) {
        print key "=" backend[key]
      } else if (key in frontend) {
        print key "=" frontend[key]
      }
    }

    for (key in all_existing) {
      if (!(key in keys)) {
        print key "=" original[key]
      }
    }
  }
' backend/.env frontend/.env .env > .env.merged && mv .env.merged .env

echo "Merge .env successfully"
