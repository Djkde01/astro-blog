#!/bin/sh
# Runs from `prepare`, which also runs on deploy hosts, so nothing here may fail an install. Keep it POSIX.
# Links only pre-push: core.hooksPath on a tracked directory would let a branch run hooks on checkout.
warn() {
  echo "Could not activate the pre-push hook" >&2
  exit 0
}

[ -e .git ] || exit 0
hook=$(git rev-parse --git-common-dir)/hooks/pre-push || warn
[ -e "$hook" ] || [ -L "$hook" ] && exit 0
mkdir -p "$(dirname "$hook")" && ln -s ../../.githooks/pre-push "$hook" || warn
