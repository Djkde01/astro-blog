# JavaScript helpers

| File | Purpose | Tested by |
|------|---------|-----------|
| `utils.js` | `formatBlogPosts()`, `slugify()` and `formatDate()` | `tests/utils.test.mjs` |
| `jsonLD.js` | Builds the JSON-LD script for `Seo.astro`, without escaping | The build; it reads `import.meta.env` and cannot load under plain Node |
| `nav.js` | Marks the current navigation link with `aria-current` | Not tested |

`formatBlogPosts()` is the one way to get a list of posts. It accepts the object from `import.meta.glob` or an array, drops drafts and future posts by default, and sorts by descending date.

`slugify()` only lowercases and replaces whitespace with hyphens. Category URLs depend on this, so changing it changes public URLs.
