import type { Metadata } from "next";
import { resources, siteConfig } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { ResourceCard } from "@/components/ResourceCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/resources",
  title: "Resources",
  description:
    "Curated talks, repositories, models, and writing - each annotated with why it matters.",
});

const KINDS: Array<{
  key: "talk" | "repo" | "model" | "writing";
  label: string;
  // Singular form used by the count's aria-label when items.length === 1, so
  // assistive tech reads "1 talk" instead of the grammatically wrong "1 talks".
  singular: string;
  blurb: string;
}> = [
  {
    key: "talk",
    label: "Talks",
    singular: "talk",
    blurb: "Conference talks and recorded sessions worth your time.",
  },
  {
    key: "repo",
    label: "Repositories",
    singular: "repository",
    blurb: "Code I keep coming back to - for ideas, primitives, or the way they're built.",
  },
  {
    key: "model",
    label: "Models",
    singular: "model",
    blurb: "Open-weight models I've tested or shipped against.",
  },
  {
    key: "writing",
    label: "Writing",
    singular: "writing",
    blurb: "Essays, papers, and posts that changed how I think.",
  },
];

export default function ResourcesPage() {
  // US-029 (could-have): suggested reading order - show items with reading_order
  // ascending, then the rest grouped by kind.
  const readingOrderEnabled = siteConfig.feature_flags.reading_order;
  const ordered = readingOrderEnabled
    ? resources
        .filter((r) => typeof r.reading_order === "number")
        .sort((a, b) => (a.reading_order ?? 0) - (b.reading_order ?? 0))
    : [];

  return (
    <div className="px-4 max-w-5xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Curated"
        title="Resources"
        description="A short, opinionated reading list - talks, repositories, models, and writing that have shaped how I work, with a one-line annotation on each."
      />

      {ordered.length > 0 && (
        <section className="surface-accent mb-14 px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow mb-3">Curated path</p>
          <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Suggested reading order
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] mb-6 max-w-prose">
            Start here if you want a guided walk-through. Pieces are ordered so each one builds on
            the previous.
          </p>
          <ol className="space-y-3">
            {ordered.map((r, i) => (
              <li key={r.url} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="display text-2xl font-bold tabular-nums text-[var(--color-accent)] leading-none mt-0.5 w-8 shrink-0"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <a
                    href={r.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-base font-semibold hover:text-[var(--color-accent)] transition-colors"
                  >
                    {r.title} <span aria-hidden="true">↗</span>
                  </a>
                  <p className="metadata uppercase mt-0.5">{r.kind}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="space-y-12">
        {KINDS.map(({ key, label, singular, blurb }) => {
          const items = resources.filter((r) => r.kind === key);
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <div className="mb-5">
                {/*
                 * Hit-count pattern (Simon Willison-style /tags/<slug>): a bare
                 * right-aligned count signals section weight at a glance.
                 * Inspired by: https://simonwillison.net/tags/ (verified 2026-04-27).
                 *
                 * `data-resource-count` is a load-bearing e2e selector - see
                 * tests/e2e/smoke.spec.ts for the assertion contract.
                 */}
                {/*
                 * items-center keeps the .section-rule decorative bar centered
                 * on the heading's cross-axis (its `vertical-align` tuning is
                 * ignored once the bar is a flex child, but center alignment
                 * yields the same visual result as the prior non-flex layout).
                 */}
                <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight flex items-center mb-1">
                  <span className="section-rule bg-[var(--color-accent)]" aria-hidden="true" />
                  {label}
                  <span
                    data-resource-count=""
                    aria-label={`${items.length} ${items.length === 1 ? singular : label.toLowerCase()}`}
                    className="ml-auto metadata text-sm tabular-nums text-[var(--color-fg-muted)] font-normal"
                  >
                    {items.length}
                  </span>
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] ml-[0.875rem] max-w-2xl">
                  {blurb}
                </p>
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                {items.map((r) => (
                  <li key={r.url}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
