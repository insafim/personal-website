import Link from "next/link";
import type { Publication } from "#site/content";

const AUTHOR_NAME = "Insaf Ismath";

export function PublicationCard({ publication: p }: { publication: Publication }) {
  return (
    <article className="border-b border-[var(--color-border)] pb-4">
      <h3 className="text-lg font-semibold leading-tight mb-1">
        <Link href={`/publications/${p.slug}`} className="hover:text-[var(--color-accent)]">
          {p.title}
        </Link>
      </h3>
      <p className="text-sm text-[var(--color-fg-muted)] mb-2">
        {p.authors.map((a, i) => (
          <span key={a} className={a === AUTHOR_NAME ? "font-semibold text-[var(--color-fg)]" : ""}>
            {a}
            {i < p.authors.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p className="text-sm">
        <span className="font-medium">{p.venue}</span>{" "}
        <span className="text-[var(--color-fg-muted)]">
          · {p.year} · {p.type} · {p.authorship_order} author
        </span>
      </p>
      <ul className="flex flex-wrap gap-3 mt-2 text-xs">
        {p.arxiv_id && (
          <li>
            <a
              className="underline text-[var(--color-fg-muted)]"
              href={`https://arxiv.org/abs/${p.arxiv_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              arXiv
            </a>
          </li>
        )}
        {p.doi && (
          <li>
            <a
              className="underline text-[var(--color-fg-muted)]"
              href={`https://doi.org/${p.doi}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              DOI
            </a>
          </li>
        )}
        {p.pdf_url && (
          <li>
            <a
              className="underline text-[var(--color-fg-muted)]"
              href={p.pdf_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              PDF
            </a>
          </li>
        )}
      </ul>
    </article>
  );
}
