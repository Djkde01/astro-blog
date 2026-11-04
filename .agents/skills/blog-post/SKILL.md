---
name: blog-post
description: Add or edit a blog post under src/pages/blog with valid frontmatter. Use when creating, moving or changing the frontmatter of a post.
---

# Blog post

Posts are Markdown files directly under `src/pages/blog/`. The filename becomes the URL, so use lowercase words joined by hyphens.

Keep the file flat. Every consumer except RSS globs `blog/*.md`, so a nested post would appear in the feed and nowhere else.

```yaml
---
layout: "../../layouts/BlogPostLayout.astro"
title: Título del post
date: 2026-11-04
author: Sergio Estrella
image:
  {
    src: "/images/post-example.webp",
    alt: "Descriptive alt text in Spanish",
  }
description: One sentence for cards, SEO and RSS.
category: Charlas
draft: true
---
```

- `layout`, `title`, `date`, `image.src`, `image.alt`, `description` and `category` are required by the layouts. A missing `image` breaks the build.
- Reuse an existing category where one fits: `Charlas`, `Marca Personal` or `Productividad`. A new category creates a new route.
- Avoid a double quote in `title` and `description`. `src/js/jsonLD.js` does not escape them, and one would break the page's JSON-LD.
- Put images in `public/images/`, in WebP.
- `draft: true` or a future `date` hides a post from every page and from RSS. The post's own URL is still built.
- `robots` with any value makes the page `noindex, nofollow`.

Then run `pnpm run build`. While the post is a draft, check it at its own URL with `pnpm run preview`; it appears nowhere else. Once the owner publishes it, also check the blog index, its category and `/rss.xml`. The home page shows only the latest three posts, so an older date can keep a published post off it.
