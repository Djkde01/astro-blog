# Sergio Estrella (Djkde) — Astro Blog & Portfolio

Personal blog and portfolio site for [sergioestrella.com](https://sergioestrella.com). Built with Astro as a static site: Spanish-first content, file-based blog posts, and a lightweight portfolio landing page.

## Project Status

This is a **single-package Astro site** (not a monorepo). The site is actively maintained and evolving toward a richer editorial portfolio. The product backlog is in [`docs/portfolio-roadmap.md`](docs/portfolio-roadmap.md), and each phase runs as a Deep Work Plan.

**What exists today**

- Static site generation with Astro 5
- Home page with intro and latest posts
- About page with bio, experience, and projects
- Paginated blog index, category archives, and related posts
- RSS feed and sitemap generation at build time
- SEO metadata and JSON-LD structured data

**Content model**

- Blog posts live as Markdown files under `src/pages/blog/*.md`
- There is **no** Astro Content Collection; posts are discovered with `import.meta.glob(...)` and normalized through `formatBlogPosts()` in `src/js/utils.js`
- Draft and future-dated posts are filtered out by default

**Tooling**

- Unit tests with `node:test`, type-checking with `astro check`, and end-to-end tests with Playwright that record a video per test
- ESLint with JavaScript, TypeScript, Astro and accessibility rules
- No format script

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Astro](https://astro.build) 5 |
| Build tool | [Vite](https://vite.dev) |
| Package manager | [pnpm](https://pnpm.io) 11.21.0 (required, pinned in `package.json`) |
| Content | Markdown + [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) |
| SEO & discovery | [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/), [`@astrojs/rss`](https://docs.astro.build/en/guides/rss/), custom JSON-LD |
| Analytics | [`@astrojs/partytown`](https://docs.astro.build/en/guides/integrations-guide/partytown/) (Google Analytics) |
| Icons | [`astro-icon`](https://github.com/natemoo-re/astro-icon) + Iconify |
| Media | [`@justinribeiro/lite-youtube`](https://github.com/justinribeiro/lite-youtube), [`sharp`](https://sharp.pixelplumbing.com/) |
| Styles | PostCSS + [`postcss-preset-env`](https://preset-env.cssdb.org/) |
| Fonts | [`@fontsource-variable/montserrat`](https://fontsource.org/fonts/montserrat) |
| Testing | `node:test`, [`@astrojs/check`](https://docs.astro.build/en/reference/cli-reference/#astro-check), [Playwright](https://playwright.dev), [ESLint](https://eslint.org) |

## Architecture

```text
/
├── docs/                   Product, roadmap and engineering guides
├── e2e/                    Playwright tests
├── tests/                  Unit tests
├── public/                 Static assets copied as-is (images, RSS stylesheet)
├── src/
│   ├── components/         Reusable UI (Nav, PostCard, Seo, LiteYoutube, etc.)
│   ├── data/               Site metadata and navigation data
│   ├── js/                 Utilities (formatBlogPosts, slugify, JSON-LD)
│   ├── layouts/            MainLayout, BlogPostLayout, MainHead
│   ├── pages/
│   │   ├── blog/           Markdown blog posts (*.md)
│   │   ├── category/       Category archive routes
│   │   ├── index.astro     Home page
│   │   ├── about.astro     About / portfolio page
│   │   └── rss.xml.js      RSS endpoint
│   ├── styles/             Global CSS
│   └── types/              TypeScript interfaces
├── astro.config.mjs        Astro config (site URL, integrations)
├── scripts/                pnpm guard and the end-to-end evidence gate
└── dist/                   Production build output (generated)
```

**Key wiring**

- `astro.config.mjs` sets `site` to `https://sergioestrella.com` and enables MDX, sitemap, Partytown, and astro-icon
- Shared page shell: `src/layouts/MainLayout.astro`
- Blog post shell: `src/layouts/BlogPostLayout.astro`
- Head/SEO/analytics: `src/layouts/MainHead.astro`
- Blog consumers that must stay in sync when changing post discovery or frontmatter:
  - `src/pages/index.astro`
  - `src/pages/blog/[...page].astro`
  - `src/pages/category/[category].astro`
  - `src/layouts/BlogPostLayout.astro` (related posts)
  - `src/components/CategoryCloud.astro`
  - `src/pages/rss.xml.js`

Details are in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). For agent-oriented project notes, see [`AGENTS.md`](AGENTS.md).

## Local Development

### Prerequisites

- Node.js 26, the version in `.nvmrc`
- pnpm 11.21.0

This project **requires pnpm** at the version pinned in `package.json`. npm, yarn, and bun are rejected by `scripts/require-pnpm.mjs`.

### Setup

```sh
npm install -g pnpm@11.21.0
pnpm install
```

### Commands

All commands run from the project root:

| Command | Action |
| --- | --- |
| `pnpm run dev` | Start the dev server at `http://localhost:4321` |
| `pnpm run build` | Build the production site to `./dist/` |
| `pnpm run preview` | Preview the production build locally |
| `pnpm run astro ...` | Run Astro CLI commands (e.g. `pnpm run astro add`) |
| `pnpm run lint` | Lint the project |
| `pnpm run check` | Type-check the project |
| `pnpm run test` | Run the unit tests |
| `pnpm run test:e2e` | Build the site and run the end-to-end tests, with video |

### Verify changes

```sh
pnpm run lint && pnpm run check && pnpm run test && pnpm run test:e2e
```

This lints and type-checks the project, runs the unit tests, then builds the site and tests it in a browser. The first Playwright run on a machine may need `pnpm exec playwright install chromium`. See [`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md).

## Contributing

### Workflow

1. Use **pnpm** for all installs and scripts
2. Create a branch for your change
3. Make focused edits
4. Run the checks under [Verify changes](#verify-changes) before opening a PR
5. Use Conventional Commits, scoped to the change

### Adding or editing blog posts

Create or edit a Markdown file in `src/pages/blog/`. Each file becomes a route based on its filename.

Use frontmatter consistent with existing posts:

```yaml
---
layout: "../../layouts/BlogPostLayout.astro"
title: Post title
date: 2025-11-29
author: Sergio Estrella
image:
  {
    src: "/images/post-example.webp",
    alt: "Descriptive alt text",
  }
description: Short summary for cards, SEO, and RSS.
category: Charlas
---
```

Optional fields used elsewhere in the site include `draft: true` and `robots`.

**Important:** when changing blog behavior, discovery paths, or frontmatter shape, update **all** consumers listed in the Architecture section—not just one route.

### Generated output

Do not hand-edit:

- `.astro/` — Astro/Vite cache
- `dist/` — production build output

### Roadmap and larger changes

For planned UX, content, and architecture work, read [`docs/portfolio-roadmap.md`](docs/portfolio-roadmap.md) before proposing structural changes. Larger work runs as a Deep Work Plan; see [`AGENTS.md`](AGENTS.md).

## License

Private personal site. Contact the repository owner before reusing content or assets.
