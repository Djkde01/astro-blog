#!/usr/bin/env bash
# Evidence gate. Usage: e2e-gate.sh <AC-id> | --all
# Fails when a selected test fails, when a test.only narrows the run, when no test is
# selected, when a video is missing, or when a selected test's title does not start with the id.
# E2E_GATE_CONFIG exists only for scripts/test-e2e-gate.sh, which points the gate at its fixtures.
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: e2e-gate.sh <AC-id> | --all" >&2
  exit 2
fi
target=$1

repo=$(cd "$(dirname "$0")/.." && pwd)
select_tests=()
label=all
if [ "$target" != "--all" ]; then
  if [[ ! "$target" =~ ^[A-Za-z0-9-]+$ ]]; then
    echo "e2e-gate: an id holds only letters, digits and hyphens: $target" >&2
    exit 2
  fi
  label=$target
  select_tests=(--grep "$target:")
fi

export DWP_EVIDENCE_DIR=${DWP_EVIDENCE_DIR:-$repo/tmp/e2e-evidence/$label}
mkdir -p "$DWP_EVIDENCE_DIR"
report=$(mktemp)
trap 'rm -f "$report"' EXIT

status=0
(
  cd "$repo"
  PLAYWRIGHT_JSON_OUTPUT_NAME="$report" pnpm exec playwright test \
    --config "${E2E_GATE_CONFIG:-playwright.config.ts}" \
    --forbid-only \
    --reporter=list,json \
    "${select_tests[@]+"${select_tests[@]}"}"
) || status=$?

if [ "$status" -ne 0 ]; then
  echo "e2e-gate: Playwright exited $status" >&2
  exit "$status"
fi
if [ "$target" = "--all" ]; then
  node "$repo/scripts/check-e2e-report.mjs" "$report"
else
  node "$repo/scripts/check-e2e-report.mjs" "$report" "$target"
fi
