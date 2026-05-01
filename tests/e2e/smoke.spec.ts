import { expect, test } from "@playwright/test";

test("home renders hero with name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Insaf Ismath");
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

test("publications page renders flat list with no year-group H2s", async ({ page }) => {
  // Mutation: restoring year-grouped H2s on /publications. The flat-list
  // structure is the contract the user requested; the eyebrow + description
  // were removed in changes_v2 (the page header is now title-only).
  await page.goto("/publications");
  await expect(page.locator("h1")).toContainText("Publications");
  // Anchor on actual card render so a broken Velite content load does not
  // pass silently after the eyebrow count was removed (the old "N papers"
  // assertion implicitly proved content loaded).
  const cards = page.locator("ul article.surface-elevated");
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
  const yearHeadings = page.locator("h2").filter({ hasText: /^\d{4}$/ });
  await expect(yearHeadings).toHaveCount(0);
});

test("every publication card renders the research accent bar", async ({ page }) => {
  // changes_v2 dropped the isFirst gate so the purple --color-research bar
  // renders on every card, not only first-author papers. Mutation guarded:
  // restoring the {isFirst && ...} wrapper in PublicationCard.tsx.
  await page.goto("/publications");
  const cards = page.locator("ul article.surface-elevated");
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThanOrEqual(1);
  const bars = page.locator("ul article.surface-elevated > span.absolute.inset-y-0.left-0.w-1");
  await expect(bars).toHaveCount(cardCount);
});

test("timeline logo containers use logo-frame-light when no logo_dark variant is set", async ({
  page,
}) => {
  // Contract: dark-on-transparent brand PNGs must remain visible across both
  // light and dark themes. The container for entries lacking a `logo_dark`
  // field gets .logo-frame-light (always-light surface). No content currently
  // ships logo_dark, so EVERY rendered logo container must carry the class.
  // This stronger equality (rather than count > 0) catches a partial
  // regression that strips the class from some entries but not others.
  // When the first `logo_dark` is added to a YAML, this assertion must be
  // updated: split the count between .logo-frame-light (entries without
  // logo_dark) and the theme-aware branch (entries with logo_dark, which
  // render two <Image> elements toggled by .dark class on <html>).
  await page.goto("/about");
  // Count timeline entries (one <li> per career/education row). Every entry
  // currently renders a logo container, so the .logo-frame-light count must
  // equal this count exactly. A descendant `img` selector would be fragile
  // because Next.js Image may wrap the rendered <img> differently per release.
  const careerEntries = page.locator("section:has(h2:text-is('Career')) ol li");
  const educationEntries = page.locator("section:has(h2:text-is('Education')) ol li");
  const totalEntries = (await careerEntries.count()) + (await educationEntries.count());
  expect(totalEntries).toBeGreaterThan(0);
  const lightFrames = page.locator(
    "section:has(h2:text-is('Career')) .logo-frame-light, section:has(h2:text-is('Education')) .logo-frame-light"
  );
  await expect(lightFrames).toHaveCount(totalEntries);
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

test("project cards do not render a status pill", async ({ page }) => {
  // Contract: the legacy status pill (shipped/active/archived/in-progress) was
  // removed in favour of an affiliation chip. Catches a regression that
  // restores STATUS_PALETTE rendering inside ProjectCard. The selector pins to
  // the same span shape the old pill used, scoped to the projects index.
  await page.goto("/projects");
  const statusPills = page.locator(
    'article.surface-elevated span.rounded-full[class*="status-shipped"], article.surface-elevated span.rounded-full[class*="status-active"], article.surface-elevated span.rounded-full[class*="status-archived"], article.surface-elevated span.rounded-full[class*="status-in-progress"]'
  );
  await expect(statusPills).toHaveCount(0);
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

test("project detail page eyebrow shows the project's affiliation", async ({ page }) => {
  // Contract: the eyebrow on a project detail page surfaces the affiliation
  // (e.g. "2PointZero Group") rather than the legacy "Enterprise project" /
  // "Research project" category label. avatar-voice-agent is wired to
  // 2PointZero Group, so the eyebrow must contain that exact label.
  await page.goto("/projects/avatar-voice-agent");
  const eyebrow = page.locator("header .eyebrow").first();
  await expect(eyebrow).toContainText("2PointZero Group");
});

test("projects index renders a flat list with affiliation chips on every card", async ({
  page,
}) => {
  // Contract: the projects index is a single flat list (no enterprise/research
  // grouping) and every card surfaces an affiliation chip via data-affiliation.
  // Catches: regression that re-introduces section grouping, or a card that
  // renders without an affiliation chip after the schema migration.
  await page.goto("/projects");
  await expect(page.locator("h1")).toContainText("Projects");

  const cards = page.locator("article.surface-elevated");
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThanOrEqual(1);

  const chips = page.locator("article.surface-elevated [data-affiliation]");
  expect(await chips.count()).toBe(cardCount);
});

test("projects index promotes a scale_metric on cards that have one", async ({
  page,
}) => {
  await page.goto("/projects");
  // data-hero-metric marks a project's first scale_metric as the tile's anchor
  // number. Tiles share one uniform format now (no featured/regular split), so
  // the attribute appears on every card whose project frontmatter has
  // scale_metrics, and is absent on cards whose frontmatter omits them.
  const heroMetrics = page.locator("[data-hero-metric]");
  await expect(heroMetrics).not.toHaveCount(0);

  // The promoted value carries data-metric-value as a stable test anchor
  // (decoupled from the .display font class, which controls family/leading
  // but not size). Assert presence AND a computed font-size at or above
  // text-3xl (30px) so a regression that strips the size utilities is caught.
  const valueSpan = heroMetrics.first().locator("[data-metric-value]");
  await expect(valueSpan).toBeVisible();
  const fontSize = await valueSpan.evaluate((el) =>
    Number.parseFloat(getComputedStyle(el).fontSize)
  );
  expect(fontSize).toBeGreaterThanOrEqual(30);

  // Exclusivity: cards whose frontmatter has no scale_metrics must NOT carry
  // the hero-metric block. At least one such card exists in the seed content
  // (e.g. avatar-voice-agent, langgraph-eval-pipeline), so the count must be
  // > 0 - otherwise the attribute has leaked to every card.
  const cardsWithoutHero = page.locator("article.surface-elevated:not(:has([data-hero-metric]))");
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

test("publication detail renders BibTeX block by default", async ({ page }) => {
  await page.goto("/publications/promptception-emnlp2025");
  await expect(page.getByText("BibTeX", { exact: true })).toBeVisible();
});

test("publication detail suppresses BibTeX when hide_bibtex is true", async ({ page }) => {
  // CVPR 2026 carries hide_bibtex: true so the BibTeXBlock must not render.
  // Mutation guarded: removing the !pub.hide_bibtex guard in
  // app/publications/[slug]/page.tsx.
  await page.goto("/publications/prompt-tuning-calibration-cvpr2026");
  await expect(page.locator("h1")).toContainText(
    "Towards Calibrating Prompt Tuning of Vision-Language Models"
  );
  // BibTeX appears nowhere in the visible DOM. Use exact text to ignore the
  // BibTeXBlock chunk-preload script src (which contains the string
  // "BibTeXBlock_tsx" but is not rendered text).
  await expect(page.getByText("BibTeX", { exact: true })).toHaveCount(0);
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

test("nav surfaces the Beyond link routing to /beyond", async ({ page }) => {
  // Catches mutation: reverting the nav href back to the old /hobbies path.
  await page.goto("/");
  const beyondLink = page.locator('nav a[href="/beyond"]');
  await expect(beyondLink).toHaveCount(1);
  await expect(beyondLink).toContainText("Beyond");
});

test("GET /hobbies redirects permanently to /beyond", async ({ page }) => {
  // content/redirects.yaml is the sole source of truth for the 308. A regression
  // there would silently break inbound links and OG cards from before the rename.
  await page.goto("/hobbies");
  expect(page.url()).toContain("/beyond");
});

test("Beyond page renders categorised sections in the expected order", async ({ page }) => {
  // Asserts the populated category H2s are present and ordered as
  // CATEGORY_ORDER declares (Leadership > Sports & Fitness). Empty categories
  // (extracurricular, interest) are skipped by the items.length === 0 guard.
  // Catches:
  //   - mutation: removing a category field from a yaml (silently migrates to Interests)
  //   - mutation: reordering CATEGORY_ORDER
  //   - mutation: heading-hierarchy regression (cards becoming h2 instead of h3)
  await page.goto("/beyond");
  const sectionHeadings = await page
    .locator("h2.display")
    .allTextContents()
    .then((arr) => arr.map((s) => s.trim()));
  expect(sectionHeadings).toEqual(["Leadership", "Sports & Fitness"]);

  // Card titles render as h3 (one per entry). Floor catches mass-deletion of
  // hobby MDX files; current content has 6 entries so floor=4 leaves room for
  // a single intentional removal without false-failing.
  const cardTitles = page.locator("section article h3");
  expect(await cardTitles.count()).toBeGreaterThanOrEqual(4);
});

test("Beyond page renders at least one org logo inside a card", async ({ page }) => {
  // Catches mutations: removing all `logo:` fields from hobby YAMLs, replacing
  // next/image with a non-rendering element, or breaking the conditional
  // render block.
  await page.goto("/beyond");
  const logoImgs = page.locator("section article img");
  await expect(logoImgs).not.toHaveCount(0);
});

test("Beyond page renders the partner-logo chip strip on the MBZUAI card", async ({ page }) => {
  // Scoped specifically to the only card with `partner_logos` today. The
  // page-wide "logo not zero" assertion above passes even if the entire
  // partner_logos render block is deleted, because the primary logo would
  // still produce one img. This narrower test catches that regression.
  await page.goto("/beyond");
  const mbzuaiCard = page.locator('article:has(h3:text-is("MBZUAI Consulting Club"))');
  await expect(mbzuaiCard.locator("img")).toHaveCount(3);
  await expect(mbzuaiCard.getByText("With", { exact: true })).toBeVisible();
});

test("Beyond page renders anecdotes", async ({ page }) => {
  await page.goto("/beyond");
  await expect(page.locator("h1")).toContainText("Beyond");
  await expect(page.locator("section ul li").first()).toBeVisible();
});

test("contact page renders mailto link to decoded email", async ({ page }) => {
  // EmailContact replaces the obfuscated fallback with a clickable mailto
  // anchor on hydration. /contact mounts two instances (footer + main
  // section); the first one resolving is enough.
  await page.goto("/contact");
  const mailto = page.locator('a[href^="mailto:"]').first();
  await expect(mailto).toBeVisible();
  await expect(mailto).toHaveAttribute("href", /^mailto:i\.m\.insaf@gmail\.com$/);
});

test("social links carry brand-icon SVGs in Footer and Contact aside", async ({ page }) => {
  // The SocialIcon component renders an inline <svg> alongside each social
  // label (GitHub / LinkedIn / Scholar). Catches: deletion of the SocialIcon
  // import, the icon-key map regressing to an empty object, or a rename of
  // the social labels in site-config.yaml that breaks the label-to-icon
  // lookup. The labels are aria-hidden on the SVG, so the assertion targets
  // the link's accessible name (label text) and counts the inline svg
  // children separately.
  await page.goto("/contact");

  const githubLink = page.locator('aside a[href*="github.com"]');
  await expect(githubLink).toHaveCount(1);
  await expect(githubLink.locator("svg")).toHaveCount(1);

  const linkedinLink = page.locator('aside a[href*="linkedin.com"]');
  await expect(linkedinLink).toHaveCount(1);
  await expect(linkedinLink.locator("svg")).toHaveCount(1);

  const scholarLink = page.locator('aside a[href*="scholar.google"]');
  await expect(scholarLink).toHaveCount(1);
  await expect(scholarLink.locator("svg")).toHaveCount(1);

  // Footer carries the same three social links; verify icons there too.
  await page.goto("/");
  const footerGithub = page.locator('footer a[href*="github.com"]');
  await expect(footerGithub).toHaveCount(1);
  await expect(footerGithub.locator("svg")).toHaveCount(1);
});

test("contact page renders phone and WhatsApp action links from profile.phone", async ({
  page,
}) => {
  // Contract (per content/profile.mdx + app/contact/page.tsx):
  //   tel:   strips whitespace from the display number.
  //   wa.me: strips ALL non-digits (so the leading + is gone, leaving the
  //          E.164 digits). This is wa.me's required format.
  // Catches: deletion of the phone block when profile.phone is set, regression
  // in the strip rules, or swapping the two link targets.
  await page.goto("/contact");
  const callLink = page.locator('a[href^="tel:"]');
  await expect(callLink).toHaveCount(1);
  await expect(callLink).toHaveAttribute("href", /^tel:\+\d+$/);

  const whatsappLink = page.locator('a[href*="wa.me"]');
  await expect(whatsappLink).toHaveCount(1);
  // wa.me requires digits only after the slash, no leading +.
  await expect(whatsappLink).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+$/);

  // Visible display number paragraph: catches deletion of the human-readable
  // <p>{person.phone}</p> element above the action buttons. The text query
  // matches against the rendered text node directly, not aria-label.
  await expect(page.getByText("+971 56 607 1157", { exact: true })).toBeVisible();

  // getByRole("link", { name }) resolves the accessible name. Both action
  // links carry an aria-label (Call <number> / Open WhatsApp chat with
  // <number>), so the regex matches against aria-label, not the inner span
  // text. If the aria-label prefix is renamed in the future, these
  // assertions break - intentional, because the leading word is the user-
  // visible action verb to assistive tech.
  await expect(page.getByRole("link", { name: /^Call/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Open WhatsApp chat with/i })).toBeVisible();
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
  // Contract: copy must not advertise the legacy enterprise/research grouping
  // since the projects page is now a flat list. Catches a regression that
  // reverts the route handler text without updating the model surface.
  expect(body).not.toMatch(/grouped by category/i);
});

test("theme toggle flips .dark class", async ({ page }) => {
  await page.goto("/");
  const initial = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: /Switch to/i }).click();
  await page.waitForTimeout(100);
  const after = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(after).toBe(!initial);
});
