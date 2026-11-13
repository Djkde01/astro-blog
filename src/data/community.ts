import type { CommunityEntry } from "../types/sections";

// Comunidad on About. Organizers render as cards, their `events` (post slugs) as chips;
// collaborators render as one row of chips. `draft: true` marks an entry still to confirm,
// shown under `pnpm run dev` only.
export const community: CommunityEntry[] = [
  {
    name: "Backbone UTP",
    kind: "organizer",
    role: "Fundador y mentor",
    period: "Agosto 2022 - Actualidad",
    link: "https://backboneutp.com",
    events: ["gdg-devfest-pereira", "mujeres-tecnologia-2025", "la-ia-no-te-quitara-el-trabajo-pero-yo-si"],
  },
  {
    name: "Pereira Tech Talks (PerTT)",
    kind: "organizer",
    role: "Organizador",
    period: "2025 - Actualidad",
    draft: true,
  },
  {
    name: "Software Freedom Day Pereira",
    kind: "organizer",
    role: "Organizador",
    period: "2023 - Actualidad",
    events: ["software-freedom-day-2023", "software-freedom-day-2024", "software-freedom-day-2025"],
    draft: true,
  },
  { name: "GDG Pereira", kind: "collaborator", link: "https://gdg.community.dev/gdg-pereira/" },
  { name: "AWS User Group Pereira", kind: "collaborator", draft: true },
  // The owner decides whether this shows as FLISoL or Ubuntu Colombia.
  { name: "FLISoL", kind: "collaborator", draft: true },
  { name: "QA Conf", kind: "collaborator", draft: true },
];
