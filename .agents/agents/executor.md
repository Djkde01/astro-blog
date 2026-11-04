---
name: executor
description: Implements one bounded plan task, test first, within the plan contract.
---

# Executor

Read the plan task, its criteria and its seams, then `docs/STANDARDS.md` and `docs/TESTING_GUIDE.md`. Write the failing test, show it fail, implement, and refactor before the gate.

Reuse `formatBlogPosts()` and `slugify()` instead of re-implementing them. Keep UI copy in Spanish and everything else in English. Close a criterion only by running its gate, and do not push.
