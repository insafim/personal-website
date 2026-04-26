import type { Metadata } from "next";
import { person, publications } from "#site/content";
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

  return (
    <section className="px-4 py-12 max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between gap-3 mb-8">
        <h1 className="text-4xl font-bold">Publications</h1>
        <a
          href={person.scholar_url}
          rel="noopener noreferrer"
          target="_blank"
          className="text-sm underline text-[var(--color-fg-muted)]"
        >
          View on Google Scholar →
        </a>
      </div>
      <ul className="space-y-6">
        {sorted.map((p) => (
          <li key={p.slug}>
            <PublicationCard publication={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
