import type { Service } from "../types/sections";

// The cards under "Servicios" on About, in display order.
export const services: Service[] = [
  {
    icon: "mdi:robot-outline",
    title: "Agentes de IA en producción",
    description:
      "Diseño e integro agentes de IA y flujos con MCP conectados a tus datos, con protección de PII y registro de eventos.",
  },
  {
    icon: "mdi:layers-outline",
    title: "Desarrollo Fullstack",
    description:
      "Aplicaciones web y APIs de punta a punta, con Angular o React en el frontend y NestJS o Spring Boot en el backend.",
  },
  {
    icon: "mdi:rocket-launch-outline",
    title: "Calidad y entrega continua",
    description:
      "Pruebas automatizadas, CI/CD y pruebas de rendimiento para entregar más rápido y con menos errores.",
  },
  {
    icon: "mdi:human-male-board",
    title: "Mentoría y charlas",
    description: "Capacitaciones para equipos y charlas para comunidades sobre desarrollo, pruebas e IA.",
  },
];
