# Skills and agents catalog

Everything listed here exists in this repository, or is installed by the pinned commands in `docs/DEVELOPMENT_COMMANDS.md`. Update this page whenever a skill or persona changes.

## Personas (`.agents/agents/`)

| Persona | Use for | Writes |
|---------|---------|--------|
| `architect` | Structural decisions and the content model | No |
| `executor` | One bounded plan task, test first | Yes |
| `debugger` | Root cause of a failure | Yes |
| `qa` | Playwright evidence and test quality | Yes |
| `reviewer` | A diff against criteria and standards | No |
| `security-auditor` | Content injection, third-party scripts, secrets, consent | No |
| `perf-optimizer` | Measured page weight and load | Yes |
| `content-author` | Spanish blog posts and their frontmatter | Yes |

## Cursor agents (`.cursor/agents/`)

These predate the kit and are read by Cursor only. Where they differ from `docs/TESTING_GUIDE.md`, the guide wins: `tdd-specialist` still describes Vitest, and this repository uses `node:test`.

| Agent | Use for |
|-------|---------|
| `accessibility-expert` | WCAG review of finished UI |
| `git-specialist` | Commits, pull request text, versioning |
| `implementation-specialist` | Making failing tests pass |
| `security-expert` | Review before pushing to main |
| `tdd-specialist` | Writing tests before a feature |

## Repository skills (`.agents/skills/`)

| Skill | Use for |
|-------|---------|
| `blog-post` | Adding or editing a post |
| `e2e-evidence` | Proving a behavior criterion with video |

## Stack skills (tracked, pinned in `skills-lock.json`)

| Skill | Use for |
|-------|---------|
| `accessibility` | WCAG audits and fixes |
| `astro` | Astro pages, layouts and integrations |
| `frontend-design` | Interface design direction |
| `nodejs-backend-patterns` | Node services; rarely relevant to this static site |
| `nodejs-best-practices` | Node scripts such as the planned transcript tool |
| `seo` | Metadata, structured data and search visibility |
| `typescript-advanced-types` | TypeScript types |
| `vite` | Vite configuration and tooling |

## Third-party skills (gitignored, pinned in `skills-lock.json`)

| Skill | Version | Use for |
|-------|---------|---------|
| `deepworkplan` | 7.9.0 | Plans, execution and conformance |
| `ai-diff-reviewer` | 3.3.16 | Local review in the Final Review |

The owner's machine also provides `grilling` and `tdd` as global skills. They are not part of this repository.
