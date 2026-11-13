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
    ...community.flatMap(({ events = [] }) => events),
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

describe("placeholders", () => {
  it("AC-placeholders-drafted: only DevFest Pereira 2025 is a published talk", () => {
    assert.deepEqual(
      published(talks, false).map(({ post }) => post),
      ["gdg-devfest-pereira"],
    );
    const pending = drafts(talks);
    const text = pending.map(({ title, event }) => `${title} ${event}`);
    assert.ok(text.some((line) => /QA Conf/.test(line)), "a QA Conf draft");
    assert.ok(text.some((line) => /AWS/.test(line)), "an AWS draft");
    assert.equal(text.filter((line) => /FLISoL/.test(line)).length, 2, "two FLISoL drafts");
    assert.ok(pending.some(({ date }) => date.startsWith("2022")), "a 2022 draft");
  });

  it("AC-placeholders-drafted: Backbone UTP and GDG Pereira are the published communities", () => {
    assert.deepEqual(names(published(community, false)), ["Backbone UTP", "GDG Pereira"]);
    for (const name of ["Pereira Tech Talks (PerTT)", "Software Freedom Day Pereira", "AWS User Group Pereira", "FLISoL", "QA Conf"]) {
      assert.ok(names(drafts(community)).includes(name), `${name} is a draft`);
    }
    const backbone = community.find(({ name }) => name === "Backbone UTP");
    assert.equal(backbone.kind, "organizer");
    assert.equal(backbone.role, "Fundador y mentor");
    assert.equal(backbone.period, "Agosto 2022 - Actualidad");
    assert.deepEqual(backbone.events, ["gdg-devfest-pereira", "mujeres-tecnologia-2025", "la-ia-no-te-quitara-el-trabajo-pero-yo-si"]);
    const sfd = community.find(({ name }) => name === "Software Freedom Day Pereira");
    assert.deepEqual(sfd.events, ["software-freedom-day-2023", "software-freedom-day-2024", "software-freedom-day-2025"]);
    const gdg = community.find(({ name }) => name === "GDG Pereira");
    assert.equal(gdg.kind, "collaborator");
    assert.equal(gdg.link, "https://gdg.community.dev/gdg-pereira/");
  });

  it("AC-placeholders-drafted: every client is a draft and no testimonial exists", () => {
    assert.deepEqual(published(clients, false), []);
    const titles = clients.map(({ title }) => title);
    assert.ok(titles.some((title) => title.includes("vía Fuse")));
    assert.ok(titles.some((title) => title.includes("vía Globant")));
    assert.equal(clients.filter(({ kind }) => kind === "freelance").length, 2);
    assert.deepEqual(testimonials, []);
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
