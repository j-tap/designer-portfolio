#!/usr/bin/env bash

awk -F'=' '
  /^[[:space:]]*($|#)/ { next }

  FILENAME == ARGV[1] {
    backend[$1] = $2; next
  }
  FILENAME == ARGV[2] {
    frontend[$1] = $2; next
  }
  FILENAME == ARGV[3] {
    original[$1] = $2; next
  }

  END {
    # собираем все ключи
    for (k in backend)   keys[k] = 1
    for (k in frontend)  keys[k] = 1
    for (k in original)  keys[k] = 1

    for (k in keys) {
      if (k in original) {
        # если есть в корневом .env — печатаем его
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
' backend/.env frontend/.env .env > .env.merged \
  && mv .env.merged .env

echo "Merge .env успешно"
