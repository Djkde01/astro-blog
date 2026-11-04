# Agent collaboration

One owner supervises, validates and approves, and agents do the implementation. The active DWP plan is the shared record, so agents hand off through it rather than through chat.

## Who owns what

| Job | Owner |
|-----|-------|
| Product decisions, plan approval, sign-off on how a page looks | The owner |
| Push, pull requests, merges, releases | The owner |
| Plan authoring and task execution | Agents, within the plan contract |
| Closing a criterion | The gate runner or the owner's sign-off, never an agent's report |
| Reviewing each commit | Gentle AI receipt-driven review, when its assessment says it is due |
| Reviewing the whole plan | AI Diff Reviewer, in the Final Review |
| Long-term decisions and discoveries | Engram memory; task state stays in the plan journal |

## Branches

`main` is the default branch. History shows pull requests merging `development` into `main`. Work happens on a feature branch, and the owner decides where it goes.

## Handoff

- `/dwp-resume` recovers an interrupted plan from its journal, so no separate handoff document is needed.
- Before stopping, leave the working tree in a state the journal describes, and commit finished work units on the feature branch.
- Record decisions in the plan, with the options, the choice and how to reverse it.

## Parallel work

Start with one lane. When parallel work is needed:

- Each writer declares its files, and two writers never touch the same file.
- `src/styles/global.css` and `src/js/utils.js` are shared files. Give each one owner, or edit them at the end.
- Writers do not run repository-wide formatters, generators or installs.
- Check whether plan state in `.dwp/` survives across worktrees before relying on it. This is an open question in the owner's way of working.

## Avoiding conflicts

- Preserve changes you did not make, and ask before overwriting them.
- Reuse `formatBlogPosts()` and `slugify()` for post data.
- Keep scratch files in `tmp/` and plan artifacts in the plan's `analysis_results/`.
