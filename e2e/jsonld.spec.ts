import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { fixturePost } from "./jsonld-fixture";

const jsonLd = (page: Page) => page.locator('script[type="application/ld+json"]').allTextContents();

test("AC-jsonld-escaped: a quote or markup in a post's frontmatter stays inside its JSON-LD", async ({ page }) => {
  await page.goto("/e2e/jsonld-fixture/");
  await expect(page.getByRole("heading", { name: fixturePost.title, exact: true })).toBeVisible();
  const blocks = await jsonLd(page);
  expect(blocks).toHaveLength(1);
  const data = JSON.parse(blocks[0]);
  expect(data.headline).toBe(fixturePost.title);
  expect(data.description).toBe(fixturePost.description);
  expect(await page.evaluate(() => "__jsonLdInjected" in window)).toBe(false);
});

test("AC-jsonld-parses: every page's JSON-LD parses, and each post's names the post", async ({ page, request }) => {
  test.setTimeout(120_000);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  expect(paths.length).toBeGreaterThan(0);

  for (const path of paths) {
    await page.goto(path);
    const blocks = await jsonLd(page);
    expect(blocks, path).toHaveLength(1);
    const data = JSON.parse(blocks[0]);
    if (/^\/blog\/(?!\d+\/$)[^/]+\/$/.test(path)) expect(data["@type"], path).toBe("BlogPosting");
    if (data["@type"] === "BlogPosting") {
      expect(data.headline, path).toBe((await page.locator("header h2.h2").textContent())?.trim());
    } else {
      expect(data["@type"], path).toBe("WebSite");
    }
  }
});
