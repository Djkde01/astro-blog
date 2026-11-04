# Review overrides for astro-blog

A static Astro blog and portfolio with no server or database. The risks here are what gets published, how frontmatter reaches the page, and a change that reaches only some of the six post consumers.

## Severity overrides for this codebase

- **Always `critical`:**
  - Credentials, tokens or local machine paths in any tracked file.
  - A value from outside the repository reaching `set:html`, as in `src/components/Seo.astro`.
  - A testimonial, photo or client name published without the owner confirming consent, as Phase 0 and Phase 5 of `docs/portfolio-roadmap.md` require.
  - A spec under `e2e/` that imports `test` from `@playwright/test` instead of `./fixtures`, because that run would send hits to the production analytics property.

- **Escalate to `warning`:**
  - A change to post discovery or frontmatter that does not reach all six consumers in `docs/ARCHITECTURE.md`: `index.astro`, `blog/[...page].astro`, `category/[category].astro`, `BlogPostLayout.astro`, `CategoryCloud.astro` and `rss.xml.js`.
  - A post list that does not go through `formatBlogPosts()`, because drafts and future posts would leak.
  - A `.md` file under `src/pages/` that is not a post, because it becomes a public route.
  - A post nested in a subfolder of `src/pages/blog/`, because it would reach RSS and nothing else.
  - A change to `slugify()`, because it changes public category URLs.
  - More frontmatter interpolated into the JSON-LD in `src/js/jsonLD.js` without escaping.
  - An image without meaningful `alt` text, or a new animation that ignores `prefers-reduced-motion` or moves post body text.
  - A first-party script routed through Partytown, or a heavy library loaded on every page through `MainHead.astro`.
  - English text in visible UI copy.
  - A behavior criterion with no Playwright test titled with its `AC-*` id.

- **De-escalate to `info`:**
  - The density of `src/styles/global.css`. The roadmap keeps a single stylesheet, and a rewrite is a non-goal.

## Don't comment on

- Spanish in posts and UI copy. It is required, and only code and docs must be in English.
- The absence of a linter or formatter. It is a known choice for now.
- Vendored stack skills under `.agents/skills/` and anything under `public/`.
- The GA measurement ID in `MainHead.astro`, which is public by design.
- The inline data in `Projects.astro` and `about.astro`. Phase 1 of the roadmap moves it.

## Repo-specific conventions

- Commits use the scopes `blog`, `ui`, `content`, `test`, `deps`, `docs` and `agents`, with no AI attribution.
- The DWP plan is the only planning document, so flag any `odd/tasks/` or similar file, and any task state added to `docs/portfolio-roadmap.md`.
- pnpm only, at the version pinned in `devEngines`. Flag a `package-lock.json`, a `yarn.lock` or `npx` in a script.

## Test-strategy expectations

- A change to `src/js/utils.js` comes with a test in `tests/utils.test.mjs`.
- A change to the frontmatter shape or to generated routes comes with a test for that seam.
- Tests assert observable behavior, and end-to-end tests read post titles from the page instead of hard-coding them.
