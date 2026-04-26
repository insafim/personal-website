import { expect, test } from "@playwright/test";

test("home contains valid Person JSON-LD", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(json).toBeTruthy();
  const parsed = JSON.parse(json!);
  expect(parsed["@context"]).toBe("https://schema.org");
  expect(parsed["@type"]).toBe("Person");
  expect(parsed.name).toBeTruthy();
  expect(parsed.jobTitle).toBeTruthy();
  expect(Array.isArray(parsed.sameAs)).toBe(true);
  expect(parsed.sameAs.length).toBeGreaterThanOrEqual(3);
});

test("about contains valid Person JSON-LD", async ({ page }) => {
  await page.goto("/about");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(json).toBeTruthy();
  const parsed = JSON.parse(json!);
  expect(parsed["@type"]).toBe("Person");
});

test("OG image route returns identical bytes regardless of query string (SEC-005)", async ({
  request,
}) => {
  const a = await request.get("/og/default");
  const b = await request.get("/og/default?attacker=1");
  expect(a.status()).toBe(200);
  expect(b.status()).toBe(200);
  const aBytes = await a.body();
  const bBytes = await b.body();
  expect(aBytes.equals(bBytes)).toBe(true);
});
