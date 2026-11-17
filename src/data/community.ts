import type { CommunityEntry } from "../types/sections";

// Pereira Tech Talks meetups held in 2025 and 2026, from https://pereiratechtalks.org/meetups/.
const pertt = (slug: string, title: string) => ({ title, url: `https://pereiratechtalks.org/meetups/${slug}/` });

// Comunidad on /comunidad. Organizers render as cards with their `logo`, their `events` as chips,
// newest first: a post slug links to the post, an external event links out. Collaborators render
// as links with their `icon`.
// `draft: true` marks an entry still to confirm, shown under `pnpm run dev` only.
export const community: CommunityEntry[] = [
  {
    name: "Backbone UTP",
    kind: "organizer",
    role: "Fundador y mentor",
    period: "Agosto 2022 - Actualidad",
    link: "https://backboneutp.com",
    logo: "/src/assets/images/backbone-logo.svg",
    events: ["gdg-devfest-pereira", "mujeres-tecnologia-2025", "la-ia-no-te-quitara-el-trabajo-pero-yo-si"],
  },
  {
    name: "Pereira Tech Talks (PerTT)",
    kind: "organizer",
    role: "Organizador",
    period: "2025 - Actualidad",
    link: "https://pereiratechtalks.org/",
    logo: "/src/assets/images/pertt-logo.webp",
    events: [
      pertt("october-meetup-2026", "Meetup de octubre 2026"),
      pertt("open-cowork-i", "Open Cowork I"),
      pertt("office-hours-directing-agents", "Office Hours: El arte de dirigir agentes"),
      pertt("september-meetup-2026", "Meetup de charlas relámpago"),
      pertt("qa-pilar-del-software", "QA: Pilar del software"),
      pertt("ia-como-motor-de-crecimiento", "IA como motor de crecimiento"),
      pertt("abril-mobile-2026", "Abril Mobile"),
      pertt("openclaw-moltys-utp", "OpenClaw Moltys en la UTP"),
      pertt("mujeres-en-tecnologia-2026", "Mujeres en Tecnología 2026"),
      pertt("de-vuetify-a-edge-computing", "Desde Vuetify hasta el Edge Computing"),
      pertt("el-futuro-de-la-ia", "El Futuro de la IA"),
      pertt("lightning-talks-2025-11", "Lightning Talks — Noviembre 2025"),
      pertt("conversatorio-hackathon", "Conversatorio: ¿Qué es una Hackathon?"),
      pertt("conociendo-la-nube", "Conociendo la nube"),
      pertt("noche-de-python-2025", "Noche de Python 2025"),
      pertt("noche-de-rust-2025", "Noche de Rust 2025"),
      pertt("aprendiendo-con-vibe-coding", "Aprendiendo con Vibe Coding"),
      pertt("continuous-testing-paralelizacion-y-observabilidad", "Continuous Testing"),
      pertt("noche-de-ai-generativa-2025", "Noche de AI Generativa"),
      pertt("conoce-a-la-cloud-native-computing-foundation", "Conoce a la Cloud Native Computing Foundation"),
      pertt("inauguracion-gdg-pereira", "Inauguración GDG Pereira"),
    ],
  },
  {
    name: "Software Freedom Day Pereira",
    kind: "organizer",
    role: "Organizador",
    period: "2023 - Actualidad",
    link: "https://backboneutp.com/",
    logo: "/src/assets/images/sfd-logo.svg",
    events: ["software-freedom-day-2025", "software-freedom-day-2024", "software-freedom-day-2023"],
  },
  { name: "GDG Pereira", kind: "collaborator", link: "https://gdg.community.dev/gdg-pereira/", icon: "mdi:google" },
  { name: "AWS User Group Pereira", kind: "collaborator", link: "https://www.meetup.com/aws-user-group-pereira/", icon: "mdi:aws" },
  { name: "FLISoL", kind: "collaborator", link: "https://flisolpereira.vercel.app/", icon: "mdi:penguin" },
  { name: "QA Conf", kind: "collaborator", link: "https://qaconf.co/", icon: "mdi:test-tube" },
];
