import type { Metadata } from "next";
import Image from "next/image";
import { type Hobby, hobbies } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/beyond",
  title: "Beyond",
  description:
    "Clubs, communities, sports, and the things I show up for outside the day job.",
});

type Accent = { fg: string; soft: string };
const ACCENTS: readonly [Accent, Accent, Accent, Accent] = [
  { fg: "var(--color-research)", soft: "var(--color-research-soft)" },
  { fg: "var(--color-enterprise)", soft: "var(--color-enterprise-soft)" },
  { fg: "var(--color-independent)", soft: "var(--color-independent-soft)" },
  { fg: "var(--color-accent)", soft: "var(--color-accent-soft)" },
];

// Category display order + section labels. Entries without a category fall
// into "interest" by default so the page never has uncategorised orphans.
// "leadership" remains a valid schema value but folds into "Clubs &
// competitions" at render time so a single founding role does not require its
// own section header.
type Category = NonNullable<Hobby["category"]>;
const CATEGORY_ORDER: ReadonlyArray<{ key: Category; label: string; blurb: string }> = [
  {
    key: "extracurricular",
    label: "Clubs & competitions",
    blurb: "Clubs I've founded or joined, and competitions I've shown up for.",
  },
  {
    key: "sport",
    label: "Sports",
    blurb: "What keeps me moving when the laptop closes.",
  },
  {
    key: "interest",
    label: "Interests",
    blurb: "Other things worth surfacing.",
  },
];

export default function BeyondPage() {
  const sorted = [...hobbies].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const grouped = new Map<Category, Hobby[]>();
  for (const h of sorted) {
    // "leadership" entries fold into "extracurricular" so we keep one combined
    // "Clubs & competitions" section; the schema still accepts both values.
    const raw = h.category ?? "interest";
    const cat = (raw === "leadership" ? "extracurricular" : raw) as Category;
    const list = grouped.get(cat) ?? [];
    list.push(h);
    grouped.set(cat, list);
  }

  // Counter that runs across all groups so accent colour rotation stays varied
  // even when one category has many entries.
  let cardIndex = 0;

  return (
    <div className="px-4 max-w-4xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Off the clock"
        title="Beyond"
        description="Clubs, competitions, sports, and the things I show up for outside the day job. Each one teaches me something I bring back to work."
      />

      <div className="space-y-16">
        {CATEGORY_ORDER.map(({ key, label, blurb }) => {
          const items = grouped.get(key) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <div className="mb-6">
                <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight flex items-center mb-1">
                  <span className="section-rule bg-[var(--color-accent)]" aria-hidden="true" />
                  {label}
                  <span
                    aria-label={`${items.length} ${label.toLowerCase()}`}
                    className="ml-auto metadata text-sm tabular-nums text-[var(--color-fg-muted)] font-normal"
                  >
                    {items.length}
                  </span>
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] ml-[0.875rem] max-w-2xl">
                  {blurb}
                </p>
              </div>
              <div className="space-y-6">
                {items.map((h) => {
                  const accent = ACCENTS[(cardIndex++ % 4) as 0 | 1 | 2 | 3];
                  return (
                    <article
                      key={h.title}
                      className="surface-elevated relative overflow-hidden"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-1.5"
                        style={{ background: accent.fg }}
                      />
                      <div className="p-6 md:p-8 pl-7 md:pl-9">
                        {/*
                         * Two-column header: title on the left, optional org
                         * logo on the right. When `logo` is absent (e.g. the
                         * sport entries), the title fills the row alone and
                         * the layout collapses gracefully.
                         */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className="display text-2xl md:text-3xl font-bold tracking-tight"
                            style={{ color: accent.fg }}
                          >
                            {h.title}
                          </h3>
                          {/* See CareerTimeline for the dark-mode logo legibility design. */}
                          {h.logo && (() => {
                            const hasDark = !!h.logo_dark;
                            const frameBg = hasDark
                              ? "bg-[var(--color-bg-raised)]"
                              : "logo-frame-light";
                            return (
                              <span
                                aria-hidden="true"
                                className={`shrink-0 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-md border border-[var(--color-border-strong)] overflow-hidden shadow-[var(--shadow-card)] ${frameBg}`}
                              >
                                <Image
                                  src={h.logo}
                                  alt=""
                                  width={80}
                                  height={80}
                                  className={`h-full w-full object-contain p-1.5 ${hasDark ? "dark:hidden" : ""}`}
                                />
                                {hasDark && (
                                  <Image
                                    src={h.logo_dark as string}
                                    alt=""
                                    width={80}
                                    height={80}
                                    className="hidden dark:block h-full w-full object-contain p-1.5"
                                  />
                                )}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-base text-[var(--color-fg-muted)] mb-5 max-w-prose leading-relaxed">
                          {h.description}
                        </p>
                        <ul className="space-y-3">
                          {h.anecdotes.map((a) => (
                            <li key={a.slice(0, 60)} className="flex gap-3 leading-relaxed">
                              <span
                                aria-hidden="true"
                                className="mt-2 w-1 h-1 rounded-full shrink-0"
                                style={{ background: accent.fg }}
                              />
                              <span className="text-[var(--color-fg)]">{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
