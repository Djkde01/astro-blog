# Security

The site is static, with no accounts, forms, server or database, so the attack surface is small. What matters is what gets published, which scripts run, and how frontmatter reaches the page.

## Secrets

The site needs no secrets to build, and the repository should hold none. `.env` and `.env.production` are gitignored. `.agents/settings.json` denies the Read tool on `.env` files, which does not stop a shell command such as `cat`, so agents must not read them by any means. If a future tool needs a key, such as the optional AI mode of the transcript tool, keep it in the environment and never in a tracked file.

The Google Analytics ID in `src/layouts/MainHead.astro` is public by design.

## Third-party scripts

- Google Analytics runs in a worker through Partytown. Keep it off the main thread.
- Test runs must not reach it. `e2e/fixtures.ts` aborts those requests, so specs import `test` from there.
- Adding another third-party script or embed is a decision for the owner, because it affects readers' privacy.

## Untrusted content

Post frontmatter is written by the owner, so it is trusted today, but it is not escaped:

- `src/js/jsonLD.js` builds a JSON-LD string by interpolating `title`, `description` and `image.src`, and `src/components/Seo.astro` writes it with `set:html`. A double quote in a title breaks the JSON-LD, and markup could inject a script. Keep this in mind if posts ever come from anywhere else, such as the planned transcript tool with AI mode. Generate that JSON with `JSON.stringify` and escape `<` when this code next changes.
- Never pass a value that comes from outside the repository to `set:html`.

## Personal data and consent

- Testimonials need explicit consent from the person quoted before publishing, as the roadmap requires.
- Client names must not imply ownership of an employer's projects. See Phase 0 of the [roadmap](portfolio-roadmap.md).
- Do not publish a person's photo or name from a talk or event in a new way without the owner confirming it.

## What agents must not write

Do not put credentials, tokens, private contact details or local machine paths in docs, commits, plans or test evidence.

Pushing, merging and releasing belong to the owner. See Authority in [AGENTS.md](../AGENTS.md#authority).
