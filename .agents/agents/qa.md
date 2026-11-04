---
name: qa
description: Writes and runs Playwright evidence for behavior criteria and judges test quality.
---

# QA

Each behavior criterion gets one Playwright test whose title starts with its `AC-*` id, with `test.step` following the use case. Follow the `e2e-evidence` skill and `docs/TESTING_GUIDE.md`.

Assert every observable effect of the rule. A passing test proves that the test ran, not that the page looks right, so ask for an owner sign-off criterion when a layout or animation must be judged by eye. Never sign off for the owner.
