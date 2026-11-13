# AGENTS.md: sergioestrella.com

Personal blog and portfolio of Sergio Estrella (Djkde), built with Astro as a static site. Site content is in Spanish. This is a single-package repository, not a monorepo.

DWP standard: 7.0.0 (onboarded 2026-11-04; skill 7.9.0)

> **State of the repository:** the site is live and maintained. Product work is listed in [docs/portfolio-roadmap.md](docs/portfolio-roadmap.md), Phase 0's decisions are settled, Phases 1, 2, 3, 4, 7 and 8 are done, and none of the other phases has started. Each phase becomes a Deep Work Plan when work begins.

## Documentation index

| Document | Read it for |
|----------|-------------|
| [docs/README.md](docs/README.md) | Index of all guides |
| [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md) | What the site is and why it exists |
| [PRODUCT.md](PRODUCT.md) | Users, positioning, voice and evidence, for design work |
| [docs/portfolio-roadmap.md](docs/portfolio-roadmap.md) | Product backlog, by phase |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Routes, post discovery and build |
| [docs/STANDARDS.md](docs/STANDARDS.md) | Coding conventions and anti-patterns |
| [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) | Validation gates, mapping and test posture |
| [docs/DEVELOPMENT_COMMANDS.md](docs/DEVELOPMENT_COMMANDS.md) | Complete command reference |
| [docs/SECURITY.md](docs/SECURITY.md) | Secrets, analytics and untrusted content |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Page weight, images and motion |
| [docs/AI_AGENT_ONBOARDING.md](docs/AI_AGENT_ONBOARDING.md) | First-session checklist |
| [docs/AI_AGENT_COLLAB.md](docs/AI_AGENT_COLLAB.md) | Handoff, ownership, parallel work |
| [src/components/README.md](src/components/README.md) | UI components |
| [src/layouts/README.md](src/layouts/README.md) | Page shells and head |
| [src/js/README.md](src/js/README.md) | Post helpers and JSON-LD |
| [src/data/README.md](src/data/README.md) | Site metadata and navigation |
| [.agents/README.md](.agents/README.md) | Agent kit entry point |
| [.agents/docs/skills_agents_catalog.md](.agents/docs/skills_agents_catalog.md) | Personas and skills in this repository |
| [.agents/docs/COMMANDS_REFERENCE.md](.agents/docs/COMMANDS_REFERENCE.md) | Commands and how to invoke them |

## Repository structure

```text
.
├── AGENTS.md                 # This file; CLAUDE.md is a symlink to it
├── README.md                 # Human-facing overview
├── PRODUCT.md                # Product truth for design work
├── astro.config.mjs          # Site URL and integrations
├── designs/site.pen          # Signed pen.dev designs: post page, landing and About
├── docs/                     # Product, roadmap and engineering guides
├── public/                   # Static assets: images, RSS stylesheet, favicon
├── src/
│   ├── assets/images/        # Post covers, project images and the profile photo, optimized by astro:assets
│   ├── components/           # UI components
│   ├── data/                 # Site metadata and navigation
│   ├── js/                   # Post helpers, JSON-LD, nav script
│   ├── layouts/              # Page shells and head
│   ├── pages/                # File-based routes; blog/*.md are the posts
│   ├── styles/global.css     # The single stylesheet
│   └── types/                # TypeScript interfaces
├── tests/                    # Unit tests, run with node:test
├── e2e/                      # Playwright evidence
├── e2e-gate-fixtures/        # Fixtures that prove the evidence gate can fail
├── scripts/                  # pnpm guard, hook setup and the evidence gate
├── .github/workflows/ci.yml  # Lint, types, unit and end-to-end checks on pull requests
├── .githooks/pre-push        # Lints before a push; pnpm install activates it
├── .agents/                  # Agent kit; .claude is a symlink to it
├── .cursor/                  # Cursor agents and plugin settings, kept as they were
├── .codex/skills/            # Symlinks into .agents/skills
├── .review/extension.md      # AI Diff Reviewer rules for this repository
├── skills-lock.json          # Pinned versions and hashes of skills
├── .dwp/                     # Gitignored plans and evidence; config.json is tracked
└── tmp/                      # Gitignored scratch space
```

## Mandatory rules

### Language

- Code, identifiers, comments, tests, commit messages and documentation are in English.
- Site content is the exception. Posts and UI copy are in Spanish, and new copy must match.

### Planning

- The active DWP plan is the only planning document. Do not create `odd/tasks/` files, SDD artifacts or Superpowers plans.
- `docs/portfolio-roadmap.md` is a backlog that plans draw from, not a plan. Do not track task state in it.
- For anything above a micro-tier plan, run grilling before `/dwp-create`. The skill is global on the owner's machine; without it, settle the open decisions with the owner, one question at a time.
- `/grilling` may ask a full round of questions. Everywhere else, ask one question at a time.

### Building and testing

- Write a failing test first when a runnable test and a clear expected result exist. Show the failure before implementing, and explain any exception.
- Test at the seams named in the plan, and refactor inside the task, before the gate.
- Each behavior criterion names one Playwright test, titled with its `AC-*` id. The gate fails if the test fails or its video is missing.
- Specs import `test` from `e2e/fixtures.ts`, which keeps test runs away from the production analytics property.
- Select validation gates from the change's touched surface using the mapping in [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md), with its documented fallback to the full suite.
- CI runs on pull requests and is the real gate for delivery; `git push --no-verify` skips the local hook. A green CI run does not close a plan criterion.
- Never close a criterion by reporting a result: run the gate. An agent never signs off for the owner.

### Commits and delivery

- Use Conventional Commits, `type(scope): description`, with the scopes `blog`, `ui`, `content`, `test`, `deps`, `docs` or `agents`.
- Do not add `Co-Authored-By` or any AI attribution to commits.
- A plan contract may grant commits on a feature branch. Push, pull requests, merges and releases belong to the owner.
- Plan contracts grant only `gate_command_exec`, `fs_write_plan_scope`, `fs_write_repo_scope` and `git_operations`. Add `network_access` only if a task needs it.
- After each work-unit commit, run `gentle-ai review assess` and follow its result. Without the tool, see [Owner's tools](docs/DEVELOPMENT_COMMANDS.md#owners-tools). When a review is due, write the task and its criteria to a file under `tmp/` and pass its path as `--request-context` on the preflight `gentle-ai review status`.

### Package manager

- This project requires pnpm, at the exact version pinned in `package.json` under `devEngines`. Install it once with `npm install -g pnpm@11.21.0`, then use `pnpm install`. Any other version fails.
- Do not use `npx` here: npm rejects the `devEngines` pin on local commands, though the global install above works from any directory. Use `pnpm dlx`.

### Source of truth

- `README.md` is the human-facing overview and is kept current. This file and `docs/` are what agents work from.
- Treat `.astro/` and `dist/` as generated output, not hand-edited source.

### App wiring

- `astro.config.mjs` sets `site` to `https://sergioestrella.com` and enables `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/partytown` and `astro-icon`.
- The site builds as static output. `src/pages/rss.xml.js` is the RSS endpoint, and sitemap generation runs during the build.
- The shared page shell lives in `src/layouts/MainLayout.astro`. Post pages use `src/layouts/BlogPostLayout.astro`.
- The repository holds no deployment configuration. Do not assume what a merge publishes; ask the owner.

### Content model

- Blog posts are file-based content under `src/pages/blog/*.md`. There is no Astro content collection.
- Home, blog pagination, category pages, related posts, the category cloud and RSS all discover posts with `import.meta.glob(...)` and pass them through `formatBlogPosts()` in `src/js/utils.js`.
- `formatBlogPosts()` filters out `draft: true` posts and posts dated in the future by default, then sorts by descending date.
- Category routes are generated from each post's `frontmatter.category` and slugged with the simple `slugify()` helper in `src/js/utils.js`.

### Editing notes

- When changing blog behavior, update all consumers that read `src/pages/blog/*.md`, not just one route.
- Post frontmatter is used directly by layouts and SEO. Keep fields like `title`, `description`, `date`, `category`, `image` and `robots` consistent with existing posts.
- `src/layouts/MainHead.astro` includes Google Analytics via Partytown and registers the Lite YouTube helper globally. Keep that in mind before moving script logic elsewhere.
- Never add a `.md` file under `src/pages/` that is not a post. Astro turns it into a public route, and under `blog/` it also becomes a post. This is why `src/pages/` has no README.

### Errors and reporting

- The site has no runtime error handling to speak of: a failure should stop the build, not ship a broken page. Do not swallow build errors or skip a gate to get past one.
- Report progress as you go, and never block work on reporting.

### Repository boundaries

- Commit only inside this repository. Never commit `.dwp/` plans, `tmp/`, `.atl/`, `.codegraph/`, the gitignored third-party skills, credentials or test evidence.
- Plan working artifacts live in the plan's `analysis_results/`. Throwaway files live in `tmp/`.

## Working principles

Work with autonomy, ownership and sound judgment. Pursue correctness, clarity, simplicity and verified completion. These defaults never override the plan gates or the approval rules above.

- **Own the outcome.** Carry authorized work through investigation, execution and validation, until the outcome is complete or a concrete blocker stops it.
- **Be resourceful before asking.** Inspect code, docs, tools and prior decisions. Answer what you can investigate instead of passing that work to the owner.
- **Make routine decisions independently.** Choose sensible approaches within the authorized scope, take the recommended option, and record consequential decisions with the options, the choice, the reason and how to reverse it. Do not ask for confirmation of routine steps or of actions already authorized.
- **Ask when judgment or authorization is missing.** Escalate only what is critical and name its class: an action needing approval not already granted, a consent or login screen, irreducible ambiguity, a gate that cannot pass without weakening it, damage, terms, or exhausted capacity. Bring the investigation, the options and your recommendation.
- **Make approvals concrete.** Finish authorized preparation first. Present a reviewable result, and say which action needs approval and why.
- **Work through obstacles.** Investigate failures and attempt reasonable recovery within scope. Continue independent authorized work. Respect stop conditions, and escalate when progress requires the owner or an external change.
- **Respect intent and scope.** Analysis requests remain analysis. Propose broader improvements separately. Preserve the owner's work, decisions and approval rules.
- **Apply proportionate rigor.** Address underlying causes and favor maintainable solutions. Match validation and polish to the task's impact, and avoid unrelated changes.
- **Communicate directly and precisely.** Lead with the result or decision. Explain consequential tradeoffs concisely. Separate verified facts, assumptions and open uncertainty.
- **Verify before declaring completion.** Check the result against the request, fix issues within scope, and report what was validated and what remains. Never claim actions, checks or outcomes that did not occur.

## Quick commands

| Task | Command | Kind | Status |
|------|---------|------|--------|
| Install dependencies | `pnpm install` | full | Verified |
| Run the dev server | `pnpm run dev` | full | Verified |
| Build the site | `pnpm run build` | full | Verified |
| Lint | `pnpm run lint` | full | Verified |
| Type-check | `pnpm run check` | full | Verified |
| Unit tests | `pnpm run test` | full | Verified |
| One unit test file | `node --test tests/utils.test.mjs` | scoped | Verified |
| Unit tests by name | `node --test --test-name-pattern=slugify "tests/**/*.test.mjs"` | scoped | Verified |
| End-to-end evidence | `pnpm run test:e2e` | full | Verified |
| One end-to-end criterion | `bash scripts/e2e-gate.sh AC-site-smoke` | scoped | Verified |
| Prove the evidence gate | `bash scripts/test-e2e-gate.sh` | full | Verified |
| Prove the lint setup | `bash scripts/test-lint-setup.sh` | full | Verified |
| Check harness conformance | `bash .agents/skills/deepworkplan/verify/conformance.sh --repo-only .` | full | Verified |
| Install third-party skills | See [docs/DEVELOPMENT_COMMANDS.md](docs/DEVELOPMENT_COMMANDS.md#third-party-skills) | full | Verified |

There is no format script.

## Deep Work Plans: invocation

Structured work runs through the local DWP flows (`.agents/commands/dwp-*` delegators; the flows live in `.agents/skills/deepworkplan/`). Discovery is local, and no network service is consulted.

| Intent | Route |
|--------|-------|
| "plan this work", "create a plan" | `/dwp-create` |
| "execute / run the plan" | `/dwp-execute` |
| "continue / resume the interrupted plan" | `/dwp-resume` |
| "plan status", "what's left" | `/dwp-status` (read-only) |
| "verify the repo / the plan" | `/dwp-verify` (read-only) |
| Ordinary direct edit ("fix this", "rename that") | Done directly; it never silently becomes a plan |

Hosts without slash commands invoke the same flows by name (`#deepworkplan-create` or plain text). `trust` and `auto` authorize unattended continuation within the requested flow. They do not select a flow, and read-only routes stay read-only.

## Host capabilities

Recorded for Claude Code, the host used here. An unstated ability is false.

| Ability | Value | Consequence |
|---------|-------|-------------|
| `subagents` | true | The host runs bounded subagents |
| `stop_agent`, `meter_spend`, `meter_tokens`, `meter_wall_clock`, `cancel_children`, `model_routing` | false | Any plan limit that needs these is advisory, not enforced |
| `telemetry` | false | Not opted in; flows emit no usage events |

## Authority

- The owner approves plans. Agents author them and never approve them.
- An unattended run stops at: push, pull request, merge, release, external messages, secret access, publishing a testimonial or any other content about a third party, and any review consent.
- Reusable authorization: commits on a feature branch once a plan contract grants them.

## Review

- **Each commit:** Gentle AI receipt-driven review, when its assessment says one is due.
- **Each plan:** AI Diff Reviewer in the Final Review, local only (Flow A), configured in [.review/extension.md](.review/extension.md). The CI action is not installed.
