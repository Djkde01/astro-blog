---
description: Commit the current work unit with a Conventional Commit message
---

# /commit

Commit one reviewable work unit, with its tests and docs. Use `type(scope): description`, with the scope `blog`, `ui`, `content`, `test`, `deps`, `docs` or `agents`. Do not add `Co-Authored-By` or any AI attribution, and do not push.

Check that no secrets, `.dwp/` plans or test evidence are staged. After committing, run `gentle-ai review assess` and follow its result.
