import type { Talk } from "../types/sections";

// Sergio's own talks; Charlas on About and the landing's talk count read this file. Events he
// organized are not talks: they are chips under their community in community.ts.
// `draft: true` marks a placeholder still to fill in: it shows under `pnpm run dev` only.
export const talks: Talk[] = [
  {
    title: "De documento a video: explicaciones narradas con IA en AWS por menos de un dólar",
    event: "AWS User Group Pereira Meetup",
    date: "2026-11-23",
    place: "Universidad Tecnológica de Pereira",
    language: "Español",
    registration: "https://www.meetup.com/aws-user-group-pereira/events/317390154/",
    image: "/src/assets/images/talk-aws-user-group-2026.webp",
  },
  {
    title: "Spec Driven Development: Calidad asegurada desde el requerimiento",
    event: "QA Conf",
    date: "2026-09-05",
    place: "Virtual",
    language: "Español",
    slides: "https://qaconf-2026-deck.vercel.app/",
    recording: "https://www.youtube.com/live/1nvA6A0hp18?t=3980",
    image: "/src/assets/images/talk-qa-conf-2026.webp",
  },
  {
    title: "El Open Source en tiempos de IA",
    event: "FLISoL 2026",
    date: "2026-05-07",
    place: "Universidad Tecnológica de Pereira, Auditorio Jorge Roa",
    language: "Español",
    slides: "https://v0-flisol-pereira-2026-presentation.vercel.app/",
    image: "/src/assets/images/talk-flisol-2026.webp",
  },
  {
    title: "Herramientas IA para desarrollo web",
    event: "Google DevFest Pereira 2025",
    date: "2025-11-29",
    place: "Expofuturo",
    language: "Español",
    slides: "https://docs.google.com/presentation/d/1JadKF9UIsAX58Cj_jRIvCoyLuGzRZ38zvm1XkXZ6CYU/edit?usp=sharing",
    recording: "https://www.youtube.com/live/CfCk6gt0tc4?t=1321",
    post: "gdg-devfest-pereira",
  },
  {
    title: "Conversatorio PerTT: ¿Qué es una Hackathon?",
    event: "Pereira Tech Talks",
    date: "2025-10-29",
    place: "Universidad Tecnológica de Pereira, Sala Magistral 1",
    language: "Español",
    image: "/src/assets/images/talk-conversatorio-hackathon.webp",
  },
  {
    title: "De usuarios a creadores: Open Source para transformar la industria y Latinoamérica",
    event: "FLISoL 2024",
    date: "2024-05-16",
    place: "Universidad Tecnológica de Pereira, Sala Magistral 2",
    language: "Español",
    slides: "https://docs.google.com/presentation/d/1uQeXz6-pmDVVNeNjOzrlncICngXUdI6jE5DufpIcfuU/edit?usp=sharing",
    image: "/src/assets/images/talk-flisol-2024.webp",
  },
  {
    title: "Introducción a Load Testing y Observability con K6 y New Relic",
    event: "Noche de liderazgo y testing",
    date: "2022-05-12",
    place: "Online",
    language: "Español",
    slides: "https://docs.google.com/presentation/d/1t1AgoFci7TBu6ArlvMxp0O03NvAJ51IXR6_ZENQkZ9w/edit?usp=sharing",
    recording: "https://www.youtube.com/live/4EG5BGvYP9g",
    image: "/src/assets/images/talk-pertt-2022.webp",
  },
];
