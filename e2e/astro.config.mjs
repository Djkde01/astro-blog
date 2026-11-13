import config from "../astro.config.mjs";

// The end-to-end build adds fixture pages that must never ship. `pnpm run build` uses the
// root config and never sees them; Playwright builds and previews with this one. The build goes to
// its own folder, so dist/ never holds a fixture after a test run.
export default {
  ...config,
  outDir: "tmp/e2e-dist",
  integrations: [
    ...config.integrations,
    {
      name: "e2e-fixtures",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          injectRoute({ pattern: "/e2e/jsonld-fixture", entrypoint: "./e2e/pages/jsonld-fixture.astro" });
          injectRoute({ pattern: "/e2e/sections-fixture", entrypoint: "./e2e/pages/sections-fixture.astro" });
        },
      },
    },
  ],
};
