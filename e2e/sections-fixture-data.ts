import type { Client, CommunityEntry, Talk, Testimonial } from "../src/types/sections";

// Data for e2e/pages/sections-fixture.astro. The real data keeps Clientes and Testimonios hidden,
// so their rendering, empty arrays and card images are proved here instead.
export const fixtureTalks: Talk[] = [
  {
    title: "Charla de prueba con imagen",
    event: "Evento de prueba",
    date: "2024-05-04",
    place: "Pereira",
    language: "Español",
    image: "/src/assets/images/backbone.webp",
    slides: "https://example.com/slides",
  },
];

export const fixtureCommunity: CommunityEntry[] = [
  {
    name: "Comunidad de prueba",
    kind: "organizer",
    role: "Organizador",
    period: "2024 - Actualidad",
    link: "https://example.com/comunidad",
    events: ["software-freedom-day-2024", { title: "Meetup externo de prueba", url: "https://example.com/meetup" }],
  },
  { name: "Comunidad aliada", kind: "collaborator", link: "https://example.com/aliada" },
];

export const fixtureClients: Client[] = [
  { kind: "employer", title: "Cliente de prueba · vía Empresa Uno", role: "Desarrollador", outcome: "Resultado de prueba uno" },
  { kind: "employer", title: "Otro cliente · vía Empresa Dos", role: "Arquitecto", outcome: "Resultado de prueba dos" },
  { kind: "freelance", title: "Cliente independiente", role: "Consultor", outcome: "Resultado de prueba tres" },
];

export const fixtureTestimonials: Testimonial[] = [
  { name: "Ana Prueba", role: "Líder técnica", company: "Empresa Uno", quote: "Una cita de prueba sobre el trabajo en equipo." },
  { name: "Luis Ejemplo", role: "Gerente", company: "Empresa Dos", quote: "Otra cita de prueba sobre los resultados." },
  { name: "Sin Empresa", role: "Mentora", quote: "Una cita de prueba sin empresa." },
];
