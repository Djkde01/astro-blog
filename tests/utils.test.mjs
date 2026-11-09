import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatBlogPosts, getExperienceInYears, selectRelatedPosts, slugify } from "../src/js/utils.js";

const post = (title, date, extra = {}) => ({
  url: `/blog/${title}`,
  frontmatter: { title, date, ...extra },
});
const titles = (posts) => posts.map(({ frontmatter }) => frontmatter.title);
const tomorrow = new Date(Date.now() + 86_400_000).toISOString();

describe("formatBlogPosts", () => {
  it("drops drafts and future posts by default", async () => {
    const posts = [
      post("published", "2025-01-01"),
      post("draft", "2025-01-02", { draft: true }),
      post("future", tomorrow),
    ];
    assert.deepEqual(titles(await formatBlogPosts(posts)), ["published"]);
  });

  it("keeps drafts and future posts when asked to", async () => {
    const posts = [post("draft", "2025-01-02", { draft: true }), post("future", tomorrow)];
    const result = await formatBlogPosts(posts, { filterOutDrafts: false, filterFuturePosts: false });
    assert.deepEqual(titles(result), ["future", "draft"]);
  });

  it("sorts by descending date", async () => {
    const posts = [post("old", "2023-01-01"), post("new", "2025-01-01"), post("mid", "2024-01-01")];
    assert.deepEqual(titles(await formatBlogPosts(posts)), ["new", "mid", "old"]);
  });

  it("sorts by title when asked to", async () => {
    const posts = [post("b", "2025-01-01"), post("a", "2024-01-01")];
    assert.deepEqual(titles(await formatBlogPosts(posts, { sortBy: "title" })), ["a", "b"]);
  });

  it("applies the limit after sorting", async () => {
    const posts = [post("old", "2023-01-01"), post("new", "2025-01-01")];
    assert.deepEqual(titles(await formatBlogPosts(posts, { limit: 1 })), ["new"]);
  });

  it("accepts the object that import.meta.glob returns", async () => {
    const modules = { "./a.md": post("a", "2025-01-01") };
    assert.deepEqual(titles(await formatBlogPosts(modules)), ["a"]);
  });
});

describe("selectRelatedPosts", () => {
  // Newest first, as formatBlogPosts returns them.
  const site = [
    post("talk-new", "2025-05-01", { category: "Charlas" }),
    post("other-new", "2025-04-01", { category: "Productividad" }),
    post("talk-mid", "2025-03-01", { category: "Charlas" }),
    post("current", "2025-02-01", { category: "Charlas" }),
    post("other-old", "2024-01-01", { category: "Marca Personal" }),
    post("talk-old", "2023-01-01", { category: "Charlas" }),
  ];
  const current = site[3];

  it("picks same-category posts, newest first, without the current post", () => {
    const { posts, sameCategory } = selectRelatedPosts(site, current);
    assert.deepEqual(titles(posts), ["talk-new", "talk-mid", "talk-old"]);
    assert.equal(sameCategory, true);
  });

  it("fills with the newest posts from any category when the category runs short", () => {
    const lonely = site[1];
    const { posts, sameCategory } = selectRelatedPosts(site, lonely);
    assert.deepEqual(titles(posts), ["talk-new", "talk-mid", "current"]);
    assert.equal(sameCategory, false);
  });

  it("puts same-category posts before the fill and never repeats one", () => {
    const { posts, sameCategory } = selectRelatedPosts(site, current, 5);
    assert.deepEqual(titles(posts), ["talk-new", "talk-mid", "talk-old", "other-new", "other-old"]);
    assert.equal(sameCategory, false);
  });

  it("returns every other post when the site has fewer than asked for", () => {
    const { posts } = selectRelatedPosts(site.slice(0, 2), site[0]);
    assert.deepEqual(titles(posts), ["other-new"]);
  });
});

describe("slugify", () => {
  it("lowercases and joins words the way category routes expect", () => {
    assert.equal(slugify("Marca Personal"), "marca-personal");
  });
});

describe("getExperienceInYears", () => {
  it("counts full years from May 2021", () => {
    assert.equal(getExperienceInYears(new Date(2026, 3, 30)), 4);
    assert.equal(getExperienceInYears(new Date(2026, 4, 1)), 5);
    assert.equal(getExperienceInYears(new Date(2026, 10, 9)), 5);
  });
});
