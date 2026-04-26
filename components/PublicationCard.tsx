import Link from "next/link";
import type { Publication } from "#site/content";

const AUTHOR_NAME = "Insaf Ismath";

const AUTHORSHIP_LABEL: Record<Publication["authorship_order"], string> = {
  first: "First author",
  "co-first": "Co-first author",
  middle: "Contributing author",
  senior: "Senior author",
  last: "Last author",
  corresponding: "Corresponding",
};

const TYPE_LABEL: Record<Publication["type"], string> = {
  conference: "Conference",
  journal: "Journal",
  workshop: "Workshop",
  preprint: "Preprint",
  thesis: "Thesis",
  "tech-report": "Tech report",
};

export function PublicationCard({ publication: p }: { publication: Publication }) {
  const isFirst = p.authorship_order === "first" || p.authorship_order === "co-first";

  return (
    <article className="surface-elevated is-interactive relative p-5 md:p-6 overflow-hidden">
      {isFirst && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-[var(--color-research)]"
        />
      )}
      <div className={`${isFirst ? "pl-3" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border border-[var(--color-border)]">
            {TYPE_LABEL[p.type]}
          </span>
          {isFirst && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] bg-[var(--color-research-soft)] text-[var(--color-research)]">
              {AUTHORSHIP_LABEL[p.authorship_order]}
            </span>
          )}
          <span className="ml-auto metadata">{p.year}</span>
        </div>

        <h3 className="display text-xl md:text-2xl font-semibold leading-snug tracking-tight mb-2">
          <Link
            href={`/publications/${p.slug}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {p.title}
          </Link>
        </h3>

        <p className="text-sm text-[var(--color-fg-muted)] mb-2 leading-relaxed">
          {p.authors.map((a, i) => (
            <span
              key={a}
              className={a === AUTHOR_NAME ? "font-semibold text-[var(--color-fg)]" : ""}
            >
              {a}
              {i < p.authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>

        <p className="text-sm text-[var(--color-fg)] font-medium mb-3">{p.venue}</p>

        <ul className="flex flex-wrap gap-2 text-xs">
          {p.arxiv_id && (
            <li>
              <a
                className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] border border-[var(--color-border)] transition-colors"
                href={`https://arxiv.org/abs/${p.arxiv_id}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                arXiv ↗
              </a>
            </li>
          )}
          {p.doi && (
            <li>
              <a
                className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] border border-[var(--color-border)] transition-colors"
                href={`https://doi.org/${p.doi}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                DOI ↗
              </a>
            </li>
          )}
          {p.pdf_url && (
            <li>
              <a
                className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] border border-[var(--color-border)] transition-colors"
                href={p.pdf_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                PDF ↗
              </a>
            </li>
          )}
          <li className="ml-auto">
            <Link
              href={`/publications/${p.slug}`}
              className="inline-flex items-center px-2 py-1 rounded-md text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] transition-colors font-medium"
            >
              Read →
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
}
