#!/usr/bin/env bash
# Proves scripts/e2e-gate.sh passes on real evidence and fails without it.
set -uo pipefail

repo=$(cd "$(dirname "$0")/.." && pwd)
gate="$repo/scripts/e2e-gate.sh"
export E2E_GATE_CONFIG="e2e-gate-fixtures/playwright.config.ts"
evidence=$(mktemp -d)
trap 'rm -rf "$evidence"' EXIT
export DWP_EVIDENCE_DIR="$evidence/run"
failures=0

# With E2E_GATE_EXPECT set, the output must also hold that text, so a case can only pass for its own reason.
check() {
  local expected=$1 name=$2
  shift 2
  bash "$gate" "$@" >"$evidence/output.log" 2>&1
  local actual=$?
  if { [ "$expected" = pass ] && [ "$actual" -ne 0 ]; } || { [ "$expected" = fail ] && [ "$actual" -eq 0 ]; }; then
    echo "NOT OK: $name (expected $expected, exit $actual)"
    tail -20 "$evidence/output.log"
    failures=$((failures + 1))
  elif [ -n "${E2E_GATE_EXPECT:-}" ] && ! grep -qF -- "$E2E_GATE_EXPECT" "$evidence/output.log"; then
    echo "NOT OK: $name (output does not hold: $E2E_GATE_EXPECT)"
    tail -20 "$evidence/output.log"
    failures=$((failures + 1))
  else
    echo "ok: $name"
  fi
}

E2E_GATE_EXPECT="1 test(s) passed" check pass "one criterion passes with its video" AC-fixture-pass
E2E_GATE_FIXTURE_MATCH=failing.spec.ts E2E_GATE_EXPECT="Playwright exited" check fail "one criterion fails when its test fails" AC-fixture-fail
E2E_GATE_FIXTURE_VIDEO=off E2E_GATE_EXPECT="video is missing" check fail "one criterion fails when its video is missing" AC-fixture-pass
E2E_GATE_EXPECT="No tests found" check fail "one criterion fails when no test matches" AC-fixture-none
E2E_GATE_EXPECT="test(s) passed" check pass "--all passes with videos" --all
E2E_GATE_FIXTURE_MATCH="*.spec.ts" E2E_GATE_EXPECT="Playwright exited" check fail "--all fails when a test fails" --all
E2E_GATE_FIXTURE_VIDEO=off E2E_GATE_EXPECT="video is missing" check fail "--all fails when a video is missing" --all
E2E_GATE_EXPECT="usage:" check fail "no argument is rejected"
E2E_GATE_FIXTURE_MATCH=mention.spec.ts E2E_GATE_EXPECT="title does not start with" check fail "a test that only mentions the criterion in its title does not close it" AC-fixture-mentioned
E2E_GATE_EXPECT="an id holds only" check fail "an id with regex characters is rejected" "AC-fixture-.*"
E2E_GATE_FIXTURE_MATCH=only.fixture.ts E2E_GATE_EXPECT="--forbid-only" check fail "--all fails when a test.only narrows the run" --all

# Playwright stops on its own when nothing matches, so the checker's guard is proved directly.
echo '{"suites":[]}' >"$evidence/empty.json"
node "$repo/scripts/check-e2e-report.mjs" "$evidence/empty.json" >"$evidence/output.log" 2>&1
if [ $? -ne 0 ] && grep -qF "no test was selected" "$evidence/output.log"; then
  echo "ok: a report with no tests is rejected"
else
  echo "NOT OK: a report with no tests is rejected"
  failures=$((failures + 1))
fi

[ "$failures" -eq 0 ]
