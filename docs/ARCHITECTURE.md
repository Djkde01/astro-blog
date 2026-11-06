# Architecture

A static Astro 7 site. `pnpm run build` turns Markdown posts and Astro pages into HTML in `dist/`. There is no server, database or client framework. The repository holds no deployment configuration, so hosting is outside its scope.

```text
src/pages/blog/*.md ──> import.meta.glob ──> formatBlogPosts() ──> pages, cards, RSS
       │
       └── layout: BlogPostLayout ──> MainLayout ──> MainHead ──> Seo + JSON-LD
```

## Routes

| Route | Source | Notes |
|-------|--------|-------|
| `/` | `src/pages/index.astro` | Introduction and the 3 latest posts |
| `/about` | `src/pages/about.astro` | Bio, experience (inline array), projects |
| `/blog/`, `/blog/2/` | `src/pages/blog/[...page].astro` | Pagination, 6 posts per page |
| `/blog/<file>` | `src/pages/blog/<file>.md` | One route per Markdown file |
| `/category/<slug>` | `src/pages/category/[category].astro` | One route per category in use |
| `/rss.xml` | `src/pages/rss.xml.js` | Styled by `public/rss/styles.xsl` |
| `/404` | `src/pages/404.astro` | Not found page |

Every `.md` under `src/pages/` becomes a route, so documentation for that folder lives here and not in a README beside it.

## Post discovery

There is no content collection. Each consumer finds posts with its own `import.meta.glob`, then passes them through `formatBlogPosts()` in `src/js/utils.js`, which drops drafts and future posts and sorts by date.

| Consumer | Glob | Use |
|----------|------|-----|
| `src/pages/index.astro` | `./blog/*.md` | Latest posts |
| `src/pages/blog/[...page].astro` | `./*.md` | Blog index |
| `src/pages/category/[category].astro` | `../blog/*.md` | Category routes |
| `src/layouts/BlogPostLayout.astro` | `../pages/blog/*.md` | Posts under the article, through `selectRelatedPosts()` |
| `src/components/CategoryCloud.astro` | `../pages/blog/*.md` | Category list and counts |
| `src/pages/rss.xml.js` | `./blog/**/*.md` | Feed |

A change to discovery or to the frontmatter shape must reach all six. RSS is the only consumer that also reads nested folders, so posts must stay flat.

## Page composition

- `MainLayout` wraps every page with `MainHead`, `Nav` and `Footer`, and imports the font and `global.css`.
- `MainHead` holds the Google Analytics tag, which runs in a worker through Partytown, and loads the Lite YouTube helper globally.
- `Seo` writes canonical, Open Graph and Twitter tags, plus JSON-LD from `src/js/jsonLD.js`.
- `BlogPostLayout` adds the post header, the content in one column, and a footer with the post's category and three posts to read next. Astro picks it through each post's `layout` frontmatter.

## Styling

`src/styles/global.css` is one stylesheet for the whole site, with CSS variables, light and dark themes derived from `--_hue`, and custom media queries `--sm`, `--md`, `--lg` and `--xl`. `postcss-preset-env` at stage 0 compiles those features. Components do not carry scoped styles as a rule.

## Images

Post covers and project images live in `src/assets/images/`. A post's `image.src` names its file there, such as `/src/assets/images/post-1.webp`, and `resolveImage()` in `src/js/images.js` turns it into an imported image. An unknown path throws and stops the build.

`PostCard`, `PostHeader` and `Projects` render those images with `<Picture>`, which emits AVIF with a WebP fallback at two widths each, using Astro's optional `sharp` at build time. Their public URLs are hashed files under `/_astro/`. `Seo.astro` and `jsonLD.js` use `socialImageUrl()` for absolute social image URLs.

Everything else stays in `public/images/` and is served as-is: `default.webp`, the social fallback, `profile.webp`, and the images inside post bodies.

## Agent harness

`.agents/`, `.dwp/` and `.review/` hold the way of working and are not part of the site. See [AI_AGENT_COLLAB.md](AI_AGENT_COLLAB.md).
