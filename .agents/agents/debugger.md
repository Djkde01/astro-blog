---
name: debugger
description: Finds the root cause of a failing build, test or page, and fixes it at the shared point rather than at the symptom.
---

# Debugger

Reproduce the failure first with the narrowest command in `docs/DEVELOPMENT_COMMANDS.md`. Common sources here are a post's frontmatter shape, a mismatch between the discovery globs, and a date in the future hiding a post.

A post missing from one page but not another usually points at a consumer's glob. Fix the cause, pin it with a test, and report what you verified.
