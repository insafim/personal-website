import type { Publication } from "#site/content";

export function sortByYearDesc(pubs: readonly Publication[]): Publication[] {
  return [...pubs].sort((a, b) => b.year - a.year);
}
