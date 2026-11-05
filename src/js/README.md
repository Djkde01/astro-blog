# JavaScript helpers

| File | Purpose | Tested by |
|------|---------|-----------|
| `utils.js` | `formatBlogPosts()`, `slugify()` and `formatDate()` | `tests/utils.test.mjs` covers `formatBlogPosts()` and `slugify()`. `formatDate()` has no test |
| `jsonLD.js` | Builds the JSON-LD script for `Seo.astro` with `JSON.stringify`, escaping `<` | The build; it reads `import.meta.env` and cannot load under plain Node |
| `images.js` | `resolveImage()` maps a post's `image.src` to its file in `src/assets/images/` and throws on an unknown path; `socialImageUrl()` returns its absolute URL | The build and `e2e/images*.spec.ts`; it reads `import.meta.glob` and cannot load under plain Node |
| `nav.js` | Marks the current navigation link with `aria-current` | Not tested |

`formatBlogPosts()` is the one way to get a list of posts. It accepts the object from `import.meta.glob` or an array, drops drafts and future posts by default, and sorts by descending date.

`slugify()` only lowercases and replaces whitespace with hyphens. Category URLs depend on this, so changing it changes public URLs.
