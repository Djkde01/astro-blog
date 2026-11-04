# Development commands

Run these from the repository root. Each one ran on 2026-11-04, except the pnpm install and the browser install, which are first-time setup and were already in place on that machine.

## Setup

This project requires pnpm at the exact version in `package.json`, under `devEngines` (11.21.0). `scripts/require-pnpm.mjs` rejects npm, yarn and bun, and pnpm itself rejects any other version.

The Node version is in `.nvmrc` (26). Node 25 and later no longer ship Corepack, so install pnpm with npm:

```bash
npm install -g pnpm@11.21.0
```

```bash
pnpm install
```

To run Playwright for the first time on a machine, install its browser:

```bash
pnpm exec playwright install chromium
```

## Everyday commands

| Task | Command | Kind |
|------|---------|------|
| Dev server at `http://localhost:4321` | `pnpm run dev` | full |
| Build to `dist/` | `pnpm run build` | full |
| Serve the build | `pnpm run preview` | full |
| Any Astro CLI command | `pnpm run astro <command>` | full |

## Validation

| Task | Command | Kind |
|------|---------|------|
| Type-check and Astro diagnostics | `pnpm run check` | full |
| Unit tests | `pnpm run test` | full |
| One unit test file | `node --test tests/utils.test.mjs` | scoped |
| Unit tests by name | `node --test --test-name-pattern=slugify "tests/**/*.test.mjs"` | scoped |
| End-to-end evidence | `pnpm run test:e2e` | full |
| One end-to-end criterion | `bash scripts/e2e-gate.sh AC-site-smoke` | scoped |
| Prove the evidence gate can fail | `bash scripts/test-e2e-gate.sh` | full |
| Harness conformance | `bash .agents/skills/deepworkplan/verify/conformance.sh --repo-only .` | full |

`pnpm run check` also prints two hints for unused imports, which do not fail it. See [TESTING_GUIDE.md](TESTING_GUIDE.md) for which gate to run when.

## Third-party skills

`deepworkplan` and `ai-diff-reviewer` are gitignored, and `skills-lock.json` records their pinned versions and hashes. Install them on a fresh clone with `pnpm dlx`, because `npx` fails here on the `devEngines` pin:

```bash
pnpm dlx skills add https://github.com/DailybotHQ/deepworkplan-skill/tree/v7.9.0 --skill deepworkplan -y
```

```bash
pnpm dlx skills add https://github.com/DailybotHQ/ai-diff-reviewer/tree/v3.3.16 --skill ai-diff-reviewer -y
```

Then confirm the versions:

```bash
grep -m1 '^version:' .agents/skills/deepworkplan/SKILL.md .agents/skills/ai-diff-reviewer/SKILL.md
```

Plans and scratch files are gitignored, so create their folders too. Without `.dwp/plans`, the harness conformance check fails:

```bash
mkdir -p .dwp/plans tmp
```

On 2026-11-04 the installed files matched the owner's global copies byte for byte.

## Owner's tools

These run on the owner's machine and are configured outside this repository. Nothing in the build or the gates needs them.

- **Gentle AI** (`gentle-ai`, 4.3.1 on 2026-11-04) provides the per-commit review, from [Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). Without it, skip that review and say so when reporting. The plan's Final Review with AI Diff Reviewer still applies.
- **Engram** is a persistent memory for agents. Without it, keep decisions in the plan journal.

## Dependencies

| Task | Command |
|------|---------|
| Check peer dependencies | `pnpm peers check` |
| Upgrade dependencies in batches | `/lib-upgrade`, see `.agents/commands/lib-upgrade.md` |

`typescript` stays on 5.x, because `tsconfck` and `zod-to-ts`, which Astro depends on, accept only up to 5.x. `@astrojs/check` alone would allow 6.x.
