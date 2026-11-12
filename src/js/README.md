# JavaScript helpers

| File | Purpose | Tested by |
|------|---------|-----------|
| `utils.js` | `formatBlogPosts()`, `selectRelatedPosts()`, `selectNow()`, `slugify()`, `formatDate()` and `getExperienceInYears()` | `tests/utils.test.mjs` covers all but `formatDate()`, which has no test |
| `jsonLD.js` | Builds the JSON-LD script for `Seo.astro` with `JSON.stringify`, escaping `<` | The build and `e2e/jsonld.spec.ts`; it reads `import.meta.env` and cannot load under plain Node |
| `images.js` | `resolveImage()` maps a post's `image.src` to its file in `src/assets/images/` and throws on an unknown path; `socialImageUrl()` returns its absolute URL | The build and `e2e/images*.spec.ts`; it reads `import.meta.glob` and cannot load under plain Node |
| `motion.js` | `revealCards(selector)`: GSAP with ScrollTrigger reveals the matching cards once each as they scroll into view. Cards on screen at load stay still, and nothing runs under `prefers-reduced-motion` | `e2e/motion.spec.ts` |
| `nav.js` | Marks the current navigation link with `aria-current` | Not tested |

`formatBlogPosts()` is the one way to get a list of posts. It accepts the object from `import.meta.glob` or an array, drops drafts and future posts by default, and sorts by descending date.

`selectRelatedPosts(posts, current, count = 3)` picks the posts under an article from `formatBlogPosts()` output: the same category first, then the newest posts from any category, never the current post. It returns `{ posts, sameCategory }`, and the layout heads the block "Artículos relacionados" when `sameCategory` is true and "Más artículos" otherwise.

`selectNow(experience, now)` picks the landing's Ahora text from `src/data/experience.ts` and `landing.now`. The current job is the entry whose `period` ends in "Actualidad"; its "<role> - <company>" title fills `{job}` in `now.working` as "<role> en <company>", and the result is `{ text }`. With no current job it returns `{ text: now.open, link: now.link }`.

`slugify()` only lowercases and replaces whitespace with hyphens. Category URLs depend on this, so changing it changes public URLs.
