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
        forward: ["dataLayer.push"],
      },
    }),
    icon(),
  ],
});
