import type { Metadata } from "next";
import { profile, publications } from "#site/content";
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
  const count = sorted.length;

  return (
    <div className="px-4 max-w-4xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow={`${count} ${count === 1 ? "paper" : "papers"}`}
        title="Publications"
        description="Peer-reviewed work on multimodal LLMs, vision-language calibration, and computer vision - with abstracts, BibTeX, and direct links to PDFs."
        utility={
          <a
            href={profile.scholar_url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border-strong)] text-sm font-semibold text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <span>Google Scholar</span>
            <span aria-hidden="true">↗</span>
          </a>
        }
      />

      <ul className="space-y-5">
        {sorted.map((p) => (
          <li key={p.slug}>
            <PublicationCard publication={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
