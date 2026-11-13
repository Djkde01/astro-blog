import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { about } from "../src/data/about";
import { experience } from "../src/data/experience";
import { landing } from "../src/data/landing";
import { services } from "../src/data/services";
import { talks } from "../src/data/talks";
import { getExperienceInYears, published, selectNow } from "../src/js/utils.js";

const WIDTHS = [1280, 375];
const trimmed = (texts: string[]) => texts.map((text) => text.replace(/\s+/g, " ").trim());
// Top and left of every element the locator matches, rounded to whole pixels.
const positions = (locator: Locator) =>
  locator.evaluateAll((elements) =>
    elements.map((element) => {
      const { top, left } = element.getBoundingClientRect();
      return { top: Math.round(top), left: Math.round(left) };
    }),
  );
const animationName = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((blocks) => blocks.map((block) => getComputedStyle(block).animationName));

test("AC-landing-hero: the landing has one h1, the role, the value line and three buttons, and no community chips", async ({ page }) => {
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
      await expect(hero.locator(".chip, .communities")).toHaveCount(0);
    });
  }
});

test("AC-profile-picture: the profile photo is an optimized picture, and the old file is not requested", async ({ page }) => {
  for (const [path, alt] of [["/", landing.hero.photoAlt], ["/about", about.intro.photoAlt]]) {
    await test.step(path, async () => {
      const requested: string[] = [];
      page.on("request", (request) => requested.push(request.url()));
      await page.goto(path, { waitUntil: "load" });
      const picture = page.locator("main picture").filter({ has: page.locator(`img[alt="${alt}"]`) });
      await expect(picture).toHaveCount(1);
      await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
      const image = picture.locator("img");
      await expect(image).toHaveAttribute("width", /\d+/);
      await expect(image).toHaveAttribute("height", /\d+/);
      expect(requested.filter((url) => url.endsWith("/images/profile.webp"))).toEqual([]);
    });
  }
});

test("AC-now-strip: the Ahora strip sits between the hero and the metrics, spans the viewport and reads selectNow()", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto("/");
  const strip = page.locator("section.now");
  const { text, link } = selectNow(experience, landing.now, published(talks, false));
  await expect(strip).toContainText(landing.now.label);
  await expect(strip).toContainText(text);
  if (link) {
    await expect(strip.getByRole("link", { name: link.text })).toHaveAttribute("href", link.href);
  } else {
    await expect(strip.getByRole("link")).toHaveCount(0);
  }

  const order = await page.locator("section.hero, section.now, section.metrics").evaluateAll((sections) => sections.map((section) => section.className));
  expect(order.map((name) => name.match(/hero|now|metrics/)![0])).toEqual(["hero", "now", "metrics"]);

  const box = (await strip.boundingBox())!;
  const viewport = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box.x).toBe(0);
  expect(box.width).toBe(viewport);
  // The text lines up with the page container, as the section headings below do.
  const label = (await strip.locator(".label").boundingBox())!;
  const heading = (await page.getByRole("heading", { name: landing.latestPosts.title }).boundingBox())!;
  expect(label.x).toBeCloseTo(heading.x, 0);
});

test("AC-metrics-computed: the metrics are computed from the talks, the posts and the start date, charlas first", async ({ page }) => {
  // Phase 5: charlas counts the talks already given, not the posts in the Charlas category.
  await page.goto("/about");
  const tags = await page.locator("section.talks .card-tag").allTextContents();
  const charlas = tags.filter((tag) => tag.trim() !== about.talks.upcoming).length;
  let posts = 0;
  for (let number = 1; (await page.goto(number === 1 ? "/blog/" : `/blog/${number}/`))?.ok(); number++) {
    posts += await page.locator("article.card").count();
  }

  await page.goto("/");
  // The visible number and its label; screen readers get the same number from a hidden copy.
  const metrics = page.locator("section.metrics li");
  const visible = await metrics.evaluateAll((items) =>
    items.map((item) => `${item.querySelector(".count")!.textContent!.trim()} ${item.querySelector(".label")!.textContent!.trim()}`),
  );
  expect(visible).toEqual([
    `${charlas} ${landing.metrics.talks}`,
    `+${getExperienceInYears()} ${landing.metrics.years}`,
    `${posts} ${landing.metrics.posts}`,
  ]);

  for (const [width, minimum] of [[1280, 72], [375, 40]]) {
    await test.step(`large centered numbers at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const items = await metrics.evaluateAll((elements) =>
        elements.map((item) => {
          const number = item.querySelector("strong")!;
          const box = item.getBoundingClientRect();
          return {
            size: parseFloat(getComputedStyle(number).fontSize),
            numberBottom: number.getBoundingClientRect().bottom,
            labelTop: item.querySelector(".label")!.getBoundingClientRect().top,
            left: box.left,
            right: box.right,
          };
        }),
      );
      for (const { size, numberBottom, labelTop } of items) {
        expect(size).toBeGreaterThanOrEqual(minimum);
        expect(labelTop).toBeGreaterThanOrEqual(numberBottom);
      }
      const viewport = await page.evaluate(() => document.documentElement.clientWidth);
      expect((items[0].left + items.at(-1)!.right) / 2).toBeCloseTo(viewport / 2, -1);
    });
  }

  await page.goto("/about");
  const intro = page.locator(".about .content");
  await expect(intro).toContainText(`+${getExperienceInYears()}`);
  await expect(intro).not.toContainText("{years}");
});

test("AC-latest-posts: the three latest posts follow the metrics, with equal heights and aligned buttons", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const titles = () => page.locator("article.card").getByRole("heading").allTextContents();
  await page.goto("/blog/");
  const newest = (await titles()).slice(0, landing.latestPosts.count);
  await page.goto("/");
  const cards = page.locator("article.card");
  await expect(cards).toHaveCount(landing.latestPosts.count);
  expect(await titles()).toEqual(newest);
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
    const delays = await page.locator("section.hero .intro").evaluateAll((blocks) => blocks.map((block) => parseFloat(getComputedStyle(block).animationDelay)));
    for (const [index, delay] of delays.entries()) if (index > 0) expect(delay).toBeGreaterThan(delays[index - 1]);
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

test("AC-services: Servicios shows four cards from services.ts with an icon, a title and a description, four columns wide at 1280 px and one at 375 px", async ({ page }) => {
  for (const width of WIDTHS) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      const section = page.locator("section.services");
      await expect(section.getByRole("heading", { name: about.services.title, level: 2 })).toBeVisible();
      const cards = section.locator("li");
      await expect(cards).toHaveCount(services.length);
      for (const [index, { title, description }] of services.entries()) {
        const card = cards.nth(index);
        await expect(card.getByRole("heading", { name: title })).toBeVisible();
        // The description is the card's only text after the title: no highlighted proof line.
        await expect(card.locator("p")).toHaveText([description]);
        await expect(card.locator("svg")).toHaveAttribute("aria-hidden", "true");
      }
      const boxes = await positions(cards);
      if (width === 1280) {
        for (const box of boxes) expect(box.top).toBe(boxes[0].top);
        expect(new Set(boxes.map((box) => box.left)).size).toBe(services.length);
      } else {
        for (const box of boxes) expect(box.left).toBe(boxes[0].left);
        for (const [index, box] of boxes.entries()) if (index > 0) expect(box.top).toBeGreaterThan(boxes[index - 1].top);
      }
    });
  }
});

test("AC-experience-cv: the timeline lists the five jobs of the CV, with Saber más only where a link exists", async ({ page }) => {
  await page.goto("/about");
  const section = page.locator("section.experience");
  expect(trimmed(await section.locator("h3").allTextContents())).toEqual([
    "Forward Deployed Engineer - Fuse",
    "Fullstack Developer - Curoo",
    "Fullstack Developer - Selaski",
    "Profesor - Platzi",
    "Web UI Developer - Globant",
  ]);
  await expect(section).not.toContainText("Backbone");
  await expect(section.locator("ol > li").first().getByRole("link", { name: "Saber más" })).toHaveAttribute("href", "https://fusefinance.com/");
  const items = section.locator("ol > li");
  await expect(items).toHaveCount(experience.length);
  for (const [index, { link }] of experience.entries()) {
    const more = items.nth(index).getByRole("link", { name: "Saber más" });
    if (link) await expect(more).toHaveAttribute("href", link);
    else await expect(more).toHaveCount(0);
  }
});

test("AC-project-cards: each card's buttons share a row, and titles of cards in a row start level", async ({ page }) => {
  for (const width of [1280, 1440, 375]) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      const cards = page.locator("article.project-card");
      for (const card of await cards.all()) {
        const buttons = await positions(card.locator(".card-ctas a"));
        for (const button of buttons) expect(button.top).toBe(buttons[0].top);
      }
      const boxes = await positions(cards);
      const titles = await positions(cards.locator("h3"));
      if (width === 375) {
        for (const box of boxes) expect(box.left).toBe(boxes[0].left);
      } else {
        const rows = new Map<number, number[]>();
        for (const [index, box] of boxes.entries()) rows.set(box.top, [...(rows.get(box.top) ?? []), titles[index].top]);
        expect(rows.size).toBeLessThan(boxes.length);
        for (const tops of rows.values()) for (const top of tops) expect(top).toBe(tops[0]);
      }
    });
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/about");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("AC-about-order: About's sections read find-me, services, experience, talks, community, projects, under an intro band that spans the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto("/about");
  // The band carries the glow, so a band narrower than the viewport cuts it.
  const band = (await page.locator(".about-band").boundingBox())!;
  const viewport = await page.evaluate(() => document.documentElement.clientWidth);
  expect(band.x).toBe(0);
  expect(band.width).toBe(viewport);
  expect(trimmed(await page.locator("main section h2").allTextContents())).toEqual([
    about.findMe.title,
    about.services.title,
    about.experience.title,
    about.talks.title,
    about.community.title,
    about.projects.title,
  ]);
});

// The number in each metric, as the served HTML carries it.
const servedMetrics = async (page: Page) => {
  const html = await (await page.request.get("/")).text();
  const section = html.slice(html.indexOf('class="container metrics"'));
  return [...section.matchAll(/<span class="count"[^>]*>([^<]*)<\/span>/g)].slice(0, 3).map(([, value]) => value.trim());
};
const numbers = (page: Page) => page.locator("section.metrics .count").allTextContents();
const spokenNumbers = (page: Page) => page.locator("section.metrics .visually-hidden").allTextContents();
// Records every text each metric number shows from now on.
const recordNumbers = (page: Page) =>
  page.evaluate(() => {
    const seen: string[][] = [];
    (window as unknown as { seen: string[][] }).seen = seen;
    document.querySelectorAll("section.metrics .count").forEach((number, index) => {
      seen[index] = [number.textContent!.trim()];
      new MutationObserver(() => seen[index].push(number.textContent!.trim())).observe(number, { childList: true, characterData: true, subtree: true });
    });
  });
const seenNumbers = (page: Page) => page.evaluate(() => (window as unknown as { seen: string[][] }).seen);
const toNumber = (text: string) => Number(text.replace(/\D/g, ""));

test.describe("with motion allowed", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("AC-metrics-countup: the metrics count up from 0 once they scroll into view, and end at their served values", async ({ page }) => {
    const served = await servedMetrics(page);
    expect(served).toHaveLength(3);
    for (const value of served) expect(toNumber(value)).toBeGreaterThan(0);

    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto("/");
    // Off screen, the visible numbers wait at 0 while screen readers get the final values.
    expect(await numbers(page)).toEqual(served.map((value) => value.replace(/\d+/, "0")));
    expect(trimmed(await spokenNumbers(page))).toEqual(served);
    await recordNumbers(page);
    await page.locator("section.metrics").scrollIntoViewIfNeeded();
    await expect.poll(() => numbers(page)).toEqual(served);
    expect(trimmed(await spokenNumbers(page))).toEqual(served);
    const seen = await seenNumbers(page);
    for (const [index, values] of seen.entries()) {
      const target = toNumber(served[index]);
      // A real count passes through values between 0 and the target.
      if (target > 1) expect(values.some((value) => toNumber(value) > 0 && toNumber(value) < target)).toBe(true);
      // The prefix stays while counting.
      for (const value of values) expect(value.replace(/\d/g, "")).toBe(served[index].replace(/\d/g, ""));
    }
    const fontVariant = await page.locator("section.metrics .count").first().evaluate((number) => getComputedStyle(number).fontVariantNumeric);
    expect(fontVariant).toContain("tabular-nums");
  });
});

test("AC-metrics-countup: with reduced motion the metrics show their served values at once and never change", async ({ page }) => {
  const served = await servedMetrics(page);
  expect(served).toHaveLength(3);
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto("/");
  expect(await numbers(page)).toEqual(served);
  await recordNumbers(page);
  await page.locator("section.metrics").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  expect(await numbers(page)).toEqual(served);
  for (const values of await seenNumbers(page)) expect(values).toHaveLength(1);
});
