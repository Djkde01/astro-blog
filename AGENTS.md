# AGENTS.md

## Commands
- Use `pnpm run dev` for local work and `pnpm run build` for the main verification step. `pnpm run build` succeeds and generates the static site into `dist/`.
- There are no `test`, `lint`, or dedicated `typecheck` scripts in `package.json`.
- `pnpm run astro -- check` is not ready in a fresh checkout: it prompts to install `@astrojs/check` first.
- This project requires pnpm. Run `corepack enable` once, then use `pnpm install` instead of npm or yarn.

## Source Of Truth
- Do not rely on `README.md` for project structure; it is still the default Astro starter text.
- This is a single-package Astro site, not a monorepo.
- Treat `.astro/` and `dist/` as generated output, not hand-edited source.

## App Wiring
- `astro.config.mjs` sets `site` to `https://sergioestrella.com` and enables `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/partytown`, and `astro-icon`.
- The site builds as static output. `src/pages/rss.xml.js` is the RSS endpoint and sitemap generation runs during build.
- Shared page shell lives in `src/layouts/MainLayout.astro`; post pages use `src/layouts/BlogPostLayout.astro`.

## Content Model
- Blog posts are file-based content under `src/pages/blog/*.md`; there is no Astro content collection.
- Home, blog pagination, category pages, related posts, and RSS all discover posts with `import.meta.glob(...)` and pass them through `formatBlogPosts()` in `src/js/utils.js`.
- `formatBlogPosts()` filters out `draft: true` posts and posts dated in the future by default, then sorts by descending date.
- Category routes are generated from each post's `frontmatter.category` and slugged with the simple `slugify()` helper in `src/js/utils.js`.

## Editing Notes
- When changing blog behavior, update all consumers that read `src/pages/blog/*.md`, not just one route.
- Post frontmatter is used directly by layouts/SEO. Keep fields like `title`, `description`, `date`, `category`, `image`, and `robots` consistent with existing posts.
- `src/layouts/MainHead.astro` includes Google Analytics via Partytown and registers the Lite YouTube helper globally; keep that in mind before moving script logic elsewhere.
