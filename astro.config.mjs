import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://djkde.com",
  integrations: [mdx(), sitemap(), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), icon()],
});