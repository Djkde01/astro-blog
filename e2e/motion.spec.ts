import type { Page, Response } from "@playwright/test";
import { expect, test } from "./fixtures";

const POST = "/blog/software-freedom-day-2025/";
const LISTINGS = [
  { path: "/", cards: "article.card" },
  { path: "/blog/", cards: "article.card" },
  { path: "/about", cards: "article.project-card" },
];
// GSAP's ScrollTrigger names itself and its tween option with this word; the /blog/ check proves the marker.
const GSAP_MARKER = /scrollTrigger/i;

// Scrolls to the bottom in steps, so every card crosses the viewport.
const scrollThrough = async (page: Page) => {
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 300) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
};

const cardStyles = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((cards) =>
    cards.map((card) => {
      const style = getComputedStyle(card);
      return {
        onScreen: card.getBoundingClientRect().top < window.innerHeight,
        opacity: style.opacity,
        visibility: style.visibility,
        transform: style.transform,
      };
    }),
  );

// Every script the page runs: downloaded files and inline blocks.
const scriptsOf = async (page: Page, path: string) => {
  const bodies: Promise<string>[] = [];
  const collect = (response: Response) => {
    if (response.request().resourceType() === "script") bodies.push(response.text().catch(() => ""));
  };
  page.on("response", collect);
  await page.goto(path);
  page.off("response", collect);
  return [...(await Promise.all(bodies)), ...(await page.locator("script:not([src])").allTextContents())];
};

test.describe("with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" }, viewport: { width: 375, height: 800 } });

  test("AC-reveal-completes: cards below the fold start transparent, cards on screen never do, and every card ends visible", async ({ page }) => {
    for (const { path, cards } of LISTINGS) {
      await test.step(path, async () => {
        await page.goto(path);
        const all = page.locator(cards);
        // The last card is below the fold at 375 px, so the motion script fades it out until it scrolls in.
        await expect(all.last()).toHaveCSS("opacity", "0");
        // Polled: a late font swap can pull a card on screen and start its reveal.
        await expect
          .poll(async () => (await cardStyles(page, cards)).filter((card) => card.onScreen).every((card) => card.opacity === "1"))
          .toBe(true);
        if (path === "/blog/") expect((await cardStyles(page, cards)).some((card) => card.onScreen)).toBe(true);

        await scrollThrough(page);
        for (const card of await all.all()) await expect(card).toBeVisible();
        await expect
          .poll(async () => (await cardStyles(page, cards)).every((card) => card.opacity === "1"))
          .toBe(true);
      });
    }
  });

  test("AC-reveal-completes: a card waiting for its reveal stays in the accessibility tree and takes focus", async ({ page }) => {
    await page.goto("/blog/");
    const waiting = page.locator("article.card").last();
    await expect(waiting).toHaveCSS("opacity", "0");
    // Screen readers and find-in-page must still reach it, so no visibility: hidden.
    await expect(waiting.getByRole("heading")).toHaveCount(1);
    const link = waiting.getByRole("link", { name: "Leer más" });
    await link.evaluate((element: HTMLElement) => element.focus());
    await expect(link).toBeFocused();
  });

  test("AC-hover-lift: after its reveal, a card moves up on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const { path, cards } of LISTINGS) {
      await test.step(path, async () => {
        await page.goto(path);
        await scrollThrough(page);
        const card = page.locator(cards).last();
        await expect.poll(() => card.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
        await card.hover();
        await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
        await expect
          .poll(() => card.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42))
          .toBeLessThan(0);
      });
    }
  });
});

test.describe("with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" }, viewport: { width: 375, height: 800 } });

  test("AC-reduced-motion: every card is visible and still at load, before any scroll", async ({ page }) => {
    for (const { path, cards } of LISTINGS) {
      await test.step(path, async () => {
        await page.goto(path);
        const styles = await cardStyles(page, cards);
        expect(styles.length).toBeGreaterThan(0);
        for (const card of styles) expect(card).toMatchObject({ opacity: "1", visibility: "visible", transform: "none" });
      });
    }
  });
});

test("AC-post-no-gsap: a post page runs no GSAP code, while the blog index does", async ({ page }) => {
  // The post first, so the GSAP chunk cannot come from the cache unreported.
  expect((await scriptsOf(page, POST)).filter((body) => GSAP_MARKER.test(body))).toEqual([]);
  expect((await scriptsOf(page, "/blog/")).some((body) => GSAP_MARKER.test(body))).toBe(true);
});
