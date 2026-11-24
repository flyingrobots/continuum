#!/bin/sh
set -eu

git config core.hooksPath .githooks
printf '%s\n' 'Configured Git hooks path: .githooks'
