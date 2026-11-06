# Security

The site is static, with no accounts, forms, server or database, so the attack surface is small. What matters is what gets published, which scripts run, and how frontmatter reaches the page.

## Secrets

The site needs no secrets to build, and the repository should hold none. `.env` and `.env.production` are gitignored. `.agents/settings.json` denies the Read tool on `.env` files, which does not stop a shell command such as `cat`, so agents must not read them by any means. If a future tool needs a key, such as the optional AI mode of the transcript tool, keep it in the environment and never in a tracked file.

The Google Analytics ID in `src/layouts/MainHead.astro` is public by design.

## Third-party scripts

- Google Analytics runs in a worker through Partytown. Keep it off the main thread.
- Test runs must not reach it. `e2e/fixtures.ts` aborts those requests, so specs import `test` from there.
- Adding another third-party script or embed is a decision for the owner, because it affects readers' privacy.

## Continuous integration

`.github/workflows/ci.yml` runs code from pull requests, so it holds nothing worth stealing:

- It uses no secrets, and its token has only `contents: read`. Checkout does not keep the token in the workspace.
- It triggers on `pull_request`, never on `pull_request_target`, which would give a fork's code access to a privileged token.
- Each action is pinned to a full commit SHA, with its version in a comment. Update the SHA and the comment together.
- Test runs do not reach Google Analytics, for the reason above.

## Git hooks

Setup links only `pre-push` into git's hooks directory. A branch controls the files in `.githooks/`, so that hook's code comes from the checkout, but it runs only on a push. Pointing `core.hooksPath` at that directory would run a branch's `post-checkout` on a plain `git checkout`, so do not do that.

## Untrusted content

Post frontmatter is written by the owner, so it is trusted today. Keep it safe to render anyway, in case posts ever come from anywhere else, such as the planned transcript tool with AI mode:

- `src/js/jsonLD.js` builds the JSON-LD as an object, serializes it with `JSON.stringify` and escapes every `<` as `\u003c`, because `src/components/Seo.astro` writes it with `set:html`. A quote or `</script>` in a title or description stays inside the JSON string. `e2e/jsonld.spec.ts` proves it with a fixture post that exists only in the end-to-end build. Build any other script or JSON this way, never by interpolating frontmatter into a string.
- Never pass a value that comes from outside the repository to `set:html`.
- The build decodes every image in `src/assets/images/` with `sharp`, through Astro's optional dependency. Commit only images you made or trust, and keep `astro` current, since an image decoder is where parser bugs live.

## Personal data and consent

- Testimonials need explicit consent from the person quoted before publishing, as the roadmap requires.
- Client names must not imply ownership of an employer's projects. See Phase 0 of the [roadmap](portfolio-roadmap.md).
- Do not publish a person's photo or name from a talk or event in a new way without the owner confirming it.

## What agents must not write

Do not put credentials, tokens, private contact details or local machine paths in docs, commits, plans or test evidence.

Pushing, merging and releasing belong to the owner. See Authority in [AGENTS.md](../AGENTS.md#authority).
