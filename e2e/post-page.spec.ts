import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const CHARLAS_POST = "/blog/software-freedom-day-2025/";
const PRODUCTIVIDAD_POST = "/blog/empieza-con-algo-simple-pero-empieza--ya/";

// The footer under the article: the category chip and the posts to read next.
const postFooter = (page: Page) => page.getByRole("complementary", { name: "Sigue leyendo" });
// Post titles in the order a listing page shows them: newest first, as the footer must.
const listedTitles = async (page: Page, path: string) => {
  await page.goto(path);
  return (await page.locator("article.card h3 a").allTextContents()).map((title) =>
    title.trim(),
  );
};
const footerPostTitles = async (page: Page) =>
  (await postFooter(page).getByRole("listitem").getByRole("heading").allTextContents()).map((title) => title.trim());

test("AC-single-column: the post footer sits below the article, whose text is at most 65ch wide", async ({ page }) => {
  for (const width of [1280, 375]) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(CHARLAS_POST);
      const article = page.locator(".post-content .content");
      const footer = postFooter(page);
      await expect(footer).toBeVisible();

      const articleBox = (await article.boundingBox())!;
      const footerBox = (await footer.boundingBox())!;
      expect(footerBox.y).toBeGreaterThanOrEqual(articleBox.y + articleBox.height);

      const { widest, measure } = await article.evaluate((element) => {
        const probe = document.createElement("span");
        probe.textContent = "0".repeat(65);
        probe.style.cssText = "position:absolute;white-space:nowrap;visibility:hidden";
        element.querySelector("p")!.append(probe);
        const measure = probe.getBoundingClientRect().width;
        probe.remove();
        const widest = Math.max(...[...element.querySelectorAll("p")].map((p) => p.getBoundingClientRect().width));
        return { widest, measure };
      });
      expect(widest).toBeLessThanOrEqual(measure + 1);
    });
  }
});

test("AC-footer-category: the footer links only this post's category, with no cloud, and the header keeps its badge", async ({ page }) => {
  await page.goto(CHARLAS_POST);
  const chips = postFooter(page).locator('a[href^="/category/"]');
  await expect(chips).toHaveCount(1);
  await expect(chips).toHaveAttribute("href", "/category/charlas");
  await expect(page.locator("main header a.badge")).toHaveAttribute("href", "/category/charlas");
  // The badge and the chip are the only category links: the cloud of all categories is gone.
  await expect(page.locator('main a[href^="/category/"]')).toHaveCount(2);
});

test("AC-related-same-category: a Charlas post lists 3 other Charlas posts under Artículos relacionados", async ({ page }) => {
  await page.goto(CHARLAS_POST);
  const current = (await page.locator("h1").textContent())!.trim();
  await expect(postFooter(page).getByRole("heading", { name: "Artículos relacionados" })).toBeVisible();
  const footer = await footerPostTitles(page);
  const charlas = await listedTitles(page, "/category/charlas/");
  expect(footer).toEqual(charlas.filter((title) => title !== current).slice(0, 3));
});

test("AC-related-fill: a post alone in its category lists the 3 newest posts under Más artículos", async ({ page }) => {
  await page.goto(PRODUCTIVIDAD_POST);
  const current = (await page.locator("h1").textContent())!.trim();
  await expect(postFooter(page).getByRole("heading", { name: "Más artículos" })).toBeVisible();
  const footer = await footerPostTitles(page);
  // The post is alone in Productividad, so the footer is the newest posts on the blog index.
  expect(await listedTitles(page, "/category/productividad/")).toEqual([current]);
  const newest = await listedTitles(page, "/blog/");
  expect(footer).toEqual(newest.filter((title) => title !== current).slice(0, 3));
});

test("AC-related-list: the footer posts stack, each with its title, a one-line description, author, date and an image on the right", async ({ page }) => {
  for (const width of [1280, 375]) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(CHARLAS_POST);
      const items = postFooter(page).getByRole("listitem");
      await expect(items).toHaveCount(3);
      for (const item of await items.all()) {
        await expect(item.getByRole("heading")).toBeVisible();
        await expect(item.locator("p")).not.toBeEmpty();
        await expect(item.locator("small")).toContainText("Sergio Estrella");
        await expect(item.locator("img")).toBeVisible();
      }

      // Measured in one pass, so scrolling between measurements cannot shift the boxes.
      const layout = await items.evaluateAll((elements) =>
        elements.map((li) => {
          const box = (selector: string) => li.querySelector(selector)!.getBoundingClientRect();
          const description = getComputedStyle(li.querySelector("p")!);
          return {
            top: li.getBoundingClientRect().top,
            bottom: li.getBoundingClientRect().bottom,
            titleRight: box("h3").right,
            imageLeft: box("img").left,
            descriptionHeight: box("p").height,
            lineHeight: parseFloat(description.lineHeight),
            ellipsis: description.textOverflow,
          };
        }),
      );
      layout.forEach((item, index) => {
        if (index > 0) expect(item.top).toBeGreaterThanOrEqual(layout[index - 1].bottom);
        // One line, cut with an ellipsis.
        expect(item.descriptionHeight).toBeLessThan(item.lineHeight * 2);
        expect(item.ellipsis).toBe("ellipsis");
        expect(item.imageLeft).toBeGreaterThanOrEqual(item.titleRight);
      });
    });
  }
});

test("AC-single-h1: every post page has one h1, the post's title", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const posts = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((path) => /^\/blog\/(?!\d+\/$)[^/]+\/$/.test(path));
  expect(posts.length).toBeGreaterThan(0);

  for (const path of posts) {
    await page.goto(path);
    const title = (await page.title()).replace(/ - Sergio Estrella$/, "");
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator("h1"), path).toHaveText(title);
  }
});
