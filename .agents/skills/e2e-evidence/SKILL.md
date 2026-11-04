---
name: e2e-evidence
description: Write a Playwright test that proves one plan behavior criterion with video evidence. Use when a plan task closes an AC-* behavior criterion on the site.
---

# End-to-end evidence

Follow this for each behavior criterion. The setup is in `docs/TESTING_GUIDE.md`.

1. Add the test under `e2e/`, importing `test` and `expect` from `./fixtures`. That fixture stops test runs from reaching the production analytics property.
2. Name the test with the criterion id first, such as `AC-3: a reader filters posts by category`, and write one `test.step` per use-case step.
3. See it fail before implementing the behavior.
4. Assert what a reader can observe. Find elements by role and visible name where possible. UI text is in Spanish.
5. Run it through `bash scripts/e2e-gate.sh <AC-id>`. The gate builds the site, serves it, and fails if the test fails or its video is missing.
6. Do not close the criterion by reporting a result. If the result must be judged by eye, such as an animation or a layout, add a second criterion for the owner's sign-off.

Do not assert on the content of a specific post unless the criterion is about it, because posts change. A test that needs a known post should read it from the page.
