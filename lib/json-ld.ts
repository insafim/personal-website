import type { Publication } from "#site/content";
import { person, siteConfig } from "#site/content";

export interface PersonJsonLd {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  affiliation?: { "@type": "Organization"; name: string };
  address?: { "@type": "PostalAddress"; addressLocality: string };
  sameAs: string[];
}

export function buildPersonJsonLd(): PersonJsonLd {
  const sameAs: string[] = [
    person.github_url,
    person.scholar_url,
    person.linkedin_url,
    ...(person.orcid_id ? [`https://orcid.org/${person.orcid_id}`] : []),
    ...(person.arxiv_author_url ? [person.arxiv_author_url] : []),
    ...(person.additional_social_links?.map((s) => s.url) ?? []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    url: siteConfig.site_url,
    image: `${siteConfig.site_url}${person.avatar_url}`,
    ...(person.affiliation
      ? { affiliation: { "@type": "Organization" as const, name: person.affiliation } }
      : {}),
    address: { "@type": "PostalAddress", addressLocality: person.location },
    sameAs,
  };
}

// US-031 (could-have, gated by siteConfig.feature_flags.scholarly_article_jsonld).
export interface ScholarlyArticleJsonLd {
  "@context": "https://schema.org";
  "@type": "ScholarlyArticle";
  headline: string;
  author: Array<{ "@type": "Person"; name: string }>;
  datePublished: string;
  isPartOf: { "@type": "Periodical"; name: string };
  identifier?: string[];
  url: string;
  abstract: string;
}

export function buildScholarlyArticleJsonLd(pub: Publication): ScholarlyArticleJsonLd {
  const identifiers: string[] = [];
  if (pub.arxiv_id) identifiers.push(`arXiv:${pub.arxiv_id}`);
  if (pub.doi) identifiers.push(`doi:${pub.doi}`);

  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    author: pub.authors.map((name) => ({ "@type": "Person" as const, name })),
    datePublished: String(pub.year),
    isPartOf: { "@type": "Periodical", name: pub.venue },
    ...(identifiers.length ? { identifier: identifiers } : {}),
    url: `${siteConfig.site_url}/publications/${pub.slug}`,
    abstract: pub.abstract,
  };
}

// Safe stringify: escape </script> sequences inside JSON before injecting in <script>.
export function safeJsonLdString(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\/script>/gi, "<\\/script>");
}
