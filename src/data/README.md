# Site data

| File | Purpose | Read by |
|------|---------|---------|
| `navData.js` | Navigation links | `Nav.astro` |
| `siteData.json` | Default title, description and social image. `{years}` in the description is replaced by the computed years of experience | `MainLayout.astro`, `Seo.astro`, `jsonLD.js` |
| `projects.ts` | Project cards on About. `status` is `"deployed"` or `"development"`; the component maps it to its label and class | `Projects.astro` |
| `experience.ts` | Work experience on About. A `period` ending in "Actualidad" marks the current job, which the landing's Ahora strip names | `about.astro`, `index.astro` through `selectNow()` |
| `landing.ts` | Every string on the landing: hero, the Ahora strip, metric labels, post list title. `now.upcoming` invites to the next published talk; otherwise `now.working` fills `{job}` with the current job; `now.open` and `now.link` show when no job is current. Edit copy here | `index.astro` |
| `about.ts` | Every string on About: intro, find-me links, section titles, and the Phase 5 subgroup, tag and button labels. `{years}` in a paragraph is replaced by the computed years of experience | `about.astro` |
| `links.ts` | Every string on `/enlaces`: page title and description, the hidden new-tab note, and the links in page order. Each link's `id` is the `link_id` sent to analytics, so keep it when the label or URL changes. `next-event` keeps its id from one event to the next; edit its `href` and `description` by hand | `enlaces.astro` |
| `services.ts` | The service cards under "Servicios" on About: icon, title and description | `about.astro` |

| `talks.ts` | Sergio's own talks, not the events he organized. `date` is ISO; a talk dated on or after the build day is upcoming. `post` names its post's slug, whose cover and link the card takes; a talk without a post takes `image`, a `.webp` under `src/assets/images/` | `about.astro` (Charlas), `index.astro` (the charlas metric and Ahora) |
| `community.ts` | `kind: "organizer"` renders a card with role, period, link and `events` as chips: a post slug links to the post, and `{ title, url }` links to an event published elsewhere, in a new tab; `"collaborator"` renders one chip | `about.astro` (Comunidad) |
| `clients.ts` | `kind: "employer"` credits the employer, never its client; `"freelance"` is a direct client. Each has a role and a one-line outcome | `about.astro` (Clientes) |
| `testimonials.ts` | Quotes with name, role and an optional company: the recommendations people wrote publicly on Sergio's LinkedIn profile, word for word. Add one only with the owner's approval | `about.astro` (Testimonios) |

**Drafts.** An entry in `talks.ts`, `community.ts`, `clients.ts` or `testimonials.ts` with `draft: true` is a placeholder: it shows under `pnpm run dev` and never in a build (`published()` in `src/js/utils.js`). A section with nothing published is not rendered. To publish an entry, fill it in and delete its `draft` line.

The `.ts` files are typed with `src/types/sections.ts`. `tests/sections.test.mjs` checks the Phase 5 files: the published entries, the drafts and that every post slug names a published post. The build and `pnpm run check` cover the rest.
