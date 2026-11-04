#!/usr/bin/env bash
# Proves the lint rules are active: a clean run alone cannot tell a clean repository from rules that never ran.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
output=$(mktemp)
trap 'rm -f "$output"' EXIT
failures=0

not_ok() {
  echo "NOT OK: $1"
  tail -20 "$output"
  failures=$((failures + 1))
}

# Expects the source to fail on the named rule, so a probe can only pass for its own reason.
fails_on() {
  local rule=$1 filename=$2 source=$3
  printf '%s\n' "$source" | pnpm exec eslint --stdin --stdin-filename "$filename" >"$output" 2>&1
  if [ $? -ne 1 ] || ! grep -qF -- "$rule" "$output"; then
    not_ok "$filename should fail on $rule"
  else
    echo "ok: $filename fails on $rule"
  fi
}

passes() {
  local filename=$1 source=$2
  if ! printf '%s\n' "$source" | pnpm exec eslint --stdin --stdin-filename "$filename" >"$output" 2>&1; then
    not_ok "$filename should pass"
  else
    echo "ok: $filename passes"
  fi
}

gtag_script='<script>function gtag() { return arguments; } gtag();</script>'

passes src/lint-probe.ts 'export const value = 1;'
fails_on astro/jsx-a11y/alt-text src/pages/lint-probe.astro '<img src="a.png" />'
fails_on @typescript-eslint/no-explicit-any src/lint-probe.ts 'export const value: any = 1;'
fails_on no-undef src/js/lint-probe.js 'export const value = missingName;'
fails_on prefer-rest-params src/pages/lint-probe.astro "$gtag_script"
passes src/layouts/MainHead.astro "$gtag_script"

[ "$failures" -eq 0 ] || { echo "$failures case(s) failed"; exit 1; }
