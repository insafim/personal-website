// Verifies every `logo:` path declared in companies/*.yaml and schools/*.yaml
// resolves to a real file on disk under public/.
//
// The Velite schema only validates the leading-slash regex; it cannot check
// file existence. Without this test, a typo'd path or a deleted asset passes
// the build silently and renders as a broken image at runtime.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { companies, hobbies, schools } from "../../.velite";

const publicRoot = join(process.cwd(), "public");

describe("yaml logo paths resolve to real files under public/", () => {
  for (const c of companies) {
    if (!c.logo) continue;
    it(`company "${c.slug}" -> ${c.logo} exists`, () => {
      expect(existsSync(join(publicRoot, c.logo as string))).toBe(true);
    });
  }
  for (const s of schools) {
    if (!s.logo) continue;
    it(`school "${s.slug}" -> ${s.logo} exists`, () => {
      expect(existsSync(join(publicRoot, s.logo as string))).toBe(true);
    });
  }
  for (const h of hobbies) {
    if (!h.logo) continue;
    it(`hobby "${h.title}" -> ${h.logo} exists`, () => {
      expect(existsSync(join(publicRoot, h.logo as string))).toBe(true);
    });
  }
});
