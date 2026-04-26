# Visual Audit for insafismath.com

## Goal

This document audits the current website's visual presentation and suggests how to make it more visually appealing without losing the strengths it already has: clarity, readability, accessibility, and a professional research-oriented tone.

The recommended direction is:

- Professional, not corporate
- Personal, not casual
- Editorial, not ornamental
- Distinctive, without depending on heavy imagery

## Current Visual Strengths

The site already has a strong structural foundation.

- The design tokens in `app/globals.css` create a clean light/dark system with good contrast discipline.
- The layout rhythm is consistent across routes. Most pages use sensible width constraints and spacing that already feel calm and readable.
- The homepage hero in `components/Hero.tsx` gives the strongest sense of identity through hierarchy, chips, and clear CTAs.
- The navigation and footer are simple and unobtrusive.
- The site feels content-first. That is the right baseline for a personal site centered on research, projects, and writing.
- Accessibility fundamentals are already present, including focus styles, reduced-motion handling, and a skip link.

Those foundations should be preserved. The redesign opportunity is not a full visual reset. It is mostly about giving the site stronger atmosphere, better section hierarchy, and a more memorable visual language across inner pages.

## Main Visual Gaps

The current site is solid but restrained to the point of feeling generic on inner pages.

### 1. Too much of the personality is concentrated on the homepage

The homepage has a clear identity, but pages like Projects, Publications, About, Resources, and Contact shift back to a plain heading-plus-content layout. This makes the site feel less cohesive than it should.

### 2. The typography is competent but not expressive

A single sans-serif system keeps everything clean, but there is not enough variation in rhythm, scale, or tone between page titles, section headers, metadata, and long-form text.

### 3. The surface language is too uniform

Many repeated elements rely on the same formula: border, rounded corners, muted text, light background. It is tidy, but it flattens hierarchy and reduces memorability.

### 4. Inner pages need stronger section framing

Most pages are visually a single stack of content. There are few moments where a section feels intentionally introduced, separated, or highlighted.

### 5. The navigation is functional but visually compressed

The sticky nav bar works, but the primary links feel dense and a bit cramped, especially if the content grows or the viewport shrinks.

### 6. The site has very little visual texture

Because there is almost no image library and only a limited set of decorative motifs, the design needs more atmosphere from typography, spacing, subtle layering, and section backgrounds rather than from photos or illustrations.

## Recommended Design Direction

The best direction for this site is a restrained editorial system.

That means:

- Keep the clean technical credibility of the current layout.
- Introduce stronger contrast between hero sections, content sections, and metadata-heavy components.
- Use typography, spacing, and background treatment to create personality.
- Carry one or two signature visual motifs across the whole site instead of allowing the homepage to be the only expressive page.

The site should feel like a researcher's notebook crossed with a polished case-study portfolio.

## Site-Wide Recommendations

### 1. Expand the typography system

The current type treatment is readable, but it needs more character.

Suggestions:

- Keep the main sans-serif for body text and UI.
- Add a second voice for large headings or pull-quote style moments. This could be a serif, a more expressive display face, or a sharper grotesk depending on the brand tone you want.
- Increase the contrast between page titles, section titles, and metadata. Right now they are mostly differentiated by size and weight only.
- Give metadata a more deliberate style. Years, venues, tags, and status labels can become part of the visual system rather than passive gray text.
- Use slightly more generous line-height and measure controls for longer pages like About and publication detail pages.

Why this matters:

Typography is the fastest way to make a text-heavy site feel designed without needing new imagery.

### 2. Introduce two or three shared surface types

The site should not treat every block the same way.

Recommended surface types:

- Default surface: plain page background for regular reading.
- Elevated surface: soft panel or card with subtle tint and shadow for featured content.
- Accent surface: stronger section treatment for hero bands, callouts, or curated lists.

How to apply this:

- Use elevated surfaces for featured projects, suggested reading order, highlighted publications, and contact blocks.
- Use accent surfaces sparingly for page intros and key summary blocks.
- Keep the border-based card style, but stop using it as the only visual pattern.

### 3. Strengthen the background system

The site does not need heavy graphics, but it does need more atmosphere.

Suggestions:

- Add subtle background gradients or soft radial highlights to page headers, not just the homepage.
- Use alternating section backgrounds on longer pages to help content feel segmented.
- Add restrained texture through tint shifts, grid hints, or blurred shapes that stay out of the way of readability.
- Reuse the homepage's visual energy in quieter forms across Projects, Publications, and About.

The key is to create depth without reducing performance or accessibility.

### 4. Make the navigation feel more intentional

The current nav is clean, but it feels compressed.

Suggestions:

- Give the brand area more presence so the top bar feels anchored.
- Improve spacing between navigation items and tune their hover/active states so the nav feels less like a list of plain links.
- Consider grouping navigation and utility actions more clearly so the theme toggle feels integrated instead of appended.
- Add a stronger small-screen strategy if the link count grows. Even if the current list fits, it is visually tight.

### 5. Build a more distinctive card language

Projects, resources, and other repeatable modules should feel related but not identical.

Suggestions:

- Differentiate cards using top accents, stronger title hierarchy, category markers, and more deliberate spacing.
- Make tags more refined. They should look like part of a designed information system, not fallback pills.
- Let one element become the visual hook on each card: a year badge, category stripe, problem statement, or result metric.
- Avoid making every card the same visual weight. Featured or recent items should stand out.

### 6. Carry the homepage personality into the rest of the site

The homepage already hints at a stronger visual identity.

Preserve:

- The strong title hierarchy
- The chip treatment for specialization areas
- The sense of deliberate spacing
- The simple but confident CTA styling

Extend that language into inner-page headers, section intros, and featured content modules so the site feels authored rather than assembled.

## Page-by-Page Recommendations

### Home

Current state:

- This is the most visually effective page because `components/Hero.tsx` gives the content a clear hierarchy and a sense of focus.
- It is concise and readable, but it still has room to feel more premium.

What to preserve:

- The direct hero structure
- The specialization chips
- The dual CTA pattern
- The restrained width and readable pacing

What to improve:

- Add a more distinctive intro atmosphere. A subtle editorial header background or motif would make the landing view feel more memorable.
- Make the specialization chips feel more intentional by refining their spacing, casing, and contrast.
- Consider a secondary strip below the hero for selected signals such as current focus, recent publication, or highlighted project. That would immediately make the homepage feel more alive.
- If you keep the page minimal, increase the visual drama of the hero itself through stronger type rhythm and more deliberate separation between name, role, and supporting text.

### Projects

Current state:

- `app/projects/page.tsx` is content-rich, but visually repetitive.
- The category sections and grid layout are clear, but the page reads more like a catalog than a curated body of work.
- `components/ProjectCard.tsx` is functional, but the cards do not yet communicate enough distinction or depth.

What to preserve:

- The category grouping
- The filter functionality
- The concise project summaries
- The technology tags

What to improve:

- Give the page a stronger intro band with a short framing sentence about the kind of work you do.
- Reduce repetition between the grouped layout and filter experience if both remain present. One should feel primary, the other secondary.
- Upgrade the project cards so each card has a clearer visual hook: category, outcome, year, or type marker.
- Introduce featured-project treatment for the strongest work instead of giving every card the same weight.
- Use more contrast between title, problem statement, and tech stack so the cards scan faster.
- Consider soft tonal differences between project categories so enterprise, research, and independent work feel intentionally distinct.

### Publications

Current state:

- `app/publications/page.tsx` is academically credible but visually plain.
- `components/PublicationCard.tsx` presents the information clearly, but the list feels more like a document export than a designed publication index.

What to preserve:

- The clear ordering by year
- The direct access to paper links
- The emphasis on authorship
- The clean list structure

What to improve:

- Introduce year grouping or year markers so the list has stronger rhythm.
- Make venue, paper type, and authorship visually meaningful rather than leaving them as muted inline metadata.
- Give the Google Scholar link a more intentional place in the page header, perhaps as a utility action rather than just a small text link.
- Use stronger separation between publications so the page feels editorial instead of purely transactional.
- Consider a visual badge or accent for especially important work such as first-author papers, accepted papers, or highlighted topics.

### About

Current state:

- `app/about/page.tsx` is structurally sound, but visually minimal.
- The long-form bio and career timeline are useful, but they are presented as a standard article followed by a standard list.

What to preserve:

- The long-form prose approach
- The career timeline as a structured summary
- The generous spacing between biography and career sections

What to improve:

- Add a stronger introductory section so the page does not start as a plain block of prose.
- Break up the biography visually with pull quotes, key principles, or side notes if the content supports it.
- Make the career timeline feel more designed through markers, rhythm, or subtle connective styling.
- Consider adding a compact profile facts panel with focus areas, location, affiliation, and current interests.
- Improve the contrast between prose content and structural content so the page feels composed rather than stacked.

### Resources

Current state:

- `app/resources/page.tsx` already has a useful structure with kinds and optional reading order.
- The content model is good, but the visual treatment can better support the editorial nature of the page.

What to preserve:

- The kind-based grouping
- The optional suggested reading order section
- The concise, curated feel

What to improve:

- Give the suggested reading order block a stronger editorial treatment so it feels like a curated path, not just a bordered box.
- Differentiate resource kinds more clearly through tone, iconography, label treatment, or category accents.
- Make resource cards feel less generic by emphasizing why each resource matters.
- Consider adding a short page intro that explains how these resources connect to your work or thinking.

### Contact

Current state:

- `app/contact/page.tsx` is extremely minimal.
- It works, but it misses an opportunity to feel warm, trustworthy, and deliberate.

What to preserve:

- The simplicity
- The direct access to email
- The clean list of social destinations

What to improve:

- Wrap the contact content in a stronger panel or split layout so the page does not feel like raw text.
- Add a short framing note about what people should reach out for.
- Make the social links feel like designed actions rather than plain underlined links.
- Consider a lightweight trust signal such as response expectations, collaboration interests, or areas of expertise.

### Hobbies

Current state:

- `app/hobbies/page.tsx` is one of the better candidates for personality, but it is currently presented with the same visual vocabulary as more formal pages.
- That makes it readable, but not especially memorable.

What to preserve:

- The clear sectioning by hobby
- The anecdotal structure
- The overall simplicity

What to improve:

- Let this page be more playful than the rest of the site while still staying within the overall brand system.
- Use stronger section dividers, more expressive headings, or subtle accent treatments for each hobby.
- If imagery is added later, this is one of the best places to use it.
- Even without imagery, the page can feel more alive through typography and section-specific accent cues.

## Priority Plan

### Phase 1: Quick wins

These changes would improve the site quickly without requiring a major redesign.

- Strengthen page headers on inner pages with short intros and subtle background treatment.
- Improve nav spacing and hover/active states.
- Refine card spacing, title hierarchy, and metadata styling.
- Introduce more deliberate badge and tag styling across projects, publications, and resources.
- Upgrade the contact page from plain text to a designed contact block.

Expected impact:

Higher perceived polish with relatively low implementation risk.

### Phase 2: Medium-effort upgrades

These changes would create a noticeably stronger visual identity.

- Expand the typography system to include a second voice for display or editorial moments.
- Build shared page-intro patterns so inner pages inherit some of the homepage's personality.
- Create multiple card variants for featured content versus standard content.
- Add section-level background alternation and tonal layering on longer pages.
- Redesign the About page and career timeline into a more composed editorial layout.

Expected impact:

This is the phase that would make the site feel designed rather than simply clean.

### Phase 3: Higher-effort enhancements

These are optional, but they would make the site more distinctive if you want to push further.

- Add a small visual motif system across the site, such as gradients, ruled lines, soft glows, or diagram-like shapes.
- Create featured content modules on the homepage for latest publication, selected project, or current focus.
- Add light visual storytelling to project and publication detail pages with summary callouts or result panels.
- Introduce a minimal media system if you later decide to add portraits, diagrams, screenshots, or hobby imagery.

Expected impact:

These changes would move the site from polished to memorable.

## Suggested Execution Order

If you want the highest visual payoff first, work in this order:

1. `app/globals.css`
2. `components/Nav.tsx`
3. `components/Hero.tsx`
4. `components/ProjectCard.tsx`
5. `components/PublicationCard.tsx`
6. `app/projects/page.tsx`
7. `app/publications/page.tsx`
8. `app/about/page.tsx`
9. `app/resources/page.tsx`
10. `app/contact/page.tsx`
11. `app/hobbies/page.tsx`

That sequence prioritizes shared systems first, then the highest-traffic and highest-repetition content surfaces.

## Final Recommendation

The site does not need more decoration. It needs more authorship.

The strongest next step is to define a more expressive site-wide visual language and then apply it consistently across inner pages, especially Projects, Publications, and About. If that is done well, the site will feel more visually appealing without losing the intellectual clarity that already makes it strong.
