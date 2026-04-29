import { describe, expect, it } from "vitest";
import { isSelfAuthor } from "../../lib/publications";

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
