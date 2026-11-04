import { expect, test } from "@playwright/test";

test("AC-fixture-pass: a passing test", async ({ page }) => {
  await page.setContent("<h1>ok</h1>");
  await expect(page.locator("h1")).toHaveText("ok");
});
