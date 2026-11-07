# Performance

The site is static HTML with little JavaScript, so it starts out fast. The job is to keep it that way as the roadmap adds motion and sections.

## Budget

No numeric budget is set yet. The rule from the [roadmap](portfolio-roadmap.md) is no regression against the previous baseline, on Performance, Accessibility, Best Practices and SEO, on the home page and one post. The last measured baseline, from 2026-11-05 on Node 26 and Astro 7.4.5, across the 15 built pages:

| Measure | Before image optimization | After |
|---|---:|---:|
| Image KB, desktop 1x | 1711 | 518 |
| Image KB, desktop 2x and phone 3x | 1711 | 722 |
| Lighthouse medians on `/` (Performance, Accessibility, Best Practices, SEO) | 99, 90, 82, 100 | 100, 90, 82, 100 |
| Lighthouse medians on a post | 100, 87, 82, 100 | 100, 87, 82, 100 |

Lighthouse Performance varies by up to 14 points between identical builds on a busy machine, so compare medians of three runs. Measure again before a change that could affect these numbers.

Measure against the built site, not the dev server:

```bash
pnpm run build
```

```bash
pnpm run preview
```

Then run Lighthouse on `/` and on one post.

## Where the weight comes from

- **Images:** the largest assets. Post covers and project images live in WebP under `src/assets/images/`, and `<Picture>` serves them as AVIF with a WebP fallback, at 400 and 800 px for cards and projects and 640 and 1280 px for the post hero, at quality 60. The hero loads eagerly with high priority. `profile.webp`, `default.webp` and images inside post bodies stay in `public/images/` and are served as-is.
- **Font:** `@fontsource-variable/montserrat`, a variable font loaded on every page.
- **Global scripts:** the Lite YouTube helper loads on every page through `MainHead`, whether or not the page has a video.
- **GSAP:** `gsap` with ScrollTrigger, 111 KB raw and 43 KB gzip in one chunk (measured 2026-11-06, gsap 3.15.1). Only pages that render `PostCard` or `Projects` load it: the landing, `/blog/` and its pages, `/category/*` and `/about`. Post pages do not, and `e2e/motion.spec.ts` checks it.
- **Analytics:** runs in a worker through Partytown, off the main thread.

## Rules for new work

- Prefer CSS transitions to JavaScript for hover and small effects.
- Load a library such as GSAP only on pages that use it, from a bundled module script. Do not route it through Partytown.
- Animate `transform` and `opacity` only, and skip animation under `prefers-reduced-motion`.
- Keep post pages calm, with no animation in the body.
- Give images explicit `width` and `height`, as `PostCard` does, to avoid layout shift.
