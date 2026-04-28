import { describe, expect, it } from "vitest";
import { buildProseCitation } from "../../lib/publications";

// Minimal stand-in for the Publication shape - only fields buildProseCitation reads.
type CitableLike = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
};

const make = (over: Partial<CitableLike> = {}): CitableLike => ({
  title: "A Gentle Introduction to Graph Neural Networks",
  authors: ["Insaf Ismath", "Jane Doe", "John Smith"],
  venue: "Distill",
  year: 2026,
  ...over,
});

describe("buildProseCitation", () => {
  it("uses 'et al.' for multi-author publications and quotes the title", () => {
    const out = buildProseCitation(make() as never);
    expect(out).toBe('Ismath, et al., "A Gentle Introduction to Graph Neural Networks", Distill, 2026.');
  });

  it("renders single-author publications without 'et al.'", () => {
    const out = buildProseCitation(make({ authors: ["Insaf Ismath"] }) as never);
    expect(out).toBe('Ismath, "A Gentle Introduction to Graph Neural Networks", Distill, 2026.');
  });

  it("uses last whitespace-separated token as the surname", () => {
    const out = buildProseCitation(
      make({ authors: ["Andrej Karpathy", "Other"], title: "Foo", venue: "ICML", year: 2017 }) as never
    );
    expect(out).toBe('Karpathy, et al., "Foo", ICML, 2017.');
  });

  it("falls back gracefully when authors are empty", () => {
    const out = buildProseCitation(
      make({ authors: [], title: "Foo", venue: "ICML", year: 2017 }) as never
    );
    expect(out).toBe('"Foo", ICML, 2017.');
  });

  it("uses 'et al.' at the exact length===2 boundary (not just 3+)", () => {
    const out = buildProseCitation(
      make({ authors: ["Insaf Ismath", "Other Person"], title: "T", venue: "V", year: 2024 }) as never
    );
    expect(out).toBe('Ismath, et al., "T", V, 2024.');
  });

  it("picks last token (surname) on a single-author compound name where first != last", () => {
    const out = buildProseCitation(
      make({ authors: ["Andrej Karpathy"], title: "Foo", venue: "ICML", year: 2017 }) as never
    );
    expect(out).toBe('Karpathy, "Foo", ICML, 2017.');
  });

  it("preserves hyphenated surnames as a single token", () => {
    const out = buildProseCitation(
      make({ authors: ["Benjamin Sanchez-Lengeling"], title: "X", venue: "Distill", year: 2021 }) as never
    );
    expect(out).toBe('Sanchez-Lengeling, "X", Distill, 2021.');
  });
});
