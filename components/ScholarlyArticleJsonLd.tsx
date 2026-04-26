import type { Publication } from "#site/content";
import { siteConfig } from "#site/content";
import { buildScholarlyArticleJsonLd, safeJsonLdString } from "@/lib/json-ld";

// US-031: feature-flagged ScholarlyArticle JSON-LD. Renders nothing when the flag is off.
export function ScholarlyArticleJsonLd({ publication }: { publication: Publication }) {
  if (!siteConfig.feature_flags.scholarly_article_jsonld) return null;
  const json = safeJsonLdString(buildScholarlyArticleJsonLd(publication));
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD pattern; safeJsonLdString escapes </script>.
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
