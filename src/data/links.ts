import type { LinkHub } from "../types/sections";

// Every string on /enlaces. Edit the copy here; src/pages/enlaces.astro only reads it.
// next-event keeps its id across events: change its href and description by hand.
export const linkHub: LinkHub = {
  title: "Enlaces - Sergio Estrella (Djkde)",
  description: "Los enlaces de Sergio Estrella: blog, próximo evento, LinkedIn, GitHub, Backbone UTP y Platzi.",
  newTabNote: "(se abre en una pestaña nueva)",
  links: [
    {
      id: "blog",
      icon: "mdi:newspaper-variant-outline",
      label: "Blog",
      href: "/blog/",
      description: "Charlas, desarrollo y comunidad.",
      highlighted: true,
    },
    {
      id: "next-event",
      icon: "mdi:calendar-blank-outline",
      label: "Próximo evento",
      href: "https://www.meetup.com/aws-user-group-pereira/events/317390154/",
      description: "AWS User Group Pereira",
      highlighted: true,
    },
    { id: "linkedin", icon: "mdi:linkedin", label: "LinkedIn", href: "https://linkedin.com/in/djkde", highlighted: false },
    { id: "github", icon: "mdi:github", label: "GitHub", href: "https://github.com/Djkde01", highlighted: false },
    { id: "backbone", icon: "mdi:account-group-outline", label: "Backbone UTP", href: "https://backboneutp.com", highlighted: false },
    { id: "platzi", icon: "mdi:school-outline", label: "Platzi", href: "https://platzi.com/profes/sergioestrella", highlighted: false },
  ],
};
