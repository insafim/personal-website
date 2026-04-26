import { expect, test } from "@playwright/test";

const PAGES = ["/", "/projects", "/publications"];

for (const path of PAGES) {
  test(`OG + Twitter meta tags present on ${path}`, async ({ page }) => {
    await page.goto(path);
    const og = page.locator('meta[property="og:image"]').first();
    await expect(og).toHaveCount(1);
    const ogContent = await og.getAttribute("content");
    expect(ogContent).toBeTruthy();

    const tw = page.locator('meta[name="twitter:card"]').first();
    await expect(tw).toHaveAttribute("content", "summary_large_image");

    const ogTitle = page.locator('meta[property="og:title"]').first();
    await expect(ogTitle).toHaveCount(1);
  });
}
