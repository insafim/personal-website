// Verifies the status → pulse-class contract for ProjectCard's status dot.
// Content-independent: this catches mutation that the e2e test cannot reach
// when the live content fixture has no active-status projects (all current
// projects ship with status:"shipped").
import { describe, expect, it } from "vitest";
import { activeDotPulseClass } from "../../components/ProjectCard";

describe("activeDotPulseClass", () => {
  it("returns the motion-safe pulse class for status='active'", () => {
    expect(activeDotPulseClass("active")).toBe("motion-safe:animate-pulse");
  });

  it("returns an empty string for every non-active status", () => {
    // Mutation: applying the pulse to shipped/archived/in-progress dots would
    // turn the live signal into noise. Every non-active branch must be empty.
    for (const s of ["shipped", "archived", "in-progress"] as const) {
      expect(activeDotPulseClass(s)).toBe("");
    }
  });
});
