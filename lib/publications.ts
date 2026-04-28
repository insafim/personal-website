import type { Publication } from "#site/content";

export function sortByYearDesc(pubs: readonly Publication[]): Publication[] {
  return [...pubs].sort((a, b) => b.year - a.year);
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
