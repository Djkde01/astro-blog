#!/usr/bin/env node

const userAgent = process.env.npm_config_user_agent ?? "";
const execPath = process.env.npm_execpath ?? "";

function detectPackageManager() {
  if (userAgent.startsWith("pnpm/")) return "pnpm";
  if (userAgent.startsWith("yarn/")) return "yarn";
  if (userAgent.startsWith("npm/")) return "npm";
  if (userAgent.startsWith("bun/")) return "bun";

  if (execPath.includes("pnpm")) return "pnpm";
  if (execPath.includes("yarn")) return "yarn";
  if (execPath.includes("npm")) return "npm";
  if (execPath.includes("bun")) return "bun";

  return "unknown";
}

const manager = detectPackageManager();

if (manager !== "pnpm") {
  const label = manager === "unknown" ? "an unsupported package manager" : manager;

  console.error(
    [
      "",
      `This project requires pnpm. Detected ${label}.`,
      "",
      "Use:",
      "  corepack enable",
      "  pnpm install",
      "  pnpm run build",
      "",
    ].join("\n"),
  );

  process.exit(1);
}
