#!/usr/bin/env bash

VERSION="$1"
./node_modules/.bin/json -I -f package.json -e "this.version=\"$VERSION\""
