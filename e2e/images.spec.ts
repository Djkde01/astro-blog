import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

const SITE = "https://sergioestrella.com";

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

test("AC-hero-priority: a post's hero loads first and as AVIF", async ({ page }) => {
  await page.goto("/blog/gdg-devfest-pereira/");
  const hero = page.locator("img.hero-image");
  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.avif(\?|$)/);
});

test("AC-webp-fallback: a browser without AVIF still gets an image", async ({ page }) => {
  await page.goto("/blog/");
  const picture = page.locator("article.card picture").first();
  await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
  await expect(picture.locator("img")).toHaveAttribute("src", /\.webp(\?|$)/);
});

test("AC-social-image-urls: shared posts point at an absolute image that exists", async ({ page, request }) => {
  for (const path of ["/blog/gdg-devfest-pereira/", "/"]) {
    await page.goto(path);
    const urls = await page
      .locator('meta[property="og:image"], meta[property="og:image:url"], meta[property="og:image:secure_url"], meta[name="twitter:image"]')
      .evaluateAll((metas) => metas.map((meta) => meta.getAttribute("content")!));
    expect(urls).toHaveLength(4);
    if (path !== "/") {
      const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() ?? "{}");
      urls.push(ld.image);
    }
    for (const url of urls) {
      expect(url.startsWith(`${SITE}/`)).toBe(true);
      const response = await request.get(url.replace(SITE, ""));
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }
  }
});

test("AC-no-broken-images: every page in the sitemap draws all its images", async ({ page, request }) => {
  // It walks every page, so the default timeout is too tight on a busy machine.
  test.setTimeout(120_000);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  expect(paths.length).toBeGreaterThan(0);
  const failed: string[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "image" && !response.ok()) failed.push(response.url());
  });
  for (const path of paths) {
    await page.goto(path);
    await scrollThrough(page);
    const broken = await page.locator("img").evaluateAll((images) =>
      (images as HTMLImageElement[]).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
    );
    expect(broken, path).toEqual([]);
  }
  expect(failed).toEqual([]);
});
