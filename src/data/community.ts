import type { CommunityEntry } from "../types/sections";

// Pereira Tech Talks meetups held in 2025 and 2026, oldest first, from https://pereiratechtalks.org/meetups/.
const pertt = (slug: string, title: string) => ({ title, url: `https://pereiratechtalks.org/meetups/${slug}/` });

// Comunidad on About. Organizers render as cards, their `events` as chips: a post slug links to
// the post, an external event links out. Collaborators render as one row of chips.
// `draft: true` marks an entry still to confirm, shown under `pnpm run dev` only.
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
    link: "https://pereiratechtalks.org/",
    events: [
      pertt("inauguracion-gdg-pereira", "Inauguración GDG Pereira"),
      pertt("conoce-a-la-cloud-native-computing-foundation", "Conoce a la Cloud Native Computing Foundation"),
      pertt("noche-de-ai-generativa-2025", "Noche de AI Generativa"),
      pertt("continuous-testing-paralelizacion-y-observabilidad", "Continuous Testing"),
      pertt("aprendiendo-con-vibe-coding", "Aprendiendo con Vibe Coding"),
      pertt("noche-de-rust-2025", "Noche de Rust 2025"),
      pertt("noche-de-python-2025", "Noche de Python 2025"),
      pertt("conociendo-la-nube", "Conociendo la nube"),
      pertt("conversatorio-hackathon", "Conversatorio: ¿Qué es una Hackathon?"),
      pertt("lightning-talks-2025-11", "Lightning Talks — Noviembre 2025"),
      pertt("el-futuro-de-la-ia", "El Futuro de la IA"),
      pertt("de-vuetify-a-edge-computing", "Desde Vuetify hasta el Edge Computing"),
      pertt("mujeres-en-tecnologia-2026", "Mujeres en Tecnología 2026"),
      pertt("openclaw-moltys-utp", "OpenClaw Moltys en la UTP"),
      pertt("abril-mobile-2026", "Abril Mobile"),
      pertt("ia-como-motor-de-crecimiento", "IA como motor de crecimiento"),
      pertt("qa-pilar-del-software", "QA: Pilar del software"),
      pertt("september-meetup-2026", "Meetup de charlas relámpago"),
      pertt("office-hours-directing-agents", "Office Hours: El arte de dirigir agentes"),
      pertt("open-cowork-i", "Open Cowork I"),
      pertt("october-meetup-2026", "Meetup de octubre 2026"),
    ],
  },
  {
    name: "Software Freedom Day Pereira",
    kind: "organizer",
    role: "Organizador",
    period: "2023 - Actualidad",
    link: "https://backboneutp.com/",
    events: ["software-freedom-day-2023", "software-freedom-day-2024", "software-freedom-day-2025"],
  },
  { name: "GDG Pereira", kind: "collaborator", link: "https://gdg.community.dev/gdg-pereira/" },
  { name: "AWS User Group Pereira", kind: "collaborator", link: "https://www.meetup.com/aws-user-group-pereira/" },
  { name: "FLISoL", kind: "collaborator", link: "https://flisolpereira.vercel.app/" },
  { name: "QA Conf", kind: "collaborator", link: "https://qaconf.co/" },
];
