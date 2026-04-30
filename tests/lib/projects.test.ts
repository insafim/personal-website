import { describe, expect, it } from "vitest";
import type { Project } from "#site/content";
import { sortByYearDesc } from "../../lib/projects";

// Minimal Project shape used by the sort. The cast lets the test exercise
// the comparator without constructing a full Velite-shaped object for every
// other field, which would couple the test to schema additions unrelated to
// year ordering.
const stub = (slug: string, year: number) => ({ slug, year }) as unknown as Project;

describe("sortByYearDesc", () => {
  it("orders projects by year, newest first", () => {
    const out = sortByYearDesc([stub("a", 2021), stub("b", 2026), stub("c", 2024)]);
    expect(out.map((p) => p.year)).toEqual([2026, 2024, 2021]);
  });

  it("does not mutate the input array", () => {
    const input = [stub("a", 2021), stub("b", 2026)];
    const snapshot = input.map((p) => p.slug);
    sortByYearDesc(input);
    expect(input.map((p) => p.slug)).toEqual(snapshot);
  });

  it("returns an empty array when given no projects", () => {
    expect(sortByYearDesc([])).toEqual([]);
  });
});
