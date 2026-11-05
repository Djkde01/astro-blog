import { expect, test } from "./fixtures";

test("AC-about-spacing: inline highlights on the about page keep their spaces", async ({ page }) => {
  await page.goto("/about");
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  expect(text).toContain("un Desarrollador Fullstack");
  expect(text).toContain("con +");
});

test("AC-icons-render: the nav, footer and about icons draw inside their boxes", async ({ page }) => {
  await page.goto("/about");
  for (const name of ["MainIcon", "mdi:rss", "mdi:briefcase"]) {
    const svg = page.locator(`svg[data-icon="${name}"]`).first();
    await expect(svg).toBeVisible();
    const drawn = await svg.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const use = node.querySelector("use")!.getBoundingClientRect();
      return { w: box.width, h: box.height, dw: use.width, dh: use.height, x: use.x - box.x, y: use.y - box.y };
    });
    expect(drawn.w, name).toBeGreaterThan(0);
    expect(drawn.dw, name).toBeGreaterThan(drawn.w / 4);
    expect(drawn.dh, name).toBeGreaterThan(drawn.h / 4);
    expect(drawn.x, name).toBeGreaterThanOrEqual(-1);
    expect(drawn.y, name).toBeGreaterThanOrEqual(-1);
    expect(drawn.x + drawn.dw, name).toBeLessThanOrEqual(drawn.w + 1);
    expect(drawn.y + drawn.dh, name).toBeLessThanOrEqual(drawn.h + 1);
  }
});
