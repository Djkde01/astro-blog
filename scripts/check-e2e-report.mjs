// Fails unless a Playwright JSON report holds at least one test, and every test
// has a final passing result with a non-empty video file. With a criterion id as the
// second argument, every test's title must also start with that id: Playwright's --grep
// matches anywhere in the title, so it can select a test that only mentions the id.
import { readFileSync, statSync } from "node:fs";

function collectTests(suite) {
  const own = (suite.specs ?? []).flatMap((spec) => spec.tests.map((test) => ({ title: spec.title, test })));
  return [...own, ...(suite.suites ?? []).flatMap(collectTests)];
}

function hasVideo(result) {
  return (result.attachments ?? []).some(
    (attachment) =>
      attachment.name === "video" && attachment.path && statSync(attachment.path, { throwIfNoEntry: false })?.size > 0,
  );
}

const report = JSON.parse(readFileSync(process.argv[2], "utf8"));
const criterionId = process.argv[3];
const tests = (report.suites ?? []).flatMap(collectTests);
const problems = [];

if (tests.length === 0) {
  problems.push("no test was selected");
}
for (const { title, test } of tests) {
  if (criterionId && !title.startsWith(`${criterionId}:`)) {
    problems.push(`${title}: title does not start with ${criterionId}`);
    continue;
  }
  const result = test.results.at(-1);
  if (result?.status !== "passed") {
    problems.push(`${title}: final status is ${result?.status ?? "missing"}`);
  } else if (!hasVideo(result)) {
    problems.push(`${title}: video is missing`);
  }
}

if (problems.length > 0) {
  console.error(`e2e-gate: ${problems.join("; ")}`);
  process.exit(1);
}
console.log(`e2e-gate: ${tests.length} test(s) passed, each with its video`);
