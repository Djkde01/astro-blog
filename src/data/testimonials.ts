import type { Testimonial } from "../types/sections";

// Testimonios on About; hidden while this list is empty. Each quote is a recommendation the
// person wrote publicly on Sergio's LinkedIn profile, copied word for word, newest first.
// Add a quote only with the owner's approval, and keep each quote as its author wrote it.
export const testimonials: Testimonial[] = [
  {
    name: "Paula Andrea Castro",
    role: "Technical Writer y Software Engineer",
    quote:
      "El trabajo de Sergio en BackBone siempre ha demostrado un liderazgo enorme. Tiene un conocimiento técnico impresionante, pero lo más destacado es su capacidad para compartirlo de forma clara y cercana con los chicos que están empezando en el mundo del desarrollo. Además, tiene una gran pasión por seguir aprendiendo y creando comunidad, lo que es muy valioso en cualquier equipo de trabajo.",
  },
  {
    name: "Mariana Valencia",
    role: "Dev Lead y Frontend Developer",
    quote:
      "Siempre me ha impresionado la rapidez que tiene Sergio para recordar conceptos complejos sobre temas técnicos. Desde las bases de un lenguaje hasta la arquitectura, Sergio es esa persona que no va a parar de intentar saberlo y entenderlo todo, haciéndolo una pieza clave para cualquier equipo. Siempre es un disfrute compartir profesión con alguien tan apasionado.",
  },
  {
    name: "Mariana Cortés Rueda",
    role: "Technical Writer",
    quote:
      "Sergio es un curioso de la tecnología y de cómo los sistemas pueden ser mejores: se destaca por proponer ideas, su excelente trabajo en equipo, su profesionalismo en los proyectos y su ética laboral. Es un gusto compartir con él. Su aproximación hacia la industria y su participación en los espacios de crecimiento es refrescante, que se mejoran mucho con su buena comunicación.",
  },
];
