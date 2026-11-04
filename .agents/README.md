# Agent kit

Personas, commands and skills for agents working in this repository. `.claude` is a symlink to this directory. `.cursor/` stays a real directory with its own agents and plugin settings, and `.codex/skills/` links back here. Start with `AGENTS.md` at the repository root.

| Path | Contents |
|------|----------|
| `agents/` | Worker personas |
| `commands/` | `/dwp-*` delegators, `/skill-create`, `/agent-create`, `/commit`, `/lib-upgrade` |
| `skills/` | Repository and stack skills; `deepworkplan` and `ai-diff-reviewer` are gitignored and pinned in `skills-lock.json` |
| `docs/` | [Catalog](docs/skills_agents_catalog.md) and [command reference](docs/COMMANDS_REFERENCE.md) |
| `settings.json` | Harness permissions: asks before push and merge, and denies the Read tool on `.env` files |
