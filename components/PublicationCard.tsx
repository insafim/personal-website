import Link from "next/link";
import type { Publication } from "#site/content";
import { isSelfAuthor } from "@/lib/publications";

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

/*
 * Distill-style TYPE badges (verified at https://distill.pub).
 *
 * Three-tier palette so the badge communicates editorial weight at a glance:
 *  - Peer-reviewed venues (conference, journal) take the accent tint - the
 *    strongest signal of credibility and the most common case.
 *  - Workshop sits between peer-reviewed and unreviewed and gets a neutral
 *    raised surface so it reads as "reviewed but lighter".
 *  - Preprint / thesis / tech-report stay on the muted bg-subtle palette so
 *    they don't compete with the first-author research accent bar that
 *    already sits to the left of the card.
 *
 * Risk note from .claude/research/personal-websites-inspiration.md (§6):
 * use --color-fg-muted border on non-distinguishing types; reserve the
 * accent fill for the strong tier only.
 */
// Exported so unit tests in tests/lib/ can verify the palette contract
// (peer-reviewed types use accent-soft; others don't) without depending on
// the publication content fixture, which today is conference-only.
export const TYPE_PALETTE: Record<Publication["type"], string> = {
  conference:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/30",
  journal:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/30",
  workshop:
    "bg-[var(--color-bg-raised)] text-[var(--color-fg)] border-[var(--color-border-strong)]",
  preprint: "bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border-[var(--color-border)]",
  thesis: "bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border-[var(--color-border)]",
  "tech-report":
    "bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border-[var(--color-border)]",
};

export function PublicationCard({ publication: p }: { publication: Publication }) {
  const isFirst = p.authorship_order === "first" || p.authorship_order === "co-first";

  return (
    <article className="surface-elevated is-interactive relative p-5 md:p-6 overflow-hidden">
      {/*
       * Research accent bar renders on every card. The "First author" badge
       * carries the authorship signal; the bar is now a flat-list visual
       * rhythm cue rather than an authorship marker.
       */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-[var(--color-research)]"
      />
      <div className="pl-3">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/*
           * data-pub-type is a load-bearing e2e selector - see
           * tests/e2e/smoke.spec.ts for the assertion contract. Don't remove.
           */}
          <span
            data-pub-type={p.type}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border ${TYPE_PALETTE[p.type]}`}
          >
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
            <span key={a} className={isSelfAuthor(a) ? "font-semibold text-[var(--color-fg)]" : ""}>
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
          {p.code_repo_url && (
            <li>
              <a
                className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] border border-[var(--color-border)] transition-colors"
                href={p.code_repo_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Code ↗
              </a>
            </li>
          )}
          {p.project_page_url && (
            <li>
              <a
                className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] border border-[var(--color-border)] transition-colors"
                href={p.project_page_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Website ↗
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
