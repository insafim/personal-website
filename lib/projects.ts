import type { Project } from "#site/content";

export type ProjectCategory = "enterprise" | "research" | "independent";

export const CATEGORIES: ReadonlyArray<{ key: ProjectCategory; label: string }> = [
  { key: "enterprise", label: "Enterprise" },
  { key: "research", label: "Research" },
  { key: "independent", label: "Independent" },
];

export function groupByCategory(projects: readonly Project[]): Record<ProjectCategory, Project[]> {
  const out: Record<ProjectCategory, Project[]> = {
    enterprise: [],
    research: [],
    independent: [],
  };
  for (const p of projects) out[p.category].push(p);
  for (const k of Object.keys(out) as ProjectCategory[]) {
    out[k].sort((a, b) => b.year - a.year);
  }
  return out;
}
