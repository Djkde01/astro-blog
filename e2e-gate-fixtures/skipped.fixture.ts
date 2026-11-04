import { test } from "@playwright/test";

// Playwright exits 0 when a selected test is skipped, so only the report check can stop it.
test.skip("AC-fixture-skip: a skipped test", async () => {});
