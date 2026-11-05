---
name: lib-upgrade
description: Safely upgrade this repo's dependencies (batched, validated, revertible) via the DeepWorkPlan dependency-upgrade addon.
---

# /lib-upgrade

Bring this repository's dependencies up to date without breaking the build. This command is a thin delegator to the DeepWorkPlan dependency-upgrade addon and holds no upgrade logic.

1. Read `.agents/skills/deepworkplan/addons/dependency-upgrade/SKILL.md` and follow its flow.
2. Classify upgrades as patch, minor or major, upgrade in safe batches, and run this gate after each batch: `pnpm run lint && pnpm run check && pnpm run test && pnpm run test:e2e`, which also builds the site. Revert any batch whose gate fails.
3. Surface the upgrade report and the diff. Do not commit automatically.

- Package manager: pnpm, from `pnpm-lock.yaml`. `pnpm-workspace.yaml` holds back releases younger than one day.
- `typescript` stays on 5.x while Astro's dependencies `tsconfck` and `zod-to-ts` accept only up to 5.x. Run `pnpm peers check` after a batch.
- `eslint-plugin-jsx-a11y` 6.10.2 declares peers only up to ESLint 9, so `pnpm peers check` reports it. Three of its rules are proven to run on ESLint 10 by `bash scripts/test-lint-setup.sh`, which is a sample and not the whole plugin. Run that script after any lint upgrade.
- Majors need the owner's approval before they join a batch.
- pnpm regenerates the lockfile. Never hand-edit it.
