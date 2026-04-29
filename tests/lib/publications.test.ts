import { describe, expect, it } from "vitest";
import { buildProseCitation, isSelfAuthor } from "../../lib/publications";

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

  // Production MDX uses these author-name shapes. Pinning them in unit tests
  // catches a regression where buildProseCitation is wired to use isSelfAuthor
  // (which would collapse all aliases to a single bucket) instead of the
  // last-whitespace-token surname extraction the prose citation pattern uses.
  it("handles 'Mohamed Insaf Ismithdeen' (multi-author) producing 'Ismithdeen, et al.'", () => {
    const out = buildProseCitation(
      make({
        authors: ["Mohamed Insaf Ismithdeen", "Other"],
        title: "Promptception",
        venue: "EMNLP",
        year: 2025,
      }) as never
    );
    expect(out).toBe('Ismithdeen, et al., "Promptception", EMNLP, 2025.');
  });

  it("handles initials-only 'I. M. Insaf' by taking 'Insaf' as the surname token", () => {
    const out = buildProseCitation(
      make({ authors: ["I. M. Insaf"], title: "GHI", venue: "ICIIS", year: 2021 }) as never
    );
    expect(out).toBe('Insaf, "GHI", ICIIS, 2021.');
  });
});

describe("isSelfAuthor", () => {
  // The alias list in lib/publications.ts is the single source of truth for
  // bold-byline rendering across PublicationCard and the detail page; this
  // suite locks the contract so adding/removing an alias is an explicit edit.
  it("matches the canonical short name", () => {
    expect(isSelfAuthor("Insaf Ismath")).toBe(true);
  });

  it("matches the full legal name as it appears in the CVPR/Promptception MDX", () => {
    expect(isSelfAuthor("Mohamed Insaf Ismithdeen")).toBe(true);
  });

  it("matches the IEEE-initials byline used in the ICIIS papers", () => {
    expect(isSelfAuthor("I. M. Insaf")).toBe(true);
  });

  it("does not match unrelated co-authors", () => {
    expect(isSelfAuthor("Other Person")).toBe(false);
    expect(isSelfAuthor("Ashshak Sharifdeen")).toBe(false);
  });

  it("is case-sensitive (matches the rendered byline exactly, no normalisation)", () => {
    expect(isSelfAuthor("insaf ismath")).toBe(false);
  });
});
