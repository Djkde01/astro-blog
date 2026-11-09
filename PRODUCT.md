# Product

<!-- impeccable:product-schema 1 -->

The engineering source of truth is [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) and the backlog is [docs/portfolio-roadmap.md](docs/portfolio-roadmap.md). This file records the product truth design work needs; where the two differ, the spec wins and this file is corrected.

## Platform

web

## Users

- **People checking Sergio's background** come first: recruiters, potential clients and event organizers deciding in seconds whether he is the person they need. When a surface must choose between audiences, it serves them first (owner, 2026-11-06).
- **Readers of the blog**: the Spanish-speaking tech community, mostly arriving at a post from a share or a search, looking for event recaps, talks and career advice.
- **Sergio as author**: he publishes by adding one Markdown file, with no content system.

## Product Purpose

sergioestrella.com is the personal site of Sergio Estrella (Djkde), a fullstack developer and community organizer. It gives him one place to publish what he learns, share his talks and show his experience, and it is growing from a blog with a thin landing into an editorial portfolio about his work, talks, community and clients.

Success: a visitor checking his background understands who he is and how to reach him from the first screen; every published post is findable from the home, the blog, its category and RSS; reading stays comfortable on a phone.

## Positioning

Community and talks are what set him apart (owner, 2026-11-06). He organizes and speaks at the Pereira tech community's events (Backbone UTP, GDG Pereira, Software Freedom Day); 6 of the 8 posts are talk recaps. Product engineering at companies is the foundation, the community work is the distinctive part.

## Operating Context

- Visitors arrive from a public bio, LinkedIn, an event or a shared post, often on a phone.
- Posts are Markdown files under `src/pages/blog/`; there is no CMS, database or server. The site builds as static output.
- Work happens through Deep Work Plans; the owner signs visual changes from mockups, videos or screenshots, and Lighthouse on the affected pages against the previous baseline.

## Capabilities and Constraints

- Today: a home with a hero, current focus, metrics and the three latest posts; an About page with bio, contact links, stack, experience and projects; a paginated blog, category pages, related posts; RSS, sitemap, SEO and social metadata.
- Planned, in order of the roadmap: talks, community, clients and testimonials sections (Phase 5), a transcript-to-post tool (Phase 6) and a link hub at `/enlaces` with click metrics (Phase 8).
- All site copy is Spanish; code and docs are English. No other languages.
- Non-goals: a CMS or database, comments, accounts, anything needing a server, and a full visual rewrite. The roadmap adds to the current design rather than replacing it.
- Category is the only taxonomy; multi-tag posts are deferred.

## Brand Commitments

- **Logo**: the current monogram in the nav is fixed.
- **Voice**: warm and close, addressing the reader as "tú", in neutral Spanish (for example "¡Que bueno verte!").
- Not fixed, by the owner's choice: the way the name and alias are written, and the profile photo.

## Evidence on Hand

- Posts: 8 in `src/pages/blog/`, 6 in the category `Charlas`, with covers in `src/assets/images/`.
- Work experience: `src/data/experience.ts` (Curoo, Backbone, Selaski, Platzi, Globant).
- Projects: `src/data/projects.ts`, with images.
- Profile photo: `src/assets/images/profile.webp`.
- Absent, and not to be invented: testimonials, a clients list, community roles beyond `experience.ts`, talks without a post, and any metric beyond what the data computes. Each is gathered with the owner before the phase that uses it; testimonials also need consent from the person quoted.

## Product Principles

1. Credibility before decoration: every claim on the site comes from real data or the owner, never from filler.
2. Reading is sacred: post pages stay calm, single-column, with nothing moving under the text.
3. One Markdown file publishes a post; no change to the site should make that harder.
4. Add to the current design rather than replace it; each phase earns its change with the owner's sign-off.
5. Fast and static: no new page should lower its Lighthouse scores against the previous baseline.

## Accessibility & Inclusion

- Every animation respects `prefers-reduced-motion` with no motion when it is set, keeps keyboard focus, and never animates text being read; each phase that adds motion proves it with a Playwright test.
- Every link and button has visible or accessible text.
