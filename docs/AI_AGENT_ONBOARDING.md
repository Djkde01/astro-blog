# Agent onboarding

Your first session in this repository.

1. Read [AGENTS.md](../AGENTS.md), then [PRODUCT_SPEC.md](PRODUCT_SPEC.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
2. Install dependencies with `pnpm install`. If pnpm complains about its version, use the one pinned in `package.json`.
3. If `.agents/skills/deepworkplan/` or `.dwp/plans/` is missing, as on a fresh clone, install the skills and create the folders. See [Third-party skills](DEVELOPMENT_COMMANDS.md#third-party-skills).
4. Confirm the baseline with `pnpm run check && pnpm run test && pnpm run build`.
5. If you will touch behavior, run `pnpm run test:e2e`. The first run on a machine may need `pnpm exec playwright install chromium`.
6. Check `/dwp-status` for an active plan, and read it before changing anything.

## Where things live

| To change | Look in |
|-----------|---------|
| A post | `src/pages/blog/`, with the `blog-post` skill |
| A page | `src/pages/*.astro` |
| A shared piece of UI | `src/components/` |
| The page shell or head | `src/layouts/` |
| How posts are filtered | `src/js/utils.js` |
| Colors and layout | `src/styles/global.css` |
| Navigation | `src/data/navData.js` |
| What to build next | `docs/portfolio-roadmap.md` |

## How work flows

- An ordinary direct edit is done directly.
- Larger work starts with `/grilling`, then `/dwp-create`. Pick the next phase from the roadmap, and let the plan hold the tasks and their state.
- Each task follows the same loop: failing test, implementation, gate, commit on the feature branch, then `gentle-ai review assess`.
- The owner pushes, opens pull requests, merges and releases.
