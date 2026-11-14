import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://sergioestrella.com",
  // The default, "jsx", drops the space between text and an inline element.
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap(),
    partytown({
      config: {
        // Main-thread gtag() calls run the worker's gtag, which pushes a real Arguments object.
        // globalFns exposes MainHead's inline gtag on the worker's window; Partytown scopes it otherwise.
        // See docs/portfolio-roadmap.md, Phase 8.
        forward: ["dataLayer.push", "gtag"],
        globalFns: ["gtag"],
      },
    }),
    icon(),
  ],
});
