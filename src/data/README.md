# Site data

| File | Purpose | Read by |
|------|---------|---------|
| `navData.js` | Navigation links | `Nav.astro` |
| `siteData.json` | Default title, description and social image. `{years}` in the description is replaced by the computed years of experience | `MainLayout.astro`, `Seo.astro`, `jsonLD.js` |
| `projects.ts` | Project cards on About. `status` is `"deployed"` or `"development"`; the component maps it to its label and class | `Projects.astro` |
| `experience.ts` | Work experience on About. A `period` ending in "Actualidad" marks the current job, which the landing's Ahora strip names | `about.astro`, `index.astro` through `selectNow()` |
| `landing.ts` | Every string on the landing: hero, the Ahora strip, metric labels, post list title. `now.working` fills `{job}` with the current job; `now.open` and `now.link` show when no job is current. Edit copy here | `index.astro` |
| `about.ts` | Every string on About: intro, find-me links, section titles. `{years}` in a paragraph is replaced by the computed years of experience | `about.astro` |
| `links.ts` | Every string on `/enlaces`: page title and description, the hidden new-tab note, and the links in page order. Each link's `id` is the `link_id` sent to analytics, so keep it when the label or URL changes. `next-event` keeps its id from one event to the next; edit its `href` and `description` by hand | `enlaces.astro` |
| `services.ts` | The service cards under "Servicios" on About: icon, title and description | `about.astro` |

The `.ts` files are typed with `src/types/sections.ts`. Phase 5 of the [roadmap](../../docs/portfolio-roadmap.md) adds talks, community, clients and testimonials here. These files have no tests of their own: the build and `pnpm run check` cover them.
