import type { Publication } from "#site/content";

export function sortByYearDesc(pubs: readonly Publication[]): Publication[] {
  return [...pubs].sort((a, b) => b.year - a.year);
}

// Author-self-aliases. Bibliographies render Insaf's name in a few different
// shapes (full legal name, anglicised short name, IEEE-style initials), so
// equality matching against a single string would miss most rows. Order is
// not load-bearing (Array.includes scans the whole list); comparison is
// case-sensitive because author names in MDX are rendered exactly as they
// appear in the published byline.
const SELF_AUTHOR_ALIASES = ["Insaf Ismath", "Mohamed Insaf Ismithdeen", "I. M. Insaf"] as const;

export function isSelfAuthor(name: string): boolean {
  return SELF_AUTHOR_ALIASES.includes(name as (typeof SELF_AUTHOR_ALIASES)[number]);
}

// Distill-style prose citation rendered alongside BibTeX. Pattern:
// `Last, "Title", Venue, Year.` (single author) or `Last, et al., "Title", Venue, Year.` (multi).
// Source: https://distill.pub/2021/gnn-intro/ ("For attribution in academic contexts...")
export function buildProseCitation(pub: Publication): string {
  const firstAuthor = pub.authors[0];
  if (!firstAuthor) return `"${pub.title}", ${pub.venue}, ${pub.year}.`;
  const surname = firstAuthor.trim().split(/\s+/).pop() ?? firstAuthor;
  const authorClause = pub.authors.length === 1 ? surname : `${surname}, et al.`;
  return `${authorClause}, "${pub.title}", ${pub.venue}, ${pub.year}.`;
}
