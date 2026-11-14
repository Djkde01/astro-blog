import type { Client } from "../types/sections";

// Clientes on About. "employer" entries name the employer, never its client, so they do not
// claim the employer's work. Every entry is a draft until the owner confirms it; no client
// name from the CV is published without the owner's word.
export const clients: Client[] = [
  {
    kind: "employer",
    title: "3 clientes fintech en EE. UU. · vía Fuse",
    role: "Forward Deployed Engineer",
    outcome: "Agentes de crédito en producción con protección de PII",
    draft: true,
  },
  {
    kind: "employer",
    title: "Plataforma de streaming con +25 M de usuarios · vía Globant",
    role: "Web UI Developer",
    outcome: "Tiempo de respuesta de la API de 120 ms a 60 ms",
    draft: true,
  },
  { kind: "freelance", title: "Cliente freelance", role: "Rol", outcome: "Resultado en una línea", draft: true },
  { kind: "freelance", title: "Cliente freelance", role: "Rol", outcome: "Resultado en una línea", draft: true },
];
