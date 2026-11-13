import { expect, test } from "./fixtures";
import { getExperienceInYears } from "../src/js/utils.js";

test("AC-default-description-years: a page without its own description states the computed years", async ({ page }) => {
  await page.goto("/");
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toContain(`más de ${getExperienceInYears()} años`);
  expect(description).not.toContain("{years}");
});

test("AC-logo-name: the nav logo link has an accessible name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav a.logomark")).toHaveAccessibleName("Inicio");
});

// WCAG contrast ratio between the text color and the background color of each element.
const contrastRatios = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(selector).evaluateAll((elements) => {
    const luminance = (rgb: string) => {
      const [r, g, b] = rgb.match(/[\d.]+/g)!.slice(0, 3).map((value) => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    return elements.map((element) => {
      const { color, backgroundColor } = getComputedStyle(element);
      const [light, dark] = [luminance(color), luminance(backgroundColor)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    });
  });

for (const colorScheme of ["light", "dark"] as const) {
  test(`AC-filled-secondary-contrast: filled secondary buttons reach 4.5:1 in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    for (const path of ["/about", "/blog/"]) {
      await test.step(path, async () => {
        await page.goto(path);
        const ratios = await contrastRatios(page, ".link.secondary.filled");
        expect(ratios.length).toBeGreaterThan(0);
        for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    }
  });
}
