import {
  career,
  companies,
  education,
  schools,
  type CareerEntry,
  type Company,
  type EducationEntry,
  type School,
} from "#site/content";

export type CareerRow = Omit<CareerEntry, "company"> & {
  company: Company;
};

export type EducationRow = Omit<EducationEntry, "school"> & {
  school: School;
};

// Fail-loud cross-reference: if a career row points at a company slug with no
// matching content/companies/*.yaml file, the build error here is more useful
// than a silently-missing logo at runtime.
// Exported for unit testing in tests/lib/timeline.test.ts; consumers of this
// module should call getCareerRows / getEducationRows, not lookup directly.
export function lookup<T extends { slug: string }>(
  collection: readonly T[],
  slug: string,
  context: string
): T {
  const found = collection.find((c) => c.slug === slug);
  if (!found) {
    throw new Error(
      `${context}: no entry with slug "${slug}". Add content/${context}/${slug}.yaml or fix the reference.`
    );
  }
  return found;
}

export function getCareerRows(): CareerRow[] {
  return [...career]
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      ...entry,
      company: lookup(companies, entry.company, "companies"),
    }));
}

export function getEducationRows(): EducationRow[] {
  return [...education]
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      ...entry,
      school: lookup(schools, entry.school, "schools"),
    }));
}
