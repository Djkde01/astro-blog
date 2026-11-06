import type { Project } from "../types/sections";

export const projects: Project[] = [
  {
    title: "Backbone Events",
    description:
      "Plataforma de gestión y difusión eventos y workshops de la comunidad Backbone UTP. Creado con NextJS, Tailwind CSS, MongoDB y Vercel Cloud Functions.",
    link: "https://backboneutp.com/events",
    image: "/src/assets/images/backbone.webp",
    status: "development",
    github: "https://github.com/Djkde01/backbone-events",
  },
  {
    title: "Selaski Footprint Calculator",
    description:
      "Calculadora de huella de carbono para Selaski, que permite a los usuarios calcular sus emisiones. Creado con Angular, NestJS, MySQL y Tailwind CSS.",
    link: "https://welcome.selaski.com/plataforma-comex/",
    image: "/src/assets/images/selaski-footprint.webp",
    status: "deployed",
  },
  {
    title: "Sirius - Platzi Hackaton 2024",
    description:
      "Proyecto ganador del Platzi Hackaton 2024, retos prácticos con repetición espaciada, generados con AI. Creado con React, Vite, Tailwind CSS, y Django.",
    link: "https://aprendeconsirius.com",
    github: "https://github.com/SiriusTeam7",
    image: "/src/assets/images/sirius.webp",
    status: "deployed",
  },
  {
    title: "STS - Selaski Tracking System",
    description:
      "Sistema de tracking de envíos marítimos y aéreos, junto a mapas interactivos y notificaciones en tiempo real. Creado con Angular, NestJS y Tailwind CSS.",
    link: "https://welcome.selaski.com/tracking/",
    image: "/src/assets/images/selaski.webp",
    status: "deployed",
  },
  {
    title: "Semillero y Comunidad Backbone UTP",
    description:
      "Comunidad de la Universidad Tecnológica de Pereira, con información acerca de eventos, talleres y charlas. Página web creada con Angular y Cloudfare.",
    github: "https://github.com/Backbone-UTP/main-page",
    link: "https://backboneutp.com",
    image: "/src/assets/images/backbone.webp",
    status: "deployed",
  },
];
