import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { about } from "../src/data/about";
import { landing } from "../src/data/landing";
import { stack } from "../src/data/stack";
import { getExperienceInYears } from "../src/js/utils.js";

const WIDTHS = [1280, 375];
const trimmed = (texts: string[]) => texts.map((text) => text.replace(/\s+/g, " ").trim());
const animationName = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((blocks) => blocks.map((block) => getComputedStyle(block).animationName));

test("AC-landing-hero: the landing has one h1, the role, the value line, three buttons and the community line", async ({ page }) => {
  for (const width of WIDTHS) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(landing.hero.name);
      const hero = page.locator("section.hero");
      await expect(hero).toContainText(landing.hero.role);
      await expect(hero).toContainText(landing.hero.value);
      for (const { text, href } of landing.hero.buttons) {
        const button = hero.getByRole("link", { name: text });
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute("href", href);
      }
      await expect(hero).toContainText(landing.hero.communitiesLabel);
      expect(trimmed(await hero.locator(".chip").allTextContents())).toEqual(landing.hero.communities);
    });
  }
});

test("AC-profile-picture: the profile photo is an optimized picture, and the old file is not requested", async ({ page }) => {
  for (const path of ["/", "/about"]) {
    await test.step(path, async () => {
      const requested: string[] = [];
      page.on("request", (request) => requested.push(request.url()));
      await page.goto(path, { waitUntil: "load" });
      const picture = page.locator("main picture").filter({ has: page.locator(`img[alt="${landing.hero.photoAlt}"]`) });
      await expect(picture).toHaveCount(1);
      await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
      const image = picture.locator("img");
      await expect(image).toHaveAttribute("width", /\d+/);
      await expect(image).toHaveAttribute("height", /\d+/);
      expect(requested.filter((url) => url.endsWith("/images/profile.webp"))).toEqual([]);
    });
  }
});

test("AC-now-strip: the Ahora strip sits between the hero and the metrics", async ({ page }) => {
  await page.goto("/");
  const strip = page.locator("section.now");
  await expect(strip).toContainText(landing.now.label);
  await expect(strip).toContainText(landing.now.text);
  const order = await page.locator("section.hero, section.now, section.metrics").evaluateAll((sections) => sections.map((section) => section.className));
  expect(order.map((name) => name.match(/hero|now|metrics/)![0])).toEqual(["hero", "now", "metrics"]);
});

test("AC-metrics-computed: the metrics are computed from the posts and the start date, charlas first", async ({ page, request }) => {
  await page.goto("/category/charlas/");
  const charlas = await page.locator("article.card").count();
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  const posts = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((path) => /^\/blog\/(?!\d+\/$)[^/]+\/$/.test(path)).length;

  await page.goto("/");
  const metrics = page.locator("section.metrics li");
  expect(trimmed(await metrics.allInnerTexts())).toEqual([
    `${charlas} ${landing.metrics.talks}`,
    `+${getExperienceInYears()} ${landing.metrics.years}`,
    `${posts} ${landing.metrics.posts}`,
  ]);
});

test("AC-latest-posts: the three latest posts follow the metrics, with equal heights and aligned buttons", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const cards = page.locator("article.card");
  await expect(cards).toHaveCount(landing.latestPosts.count);
  await expect(page.locator("section.metrics + section").getByRole("heading", { name: landing.latestPosts.title })).toBeVisible();
  const boxes = await cards.evaluateAll((elements) =>
    elements.map((card) => ({
      height: card.getBoundingClientRect().height,
      button: [...card.querySelectorAll("a")].at(-1)!.getBoundingClientRect().bottom,
    })),
  );
  for (const box of boxes) {
    expect(box.height).toBeCloseTo(boxes[0].height, 0);
    expect(box.button).toBeCloseTo(boxes[0].button, 0);
  }
});

test.describe("with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("AC-hero-intro: the landing hero's blocks run a CSS animation and end visible; About's hero has none", async ({ page }) => {
    await page.goto("/");
    const names = await animationName(page, "section.hero .intro");
    expect(names.length).toBeGreaterThan(1);
    for (const name of names) expect(name).not.toBe("none");
    await expect
      .poll(() => page.locator("section.hero .intro").evaluateAll((blocks) => blocks.every((block) => getComputedStyle(block).opacity === "1")))
      .toBe(true);

    await page.goto("/about");
    for (const name of await animationName(page, "main section:first-of-type, main section:first-of-type *")) expect(name).toBe("none");
  });
});

test("AC-hero-intro: with reduced motion the landing hero has no animation and is visible at load", async ({ page }) => {
  await page.goto("/");
  const blocks = page.locator("section.hero .intro");
  expect(await blocks.count()).toBeGreaterThan(1);
  for (const block of await blocks.all()) {
    await expect(block).toHaveCSS("animation-name", "none");
    await expect(block).toHaveCSS("opacity", "1");
  }
});

test("AC-encuentrame: About lists four labeled links with their handles", async ({ page }) => {
  for (const width of WIDTHS) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      const section = page.locator("section.encuentrame");
      await expect(section.getByRole("heading", { name: about.findMe.title })).toBeVisible();
      const links = section.getByRole("link");
      await expect(links).toHaveCount(about.findMe.links.length);
      for (const [index, { network, handle, href }] of about.findMe.links.entries()) {
        const link = links.nth(index);
        await expect(link).toHaveAttribute("href", href);
        await expect(link).not.toHaveAttribute("aria-label");
        await expect(link).toContainText(network);
        await expect(link).toContainText(handle);
      }
    });
  }
});

test("AC-stack-chips: Stack actual lists the stack", async ({ page }) => {
  await page.goto("/about");
  const section = page.locator("section.stack");
  await expect(section.getByRole("heading", { name: about.stack.title })).toBeVisible();
  expect(trimmed(await section.locator(".chip").allTextContents())).toEqual(stack);
});

test("AC-about-order: About's sections read find-me, stack, experience, projects", async ({ page }) => {
  await page.goto("/about");
  expect(trimmed(await page.locator("main section h2").allTextContents())).toEqual([
    about.findMe.title,
    about.stack.title,
    about.experience.title,
    about.projects.title,
  ]);
});
