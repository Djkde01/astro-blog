import { test as base } from "@playwright/test";

// Specs import `test` from here so that test runs never reach the production analytics property.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
    await use(context);
  },
});

export { expect } from "@playwright/test";
