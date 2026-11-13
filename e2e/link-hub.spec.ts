import type { BrowserContext, Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { landing } from "../src/data/landing";
import { linkHub } from "../src/data/links";

const WIDTHS = [1280, 375];
const { links: LINKS, newTabNote: NEW_TAB_NOTE } = linkHub;

// External links never leave the machine: every non-local navigation gets a stub page.
const stubExternal = (context: BrowserContext) =>
  context.route(/^https?:\/\/(?!localhost)/, (route) =>
    route.request().resourceType() === "document"
      ? route.fulfill({ contentType: "text/html", body: "<p>stub</p>" })
      : route.fallback(),
  );
const hubLinks = (page: Page) => page.locator("main a[data-link-id]");
const linkById = (page: Page, id: string) => page.locator(`main a[data-link-id="${id}"]`);
// Clicks (or presses Enter on) a link and returns the URL the new page opened.
const openedUrl = async (context: BrowserContext, action: () => Promise<void>) => {
  const [opened] = await Promise.all([context.waitForEvent("page"), action()]);
  await opened.waitForLoadState("domcontentloaded");
  const url = opened.url();
  await opened.close();
  return url;
};
const expectOpened = (url: string, href: string) => expect(url).toBe(new URL(href, "http://localhost:4322").href);
// Replaces window.gtag after load, so the click script must look it up at click time.
const recordGtag = (page: Page) =>
  page.evaluate(() => {
    const win = window as unknown as { gtag: (...args: unknown[]) => void; gtagCalls: unknown[][] };
    win.gtagCalls = [];
    win.gtag = (...args: unknown[]) => win.gtagCalls.push(args);
  });
const gtagCalls = (page: Page) => page.evaluate(() => (window as unknown as { gtagCalls: unknown[][] }).gtagCalls);
const ids = (locator: Locator) => locator.evaluateAll((links) => links.map((link) => link.getAttribute("data-link-id")));

test.beforeEach(async ({ context }) => {
  await stubExternal(context);
});

test("AC-links-real: every link is a real anchor that opens its URL in a new tab, in order", async ({ page, context }) => {
  for (const width of WIDTHS) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/enlaces");
      expect(await ids(hubLinks(page))).toEqual(LINKS.map(({ id }) => id));
      for (const { id, label, href } of LINKS) {
        const link = linkById(page, id);
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
        await expect(link).toContainText(label);
        await expect(link).toContainText(NEW_TAB_NOTE);
        await expect(link).toBeVisible();
        expectOpened(await openedUrl(context, () => link.click()), href);
      }
    });
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("AC-no-js: every link keeps its href and opens by keyboard", async ({ page, context }) => {
    await page.goto("/enlaces");
    expect(await ids(hubLinks(page))).toEqual(LINKS.map(({ id }) => id));
    for (const { id, href } of LINKS) {
      const link = linkById(page, id);
      await expect(link).toHaveAttribute("href", href);
      await link.focus();
      expectOpened(await openedUrl(context, () => page.keyboard.press("Enter")), href);
    }
  });
});

test("AC-analytics-failure: a missing or throwing gtag never stops a link from opening", async ({ page, context }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  const { id, href } = LINKS[2];
  await page.goto("/enlaces");
  await test.step("gtag missing", async () => {
    await page.evaluate(() => delete (window as unknown as { gtag?: unknown }).gtag);
    expectOpened(await openedUrl(context, () => linkById(page, id).click()), href);
  });
  await test.step("gtag throws", async () => {
    await page.evaluate(() => {
      (window as unknown as { gtag: () => never }).gtag = () => {
        throw new Error("analytics blocked");
      };
    });
    expectOpened(await openedUrl(context, () => linkById(page, id).click()), href);
  });
  expect(errors).toEqual([]);
});

test("AC-event-handover: each click hands gtag one link_click event carrying only its link_id", async ({ page, context }) => {
  await page.goto("/enlaces");
  for (const { id, href } of LINKS) {
    await recordGtag(page);
    expectOpened(await openedUrl(context, () => linkById(page, id).click()), href);
    expect(await gtagCalls(page)).toEqual([["event", "link_click", { link_id: id }]]);
  }
});

test("AC-highlighted: the blog and next-event cards come first, with a label and a description", async ({ page }) => {
  await page.goto("/enlaces");
  const highlighted = page.locator('main [data-links="highlighted"]');
  const rest = page.locator('main [data-links="all"]');
  expect(await ids(highlighted.locator("a[data-link-id]"))).toEqual(LINKS.filter((link) => link.highlighted).map(({ id }) => id));
  expect(await ids(rest.locator("a[data-link-id]"))).toEqual(LINKS.filter((link) => !link.highlighted).map(({ id }) => id));
  for (const card of await highlighted.locator("a[data-link-id]").all()) {
    await expect(card.locator(".link-label")).not.toBeEmpty();
    await expect(card.locator(".link-description")).not.toBeEmpty();
  }
  const highlightedFirst = await highlighted.evaluate(
    (section, other) => Boolean(section.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
    await rest.elementHandle(),
  );
  expect(highlightedFirst).toBe(true);
});

test("AC-header: the page opens with the profile picture, the name and the role", async ({ page }) => {
  await page.goto("/enlaces");
  const header = page.locator("main header");
  await expect(header.locator(`picture img[alt="${landing.hero.photoAlt}"]`)).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(header.locator("h1")).toHaveText(landing.hero.name);
  await expect(header).toContainText(landing.hero.role);
  await expect(header).toContainText(landing.hero.value);
});

test("AC-discoverable: /enlaces is out of the nav, in the sitemap and indexable", async ({ page, request }) => {
  for (const path of ["/", "/enlaces"]) {
    await page.goto(path);
    await expect(page.locator('nav a[href*="enlaces"]')).toHaveCount(0);
  }
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain("<loc>https://sergioestrella.com/enlaces/</loc>");
});
