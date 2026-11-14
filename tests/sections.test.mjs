import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { clients } from "../src/data/clients.ts";
import { community } from "../src/data/community.ts";
import { experience } from "../src/data/experience.ts";
import { landing } from "../src/data/landing.ts";
import { talks } from "../src/data/talks.ts";
import { testimonials } from "../src/data/testimonials.ts";
import { formatTalkDate, published, selectNow } from "../src/js/utils.js";

const names = (entries) => entries.map(({ name }) => name);
const drafts = (entries) => entries.filter(({ draft }) => draft);

describe("published", () => {
  const entries = [{ id: 1 }, { id: 2, draft: true }, { id: 3, draft: false }, { id: 4, draft: true }];

  it("AC-drafts-hidden: drops drafts and keeps the order outside dev", () => {
    assert.deepEqual(
      published(entries, false).map(({ id }) => id),
      [1, 3],
    );
  });

  it("AC-drafts-hidden: keeps every entry in dev", () => {
    assert.deepEqual(
      published(entries, true).map(({ id }) => id),
      [1, 2, 3, 4],
    );
  });
});

describe("post slugs", () => {
  const slugs = [
    ...talks.flatMap(({ post }) => (post ? [post] : [])),
    // External events (objects) link out, so only post slugs need a post here.
    ...community.flatMap(({ events = [] }) => events.filter((event) => typeof event === "string")),
  ];

  it("AC-post-slugs: every talk post and community event names an existing, published post", () => {
    assert.ok(slugs.length > 0);
    for (const slug of slugs) {
      const file = `src/pages/blog/${slug}.md`;
      assert.ok(existsSync(file), `${file} does not exist`);
      assert.doesNotMatch(readFileSync(file, "utf8"), /^draft:\s*true/m, `${file} is a draft`);
    }
  });
});

describe("published content", () => {
  it("AC-placeholders-drafted: every talk is published, the upcoming AWS talk with its registration", () => {
    assert.equal(drafts(talks).length, 0);
    assert.equal(talks.length, 7);
    const aws = talks.find(({ event }) => event === "AWS User Group Pereira Meetup");
    assert.equal(aws.date, "2026-11-23");
    assert.equal(aws.registration, "https://www.meetup.com/aws-user-group-pereira/events/317390154/");
    const devfest = talks.find(({ event }) => event === "Google DevFest Pereira 2025");
    assert.equal(devfest.post, "gdg-devfest-pereira");
    for (const talk of talks) assert.match(talk.date, /^\d{4}-\d{2}-\d{2}$/, talk.title);
  });

  it("AC-placeholders-drafted: every community entry is published, PerTT with its meetups", () => {
    assert.equal(drafts(community).length, 0);
    assert.deepEqual(names(community.filter(({ kind }) => kind === "organizer")), [
      "Backbone UTP",
      "Pereira Tech Talks (PerTT)",
      "Software Freedom Day Pereira",
    ]);
    assert.deepEqual(names(community.filter(({ kind }) => kind === "collaborator")), [
      "GDG Pereira",
      "AWS User Group Pereira",
      "FLISoL",
      "QA Conf",
    ]);
    for (const { name, link } of community) assert.match(link, /^https:\/\//, name);
    const pertt = community.find(({ name }) => name === "Pereira Tech Talks (PerTT)");
    assert.ok(pertt.events.length > 0);
    for (const event of pertt.events) assert.match(event.url, /^https:\/\/pereiratechtalks\.org\/meetups\/[a-z0-9-]+\/$/);
  });

  it("AC-placeholders-drafted: every client is a draft", () => {
    assert.deepEqual(published(clients, false), []);
  });

  it("AC-placeholders-drafted: the three LinkedIn recommendations are published as testimonials", () => {
    assert.deepEqual(names(published(testimonials, false)), ["Paula Andrea Castro", "Mariana Valencia", "Mariana Cortés Rueda"]);
    for (const { name, role, quote } of testimonials) {
      assert.ok(role && quote.length > 100, name);
    }
  });
});

describe("selectNow with talks", () => {
  const today = new Date("2026-11-13T12:00:00Z");
  const talk = (title, date, extra = {}) => ({
    title,
    event: `Evento ${title}`,
    date,
    place: "Pereira",
    language: "Español",
    ...extra,
  });
  const working = [{ title: "Developer - Acme", period: "Enero 2026 - Actualidad", description: "" }];
  const fixture = [
    talk("Pasada", "2026-10-01", { registration: "https://example.com/pasada" }),
    talk("Borrador", "2026-11-14", { draft: true, registration: "https://example.com/borrador" }),
    talk("Lejana", "2026-12-05", { registration: "https://example.com/lejana" }),
    talk("Cercana", "2026-11-25", { registration: "https://example.com/cercana" }),
  ];

  it("AC-now-upcoming: invites to the earliest published upcoming talk, ahead of a current job", () => {
    const { text, link } = selectNow(working, landing.now, fixture, today);
    assert.ok(text.includes("Cercana"), text);
    assert.ok(text.includes("Evento Cercana"), text);
    assert.ok(text.includes(formatTalkDate("2026-11-25")), text);
    assert.ok(!text.includes("{"), text);
    assert.deepEqual(link, { text: landing.now.upcoming.link, href: "https://example.com/cercana" });
  });

  it("AC-now-upcoming: a talk dated the same day still counts", () => {
    const { text } = selectNow(working, landing.now, [talk("Hoy", "2026-11-13")], today);
    assert.ok(text.includes("Hoy"), text);
  });

  it("AC-now-upcoming: ignores past and draft talks and falls back to the job or the open text", () => {
    const old = fixture.slice(0, 2);
    assert.deepEqual(selectNow(working, landing.now, old, today), selectNow(working, landing.now));
    assert.deepEqual(selectNow(experience, landing.now, old, today), selectNow(experience, landing.now));
  });

  it("AC-now-upcoming: links to the post when the talk has no registration", () => {
    const { link } = selectNow(working, landing.now, [talk("Con post", "2026-12-01", { post: "gdg-devfest-pereira" })], today);
    // Post URLs have no trailing slash, as import.meta.glob gives them.
    assert.equal(link.href, "/blog/gdg-devfest-pereira");
  });
});
