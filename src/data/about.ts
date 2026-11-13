import type { AboutPage } from "../types/sections";

// Every string on the About page. Edit the copy here; src/pages/about.astro only reads it.
// The service cards live in services.ts, the jobs in experience.ts and the projects in projects.ts.
export const about: AboutPage = {
  title: "Acerca - Sergio Estrella (Djkde)",
  intro: {
    photoAlt: "Sergio Estrella",
    greeting: "Hola!",
    greetingEmoji: "👋",
    paragraphs: [
      [
        { text: "¡Qué bueno verte! Soy Sergio Estrella, también conocido en internet como Djkde, un " },
        { text: "Desarrollador Fullstack y organizador de comunidad", highlight: true },
        { text: " con " },
        { text: "+{years} años de experiencia", highlight: true },
        { text: "." },
      ],
      [
        {
          text: "Mi misión es mejorar la vida de las personas a través de la tecnología y en mi tiempo libre comparto mi conocimiento en lugares como este blog.",
        },
      ],
    ],
  },
  findMe: {
    title: "Encuéntrame",
    icon: "mdi:at",
    // The last card is the widest at desktop width, so keep the longest handle last.
    links: [
      { network: "LinkedIn", handle: "/in/djkde", href: "https://linkedin.com/in/djkde", icon: "mdi:linkedin" },
      { network: "X", handle: "@djkde", href: "https://twitter.com/djkde", icon: "mdi:alpha-x-box" },
      { network: "GitHub", handle: "Djkde01", href: "https://github.com/Djkde01", icon: "mdi:github" },
      { network: "Email", handle: "djkde.co@gmail.com", href: "mailto:djkde.co@gmail.com", icon: "mdi:email-outline" },
    ],
  },
  services: { title: "Servicios", icon: "mdi:handshake-outline" },
  experience: { title: "Mi Experiencia", icon: "mdi:briefcase" },
  projects: { title: "Mis proyectos", icon: "mdi:code-tags" },
};
