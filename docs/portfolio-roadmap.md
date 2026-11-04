# Portfolio Roadmap

A phased, implementation-ready backlog for evolving `sergioestrella.com` along five axes: **UX**, **UI**, **new sections**, **content workflow**, and **delivery tooling**. The roadmap is intentionally additive: it preserves the current Astro static-site architecture, the existing routes, and the file-based blog so that nothing breaks unless a content-model change is explicitly approved.

## How This Roadmap Is Executed

This file is a **product backlog**, not a plan. It says what the site should become. How the work runs is set by the owner's way of working, recorded in [`AGENTS.md`](../AGENTS.md):

1. Pick the next phase.
2. Run `/grilling` on it until no decision is open. The Phase 0 decisions that phase depends on are settled here.
3. Run `/dwp-create` with the outcome. The Deep Work Plan becomes the only planning document, with its criteria (`AC-*`), its tasks and their state. Do not copy tasks or progress back into this file.
4. Execute with `/dwp-execute`. Each task writes a failing test, implements, runs its gate, commits on the feature branch and runs `gentle-ai review assess`.
5. Close with the Final Review, using AI Diff Reviewer. The owner pushes, opens the pull request and merges.

When a plan changes what a phase should deliver, update the phase here so the backlog stays true.

---

## 1. Vision and Design Direction

The site today is a small, Spanish-first personal blog with a thin landing page and a richer "About" page. The target evolution is a more **editorial, credibility-focused personal portfolio** that:

- Tells a stronger story around work, talks, community, and clients.
- Uses subtle, intentional motion (GSAP) to add personality without hurting readability or accessibility.
- Keeps the current writing-first feel of the blog, with cleaner, single-column reading.
- Provides an internal authoring tool to turn raw transcripts into ready-to-edit blog posts.

Non-goals (for this roadmap):

- Full visual rewrite of `global.css`.
- Migration to Astro Content Collections (could be a later, separate initiative).
- Changing the deployment/hosting model.

---

## 2. Current Architecture (Source of Truth)

These are the exact files and patterns the roadmap builds on. Each phase below cites them.

### Pages and layouts

- [`src/pages/index.astro`](../src/pages/index.astro) — landing page: about hero + last 3 posts via `formatBlogPosts`.
- [`src/pages/about.astro`](../src/pages/about.astro) — bio, work experience list, projects (via `Projects.astro`).
- [`src/pages/blog/[...page].astro`](../src/pages/blog/[...page].astro) — paginated blog index (`pageSize: 6`).
- [`src/pages/category/[category].astro`](../src/pages/category/[category].astro) — category archive built from `frontmatter.category`.
- [`src/pages/rss.xml.js`](../src/pages/rss.xml.js) — RSS feed (uses `./blog/**/*.md`).
- [`src/layouts/MainLayout.astro`](../src/layouts/MainLayout.astro) — global shell, fonts, head, nav, footer.
- [`src/layouts/MainHead.astro`](../src/layouts/MainHead.astro) — SEO + Partytown/Google Analytics + Lite YouTube helper.
- [`src/layouts/BlogPostLayout.astro`](../src/layouts/BlogPostLayout.astro) — post shell: header + content + sidebars (categories + related).

### Components

- [`src/components/Nav.astro`](../src/components/Nav.astro), [`src/components/Footer.astro`](../src/components/Footer.astro)
- [`src/components/PostCard.astro`](../src/components/PostCard.astro), [`src/components/PostHeader.astro`](../src/components/PostHeader.astro)
- [`src/components/CategoryCloud.astro`](../src/components/CategoryCloud.astro), [`src/components/RelatedPosts.astro`](../src/components/RelatedPosts.astro)
- [`src/components/Pagination.astro`](../src/components/Pagination.astro)
- [`src/components/Projects.astro`](../src/components/Projects.astro) — keeps a hardcoded `PROJECTS` array inline.
- [`src/components/ExperienceItem.astro`](../src/components/ExperienceItem.astro)
- [`src/components/Link.astro`](../src/components/Link.astro), [`src/components/LiteYoutube.astro`](../src/components/LiteYoutube.astro), [`src/components/Seo.astro`](../src/components/Seo.astro)

### Data, utils, types

- [`src/data/navData.js`](../src/data/navData.js) — only `Acerca` and `Blog` today.
- [`src/data/siteData.json`](../src/data/siteData.json) — SEO defaults.
- [`src/js/utils.js`](../src/js/utils.js) — `formatBlogPosts`, `slugify`, `formatDate`; filters `draft` and future posts.
- [`src/js/jsonLD.js`](../src/js/jsonLD.js) — JSON-LD generation tied to frontmatter shape.
- [`src/types/posts.ts`](../src/types/posts.ts) — minimal `Post` interface (currently misses `author`, `robots`, and the `image` object shape).

### Styling

- [`src/styles/global.css`](../src/styles/global.css) — single, dense stylesheet with CSS variables and per-section rules. Notable for posts: the post layout becomes two columns at the `--md` breakpoint and wider at `--lg`.

```648:656:src/styles/global.css
  @media (--md) {
    grid-template-columns: 1fr minmax(auto, 220px);
    gap: var(--space-lg);
    align-items: start;
  }

  @media (--lg) {
    grid-template-columns: 1fr minmax(auto, 300px);
  }
```

### Tooling

- [`package.json`](../package.json) — `dev`, `build`, `preview`, `astro`, `check`, `test`, `test:e2e`. **No** lint or format script. Gates are described in [`docs/TESTING_GUIDE.md`](TESTING_GUIDE.md).
- [`astro.config.mjs`](../astro.config.mjs) — MDX, sitemap, Partytown, `astro-icon`.
- Content is **not** in a content collection; everything goes through `import.meta.glob("...blog/*.md")` + `formatBlogPosts()`. Any change to discovery or path shape must be applied to **all** consumers (homepage, blog index, category, related, RSS).

---

## 3. Phase 0 — Decisions Before Implementation

These should be answered before opening implementation PRs. None require code changes.

### Content prerequisites

- **Talks**: list of delivered talks with title, event, date, location/online, slides URL, recording URL, language, optional thumbnail.
- **Community**: organizations where Sergio is an organizer (Backbone UTP, GDG, etc.) with role, period, links, logo.
- **Clients showcase**: split into **employee work** (Globant, Selaski, Curoo, etc.) and **freelance/independent**. For each: client name, scope, role, period, logo, link, and a short outcome line. Be careful with wording to avoid implying ownership of employer projects.
- **Testimonials**: name, role, company, photo (optional), quote, source link or proof. Decide which can be published with names/photos.
- **Link hub**: label, URL, stable id and order for each link.

### Product/technical decisions

- **Tags vs. categories**: today only `frontmatter.category` exists. Decide whether the "tags below the article" requirement means:
  - (a) **Visual chips** built from `category` only (no content-model change), or
  - (b) **Multi-tag frontmatter** (`tags: ["a", "b"]`) — requires changes in posts, types, related-posts logic, and possibly new tag routes.
  - Default recommendation: start with (a) and migrate to (b) only if real value emerges.
- **Transcript-to-post tool**: choose between
  - (a) **Template-only**: a deterministic shell/Node script that scaffolds a Markdown file with frontmatter, headings, and image/video placeholders from a `.txt` transcript.
  - (b) **AI-assisted**: same scaffold, but body is generated by an external LLM (OpenAI/Anthropic/etc.).
  - Default recommendation: ship (a) first; layer (b) behind an opt-in flag.
- **GSAP scope**: confirm motion is acceptable on landing/about/blog index, and that **post pages stay calm** (only header/meta micro-interactions).
- **Accessibility floor**: respect `prefers-reduced-motion`, keep keyboard focus, do not animate text content during reading.
- **i18n**: site stays Spanish-only; new copy must match.
- **Link hub route**: choose between `/enlaces` and `/links`. Existing routes are in English (`/about`, `/blog/`, `/category/`), while the copy is in Spanish. Default recommendation: `/enlaces`, because this URL is read by people in a public bio.
- **Link hub click metrics**: choose between
  - (a) **Google Analytics events** on the property the site already uses. No backend and no new vendor, but ad blockers hide some clicks and delivery through Partytown is unproven (see Phase 8).
  - (b) **Counting redirects** (`/l/<id>`) in a host function. Counts every click, but it adds a server, ties the site to one host, and goes against the non-goals in section 1 and in `docs/PRODUCT_SPEC.md`.
  - Default recommendation: ship (a), and consider (b) only if (a) proves unreliable and the owner lifts those non-goals.
- **Lint tool**: choose between
  - (a) **ESLint** with `eslint-plugin-astro`, which lints `.astro` templates through a dedicated plugin.
  - (b) **Biome**, which is faster and has fewer dependencies, but documents its Astro support as experimental.
  - Default recommendation: (a), since most of this site's markup lives in `.astro` files.
- **Node version**: nothing pins one today. CI needs it, so pin it in one file that CI reads. Default recommendation: `.nvmrc` with `26`, the current LTS line since 2026-10-28. Node 25 and later no longer ship Corepack, so setup moves to `npm install -g pnpm@<pinned version>`.

---

## 4. Phase 1 — Architecture Cleanup (No Visual Changes)

Goal: make later phases trivial and additive. No user-visible change.

### Changes

- Create a `src/data/` data layer:
  - `src/data/projects.ts` — move the inline `PROJECTS` array from [`src/components/Projects.astro`](../src/components/Projects.astro) here, typed.
  - `src/data/talks.ts`, `src/data/community.ts`, `src/data/clients.ts`, `src/data/testimonials.ts` — empty arrays + types, ready for content.
- Expand [`src/types/posts.ts`](../src/types/posts.ts) to reflect the real frontmatter (`author`, `robots`, `image: { src, alt }`, optional `tags`, optional `draft`).
- Add `src/types/sections.ts` with shared types: `Talk`, `CommunityRole`, `Client`, `Testimonial`, `Project`.
- Introduce a small reusable `Section.astro` (title + icon + intro slot + content slot) to avoid copy-pasting the `<span class="title">…</span>` pattern from `about.astro`.
- Refactor [`src/components/Projects.astro`](../src/components/Projects.astro) to consume `src/data/projects.ts` (no markup change).

### Risks / guardrails

- Do not change the public API of `Projects.astro` — `about.astro` keeps importing it the same way.
- Keep the `Post` interface backward-compatible (all new fields optional).

---

## 5. Phase 2 — Blog Readability (Single Column + Tags Below)

Goal: keep the article in one column at all breakpoints; move category and related posts beneath the article.

### Changes

- In [`src/styles/global.css`](../src/styles/global.css), **remove or override** the two-column rules on `.post-content` (lines 648–656 above) so the article stays single-column. Tighten `.content` typography:
  - Cap measure with `max-width: var(--content-lg)` (already 65ch) on the article, not on every `<p>`.
  - Increase vertical rhythm (`margin-block` on headings/lists) and inter-paragraph spacing.
  - Style code blocks (currently no rules) with `hsl(var(--muted))` background and `--radius-md`.
- In [`src/layouts/BlogPostLayout.astro`](../src/layouts/BlogPostLayout.astro):
  - Keep the DOM order (article → sidebar) — the sidebar will naturally stack below.
  - Rework `.sidebar` to render as a **horizontal "post footer"** with two blocks: **Tags/Category chips** and **Artículos relacionados**.
  - Add a small "share" row (copy link, X/LinkedIn) below the footer, optional.
- In [`src/components/PostHeader.astro`](../src/components/PostHeader.astro), keep the category badge but move the tag/category cloud out of the post and only into the blog index page if desired.
- If decision (b) on tags is taken later: extend `formatBlogPosts` consumers and `relatedPosts` logic in [`src/layouts/BlogPostLayout.astro`](../src/layouts/BlogPostLayout.astro) to match by `tags` overlap as a fallback to category.

### Risks / guardrails

- `.post-content` styles also affect `blockquote`, `strong`, `em`. Verify all existing posts visually after the change.
- Do not move `CategoryCloud` to a place that requires a new glob; it already shares the same discovery path.

---

## 6. Phase 3 — UX Motion with GSAP

Goal: add subtle but distinctive motion that respects accessibility and performance.

### Setup

- Add `gsap` as a runtime dependency: `pnpm add gsap`.
- Create `src/js/motion.ts` with:
  - A single `gsap.matchMedia()` instance per page, with conditions `isDesktop`, `isMobile`, and `reduceMotion`.
  - A small `revealOnScroll(selector, opts)` helper using `ScrollTrigger.batch()` for staggered entrances.
  - A `heroIntro()` helper for the landing page.
- Register `ScrollTrigger` once: `gsap.registerPlugin(ScrollTrigger)`.
- Use Astro's `<script>` (default = type="module", deferred, bundled) inside the components that need motion. Do **not** route GSAP through Partytown.

### Where to apply motion

- **Landing hero** ([`src/pages/index.astro`](../src/pages/index.astro)): staggered reveal of avatar, headline, subline, and CTA on first paint.
- **Section reveals**: fade/translate-up on every `<section class="container">` as it enters the viewport (use `autoAlpha` + `y: 20`).
- **Project / client / talk cards**: batch reveal with stagger; subtle hover lift via CSS (transform + shadow), not JS.
- **Blog index**: staggered card entrance only.
- **Post page**: keep calm — only animate `PostHeader` meta (title fade-in + small underline grow). No body animation.
- **Reduced motion**: in `matchMedia`, set `duration: 0` or skip animations when `reduceMotion` is true.

### Guardrails

- Always use transform aliases (`x`, `y`, `scale`, `autoAlpha`) — not `width`/`top`/`opacity`.
- Kill ScrollTriggers on view-transitions (if added later) by relying on the `useGSAP`-equivalent pattern: keep all triggers within `matchMedia` so they auto-revert.
- Do not animate elements that contain headings being read aloud by screen readers.

---

## 7. Phase 4 — UI Refresh (Landing, About, Icons, Color)

Goal: lift the landing and about pages from "simple" to "intentional", reusing existing tokens.

### Changes

- **Landing** ([`src/pages/index.astro`](../src/pages/index.astro)):
  - Replace the single avatar + paragraph with a richer hero: name + role + 1-line value prop + CTA cluster (Conoceme más, Contáctame, GitHub).
  - Add a "Ahora" / "Now" strip (1–2 lines about current focus, e.g., Curoo + Backbone).
  - Add a "Métricas" mini-strip: years of experience, talks delivered, communities, posts (computed from data).
  - Keep "Últimos posts" but reduce to 3 with consistent card height.
- **About** ([`src/pages/about.astro`](../src/pages/about.astro)):
  - Promote `getExperienceInYears()` into a reusable helper in `src/js/utils.js`.
  - Replace bare social icon row with a labeled "Encuéntrame" block (icon + handle text).
  - Add a "Stack actual" chip group (typed in `src/data/`).
- **Icons & color**:
  - Audit `astro-icon` usages; introduce a small set of semantic icons per section (briefcase, mic, users, code-tags, message-quote, presentation).
  - In [`src/styles/global.css`](../src/styles/global.css), define accent variants per section (e.g., `--accent-talks`, `--accent-community`) all derived from `--_hue` so both light/dark stay coherent.
- **Cards**:
  - Unify project/talk/client/testimonial cards under a single `Card.astro` primitive (image + tag + title + description + CTAs).

### Guardrails

- Do not change the public structure of `MainLayout` props.
- Keep all changes inside existing breakpoints (`--sm`, `--md`, `--lg`, `--xl`).

---

## 8. Phase 5 — New Sections (Talks, Community, Clients, Testimonials)

Goal: add the four sections, reusing the data layer and `Card.astro` from earlier phases.

### Components and data

- `src/components/sections/Talks.astro` — consumes `src/data/talks.ts`, renders cards (title, event, date, slides, recording link, language).
- `src/components/sections/Community.astro` — consumes `src/data/community.ts`, renders organizer roles with logo, role, period, link.
- `src/components/sections/Clients.astro` — consumes `src/data/clients.ts`, split into two subgroups: **Empresa** and **Freelance**. Each card lists role + outcome.
- `src/components/sections/Testimonials.astro` — consumes `src/data/testimonials.ts`, renders quote cards with attribution.

### Placement

- Default placement: extend [`src/pages/about.astro`](../src/pages/about.astro) with the four new sections, in this order: Experiencia → Talks → Community → Clients → Testimonials → Mis proyectos.
- Optional later: promote each to its own page (e.g., `/talks`, `/community`) and add to [`src/data/navData.js`](../src/data/navData.js). Defer until each section has enough content to justify a page.

### Guardrails

- Empty data arrays must render gracefully (section hidden, not empty).
- Logos/photos go under `public/images/` to keep the asset story consistent with current posts.
- Testimonials require explicit consent from the person quoted before publishing.

---

## 9. Phase 6 — Internal Tool: Transcript → Blog Post

Goal: a repeatable command that turns a `.txt` transcript into a draft `src/pages/blog/<slug>.md` ready to edit, with image/video placeholders.

### Shape

- **Entry point**: a shell wrapper at `scripts/new-post-from-transcript.sh` accepting one positional arg (transcript path):

  ```bash
  scripts/new-post-from-transcript.sh ./transcripts/charla-gdg.txt
  ```

- The shell script delegates to a Node script (`scripts/new-post-from-transcript.mjs`) that does the real work. Reasons: cross-platform, easier file I/O, can grow into AI mode later. The shell wrapper keeps the user-facing command exactly as requested.

### Behavior

1. Validate the input (`.txt`, exists, non-empty).
2. Derive a `slug` from the file name (`slugify`-compatible) and a default `title` from the first non-empty line.
3. Detect simple structure in the transcript (blank-line paragraphs, "?" → questions) and emit Markdown headings every N paragraphs as `## Sección`.
4. Insert clearly-marked placeholders that are easy to find and replace:

   ```markdown
   <!-- IMAGE: replace with /images/<slug>-1.webp, alt text required -->
   <!-- VIDEO: replace with <LiteYoutube id="..." /> -->
   ```

5. Write the output to `src/pages/blog/<slug>.md` with frontmatter that matches existing posts:

   ```yaml
   ---
   layout: "../../layouts/BlogPostLayout.astro"
   title: "<Derived title>"
   date: <today, ISO>
   author: Sergio Estrella
   image: { src: "/images/<slug>.webp", alt: "TODO: alt" }
   description: "TODO: meta description (≤160 chars)"
   category: "TODO"
   draft: true
   ---
   ```

6. Print next steps to stdout: replace placeholders, add real `image`/`description`/`category`, set `draft: false`, run `pnpm run build`.

### Add a script entry

- Optional pnpm alias in [`package.json`](../package.json):

  ```json
  {
    "scripts": {
      "new:post": "node scripts/new-post-from-transcript.mjs"
    }
  }
  ```

### Guardrails

- Output **must** be flat under `src/pages/blog/*.md`. Nested paths would mismatch the globs in [`src/pages/index.astro`](../src/pages/index.astro), [`src/pages/blog/[...page].astro`](../src/pages/blog/[...page].astro), [`src/pages/category/[category].astro`](../src/pages/category/[category].astro), and [`src/layouts/BlogPostLayout.astro`](../src/layouts/BlogPostLayout.astro), even though `rss.xml.js` would still pick them up.
- Default `draft: true` so a half-finished post never reaches the index/RSS (because `formatBlogPosts` filters drafts, and `rss.xml.js` goes through it too).
- Refuse to overwrite an existing slug; require `--force`.
- No network calls in the default mode. AI-assisted mode (later) goes behind a `--ai` flag and an env var.

---

## 10. Phase 7 — CI Pipelines and Lint Hook

Goal: run the existing gates on every pull request, and add a linter that also runs before each push. Nothing here changes what the site ships.

This phase has no dependency on the others, and every later phase benefits from it, so it can run first.

### Changes

- **Node:** add `.nvmrc` with `26`, and replace `corepack enable` in `README.md`, `AGENTS.md`, `docs/DEVELOPMENT_COMMANDS.md` and `scripts/require-pnpm.mjs`. If a host cannot build on 26, return to `24` everywhere, so CI and production stay on one version.
- **Lint:** add `pnpm run lint`, with the tool chosen in Phase 0. Fix the findings on the existing code in a commit of their own, with no change in `dist/`. The `arguments` use in the Google Analytics snippet in `MainHead.astro` stays, with an inline exception and its reason. Formatting stays out of scope.
- **CI:** add `.github/workflows/ci.yml`, triggered on pull requests and on pushes to `main`:
  - `static` job: `pnpm run lint`, `pnpm run check`, `pnpm run test`, and `bash scripts/test-e2e-gate.sh`.
  - `e2e` job: install Chromium with its system dependencies, run `pnpm run test:e2e`, and upload `tmp/e2e-evidence/` as an artifact with a short retention.
  - Both install with `pnpm install --frozen-lockfile`. `pnpm/action-setup` can read the version from `devEngines.packageManager`, so the pin stays in one place.
- **Pre-push hook:** add `.githooks/pre-push`, which runs `pnpm run lint`, and a `prepare` script that sets `core.hooksPath` to `.githooks`. Git supports this natively, so no hook manager is needed.
- **Docs:** update `AGENTS.md`, `README.md`, `docs/TESTING_GUIDE.md`, `docs/DEVELOPMENT_COMMANDS.md`, section 2 of this file, and the line in `.review/extension.md` that accepts the missing linter.

### Risks / guardrails

- `git push --no-verify` skips a hook, so CI is the gate and the hook is only a fast warning. Keep the hook to lint: the end-to-end suite is too slow for it.
- `prepare` also runs on the hosts' builds and in CI, where `.git` may be missing. It must not fail there. The Netlify and Cloudflare Pages previews on the pull request prove this.
- Give the workflow `permissions: contents: read`, and pin third-party actions to a commit SHA.
- Test evidence goes to CI artifacts and is never committed.
- CI does not deploy. Hosting stays as it is, per the non-goals in section 1.
- Making CI a required check is a GitHub setting that belongs to the owner.

---

## 11. Phase 8 — Link Hub with Click Metrics

Goal: one public page at a descriptive route that gathers the owner's links for use in social bios, and shows how people reach it and which links they open.

### Changes

- `src/pages/enlaces.astro` (route per Phase 0) renders the links on the existing layout. It adds no client framework or new library.
- `src/data/links.ts` holds the links, following the data layer convention from Phase 1. Each entry has a stable `id`, so metrics survive a change of label or URL. This phase does not need Phase 1 to land first.
- A small script sends one `link_click` event with the `link_id` when a link is opened.
- Link to the hub from each profile with `utm_source` (for example `?utm_source=instagram`). This needs no code, and Google Analytics then reports where visits came from.

### What the metrics can answer

- **Who visits:** aggregate figures only, such as visits, country, device and traffic source. The site cannot and should not identify individual visitors. Google Analytics already collects these figures for every page.
- **Which links are opened:** clicks per `link_id`, from the new event, as a minimum and not an exact count. Ad blockers hide part of the traffic.

### Risks / guardrails

- **Delivery is unproven.** Google Analytics runs in a Partytown worker, and the link click starts a navigation away from the page, so an event may be lost. A public report also describes custom events not reaching Google Analytics through Partytown. Start the plan with a spike that confirms the event in DebugView, on real links, on a deploy preview.
- **End-to-end tests cannot prove arrival.** `playwright.config.ts` blocks service workers and `e2e/fixtures.ts` aborts analytics requests, by design. A test can assert the event is handed over with the right `link_id`, and that the link still opens. Arrival in Google Analytics needs a criterion with the owner's sign-off.
- A blocked or failed analytics call must never stop a link from opening.
- Send only the link id. No personal data goes into event parameters.
- Each link is a real `<a>` that works by keyboard and without JavaScript.
- No post consumer is touched, so `formatBlogPosts()` and its six consumers stay out of scope.

---

## 12. Suggested Architecture (Visual)

```mermaid
flowchart TD
  subgraph data [src/data]
    projects[projects.ts]
    talks[talks.ts]
    community[community.ts]
    clients[clients.ts]
    testimonials[testimonials.ts]
    links[links.ts]
  end

  subgraph components [src/components]
    Card[Card.astro]
    Section[Section.astro]
    SectionTalks[sections/Talks.astro]
    SectionCommunity[sections/Community.astro]
    SectionClients[sections/Clients.astro]
    SectionTestimonials[sections/Testimonials.astro]
    Projects[Projects.astro]
  end

  subgraph pages [src/pages]
    Index[index.astro]
    About[about.astro]
    BlogIndex["blog/[...page].astro"]
    PostLayout[layouts/BlogPostLayout.astro]
    Enlaces[enlaces.astro]
  end

  subgraph motion [src/js]
    Motion[motion.ts]
  end

  subgraph tools [scripts]
    Shell[new-post-from-transcript.sh]
    Node[new-post-from-transcript.mjs]
  end

  projects --> Projects
  talks --> SectionTalks
  community --> SectionCommunity
  clients --> SectionClients
  testimonials --> SectionTestimonials
  links --> Enlaces

  SectionTalks --> Card
  SectionCommunity --> Card
  SectionClients --> Card
  SectionTestimonials --> Card
  Projects --> Card

  Section --> SectionTalks
  Section --> SectionCommunity
  Section --> SectionClients
  Section --> SectionTestimonials

  SectionTalks --> About
  SectionCommunity --> About
  SectionClients --> About
  SectionTestimonials --> About
  Projects --> About

  Motion --> Index
  Motion --> About
  Motion --> BlogIndex
  Motion --> PostLayout

  Shell --> Node
  Node -->|"writes draft .md"| PostLayout
```

---

## 13. Validation Plan

Each phase's plan selects its gates from [`docs/TESTING_GUIDE.md`](TESTING_GUIDE.md). A criterion closes only on a gate or on the owner's sign-off.

For every phase:

- Run `pnpm run check && pnpm run test && pnpm run test:e2e`, which also builds the site.
- Prove each user-visible behavior with a Playwright test titled with its `AC-*` id, with video. For a layout or an animation that must be judged by eye, add a second criterion for the owner's sign-off.

These checks have no automated gate, so run them by hand or ask for the owner's sign-off:

- Run `pnpm run dev` and visit at minimum:
  - `/` (landing)
  - `/about`
  - `/blog/`
  - `/blog/<one existing slug>` (single post)
  - `/category/<one existing slug>`
  - `/rss.xml`
- Verify content discovery still works: every existing post appears in the index, the right category, the right related list, and RSS.
- Lighthouse pass on `/` and a post page; no regression vs baseline on Performance, Accessibility, Best Practices, SEO.
- Manual a11y checks:
  - Tab order intact through new sections.
  - All images have `alt`.
  - Reduced-motion: with the OS setting on, no entrance/scroll animations should run (or they should run with `duration: 0`).
- Transcript tool:
  - Run on a sample `.txt`, confirm a draft `.md` is created with valid frontmatter.
  - Run `pnpm run build`; the draft should **not** appear in `/blog/` or RSS while `draft: true`.
  - Flip `draft: false`, rebuild, and confirm it appears everywhere it should.

---

## 14. Sequencing Summary

| Phase | Scope | Breaking? | Depends on |
|-------|-------|-----------|------------|
| 0 | Decisions + content gathering | No | — |
| 1 | Data layer + types + `Section.astro` | No | 0 |
| 2 | One-column post + tags below | No (visual) | 1 |
| 3 | GSAP motion + reduced-motion | No | 1 |
| 4 | Landing/About refresh + `Card.astro` | No | 1, 3 |
| 5 | Talks/Community/Clients/Testimonials | No | 1, 4 |
| 6 | Transcript → post tool | No | 0 |
| 7 | CI pipelines + lint + pre-push hook | No | — |
| 8 | Link hub + click metrics | No | 0 |

Phase numbers identify the work, and this table sets the dependencies. Phases 7 and 8 do not depend on Phases 1 to 6, and Phase 7 should run first so that later phases land with CI.

The only optional **breaking-ish** change is moving from `category` to multi-`tags` (Phase 2 option b). It is deferred until clearly justified.
