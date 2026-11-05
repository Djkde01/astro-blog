#!/bin/sh
# Runs from `prepare`, which also runs on deploy hosts, so nothing here may fail an install. Keep it POSIX.
[ -e .git ] || exit 0
git config core.hooksPath .githooks || echo "Could not activate the pre-push hook" >&2
