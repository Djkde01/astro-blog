#!/usr/bin/env bash
# Proves the lint rules are active and the pre-push hook works: a clean run alone cannot tell a clean repository
# from rules that never ran.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
output=$(mktemp)
scratch=$(mktemp -d)
hook=.githooks/pre-push
setup=$PWD/scripts/setup-git-hooks.sh
sh_path=$(command -v sh)
probe=src/lint-hook-probe.ts
trap 'rm -rf "$output" "$scratch" "$probe"' EXIT
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

hook_passes() {
  if ! "$hook" </dev/null >"$output" 2>&1; then
    not_ok "the hook should pass on a clean repository"
  else
    echo "ok: the hook passes on a clean repository"
  fi
}

# Expects the hook to stop the push because of what the temporary file holds.
hook_fails_on() {
  local reason=$1 source=$2
  printf '%s\n' "$source" >"$probe"
  "$hook" </dev/null >"$output" 2>&1
  local code=$?
  rm -f "$probe"
  if [ "$code" -eq 0 ] || ! grep -qF -- "$reason" "$output"; then
    not_ok "the hook should stop on $reason"
  else
    echo "ok: the hook stops on $reason"
  fi
}

# Runs setup in a directory and expects it to exit 0, whatever that directory lacks.
setup_succeeds_in() {
  local dir=$1 label=$2
  shift 2
  if ! (cd "$dir" && env "$@" "$sh_path" "$setup") >"$output" 2>&1; then
    not_ok "setup should exit 0 $label"
  else
    echo "ok: setup exits 0 $label"
  fi
}

check() {
  local label=$1
  shift
  if test "$@"; then
    echo "ok: $label"
  else
    not_ok "$label"
  fi
}

git_in() {
  git -C "$scratch/repo" -c user.name=probe -c user.email=probe@example.com "$@"
}

gtag_script='<script>function gtag() { return arguments; } gtag();</script>'

passes src/lint-probe.ts 'export const value = 1;'
fails_on astro/jsx-a11y/alt-text src/pages/lint-probe.astro '<img src="a.png" />'
fails_on astro/jsx-a11y/anchor-has-content src/pages/lint-probe.astro '<a href="/x"></a>'
fails_on astro/jsx-a11y/aria-role src/pages/lint-probe.astro '<div role="banana"></div>'
fails_on @typescript-eslint/no-explicit-any src/lint-probe.ts 'export const value: any = 1;'
fails_on no-undef src/js/lint-probe.js 'export const value = missingName;'
fails_on prefer-rest-params src/pages/lint-probe.astro "$gtag_script"
passes src/layouts/MainHead.astro "$gtag_script"

hook_passes
hook_fails_on @typescript-eslint/no-explicit-any 'export const value: any = 1;'
# The unused directive is what warns: ESLint reports it, and --max-warnings=0 turns that into a failure.
hook_fails_on "too many warnings" '// eslint-disable-next-line no-undef
export const value = 1;'

git init -q "$scratch/repo"
setup_succeeds_in "$scratch/repo" "in a fresh repository"
check "setup links pre-push" "$(readlink "$scratch/repo/.git/hooks/pre-push")" = ../../.githooks/pre-push
check "setup leaves core.hooksPath unset" -z "$(git -C "$scratch/repo" config --local core.hooksPath)"

# A branch controls .githooks, so it must not be able to run a hook on checkout.
mkdir "$scratch/repo/.githooks"
printf '#!/bin/sh\ntouch "%s/checkout-ran"\n' "$scratch" >"$scratch/repo/.githooks/post-checkout"
printf '#!/bin/sh\necho stub-hook-ran\nexit 1\n' >"$scratch/repo/.githooks/pre-push"
chmod +x "$scratch/repo/.githooks/post-checkout" "$scratch/repo/.githooks/pre-push"
git_in add .
git_in commit -qm probe
git_in checkout -qb other
check "a branch cannot run a hook on checkout" ! -e "$scratch/checkout-ran"

git init -q --bare "$scratch/remote.git"
git_in push "$scratch/remote.git" HEAD:refs/heads/probe >"$output" 2>&1
code=$?
check "a real push runs the linked hook and stops on its failure" "$code" -ne 0 -a -n "$(grep -F stub-hook-ran "$output")"

# Runs the package script's own command, because its fallback would hide a broken entry from the cases above.
# Not through `pnpm run`, which first checks the dependencies that this scratch repository does not have.
git init -q "$scratch/prepared"
mkdir "$scratch/prepared/scripts"
cp package.json "$scratch/prepared/"
cp scripts/setup-git-hooks.sh "$scratch/prepared/scripts/"
prepare=$(node -p "require('./package.json').scripts.prepare")
(cd "$scratch/prepared" && sh -c "$prepare") >"$output" 2>&1
check "the prepare script links the hook" -L "$scratch/prepared/.git/hooks/pre-push"

git init -q "$scratch/custom"
echo custom >"$scratch/custom/.git/hooks/pre-push"
setup_succeeds_in "$scratch/custom" "where a pre-push hook already exists"
check "setup keeps an existing pre-push hook" "$(cat "$scratch/custom/.git/hooks/pre-push")" = custom

# An export can sit inside another repository, whose hooks setup must leave alone.
git init -q "$scratch/parent"
mkdir "$scratch/parent/export"
setup_succeeds_in "$scratch/parent/export" "where there is no .git"
check "setup does nothing where there is no .git" ! -e "$scratch/parent/.git/hooks/pre-push"

git init -q "$scratch/nogit"
setup_succeeds_in "$scratch/nogit" "where git is not installed" PATH=/nonexistent

[ "$failures" -eq 0 ] || { echo "$failures case(s) failed"; exit 1; }
