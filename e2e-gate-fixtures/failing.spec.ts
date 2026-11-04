import { expect, test } from "@playwright/test";

test("AC-fixture-fail: a failing test", async ({ page }) => {
  await page.setContent("<h1>ok</h1>");
  await expect(page.locator("h1")).toHaveText("not ok", { timeout: 500 });
});
