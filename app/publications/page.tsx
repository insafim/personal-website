import type { Metadata } from "next";
import { person, publications } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { PublicationCard } from "@/components/PublicationCard";
import { buildMetadata } from "@/lib/metadata";
import { sortByYearDesc } from "@/lib/publications";

export const metadata: Metadata = buildMetadata({
  path: "/publications",
  title: "Publications",
  description: "Research publications with abstracts, BibTeX, arXiv/DOI/PDF links.",
});

export default function PublicationsPage() {
  const sorted = sortByYearDesc(publications);
  const byYear = sorted.reduce<Map<number, typeof sorted>>((acc, p) => {
    const list = acc.get(p.year) ?? [];
    list.push(p);
    acc.set(p.year, list);
    return acc;
  }, new Map());
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="px-4 max-w-4xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Research output"
        title="Publications"
        description="Peer-reviewed work on multimodal LLMs, vision-language calibration, and computer vision — with abstracts, BibTeX, and direct links to PDFs."
        utility={
          <a
            href={person.scholar_url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border-strong)] text-sm font-semibold text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <span>Google Scholar</span>
            <span aria-hidden="true">↗</span>
          </a>
        }
      />

      <div className="space-y-12">
        {years.map((year) => {
          const items = byYear.get(year) ?? [];
          return (
            <section key={year}>
              <div className="flex items-baseline gap-4 mb-5 pb-2 border-b border-[var(--color-border)]">
                <h2 className="display text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
                  {year}
                </h2>
                <span className="metadata">
                  {items.length} {items.length === 1 ? "paper" : "papers"}
                </span>
              </div>
              <ul className="space-y-5">
                {items.map((p) => (
                  <li key={p.slug}>
                    <PublicationCard publication={p} />
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
