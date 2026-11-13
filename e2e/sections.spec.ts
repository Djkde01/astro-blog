import { readFileSync } from "node:fs";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { fixtureClients, fixtureTestimonials } from "./sections-fixture-data";
import { about } from "../src/data/about";
import { community } from "../src/data/community";
import { projects } from "../src/data/projects";
import { talks } from "../src/data/talks";
import { formatTalkDate, isUpcoming, published } from "../src/js/utils.js";

const WIDTHS = [1280, 375];
const FIXTURE = "/e2e/sections-fixture";
// The site builds without drafts, so the tests expect what a build publishes.
const builtTalks = published(talks, false).toSorted((a, b) => b.date.localeCompare(a.date));
const builtCommunity = published(community, false);
const squash = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();
const postTitle = (slug: string) =>
  readFileSync(`src/pages/blog/${slug}.md`, "utf8")
    .match(/^title:\s*(.+)$/m)![1]
    .trim()
    .replace(/^"(.*)"$/, "$1");
const talkTag = (date: string) => (isUpcoming({ date }, new Date()) ? about.talks.upcoming : date.slice(0, 4));

// The first non-transparent background behind an element, as [r, g, b].
async function contrastOf(locator: Locator) {
  return locator.evaluate((element) => {
    const rgb = (value: string) => value.match(/[\d.]+/g)!.map(Number);
    const opaque = (value: string) => value !== "transparent" && (rgb(value)[3] ?? 1) > 0;
    let node: Element | null = element;
    while (node && !opaque(getComputedStyle(node).backgroundColor)) node = node.parentElement;
    const back = rgb(node ? getComputedStyle(node).backgroundColor : "rgb(255, 255, 255)");
    const front = rgb(getComputedStyle(element).color);
    const luminance = ([r, g, b]: number[]) => {
      const [R, G, B] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    const [hi, lo] = [luminance(front), luminance(back)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });
}

const ctaLinks = (card: Locator) => card.locator(".card-ctas a");

async function expectTalkCards(page: Page) {
  const cards = page.locator("section.talks article.content-card");
  await expect(cards).toHaveCount(builtTalks.length);
  for (const [index, talk] of builtTalks.entries()) {
    const card = cards.nth(index);
    await expect(card.locator("h3")).toHaveText(talk.title);
    await expect(card.locator(".card-tag")).toHaveText(talkTag(talk.date));
    for (const part of [talk.event, formatTalkDate(talk.date), talk.language]) {
      await expect(card).toContainText(part);
    }
    const expected = [
      [about.talks.links.registration, talk.registration],
      [about.talks.links.slides, talk.slides],
      [about.talks.links.recording, talk.recording],
      [about.talks.links.post, talk.post && `/blog/${talk.post}`],
    ].filter((pair): pair is [string, string] => Boolean(pair[1]));
    const links = await ctaLinks(card).evaluateAll((anchors) =>
      anchors.map((anchor) => [anchor.textContent!.replace(/\s+/g, " ").trim(), anchor.getAttribute("href")]),
    );
    expect(links).toEqual(expected);
  }
}

test("AC-talks-section: Charlas lists the published talks, newest first, with their links", async ({ page }) => {
  expect(builtTalks.length).toBeGreaterThan(0);
  for (const width of WIDTHS) {
    await test.step(`at ${width} px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about");
      await expect(page.locator("section.talks h2")).toHaveText(about.talks.title);
      await expectTalkCards(page);
    });
  }
});

test("AC-talks-metric: the charlas metric counts the talks already given", async ({ page }) => {
  await page.goto("/about");
  const tags = await page.locator("section.talks .card-tag").allTextContents();
  const given = tags.filter((tag) => squash(tag) !== about.talks.upcoming).length;
  expect(given).toBeGreaterThan(0);
  await page.goto("/");
  await expect(page.locator("section.metrics li").first().locator(".count")).toHaveText(`${given}`);
});

test("AC-community-section: Comunidad shows the organizer cards with event chips and the collaborator chips", async ({ page }) => {
  await page.goto("/about");
  const section = page.locator("section.community");
  await expect(section.locator("h2")).toHaveText(about.community.title);

  const organizers = builtCommunity.filter(({ kind }) => kind === "organizer");
  const cards = section.locator(".organizers article.content-card");
  await expect(section.locator(".organizers h3")).toHaveText(about.community.organizers);
  await expect(cards).toHaveCount(organizers.length);
  for (const [index, entry] of organizers.entries()) {
    const card = cards.nth(index);
    await expect(card.locator("h4")).toHaveText(entry.name);
    await expect(card.locator(".card-tag")).toHaveText(entry.period!);
    await expect(card).toContainText(entry.role!);
    if (entry.link) {
      await expect(card.getByRole("link", { name: about.community.link })).toHaveAttribute("href", entry.link);
    }
    const chips = await card.locator(".card-chips a").evaluateAll((anchors) =>
      anchors.map((anchor) => [anchor.textContent!.replace(/\s+/g, " ").trim(), anchor.getAttribute("href")]),
    );
    expect(chips).toEqual((entry.events ?? []).map((slug) => [postTitle(slug), `/blog/${slug}`]));
  }

  const collaborators = builtCommunity.filter(({ kind }) => kind === "collaborator");
  await expect(section.locator(".collaborators h3")).toHaveText(about.community.collaborators);
  const chips = await section.locator(".collaborators li a").evaluateAll((anchors) =>
    anchors.map((anchor) => [anchor.textContent!.replace(/\s+/g, " ").trim(), anchor.getAttribute("href")]),
  );
  expect(chips).toEqual(collaborators.map(({ name, link }) => [name, link]));
});

test("AC-clients-section: Clientes groups the clients into Empresa and Freelance", async ({ page }) => {
  await page.goto(FIXTURE);
  const section = page.locator("#fixture section.clients");
  await expect(section.locator("h2")).toHaveText(about.clients.title);
  for (const [kind, label] of [["employer", about.clients.employer], ["freelance", about.clients.freelance]] as const) {
    const group = section.locator(`.client-group.${kind}`);
    await expect(group.locator("h3")).toHaveText(label);
    const expected = fixtureClients.filter((client) => client.kind === kind);
    const cards = group.locator("article.content-card");
    await expect(cards).toHaveCount(expected.length);
    for (const [index, client] of expected.entries()) {
      await expect(cards.nth(index).locator("h4")).toHaveText(client.title);
      await expect(cards.nth(index)).toContainText(client.role);
      await expect(cards.nth(index)).toContainText(client.outcome);
    }
  }
});

test("AC-testimonials-section: Testimonios shows each quote in a figure with its attribution", async ({ page }) => {
  await page.goto(FIXTURE);
  const section = page.locator("#fixture section.testimonials");
  await expect(section.locator("h2")).toHaveText(about.testimonials.title);
  const figures = section.locator("figure");
  await expect(figures).toHaveCount(fixtureTestimonials.length);
  for (const [index, { quote, name, role, company }] of fixtureTestimonials.entries()) {
    await expect(figures.nth(index).locator("blockquote")).toHaveText(quote);
    const caption = figures.nth(index).locator("figcaption");
    for (const part of [name, role, company]) await expect(caption).toContainText(part);
  }
});

test("AC-empty-hidden: a section with nothing published renders nothing", async ({ page }) => {
  await page.goto("/about");
  const headings = await page.locator("main section h2").allTextContents();
  expect(headings.map(squash)).not.toContain(about.clients.title);
  expect(headings.map(squash)).not.toContain(about.testimonials.title);

  await page.goto(FIXTURE);
  for (const name of ["talks", "community", "clients", "testimonials"]) {
    await expect(page.locator(`#empty-${name}`)).toBeAttached();
    expect(await page.locator(`#empty-${name}`).evaluate((element) => element.innerHTML.trim())).toBe("");
  }
});

test("AC-section-images: a card image renders through <Picture> with an AVIF source", async ({ page }) => {
  await page.goto(FIXTURE);
  const picture = page.locator("#fixture section.talks article.content-card picture").first();
  await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
  const img = picture.locator("img");
  await expect(img).toHaveAttribute("width", /\d+/);
  await expect(img).toHaveAttribute("height", /\d+/);
});

test("AC-projects-regression: Mis proyectos still shows every project through the card primitive", async ({ page }) => {
  await page.goto("/about");
  const cards = page.locator("section.projects article.content-card");
  await expect(cards).toHaveCount(projects.length);
  const labels = { deployed: "Publicado", development: "En desarrollo" };
  for (const [index, project] of projects.entries()) {
    const card = cards.nth(index);
    await expect(card.locator("h3")).toHaveText(project.title);
    await expect(card.locator(".card-tag")).toHaveText(labels[project.status]);
    await expect(card).toContainText(project.description);
    const links = await ctaLinks(card).evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
    expect(links).toEqual([project.github, project.link].filter(Boolean));
  }
});

test("AC-section-accents: each section has its own accent, and tag text stays readable", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await test.step(colorScheme, async () => {
      await page.emulateMedia({ colorScheme });
      await page.goto(FIXTURE);
      const accents: string[] = [];
      for (const name of ["talks", "community", "clients", "testimonials"]) {
        const section = page.locator(`#fixture section.${name}`);
        const icon = await section.locator(".title svg").evaluate((svg) => getComputedStyle(svg).backgroundColor);
        expect(icon, `${name} icon box`).not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
        accents.push(icon);
        const borders = await section
          .locator("article.content-card")
          .evaluateAll((cards) => cards.map((card) => getComputedStyle(card).borderTopColor));
        expect(borders.length).toBeGreaterThan(0);
        for (const border of borders) expect(border, `${name} card border`).toBe(icon);
        for (const tag of await section.locator(".card-tag").all()) {
          expect(await contrastOf(tag), `${name} tag contrast`).toBeGreaterThanOrEqual(4.5);
        }
      }
      expect(new Set(accents).size).toBe(4);
    });
  }
});
