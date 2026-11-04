import { defineConfig } from "@playwright/test";

// Exercised only by scripts/test-e2e-gate.sh, to prove the evidence gate can fail.
export default defineConfig({
  testDir: ".",
  testMatch: process.env.E2E_GATE_FIXTURE_MATCH ?? "passing.spec.ts",
  outputDir: process.env.DWP_EVIDENCE_DIR ?? "test-results",
  use: { video: process.env.E2E_GATE_FIXTURE_VIDEO === "off" ? "off" : "on" },
});
