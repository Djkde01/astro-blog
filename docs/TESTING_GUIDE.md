# Testing guide

Use this guide to turn a task's touched surface into a validation gate. Every command below ran on 2026-11-04, with Node 26.13.0, pnpm 11.21.0 and Playwright 1.64.1.

The whole suite is cheap, at well under a minute, so prefer running all of it over careful selection. Use scoped commands while iterating.

## Layers

| Layer | Tool | Location | Naming |
|-------|------|----------|--------|
| Unit | `node:test` with `node:assert` | `tests/` | `<module>.test.mjs` |
| Lint | ESLint | Whole repository, config in `eslint.config.mjs` | Project-wide |
| Types and Astro diagnostics | `astro check` | `src/` | Project-wide |
| Build | `astro build` | Whole site | Not applicable |
| End to end | Playwright with video | `e2e/` | `*.spec.ts`, title starts with `AC-*` |
| Evidence gate | Bash and Playwright fixtures | `scripts/`, `e2e-gate-fixtures/` | Not applicable |

No format tool is configured.

## Commands

All commands run from the repository root.

| Check | Full | Scoped | Expected evidence |
|-------|------|--------|-------------------|
| Unit | `pnpm run test` | `node --test tests/utils.test.mjs` | `fail 0` and exit code 0 on the full run |
| Unit by name | Not applicable | `node --test --test-name-pattern=slugify "tests/**/*.test.mjs"` | The test's name appears in the output. Do not rely on the exit code or the counts: a pattern that matches nothing also exits 0 and reports `tests 1`, `pass 1` |
| Lint | `pnpm run lint` | `pnpm exec eslint <path>` | No output from ESLint, and exit code 0 |
| Lint setup | `bash scripts/test-lint-setup.sh` | None | Every line starts with `ok:`, and exit code 0 |
| Types | `pnpm run check` | None; it checks the project | `0 errors` and exit code 0 |
| Build | `pnpm run build` | None | `[build] Complete!` and exit code 0 |
| End to end | `pnpm run test:e2e` | `bash scripts/e2e-gate.sh AC-site-smoke` | `e2e-gate: N test(s) passed, each with its video` |
| Evidence gate | `bash scripts/test-e2e-gate.sh` | None | Every line starts with `ok:`, and exit code 0 |
| Harness | `bash .agents/skills/deepworkplan/verify/conformance.sh --repo-only .` | None | Exit code 0 and `CONFORMANT`. On a fresh clone, first follow [Third-party skills](DEVELOPMENT_COMMANDS.md#third-party-skills) |

`node --test` needs the quoted glob. Passing `tests/` as a directory is not the supported form.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`, on the Node version in `.nvmrc`. It has two jobs:

| Job | Runs |
|-----|------|
| `static` | `pnpm run lint`, `pnpm run check`, `pnpm run test`, `bash scripts/test-lint-setup.sh` |
| `e2e` | `pnpm run test:e2e`, `bash scripts/test-e2e-gate.sh` |

`static` needs no browser, so it stays fast. `e2e` installs Chromium, and always uploads `tmp/e2e-evidence/` as the `e2e-evidence` artifact, kept for 7 days. Open it to watch the video of a failed test.

CI does not replace a plan's gate: a criterion still closes through the gate runner. The harness conformance check stays local, because the skill it lives in is gitignored.

## End-to-end evidence

`scripts/e2e-gate.sh` sets `DWP_EVIDENCE_DIR`, which defaults to `tmp/e2e-evidence/<id>`. It fails when a test fails or is skipped, when a `test.only` narrows the run, when no test is selected, when a video is missing, or when a selected test's title does not start with the id. Playwright's `--grep` matches anywhere in a title, so that last check stops a test that only mentions a criterion from closing it. Each run writes a video, a trace and a screenshot per test. `E2E_GATE_CONFIG` repoints the gate at another Playwright configuration, and exists only for `scripts/test-e2e-gate.sh`.

Playwright builds the site and serves it with `astro preview` on port 4322, so tests see the same output that ships. The command passes `--ignore-lock` because Astro otherwise starts the preview in the background under an AI agent: the server would outlive the run, and every later run would fail on the busy port. Use the `e2e-evidence` skill to write one.

Specs import `test` from `e2e/fixtures.ts`, not from `@playwright/test`. The fixture aborts requests to Google Analytics, and the configuration blocks service workers because Partytown's would hide those requests. A probe on 2026-11-04 saw zero analytics requests in 12 seconds on the home page.

Plan gates may set `DWP_EVIDENCE_DIR` to the plan's `analysis_results/e2e/<AC id>/`.

## Mapping

- **Source to test:** `src/js/<module>.js` maps to `tests/<module>.test.mjs`. Only `utils.js` has tests today. `jsonLD.js` reads `import.meta.env` and cannot load under plain Node, so it is covered through the build.
- **Behavior criterion to test:** each `AC-*` behavior criterion maps to one Playwright test whose title starts with that id.
- **Consumers:** no affected-tests tool exists. A change to `src/js/utils.js`, `src/layouts/` or a post's frontmatter shape reaches every post consumer listed in [ARCHITECTURE.md](ARCHITECTURE.md#post-discovery), so run the full suite.
- **A change in `src/components/` or `src/pages/`:** run `pnpm run lint`, `pnpm run check`, `pnpm run build` and the end-to-end suite.
- **A new or edited post:** run `pnpm run build`, then the end-to-end suite.

## Blind spots

No automated check sees these, so check them by hand or with an owner sign-off:

- **Appearance.** Tests do not compare screenshots. CSS in `global.css` can break a layout with every test passing, and dark mode is not exercised.
- **Motion and reduced motion.** Passing tests say nothing about how an animation feels.
- **SEO output.** Nothing asserts the Open Graph tags, the sitemap, or that the JSON-LD parses.
- **Analytics.** It is blocked in tests, so a broken tag would not show up.
- **Lighthouse scores and rendered accessibility.** Neither runs automatically. The lint rules check accessibility in templates only, not contrast, focus or the built page.
- **Date-dependent posts.** A post dated in the future appears only after a later build.

## Escalation

Run the full suite when any of these change:

- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `astro.config.mjs`, `postcss.config.cjs` or `tsconfig.json`.
- `src/js/utils.js`, `src/layouts/` or the frontmatter shape.
- `playwright.config.ts`, `e2e/fixtures.ts` or anything in `scripts/`. For the gate scripts, also run `bash scripts/test-e2e-gate.sh`.
- `.github/workflows/ci.yml`. CI is the only place that really runs it, so check the run on the pull request.
- `eslint.config.mjs`, `.githooks/` or `scripts/setup-git-hooks.sh`. Also run `bash scripts/test-lint-setup.sh`.

## Fallback

When a scoped gate cannot be derived with confidence, run `pnpm run lint && pnpm run check && pnpm run test && pnpm run test:e2e`, which also builds the site.

While iterating, `bash scripts/e2e-gate.sh <AC-id>` is enough. A task's gate follows the mapping above, and the Final Review always runs the full end-to-end suite.

## Posture

- **Unit tests first.** Keep logic that matters in plain modules under `src/js/`, where tests are fast and deterministic. Test observable behavior and edge cases, and do not assert internal call sequences.
- **Integration at real seams.** The seams here are the post frontmatter shape, the `formatBlogPosts()` contract and the generated routes. A task that changes one of them adds a test for it.
- **End to end for the few flows that matter.** Reading a post, browsing the blog and categories, and each new section the roadmap adds.
- **Deterministic fixtures.** Build test data in the test, as `tests/utils.test.mjs` does. End-to-end tests read titles from the page instead of hard-coding a post, and do not depend on how many posts exist, because posts change.
- **Meaningful assertions.** Assert every observable effect of a rule, not just that a page loaded.

The first tests describe behavior that already existed, so they did not start from a failing run. They were checked by mutating `src/js/utils.js`, which made four of seven fail. New behavior starts from a failing test.

## Outcome checks

Plan acceptance criteria draw from these checks. What no automated check covers needs an owner sign-off.

| Outcome | Check | Automated |
|---------|-------|-----------|
| Drafts and future posts stay hidden | `tests/utils.test.mjs` | Yes |
| Posts sort by date and respect the limit | `tests/utils.test.mjs` | Yes |
| A reader reaches a post and the blog index | `AC-site-smoke` | Yes |
| A post on the home page is also in RSS | `AC-site-smoke` | Yes |
| Code follows the lint rules | `pnpm run lint` | Yes |
| Types and Astro templates are valid | `pnpm run check` | Yes |
| The site builds | `pnpm run build` | Yes |
| A page looks right, light and dark | Owner sign-off on a video or screenshot | No |
| Lighthouse does not regress | Manual run, see [PERFORMANCE.md](PERFORMANCE.md) | No |
