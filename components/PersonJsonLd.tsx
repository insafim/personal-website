import { buildPersonJsonLd, safeJsonLdString } from "@/lib/json-ld";

export function PersonJsonLd() {
  const json = safeJsonLdString(buildPersonJsonLd());
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection is the canonical pattern; safeJsonLdString escapes </script>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
