import { expect, test } from "@playwright/test";

test("home renders hero with name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
});

test("about renders career timeline", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("About");
  await expect(page.locator("ol li").first()).toBeVisible();
});

test("projects index lists categories", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("h1")).toContainText("Projects");
});

test("publications index has Scholar link", async ({ page }) => {
  await page.goto("/publications");
  await expect(page.getByRole("link", { name: /Google Scholar/i })).toBeVisible();
});

test("resources page renders kind sections", async ({ page }) => {
  await page.goto("/resources");
  await expect(page.locator("h1")).toContainText("Resources");
});

test("hobbies page renders anecdotes", async ({ page }) => {
  await page.goto("/hobbies");
  await expect(page.locator("h1")).toContainText("Hobbies");
});

test("contact page renders reveal-email button", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: /Reveal contact email/i })).toBeVisible();
});

test("404 renders branded fallback", async ({ page }) => {
  const res = await page.goto("/this-page-definitely-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Page not found");
});

test("robots.txt contains PERMISSIVE allowlist", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
  const body = await res?.text();
  expect(body).toMatch(/GPTBot/);
  expect(body).toMatch(/ClaudeBot/);
  expect(body).toMatch(/PerplexityBot/);
});

test("sitemap.xml is valid xml", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
  const body = await res?.text();
  expect(body).toMatch(/<urlset/);
});

test("llms.txt is markdown", async ({ page }) => {
  const res = await page.goto("/llms.txt");
  expect(res?.status()).toBe(200);
  expect(res?.headers()["content-type"]).toMatch(/text\/plain/);
  const body = await res?.text();
  expect(body).toMatch(/^# /);
});

test("theme toggle flips .dark class", async ({ page }) => {
  await page.goto("/");
  const initial = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: /Switch to/i }).click();
  await page.waitForTimeout(100);
  const after = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(after).toBe(!initial);
});
