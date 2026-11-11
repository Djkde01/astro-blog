import type { Experience } from "../types/sections";

// The jobs on About, newest first. A period ending in "Actualidad" marks the current job,
// which the landing's Ahora strip names (see selectNow() in src/js/utils.js).
export const experience: Experience[] = [
  {
    title: "Forward Deployed Engineer - Fuse",
    period: "Agosto 2026 - Noviembre 2026",
    description:
      "Llevé a producción agentes de crédito para 3 clientes en Estados Unidos con React, Supabase y PostgreSQL, con protección de PII y registro de eventos.",
  },
  {
    title: "Fullstack Developer - Curoo",
    period: "Julio 2025 - Agosto 2026",
    description:
      "Parte del equipo fundador de Curoo. Lideré el frontend de 3 módulos de un copiloto de salud con IA, implementé flujos de agentes con MCP y subí la cobertura de pruebas a más del 90%.",
    link: "https://curoo.co/",
  },
  {
    title: "Fullstack Developer - Selaski",
    period: "Noviembre 2022 - Junio 2025",
    description:
      "Construí 3 microservicios y APIs REST con NestJS, MySQL, RabbitMQ y AWS, y un mapa de envíos en tiempo real. Reduje el tiempo de entrega a la mitad y los bugs semanales de 6 a 2.",
    link: "https://selaski.com",
  },
  {
    title: "Profesor - Platzi",
    period: "Febrero 2023",
    description:
      "Capacité a más de 300 desarrolladores en pruebas automatizadas y de rendimiento con K6, con una calificación de 4.5/5.",
    link: "https://platzi.com/profes/sergioestrella",
  },
  {
    title: "Web UI Developer - Globant",
    period: "Julio 2021 - Junio 2022",
    description:
      "Contribuí a servicios de búsqueda e ingesta para una plataforma de streaming con más de 25 M de usuarios, y reduje el tiempo de respuesta de la API de 120 ms a 60 ms con pruebas de carga en K6 y New Relic.",
  },
];
