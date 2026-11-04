import { defineConfig } from "@playwright/test";

const port = 4322;

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
    // Test the built site, not the dev server.
    command: `pnpm run build && pnpm exec astro preview --port ${port}`,
    port,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
