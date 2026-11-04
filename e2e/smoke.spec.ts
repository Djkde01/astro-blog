import { expect, test } from "./fixtures";

test("AC-site-smoke: a reader goes from the home page to a post and the blog index", async ({ page, request }) => {
  let title: string;

  await test.step("open the home page and see the latest posts", async () => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Últimos posts" })).toBeVisible();
    const cards = page.locator("article.card");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeLessThanOrEqual(3);
  });

  await test.step("open the first post", async () => {
    const link = page.locator("article.card h3 a").first();
    title = (await link.textContent())!.trim();
    await link.click();
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  });

  await test.step("go to the blog index from the navigation", async () => {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Blog" }).click();
    await expect(page.getByRole("heading", { name: "Todos los posts" })).toBeVisible();
    await expect(page.locator("article.card").first()).toBeVisible();
  });

  await test.step("the RSS feed lists the same post", async () => {
    const feed = await request.get("/rss.xml");
    expect(feed.ok()).toBe(true);
    const titles = await page.evaluate(
      (xml) =>
        Array.from(new DOMParser().parseFromString(xml, "text/xml").querySelectorAll("item > title")).map(
          (item) => item.textContent,
        ),
      await feed.text(),
    );
    expect(titles).toContain(title);
  });
});
