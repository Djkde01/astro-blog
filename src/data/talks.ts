import type { Talk } from "../types/sections";

// Sergio's own talks; Charlas on About and the landing's talk count read this file. Events he
// organized are not talks: they are chips under their community in community.ts.
// `draft: true` marks a placeholder still to fill in: it shows under `pnpm run dev` only.
export const talks: Talk[] = [
  {
    title: "Herramientas de IA para desarrollo web",
    event: "GDG DevFest Pereira",
    date: "2025-11-29",
    place: "Pereira",
    language: "Español",
    recording: "https://www.youtube.com/watch?v=CfCk6gt0tc4&t=1320s",
    post: "gdg-devfest-pereira",
  },
  {
    title: "Charla en AWS Community Day",
    event: "AWS User Group Pereira",
    date: "2026-12-31",
    place: "Pereira",
    language: "Español",
    draft: true,
  },
  {
    title: "Charla en QA Conf",
    event: "QA Conf",
    date: "2026-06-01",
    place: "Por confirmar",
    language: "Español",
    draft: true,
  },
  {
    title: "Charla en FLISoL",
    event: "FLISoL",
    date: "2025-04-26",
    place: "Por confirmar",
    language: "Español",
    draft: true,
  },
  {
    title: "Charla en FLISoL",
    event: "FLISoL",
    date: "2024-04-27",
    place: "Por confirmar",
    language: "Español",
    draft: true,
  },
  {
    title: "Charla de 2022",
    event: "Por confirmar",
    date: "2022-01-01",
    place: "Por confirmar",
    language: "Español",
    draft: true,
  },
];
