# Standards

`pnpm run lint` enforces the rules in `eslint.config.mjs`. No formatter is configured, so the other conventions come from the existing code. Match the file you are in.

## Files and naming

- Components and layouts are `PascalCase.astro`, in `src/components/` and `src/layouts/`.
- Helpers are plain modules in `src/js/`, with `camelCase` functions.
- Types go in `src/types/`, and are imported with `import type`.
- Site data goes in `src/data/`. Some data still lives inline in `Projects.astro` and `about.astro`, and Phase 1 of the roadmap moves it.
- Post files are lowercase words joined by hyphens, directly under `src/pages/blog/`.

## Code style

- Two spaces and double quotes.
- `tsconfig.json` is strict, so `pnpm run check` must report no errors. Annotate callback parameters with the interfaces in `src/types/`.
- A helper that several pages need belongs in `src/js/utils.js`, with a test in `tests/`.

## Astro

- Reuse `MainLayout` for pages, and `Link` for buttons and links with an icon.
- Keep `<script>` blocks small. Astro bundles them as modules, and `src/js/nav.js` is the pattern for a shared script.
- Third-party analytics stay on Partytown. First-party scripts that touch the DOM, such as animation, must not.
- Use `astro-icon` with the `mdi` set, or a local SVG in `src/icons/`.

## CSS

- Add rules to `src/styles/global.css`, using the existing variables and the `--sm`, `--md`, `--lg` and `--xl` media queries.
- Derive new colors from `--_hue` so that light and dark themes stay coherent.

## Content and accessibility

- UI copy and posts are in Spanish. `aria-label` values on existing sections are in English, and new ones may follow the same pattern; visible text may not.
- Every image needs meaningful `alt` text. Mark decorative elements with `aria-hidden`.
- Respect `prefers-reduced-motion` in any animation, and never animate post body text.
- Keep keyboard focus visible and in reading order.

## Commits

Conventional Commits, `type(scope): description`, with the scopes `blog`, `ui`, `content`, `test`, `deps`, `docs` or `agents`. No AI attribution.

## Anti-patterns

- Re-implementing post discovery or filtering instead of calling `formatBlogPosts()`.
- Changing one post consumer and not the other five.
- Adding a `.md` file under `src/pages/` that is not a post.
- Nesting a post in a subfolder under `src/pages/blog/`.
- Building a `<script>` or JSON string from frontmatter without escaping it.
- Adding a client framework or a dependency for what CSS or a few lines can do.
- Using `npm` or `npx` for local commands. `devEngines` rejects them. The global pnpm install in the setup steps is the exception.
