import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".agents/",
      ".astro/",
      ".atl/",
      ".claude/",
      ".codegraph/",
      ".codex/",
      ".cursor/",
      ".dwp/",
      "dist/",
      "playwright-report/",
      "test-results/",
      "tmp/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-recommended"],
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    // CommonJS config files can only load plugins with require().
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // The Google Analytics snippet must call dataLayer.push(arguments): gtag.js
    // reads the Arguments object, and rest parameters would pass a plain array.
    // This cannot be an inline comment, because that script ships in the HTML.
    files: ["src/layouts/MainHead.astro/*"],
    rules: { "prefer-rest-params": "off" },
  },
];
