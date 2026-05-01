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
  // Single pass over hobbies: assert primary `logo` and any `partner_logos`.
  // Partner logos carry the same broken-image risk as primary logos -- the
  // velite schema only validates the leading-slash, not file existence -- so
  // a typo or deleted asset would render as a broken chip in the "With" strip
  // on the Beyond page just as silently as a broken primary logo would.
  for (const h of hobbies) {
    if (h.logo) {
      it(`hobby "${h.title}" -> ${h.logo} exists`, () => {
        expect(existsSync(join(publicRoot, h.logo as string))).toBe(true);
      });
    }
    if (h.partner_logos) {
      for (const partnerPath of h.partner_logos) {
        it(`hobby "${h.title}" partner -> ${partnerPath} exists`, () => {
          expect(existsSync(join(publicRoot, partnerPath))).toBe(true);
        });
      }
    }
  }
});
