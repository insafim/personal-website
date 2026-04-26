import { expect, test } from "@playwright/test";

test("first Tab focuses skip-to-content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const text = await page.evaluate(
    () => (document.activeElement as HTMLElement | null)?.textContent
  );
  expect(text).toMatch(/Skip to content/);
});

test("focus order traverses Nav links and ThemeToggle", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip-to-content
  await page.keyboard.press("Tab"); // logo / first nav
  const role = await page.evaluate(() => document.activeElement?.tagName);
  expect(role).toMatch(/A|BUTTON/);
});

test("BibTeX copy works via keyboard Enter", async ({ page }) => {
  await page.goto("/publications/sample-multimodal-llm-emnlp");
  const button = page.getByRole("button", { name: /Copy/i });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toContainText(/Copied/i, { timeout: 1500 });
});
