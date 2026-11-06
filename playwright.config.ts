import { defineConfig } from "@playwright/test";

const port = 4322;
// Adds fixture pages that never ship; see e2e/astro.config.mjs.
const e2eConfig = "e2e/astro.config.mjs";

export default defineConfig({
  testDir: "e2e",
  outputDir: process.env.DWP_EVIDENCE_DIR ?? "test-results",
  use: {
    baseURL: `http://localhost:${port}`,
    // Partytown's service worker would hide analytics requests from context.route.
    serviceWorkers: "block",
    video: "on",
    trace: "on",
    screenshot: "on",
  },
  webServer: {
    // Test the built site, not the dev server. Astro starts the preview in the
    // background under an AI agent, which would outlive this run; --ignore-lock
    // keeps it in the foreground so Playwright owns it.
    command: `pnpm run build --config ${e2eConfig} && pnpm exec astro preview --config ${e2eConfig} --ignore-lock --port ${port}`,
    port,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
