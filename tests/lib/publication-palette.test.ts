// Verifies the TYPE_PALETTE contract for PublicationCard chip styling.
// Content-independent: this catches mutations the e2e test can't reach when
// the live content fixture is single-tier (currently all conferences).
//
// Source convention: .claude/research/personal-websites-inspiration.md (§6)
// (Distill-style three-tier badge palette).
import { describe, expect, it } from "vitest";
import { TYPE_PALETTE } from "../../components/PublicationCard";

const PEER_REVIEWED: ReadonlyArray<keyof typeof TYPE_PALETTE> = ["conference", "journal"];
const NON_PEER_REVIEWED: ReadonlyArray<keyof typeof TYPE_PALETTE> = [
  "workshop",
  "preprint",
  "thesis",
  "tech-report",
];

describe("TYPE_PALETTE", () => {
  it("covers every Publication type with no missing keys", () => {
    const expected = [...PEER_REVIEWED, ...NON_PEER_REVIEWED] as const;
    for (const key of expected) {
      expect(TYPE_PALETTE[key]).toBeTruthy();
      expect(typeof TYPE_PALETTE[key]).toBe("string");
    }
    expect(Object.keys(TYPE_PALETTE).sort()).toEqual([...expected].sort());
  });

  it("uses --color-accent-soft on every peer-reviewed type", () => {
    for (const key of PEER_REVIEWED) {
      expect(TYPE_PALETTE[key]).toContain("color-accent-soft");
    }
  });

  it("does NOT use --color-accent-soft on any non-peer-reviewed type", () => {
    // This is the contract the e2e negative branch couldn't enforce when
    // content was conference-only. Mutation: applying the accent palette to
    // every type fails this assertion deterministically.
    for (const key of NON_PEER_REVIEWED) {
      expect(TYPE_PALETTE[key]).not.toContain("color-accent-soft");
    }
  });

  it("uses the muted bg-subtle palette on preprint / thesis / tech-report", () => {
    for (const key of ["preprint", "thesis", "tech-report"] as const) {
      expect(TYPE_PALETTE[key]).toContain("color-bg-subtle");
      expect(TYPE_PALETTE[key]).toContain("color-fg-muted");
    }
  });

  it("uses the bg-raised tier specifically on workshop", () => {
    expect(TYPE_PALETTE.workshop).toContain("color-bg-raised");
    expect(TYPE_PALETTE.workshop).not.toContain("color-bg-subtle");
  });
});
