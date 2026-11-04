import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatBlogPosts, slugify } from "../src/js/utils.js";

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

describe("slugify", () => {
  it("lowercases and joins words the way category routes expect", () => {
    assert.equal(slugify("Marca Personal"), "marca-personal");
  });
});
