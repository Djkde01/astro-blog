# Site data

| File | Purpose | Read by |
|------|---------|---------|
| `navData.js` | Navigation links | `Nav.astro` |
| `siteData.json` | Default title, description and social image | `Seo.astro`, `jsonLD.js` |
| `projects.ts` | Project cards on About. `status` is `"deployed"` or `"development"`; the component maps it to its label and class | `Projects.astro` |
| `experience.ts` | Work experience on About | `about.astro` |
| `landing.ts` | Every string on the landing: hero, current focus, metric labels, post list title. Edit copy here | `index.astro` |
| `about.ts` | Every string on About: intro, find-me links, section titles. `{years}` in a paragraph is replaced by the computed years of experience | `about.astro` |
| `stack.ts` | The technologies listed under the stack section on About | `about.astro` |

The `.ts` files are typed with `src/types/sections.ts`. Phase 5 of the [roadmap](../../docs/portfolio-roadmap.md) adds talks, community, clients and testimonials here. These files have no tests of their own: the build and `pnpm run check` cover them.
