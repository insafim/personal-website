import type { Project } from "#site/content";

export type ProjectAffiliation = Project["affiliation"];

// Display order for any future filtering UI: most-frequent-first puts the
// orgs the user worked with most at the top of a select. Not a hard
// sort key for the projects index (that one is year desc, flat).
export const AFFILIATIONS: ReadonlyArray<{ key: ProjectAffiliation; label: string }> = [
  { key: "2PointZero Group", label: "2PointZero Group" },
  { key: "MBZUAI", label: "MBZUAI" },
  { key: "UoP", label: "UoP" },
  { key: "VisionLabs", label: "VisionLabs" },
  { key: "Independent", label: "Independent" },
];

export function sortByYearDesc(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}
