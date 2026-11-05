import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// A 3x phone is the case the 2x cap exists for, so this file runs at that density.
test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });

// Lazy images load only once they near the viewport.
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

test("AC-cards-optimized: a phone reader gets AVIF cards no larger than the 2x width", async ({ page }) => {
  await page.goto("/blog/");
  await scrollThrough(page);
  const cards = page.locator("article.card img");
  expect(await cards.count()).toBeGreaterThan(0);
  const widths: number[] = [];
  for (const card of await cards.all()) {
    const { current, srcset } = await card.evaluate((img: HTMLImageElement) => ({
      current: new URL(img.currentSrc).pathname,
      srcset: img.closest("picture")?.querySelector<HTMLSourceElement>('source[type="image/avif"]')?.srcset ?? "",
    }));
    expect(current).toMatch(/\.avif$/);
    const entry = srcset.split(",").map((part) => part.trim()).find((part) => part.startsWith(current));
    widths.push(Number.parseInt(entry?.split(" ")[1] ?? "", 10));
  }
  // 800 is the 2x cap: larger is wasted weight, and never reaching it means blurry cards.
  expect(Math.max(...widths)).toBe(800);
});
