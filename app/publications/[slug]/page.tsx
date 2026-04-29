import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { publications } from "#site/content";
import { BibTeXBlock } from "@/components/BibTeXBlock";
import { PageIntro } from "@/components/PageIntro";
import { ScholarlyArticleJsonLd } from "@/components/ScholarlyArticleJsonLd";
import { buildMetadata } from "@/lib/metadata";
import { buildProseCitation, isSelfAuthor } from "@/lib/publications";

interface Params {
  params: Promise<{ slug: string }>;
}

const AUTHORSHIP_LABEL = {
  first: "First author",
  "co-first": "Co-first author",
  middle: "Contributing author",
  senior: "Senior author",
  last: "Last author",
  corresponding: "Corresponding author",
} as const;

const TYPE_LABEL = {
  conference: "Conference",
  journal: "Journal",
  workshop: "Workshop",
  preprint: "Preprint",
  thesis: "Thesis",
  "tech-report": "Tech report",
} as const;

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

  const links = [
    pub.arxiv_id
      ? { label: `arXiv ${pub.arxiv_id}`, href: `https://arxiv.org/abs/${pub.arxiv_id}` }
      : null,
    pub.doi ? { label: "DOI", href: `https://doi.org/${pub.doi}` } : null,
    pub.pdf_url ? { label: "PDF", href: pub.pdf_url } : null,
    pub.code_repo_url ? { label: "Code", href: pub.code_repo_url } : null,
    pub.project_page_url ? { label: "Website", href: pub.project_page_url } : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <div className="px-4 max-w-5xl mx-auto pt-12 pb-20">
      {pub.venue_logo && (
        <div className="mb-4 flex items-center">
          <span className="logo-frame-light inline-flex h-16 w-auto items-center justify-center rounded-md border border-[var(--color-border-strong)] px-3 py-2 shadow-[var(--shadow-card)]">
            <Image
              src={pub.venue_logo}
              alt={`${pub.venue} logo`}
              width={160}
              height={64}
              className="h-12 w-auto object-contain"
            />
          </span>
        </div>
      )}
      <PageIntro
        eyebrow={pub.venue}
        title={pub.title}
        description={pub.abstract}
        variant="accent"
        utility={
          <div className="flex flex-wrap gap-2 md:justify-end">
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1 text-sm text-[var(--color-fg-muted)]">
              {pub.year}
            </span>
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1 text-sm text-[var(--color-fg-muted)]">
              {TYPE_LABEL[pub.type]}
            </span>
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1 text-sm text-[var(--color-fg-muted)]">
              {AUTHORSHIP_LABEL[pub.authorship_order]}
            </span>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <section className="surface-elevated px-6 py-6 md:px-7 md:py-7">
          <p className="eyebrow mb-3">Authors</p>
          <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
            {pub.authors.map((a) => (
              <span
                key={a}
                className={isSelfAuthor(a) ? "font-semibold text-[var(--color-fg)]" : ""}
              >
                {a}
                {a !== pub.authors[pub.authors.length - 1] ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="metadata uppercase mt-4">{AUTHORSHIP_LABEL[pub.authorship_order]}</p>
        </section>

        <section className="surface-elevated px-6 py-6 md:px-7 md:py-7">
          <p className="eyebrow mb-3">Links</p>
          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-fg-muted)]">No external links available.</p>
          )}
        </section>
      </div>

      <section className="surface-accent px-6 py-7 md:px-8 md:py-9 mb-8">
        <p className="eyebrow mb-3">Contribution</p>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--color-fg)] md:text-lg">
          {pub.contribution_summary}
        </p>
      </section>

      {/* US-028 extended landing: render extended_abstract_mdx when present. */}
      {pub.extended_abstract_mdx && (
        <section className="mt-8">
          <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Extended abstract
          </h2>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none
                       prose-headings:display prose-headings:tracking-tight
                       prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
                       prose-p:leading-relaxed prose-p:text-[var(--color-fg)]
                       prose-strong:text-[var(--color-fg)] prose-strong:font-semibold
                       prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX (build-time, author-controlled).
            dangerouslySetInnerHTML={{ __html: pub.extended_abstract_mdx }}
          />
        </section>
      )}

      {/*
       * hide_bibtex (velite.config.ts) gates the BibTeX + "Cited as" block on
       * a per-publication basis. The bibtex field is still required by the
       * schema because it feeds SSG metadata + ScholarlyArticle JSON-LD; only
       * the visible UI block is suppressed.
       */}
      {!pub.hide_bibtex && <BibTeXBlock bibtex={pub.bibtex} citation={buildProseCitation(pub)} />}
      <ScholarlyArticleJsonLd publication={pub} />
    </div>
  );
}
