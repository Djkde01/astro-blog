# Components

Astro components for the site's UI. Styles live in `src/styles/global.css`, so most components are markup and props only.

| Component | Purpose |
|-----------|---------|
| `Nav`, `Footer` | Site navigation, from `src/data/navData.js`, and the footer |
| `Link` | Button-styled link with an optional icon |
| `PostCard` | A post's card; `tagType` sets the heading level |
| `PostHeader` | Hero image, title, date and category of a post |
| `CategoryCloud` | Category badges, with optional counts. It finds posts itself |
| `RelatedPosts` | List items for posts in the same category |
| `Pagination` | Previous and next links on the blog index |
| `Projects` | Project cards. The data is an inline array for now |
| `ExperienceItem` | One job on the about page |
| `Seo` | Canonical, social and JSON-LD tags |
| `LiteYoutube` | Registers the Lite YouTube element |

`PostCard` and `PostHeader` need a post's `image.src` and `image.alt`, and the build fails without them or when `image.src` names no file in `src/assets/images/`. They and `Projects` render `<Picture>` with AVIF and a WebP fallback, through `resolveImage()` in `src/js/images.js`.

These have no component tests. They are covered by `pnpm run lint`, `pnpm run check`, the build and the end-to-end suite.
