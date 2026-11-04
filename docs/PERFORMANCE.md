# Performance

The site is static HTML with little JavaScript, so it starts out fast. The job is to keep it that way as the roadmap adds motion and sections.

## Budget

No numeric budget is set yet. The rule from the [roadmap](portfolio-roadmap.md) is no regression against the previous baseline, on Performance, Accessibility, Best Practices and SEO, on the home page and one post. No baseline is recorded in this repository yet, so measure one before the first change that could affect it.

Measure against the built site, not the dev server:

```bash
pnpm run build
```

```bash
pnpm run preview
```

Then run Lighthouse on `/` and on one post.

## Where the weight comes from

- **Images:** the largest assets. Keep sources in WebP under `public/images/`. `astro:assets` serves cards and post headers as AVIF at a fixed size.
- **Font:** `@fontsource-variable/montserrat`, a variable font loaded on every page.
- **Global scripts:** the Lite YouTube helper loads on every page through `MainHead`, whether or not the page has a video.
- **Analytics:** runs in a worker through Partytown, off the main thread.

## Rules for new work

- Prefer CSS transitions to JavaScript for hover and small effects.
- Load a library such as GSAP only on pages that use it, from a bundled module script. Do not route it through Partytown.
- Animate `transform` and `opacity` only, and skip animation under `prefers-reduced-motion`.
- Keep post pages calm, with no animation in the body.
- Give images explicit `width` and `height`, as `PostCard` does, to avoid layout shift.
