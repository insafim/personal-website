import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publications } from "#site/content";
import { BibTeXBlock } from "@/components/BibTeXBlock";
import { ScholarlyArticleJsonLd } from "@/components/ScholarlyArticleJsonLd";
import { buildMetadata } from "@/lib/metadata";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return publications.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pub = publications.find((p) => p.slug === slug);
  if (!pub) return {};
  return buildMetadata({
    path: `/publications/${slug}`,
    title: pub.title,
    description: pub.abstract.slice(0, 200),
    type: "article",
  });
}

export default async function PublicationDetailPage({ params }: Params) {
  const { slug } = await params;
  const pub = publications.find((p) => p.slug === slug);
  if (!pub) notFound();

  return (
    <article className="px-4 py-12 max-w-3xl mx-auto">
      <header className="mb-6">
        <p className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
          {pub.venue} · {pub.year} · {pub.type}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{pub.title}</h1>
        <p className="text-[var(--color-fg-muted)]">
          {pub.authors.map((a) => (
            <span
              key={a}
              className={a === "Insaf Ismath" ? "font-semibold text-[var(--color-fg)]" : ""}
            >
              {a}
              {a !== pub.authors[pub.authors.length - 1] ? ", " : ""}
            </span>
          ))}{" "}
          <span className="text-xs uppercase tracking-wide opacity-70">
            ({pub.authorship_order} author)
          </span>
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
          Abstract
        </h2>
        <p>{pub.abstract}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
          Contribution
        </h2>
        <p>{pub.contribution_summary}</p>
      </section>

      <ul className="flex flex-wrap gap-3 mb-6 text-sm">
        {pub.arxiv_id && (
          <li>
            <a
              className="underline"
              href={`https://arxiv.org/abs/${pub.arxiv_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              arXiv:{pub.arxiv_id}
            </a>
          </li>
        )}
        {pub.doi && (
          <li>
            <a
              className="underline"
              href={`https://doi.org/${pub.doi}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              DOI:{pub.doi}
            </a>
          </li>
        )}
        {pub.pdf_url && (
          <li>
            <a className="underline" href={pub.pdf_url} rel="noopener noreferrer" target="_blank">
              PDF
            </a>
          </li>
        )}
        {pub.code_repo_url && (
          <li>
            <a
              className="underline"
              href={pub.code_repo_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              Code
            </a>
          </li>
        )}
      </ul>

      {/* US-028 extended landing: render extended_abstract_mdx when present. */}
      {pub.extended_abstract_mdx && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Extended abstract</h2>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX (build-time, author-controlled).
            dangerouslySetInnerHTML={{ __html: pub.extended_abstract_mdx }}
          />
        </section>
      )}

      <BibTeXBlock bibtex={pub.bibtex} />
      <ScholarlyArticleJsonLd publication={pub} />
    </article>
  );
}
