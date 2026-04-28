import { expect, test } from "@playwright/test";

// Pages crawled by the no-horizontal-scroll assertion. Hand-curated rather
// than derived from the sitemap so a future route addition forces the author
// to think about its mobile layout.
const PAGES = [
  "/",
  "/about",
  "/projects",
  "/publications",
  "/resources",
  "/hobbies",
  "/contact",
] as const;

for (const path of PAGES) {
  test(`mobile: ${path} has no horizontal overflow`, async ({ page }) => {
    // Assert the route resolves to 200 first; otherwise an accidental 404
    // would still produce a "no overflow" pass against the 404 page layout
    // and silently mask a missing route.
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    // documentElement.scrollWidth > clientWidth means a child element is
    // wider than the viewport and the page can be panned sideways. The +1
    // tolerance absorbs sub-pixel rounding without masking real overflow.
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("mobile nav: hamburger button is visible, desktop menu UL is hidden", async ({ page }) => {
  await page.goto("/");
  // The hamburger toggle is the only nav button outside the theme toggle.
  const hamburger = page.getByRole("button", { name: /Open menu/i });
  await expect(hamburger).toBeVisible();
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");

  // Desktop menu container is a div with classes `hidden md:flex` so it is
  // display:none below the md breakpoint and switches to flex above it. The
  // assertion checks computed visibility, not just class presence, so a class
  // rename or a Tailwind config regression both fail here. NOTE: if the
  // visibility strategy ever changes (e.g. to sr-only or a CSS module), this
  // selector must be updated; otherwise the assertion silently goes vacuous
  // because the locator stops resolving to anything.
  const desktopMenu = page.locator("nav .hidden.md\\:flex");
  await expect(desktopMenu).toBeHidden();
});

test("mobile nav: hamburger opens dropdown panel and link tap closes it", async ({ page }) => {
  await page.goto("/");
  const hamburger = page.getByRole("button", { name: /Open menu/i });
  await hamburger.click();

  // Panel exists with id="mobile-menu" once open.
  const panel = page.locator("#mobile-menu");
  await expect(panel).toBeVisible();
  await expect(page.getByRole("button", { name: /Close menu/i })).toHaveAttribute(
    "aria-expanded",
    "true"
  );

  // Tapping a link navigates AND closes the panel (the route-change effect in
  // Nav.tsx flips `open` back to false).
  await panel.getByRole("link", { name: /About/i }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});

test("mobile nav: Escape closes the dropdown", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open menu/i }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});

test("mobile nav: dropdown shows all primary nav items", async ({ page }) => {
  // Site ships 6 primary items per content/site-config.yaml (About, Projects,
  // Publications, Resources, Beyond, Contact). Asserting the exact count makes
  // a one-item regression fail loudly. Removing or adding a primary item is an
  // intentional content change that should require updating this number.
  await page.goto("/");
  await page.getByRole("button", { name: /Open menu/i }).click();
  const items = page.locator("#mobile-menu a");
  await expect(items).toHaveCount(6);
});

test("mobile nav: opening menu locks body scroll, closing restores it", async ({ page }) => {
  // Nav.tsx sets document.body.style.overflow = "hidden" while the panel is
  // open and restores the original value on close. Without this, swiping the
  // open menu would scroll the page underneath. The cleanup branch is exercised
  // by closing the menu (Escape here) and reading the inline style back.
  await page.goto("/");
  const before = await page.evaluate(() => document.body.style.overflow);
  await page.getByRole("button", { name: /Open menu/i }).click();
  const whileOpen = await page.evaluate(() => document.body.style.overflow);
  expect(whileOpen).toBe("hidden");
  await page.keyboard.press("Escape");
  // Wait for the cleanup effect to flush before reading the restored value.
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  const afterClose = await page.evaluate(() => document.body.style.overflow);
  expect(afterClose).toBe(before);
});
