import { expect, test } from "@playwright/test";

test("AC-fixture-other: a test that mentions AC-fixture-mentioned: in its text", async ({ page }) => {
  await page.setContent("<h1>ok</h1>");
  await expect(page.locator("h1")).toHaveText("ok");
});
