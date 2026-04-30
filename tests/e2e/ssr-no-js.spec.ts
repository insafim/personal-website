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
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
  await expect(page.getByRole("heading", { name: /Career/i })).toBeVisible();
  await expect(page.locator("ol li").first()).toBeVisible();
});

test("publications index lists items without JS", async ({ page }) => {
  await page.goto("/publications");
  await expect(page.locator("h1")).toContainText("Publications");
});

test("Person JSON-LD parses on home (SSR)", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const parsed = JSON.parse(json as string);
  expect(parsed["@type"]).toBe("Person");
});

test("contact SSR HTML hides email from regex scrapers (NFR-009 / ADR-015)", async ({ page }) => {
  // EmailContact renders an "at"/"dot" obfuscated fallback during SSR. With
  // JS disabled the fallback never hydrates into a mailto anchor, so the raw
  // HTML response must contain no literal email-shaped string. This is the
  // single most important invariant of the obfuscation pipeline.
  await page.goto("/contact");
  const html = await page.content();
  expect(html).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  expect(html).toContain("i.m.insaf at gmail dot com");
});
