import type { Metadata } from "next";
import { resources, siteConfig } from "#site/content";
import { ResourceCard } from "@/components/ResourceCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/resources",
  title: "Resources",
  description:
    "Curated talks, repositories, models, and writing — each annotated with why it matters.",
});

const KINDS: Array<{ key: "talk" | "repo" | "model" | "writing"; label: string }> = [
  { key: "talk", label: "Talks" },
  { key: "repo", label: "Repositories" },
  { key: "model", label: "Models" },
  { key: "writing", label: "Writing" },
];

export default function ResourcesPage() {
  // US-029 (could-have): suggested reading order — show items with reading_order
  // ascending, then the rest grouped by kind.
  const readingOrderEnabled = siteConfig.feature_flags.reading_order;
  const ordered = readingOrderEnabled
    ? resources.filter((r) => typeof r.reading_order === "number").sort((a, b) => (a.reading_order ?? 0) - (b.reading_order ?? 0))
    : [];

  return (
    <section className="px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Resources</h1>

      {ordered.length > 0 && (
        <section className="mb-12 p-4 border border-[var(--color-accent)] rounded">
          <h2 className="text-xl font-semibold mb-2">Suggested reading order</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mb-4">
            Start here if you want a curated path through these resources.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            {ordered.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline hover:text-[var(--color-accent)]"
                >
                  {r.title}
                </a>
                <span className="text-xs text-[var(--color-fg-muted)] ml-2 uppercase tracking-wide">
                  {r.kind}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="space-y-10">
        {KINDS.map(({ key, label }) => {
          const items = resources.filter((r) => r.kind === key);
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <h2 className="text-2xl font-semibold mb-4">{label}</h2>
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
    </section>
  );
}
