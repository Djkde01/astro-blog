# Commands reference

Invoke these with `/<name>` in Claude Code, with `#<name>` in agents that intercept slash syntax, or in plain text ("run `<name>`") on hosts without slash commands. Discovery is local, from `.agents/commands/`.

| Command | What it does | Writes |
|---------|--------------|--------|
| `dwp-create` | Create a Deep Work Plan | `.dwp/` only |
| `dwp-refine` | Change a plan's scope or tasks | `.dwp/` only |
| `dwp-execute` | Run a plan task by task | Yes, within the contract |
| `dwp-resume` | Resume an interrupted plan | Yes, within the contract |
| `dwp-status` | Report plan status | No |
| `dwp-verify` | Check repository or plan conformance | No |
| `dwp-upgrade` | Check for a newer DeepWorkPlan skill, upgrading only with consent | Only with consent |
| `skill-create` | Author or update a repository skill | `.agents/` |
| `agent-create` | Author or update a repository persona | `.agents/` |
| `commit` | Commit a work unit with a Conventional Commit message | Git history |
| `lib-upgrade` | Upgrade dependencies in validated, revertible batches | `package.json` and the lockfile, only when invoked |
