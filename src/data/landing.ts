import type { Landing } from "../types/sections";

// Every string on the landing page. Edit the copy here; src/pages/index.astro only reads it.
export const landing: Landing = {
  title: "Home - Sergio Estrella (Djkde)",
  hero: {
    photoAlt: "Sergio Estrella",
    name: "Sergio Estrella (Djkde)",
    role: "Desarrollador Fullstack y organizador de comunidad",
    value: "Mejorando la vida de las personas a través de la tecnología.",
    buttons: [
      {
        text: "Conoceme más",
        href: "/about",
        variant: "solid",
        icon: { name: "mdi:arrow-right", side: "right" },
      },
      {
        text: "Contáctame",
        href: "mailto:djkde.co@gmail.com",
        variant: "outline",
        icon: { name: "mdi:email-outline", side: "left" },
      },
      {
        text: "GitHub",
        href: "https://github.com/Djkde01",
        variant: "outline",
        icon: { name: "mdi:github", side: "left" },
      },
    ],
  },
  // selectNow() in src/js/utils.js picks the text: `working` while a job in experience.ts
  // runs to "Actualidad", otherwise `open` with its link.
  now: {
    label: "Ahora",
    working: "{job} y mentor en la comunidad Backbone UTP",
    open: "Mentor en la comunidad Backbone UTP y abierto a colaboraciones.",
    link: { text: "Hablemos", href: "mailto:djkde.co@gmail.com" },
  },
  metrics: {
    label: "Métricas",
    talksCategory: "Charlas",
    talks: "charlas",
    years: "años de experiencia",
    posts: "posts",
  },
  latestPosts: { title: "Últimos posts", count: 3 },
};
