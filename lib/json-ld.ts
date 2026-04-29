import type { Publication } from "#site/content";
import { profile, siteConfig } from "#site/content";

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
    profile.github_url,
    profile.scholar_url,
    profile.linkedin_url,
    ...(profile.orcid_id ? [`https://orcid.org/${profile.orcid_id}`] : []),
    ...(profile.arxiv_author_url ? [profile.arxiv_author_url] : []),
    ...(profile.additional_social_links?.map((s) => s.url) ?? []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: siteConfig.site_url,
    image: `${siteConfig.site_url}${profile.avatar_url}`,
    ...(profile.affiliation
      ? { affiliation: { "@type": "Organization" as const, name: profile.affiliation } }
      : {}),
    address: { "@type": "PostalAddress", addressLocality: profile.location },
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
