import { expect, test } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("home renders core content without JS", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("about renders bio + timeline without JS", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("About");
  await expect(page.locator("ol li").first()).toBeVisible();
});

test("publications index lists items without JS", async ({ page }) => {
  await page.goto("/publications");
  await expect(page.locator("h1")).toContainText("Publications");
});

test("Person JSON-LD parses on home (SSR)", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const parsed = JSON.parse(json!);
  expect(parsed["@type"]).toBe("Person");
});
