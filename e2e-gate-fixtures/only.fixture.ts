import { expect, test } from "@playwright/test";

// A forgotten test.only: without the gate's --forbid-only, only the first test would run.
test.only("AC-fixture-only: the focused test passes", async ({ page }) => {
  await page.setContent("<h1>focused</h1>");
  await expect(page.locator("h1")).toHaveText("focused");
});

test("AC-fixture-skipped: the other test would fail", async () => {
  expect(1).toBe(2);
});
