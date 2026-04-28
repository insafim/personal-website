import { expect, test } from "@playwright/test";

test("home renders hero with name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
});

test("home renders exactly one live 'Currently' SignalCard", async ({ page }) => {
  await page.goto("/");
  // data-live marks the "now" freshness signal - must be applied to exactly one card.
  const liveCards = page.locator("[data-live]");
  await expect(liveCards).toHaveCount(1);
  await expect(liveCards.first()).toContainText(/Currently/i);
  // Pulsing dot is the user-visible deliverable; assert the decorative span exists
  // inside the eyebrow paragraph so deleting the dot fails this test.
  await expect(liveCards.first().locator("p > span[aria-hidden='true']")).toBeVisible();
});

test("about renders career timeline", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
  await expect(page.getByRole("heading", { name: /Career/i })).toBeVisible();
  // Scope to the Career section explicitly - a generic `ol li` selector would
  // silently pivot to the Education list if section order is ever swapped.
  // The greater-than-or-equal floor catches a content yaml deletion (mutation 1
  // from the test-validator's table) without coupling to the exact entry count.
  const careerEntries = page.locator("section:has(h2:text-is('Career')) ol li");
  await expect(careerEntries.first()).toBeVisible();
  expect(await careerEntries.count()).toBeGreaterThanOrEqual(2);
});

test("about renders education timeline", async ({ page }) => {
  await page.goto("/about");
  // Scope to the section H2 (level 2) — "Secondary Education" exists as a degree
  // in one of the entries' h3 elements, which would otherwise match a loose regex.
  await expect(page.getByRole("heading", { level: 2, name: "Education" })).toBeVisible();
  const educationEntries = page.locator("section:has(h2:text-is('Education')) ol li");
  await expect(educationEntries).not.toHaveCount(0);
  // h3 contains degree before institution per EducationTimeline.tsx; this catches
  // a regression that swaps the two field bindings (a content/markup bug).
  await expect(educationEntries.first().locator("h3")).toContainText(
    /MSc|BSc|Bachelor|Master|PhD|Doctor/i
  );
});

test("career timeline renders employment_type / mode chip line on at least one entry", async ({
  page,
}) => {
  // Chip line lives below the role h3 as a small text-xs paragraph and contains
  // "<employment_type> · <mode>". Mutation: removing either field from a yaml
  // collapses the line silently; this asserts at least one entry still emits it.
  await page.goto("/about");
  const chipParagraphs = page
    .locator("section:has(h2:text-is('Career')) ol li p.text-xs")
    .filter({ hasText: /Internship|Part-time|Full-time/ });
  await expect(chipParagraphs.first()).toBeVisible();
});

test("education timeline renders Grade and Activities lines for wired entries", async ({
  page,
}) => {
  // Grade and Activities are conditional. Live content has 2 entries with grade
  // (MSc + BSc) and 2 with activities (MSc + Trinity). Asserting both labels
  // catches deletion of either field from any current entry.
  await page.goto("/about");
  const eduSection = page.locator("section:has(h2:text-is('Education'))");
  await expect(eduSection.getByText(/Grade:/).first()).toBeVisible();
  await expect(eduSection.getByText(/Activities:/).first()).toBeVisible();
});

test("publications eyebrow shows 'N papers' count and no year-group H2s", async ({ page }) => {
  // Mutation: restoring year-grouped H2s on /publications. The flat-list
  // structure is the contract the user requested; this asserts both the
  // eyebrow format and the absence of year-prefix H2s.
  await page.goto("/publications");
  await expect(page.getByText(/^\d+ papers?$/).first()).toBeVisible();
  const yearHeadings = page.locator("h2").filter({ hasText: /^\d{4}$/ });
  await expect(yearHeadings).toHaveCount(0);
});

test("about timelines render logo images for wired companies and schools", async ({ page }) => {
  // Each entry whose YAML carries a `logo:` field must render an <img> on the
  // left rail of the timeline. Catches: yaml `logo:` deletion (entry silently
  // loses its logo); component swapping out next/image for a non-rendering
  // placeholder; or the wrapper span being deleted entirely.
  await page.goto("/about");

  const careerLogos = page.locator("section:has(h2:text-is('Career')) img");
  await expect(careerLogos).not.toHaveCount(0);
  const educationLogos = page.locator("section:has(h2:text-is('Education')) img");
  await expect(educationLogos).not.toHaveCount(0);
});

test("nav active item shows accent text-decoration underline (Distill pattern)", async ({
  page,
}) => {
  // Active nav item is identified by aria-current="page" - semantic, not a
  // styling hook. Computed-style assertions (line + color) catch regressions
  // that would survive a class-name-only check: removing `underline`,
  // changing it to line-through, or stripping `decoration-[var(--color-accent)]`.
  await page.goto("/about");
  const activeLink = page.locator('nav a[aria-current="page"]');
  await expect(activeLink).toHaveCount(1);
  await expect(activeLink).toContainText(/about/i);

  const computed = await activeLink.evaluate((el) => {
    // Use a probe element to resolve `var(--color-accent)` through the same
    // pipeline that produced textDecorationColor - comparing raw token strings
    // fails because computed colors strip the % from lab()/oklch() notation.
    const probe = document.createElement("span");
    probe.style.color = "var(--color-accent)";
    probe.style.display = "none";
    document.body.appendChild(probe);
    const accentColor = getComputedStyle(probe).color;
    probe.remove();
    const linkStyle = getComputedStyle(el);
    return {
      decorationLine: linkStyle.textDecorationLine,
      decorationColor: linkStyle.textDecorationColor,
      accentColor,
      textColor: linkStyle.color,
    };
  });
  expect(computed.decorationLine).toContain("underline");
  // decoration-[var(--color-accent)] must resolve to the accent token. If
  // someone replaces it with a literal color or removes the rule entirely,
  // the decoration falls back to currentColor (text color) and these two
  // assertions both fail.
  expect(computed.decorationColor).toBe(computed.accentColor);
  expect(computed.decorationColor).not.toBe(computed.textColor);
});

test("about page Current career pill dot uses motion-safe:animate-pulse", async ({ page }) => {
  // CareerTimeline marks the first entry "Current". Its dot must carry the
  // motion-safe:animate-pulse class so the badge reads as live for non-reduced-motion
  // users while staying static under prefers-reduced-motion.
  await page.goto("/about");
  // The pill is a span whose visible text is "Current"; the decorative dot is a
  // direct-child aria-hidden span. Don't use preceding-sibling - that resolves
  // to the timeline track marker for the same list item.
  const pill = page.getByText(/^Current$/i).first();
  await expect(pill).toBeVisible();
  const dot = pill.locator('span[aria-hidden="true"]').first();
  await expect(dot).toHaveClass(/motion-safe:animate-pulse/);
});

test("active project status dot pulses; non-active projects do not", async ({ page }) => {
  // Contract: the count of pulsing status dots on /projects must equal the
  // count of "active"-status pills. This catches three mutations:
  //   - pulse applied to non-active dots → pulsing > active
  //   - pulse removed from active dots → pulsing < active (when active > 0)
  //   - pulse on a non-dot decorative element → pulsing > active
  // Note: /projects does not render CareerTimeline, so the only pulses on this
  // page come from ProjectCard. Mutation 3 ("pulse removed from active dots
  // when zero active projects exist") is content-independently caught by the
  // unit test in tests/lib/project-pulse.test.ts.
  // Selector pins to the dot's exact dimensions (w-1.5 h-1.5) so a regression
  // that pulses a different round span inside a card still fails.
  await page.goto("/projects");
  const activeStatusPills = page.locator(
    'span.rounded-full[class*="status-active-soft"]'
  );
  const pulsingDots = page.locator(
    'span[aria-hidden="true"].motion-safe\\:animate-pulse.rounded-full.w-1\\.5.h-1\\.5'
  );
  const activeCount = await activeStatusPills.count();
  const pulsingCount = await pulsingDots.count();
  expect(pulsingCount).toBe(activeCount);
  for (let i = 0; i < pulsingCount; i++) {
    const dot = pulsingDots.nth(i);
    const insideCard = dot.locator("xpath=ancestor::article[contains(@class,'surface-elevated')]");
    await expect(insideCard).toHaveCount(1);
  }
});

test("nav brand image is decorative (alt empty string, parent link carries aria-label)", async ({
  page,
}) => {
  // Catches two mutations: (1) the brand <img> being silently removed, and
  // (2) a future edit setting alt="Insaf Ismath", which would create a
  // duplicate screen-reader announcement alongside the parent <a aria-label>.
  await page.goto("/");
  const navImg = page.locator('nav a[aria-label*="home"] img');
  await expect(navImg).toHaveCount(1);
  await expect(navImg).toHaveAttribute("alt", "");
});

test("nav active state generalizes to nested routes via isActive's startsWith branch", async ({
  page,
}) => {
  // Visit a /projects/[slug] page. The /projects nav item must remain active
  // because isActive() in components/Nav.tsx falls through to the
  // pathname.startsWith(`${href}/`) branch for non-root hrefs. This
  // exercises the active-state logic on a route other than /about.
  await page.goto("/projects/avatar-voice-agent");
  const activeLink = page.locator('nav a[aria-current="page"]');
  await expect(activeLink).toHaveCount(1);
  await expect(activeLink).toHaveAttribute("href", "/projects");
});

test("projects index lists categories", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("h1")).toContainText("Projects");
});

test("projects index renders at least one hero-metric block on a featured card", async ({
  page,
}) => {
  await page.goto("/projects");
  // data-hero-metric marks the Brittany-style promoted scale_metric on featured cards.
  // Use Playwright's auto-retrying expect rather than raw count() to avoid flake on slow renders.
  const heroMetrics = page.locator("[data-hero-metric]");
  await expect(heroMetrics).not.toHaveCount(0);

  // The promoted value carries data-metric-value as a stable test anchor (decoupled
  // from the .display font class, which controls family/leading but not size).
  // Assert both presence AND a computed font-size at or above text-4xl (36px) so
  // a regression that strips the size utilities is caught.
  const valueSpan = heroMetrics.first().locator("[data-metric-value]");
  await expect(valueSpan).toBeVisible();
  const fontSize = await valueSpan.evaluate(
    (el) => Number.parseFloat(getComputedStyle(el).fontSize)
  );
  expect(fontSize).toBeGreaterThanOrEqual(36);

  // Exclusivity: the hero-metric block must NOT be applied to non-featured cards.
  // At least one card on the page must lack the attribute, otherwise the
  // featured-only contract has been broken (e.g. attribute spread to all cards).
  const cardsWithoutHero = page.locator(
    "article.surface-elevated:not(:has([data-hero-metric]))"
  );
  expect(await cardsWithoutHero.count()).toBeGreaterThan(0);
});

test("publications index has Scholar link", async ({ page }) => {
  await page.goto("/publications");
  await expect(page.getByRole("link", { name: /Google Scholar/i })).toBeVisible();
});

test("publications index renders TYPE badges with peer-reviewed accent tint", async ({ page }) => {
  await page.goto("/publications");
  const chips = page.locator("[data-pub-type]");
  await expect(chips).not.toHaveCount(0);

  // Resolve --color-accent-soft via a probe element so the background-color
  // assertions stay decoupled from the literal OKLCH value defined in
  // app/globals.css. Same technique as the nav-active test.
  const accentSoft = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.background = "var(--color-accent-soft)";
    probe.style.display = "none";
    document.body.appendChild(probe);
    const v = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return v;
  });

  // Mirror of TYPE_LABEL in components/PublicationCard.tsx - kept inline so a
  // mutation that desyncs the production map (e.g. relabels "Conference" or
  // adds a new type without test coverage) is caught here.
  const TYPE_LABEL: Record<string, string> = {
    conference: "Conference",
    journal: "Journal",
    workshop: "Workshop",
    preprint: "Preprint",
    thesis: "Thesis",
    "tech-report": "Tech report",
  };
  const PEER_REVIEWED = new Set(["conference", "journal"]);

  // Per-chip contract - for every chip on the page assert that:
  //   (1) data-pub-type is one of the six known values,
  //   (2) the visible label exactly equals TYPE_LABEL[type] (catches a swap of
  //       data-pub-type vs displayed label),
  //   (3) peer-reviewed chips use the accent-soft background, AND
  //   (4) non-peer-reviewed chips do NOT use the accent-soft background
  //       (catches a regression that applies the strong palette to all types).
  const total = await chips.count();
  expect(total).toBeGreaterThanOrEqual(1);
  for (let i = 0; i < total; i++) {
    const chip = chips.nth(i);
    const type = await chip.getAttribute("data-pub-type");
    expect(type).toBeTruthy();
    const knownLabel = TYPE_LABEL[type as string];
    expect(knownLabel).toBeTruthy();
    const text = ((await chip.textContent()) ?? "").trim();
    expect(text).toBe(knownLabel);

    const bg = await chip.evaluate((el) => getComputedStyle(el).backgroundColor);
    if (PEER_REVIEWED.has(type as string)) {
      expect(bg).toBe(accentSoft);
    } else {
      expect(bg).not.toBe(accentSoft);
    }
  }
});

test("publication detail renders Cited-as prose block above BibTeX", async ({ page }) => {
  await page.goto("/publications/promptception-emnlp2025");
  await expect(page.getByText("Cited as")).toBeVisible();
  await expect(
    page.getByText(/For attribution in academic contexts, please cite this work as/i)
  ).toBeVisible();
  await expect(page.getByText(/Ismath, et al\., "Promptception/)).toBeVisible();
  await expect(page.getByText("BibTeX")).toBeVisible();
});

test("resources page renders kind sections", async ({ page }) => {
  await page.goto("/resources");
  await expect(page.locator("h1")).toContainText("Resources");
});

test("resources page shows per-kind hit counts as bare numbers in section eyebrows", async ({
  page,
}) => {
  await page.goto("/resources");
  // data-resource-count anchors the Simon-style bare-number count next to each
  // kind heading. Failure modes guarded against: deletion of the count span,
  // replacement with non-numeric content, off-by-one zero, and partial removal
  // (attribute on only some sections). Loop validates EVERY count, not just first.
  const counts = page.locator("[data-resource-count]");
  const n = await counts.count();
  expect(n).toBeGreaterThanOrEqual(1);
  for (let i = 0; i < n; i++) {
    const text = (await counts.nth(i).textContent())?.trim() ?? "";
    expect(text).toMatch(/^\d+$/);
    expect(Number.parseInt(text, 10)).toBeGreaterThan(0);
  }
});

test("nav surfaces the Beyond link routing to /hobbies", async ({ page }) => {
  // Catches mutation: restoring the old "Hobbies" label in site-config.yaml.
  await page.goto("/");
  const beyondLink = page.locator('nav a[href="/hobbies"]');
  await expect(beyondLink).toHaveCount(1);
  await expect(beyondLink).toContainText("Beyond");
});

test("Beyond page renders categorised sections in the expected order", async ({ page }) => {
  // Asserts the three populated category H2s are present and ordered as
  // CATEGORY_ORDER declares (Leadership > Extracurricular > Sports).
  // Catches:
  //   - mutation: removing a category field from a yaml (silently migrates to Interests)
  //   - mutation: reordering CATEGORY_ORDER
  //   - mutation: heading-hierarchy regression (cards becoming h2 instead of h3)
  await page.goto("/hobbies");
  // The H2 textContent includes the inline count badge digits (e.g.
  // "Leadership1"); strip trailing digits before comparing the label order.
  const sectionHeadings = await page
    .locator("h2.display")
    .allTextContents()
    .then((arr) => arr.map((s) => s.trim().replace(/\d+$/, "")));
  expect(sectionHeadings).toEqual(["Leadership", "Extracurricular", "Sports"]);

  // Card titles render as h3 (one per entry). Floor catches mass-deletion of
  // hobby MDX files; current content has 7 entries so floor=5 leaves room for
  // intentional content edits without false-failing on every removal.
  const cardTitles = page.locator("section article h3");
  expect(await cardTitles.count()).toBeGreaterThanOrEqual(5);
});

test("Beyond page renders at least one org logo inside a card", async ({ page }) => {
  // Catches mutations: removing all `logo:` fields from hobby YAMLs, replacing
  // next/image with a non-rendering element, or breaking the conditional
  // render block.
  await page.goto("/hobbies");
  const logoImgs = page.locator("section article img");
  await expect(logoImgs).not.toHaveCount(0);
});

test("hobbies page renders anecdotes", async ({ page }) => {
  await page.goto("/hobbies");
  await expect(page.locator("h1")).toContainText("Beyond");
  await expect(page.locator("section ul li").first()).toBeVisible();
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
