# JavaScript helpers

| File | Purpose | Tested by |
|------|---------|-----------|
| `utils.js` | `formatBlogPosts()`, `selectRelatedPosts()`, `selectNow()`, `slugify()`, `formatDate()`, `getExperienceInYears()`, and for Phase 5 `published()`, `formatTalkDate()`, `isUpcoming()` and `findPost()` | `tests/utils.test.mjs` and `tests/sections.test.mjs` cover all but `formatDate()`, which has no test |
| `jsonLD.js` | Builds the JSON-LD script for `Seo.astro` with `JSON.stringify`, escaping `<` | The build and `e2e/jsonld.spec.ts`; it reads `import.meta.env` and cannot load under plain Node |
| `images.js` | `resolveImage()` maps a post's `image.src` to its file in `src/assets/images/` and throws on an unknown path; `socialImageUrl()` returns its absolute URL | The build and `e2e/images*.spec.ts`; it reads `import.meta.glob` and cannot load under plain Node |
| `motion.js` | `revealCards(selector)`: GSAP with ScrollTrigger reveals the matching cards once each as they scroll into view. Cards on screen at load stay still, and nothing runs under `prefers-reduced-motion` | `e2e/motion.spec.ts` |
| `linkClicks.js` | On `/enlaces`, sends `gtag("event", "link_click", { link_id })` for each link opened. It looks `gtag` up at click time and swallows its errors, so the link always opens | `e2e/link-hub.spec.ts` |
| `nav.js` | Marks the current navigation link with `aria-current` | Not tested |

`formatBlogPosts()` is the one way to get a list of posts. It accepts the object from `import.meta.glob` or an array, drops drafts and future posts by default, and sorts by descending date.

`selectRelatedPosts(posts, current, count = 3)` picks the posts under an article from `formatBlogPosts()` output: the same category first, then the newest posts from any category, never the current post. It returns `{ posts, sameCategory }`, and the layout heads the block "Artículos relacionados" when `sameCategory` is true and "Más artículos" otherwise.

`selectNow(experience, now, talks, today)` picks the landing's Ahora text from `src/data/experience.ts`, `landing.now` and `src/data/talks.ts`. The earliest non-draft talk dated on or after `today` comes first: `now.upcoming.text` with its title, event and date, linked to its registration, post, slides or recording. `today` defaults to the build day, so a deploy not rebuilt after a talk keeps inviting to it. Otherwise the current job is the entry whose `period` ends in "Actualidad"; its "<role> - <company>" title fills `{job}` in `now.working` as "<role> en <company>", and the result is `{ text }`. With no current job it returns `{ text: now.open, link: now.link }`.

`slugify()` only lowercases and replaces whitespace with hyphens. Category URLs depend on this, so changing it changes public URLs.
