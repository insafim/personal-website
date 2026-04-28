// Unit tests for lib/timeline.ts: the slug-resolution + sort layer between
// Velite collections and the About page timelines. Catches mutations the e2e
// suite cannot precisely surface (a missing slug shows up as an SSR timeout,
// not an assertion failure; an order regression renders silently).
import { describe, expect, it } from "vitest";
import {
  getCareerRows,
  getEducationRows,
  lookup,
} from "../../lib/timeline";

describe("lookup", () => {
  const items = [
    { slug: "alpha", value: 1 },
    { slug: "beta", value: 2 },
    { slug: "gamma", value: 3 },
  ];

  it("returns the matching entry when the slug exists", () => {
    expect(lookup(items, "beta", "items")).toEqual({ slug: "beta", value: 2 });
  });

  it("throws a descriptive error naming both context and slug when missing", () => {
    expect(() => lookup(items, "delta", "companies")).toThrow(
      /companies: no entry with slug "delta"/
    );
    expect(() => lookup(items, "delta", "companies")).toThrow(
      /Add content\/companies\/delta\.yaml/
    );
  });

  it("treats slug match as case-sensitive (mutation: case-insensitive lookup)", () => {
    expect(() => lookup(items, "ALPHA", "items")).toThrow(/no entry with slug/);
  });

  it("returns the FIRST match if duplicate slugs exist (deterministic)", () => {
    const dupes = [
      { slug: "x", n: 1 },
      { slug: "x", n: 2 },
    ];
    expect(lookup(dupes, "x", "dupes").n).toBe(1);
  });
});

describe("getCareerRows", () => {
  it("returns at least 2 rows for the live content fixture (matches smoke floor)", () => {
    // Floor mirrors the smoke test's `>= 2` so a yaml deletion that escapes
    // the e2e suite (e.g. CI without a dev server) still fails this unit test.
    expect(getCareerRows().length).toBeGreaterThanOrEqual(2);
  });

  it("returns rows sorted by order ascending (smaller order = earlier in list)", () => {
    const rows = getCareerRows();
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.order).toBeGreaterThanOrEqual(rows[i - 1]!.order);
    }
  });

  it("resolves each entry's company slug to a Company object with name + slug", () => {
    for (const row of getCareerRows()) {
      expect(row.company).toBeTruthy();
      expect(typeof row.company.name).toBe("string");
      expect(typeof row.company.slug).toBe("string");
      expect(row.company.name.length).toBeGreaterThan(0);
    }
  });
});

describe("getEducationRows", () => {
  it("returns at least one row for the live content fixture", () => {
    expect(getEducationRows().length).toBeGreaterThanOrEqual(1);
  });

  it("returns rows sorted by order ascending", () => {
    const rows = getEducationRows();
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.order).toBeGreaterThanOrEqual(rows[i - 1]!.order);
    }
  });

  it("resolves each entry's school slug to a School object with name + slug", () => {
    for (const row of getEducationRows()) {
      expect(row.school).toBeTruthy();
      expect(typeof row.school.name).toBe("string");
      expect(typeof row.school.slug).toBe("string");
      expect(row.school.name.length).toBeGreaterThan(0);
    }
  });
});
