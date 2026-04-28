import { describe, expect, it } from "vitest";
import { z } from "zod";

// Re-derive the Publication refinement contract for unit testing without
// importing velite.config.ts (which has side effects). Mirrors velite.config.ts
// exactly per ADR-012 - keep in sync.
const publicationRefinement = z
  .object({
    arxiv_id: z.string().optional(),
    doi: z.string().optional(),
    pdf_url: z.string().optional(),
    pdf_license: z
      .enum(["arxiv", "author-accepted-manuscript", "cc-by", "cc-by-nc", "public-domain"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.arxiv_id && !data.doi && !data.pdf_url) {
      ctx.addIssue({
        code: "custom",
        message: "Publication must include at least one of: arxiv_id, doi, pdf_url (NFR-026)",
        path: ["arxiv_id"],
      });
    }
    if (data.pdf_url?.startsWith("/assets/pdfs/") && !data.pdf_license) {
      ctx.addIssue({
        code: "custom",
        message:
          "Locally-mirrored PDF (pdf_url under /assets/pdfs/) requires pdf_license: one of arxiv | author-accepted-manuscript | cc-by | cc-by-nc | public-domain (SEC-007)",
        path: ["pdf_license"],
      });
    }
  });

describe("Publication schema (NFR-026 + SEC-007)", () => {
  it("rejects publication missing all external identifiers", () => {
    const result = publicationRefinement.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(" ");
      expect(messages).toMatch(/arxiv_id/);
      expect(messages).toMatch(/doi/);
      expect(messages).toMatch(/pdf_url/);
      expect(messages).toMatch(/NFR-026/);
    }
  });

  it("accepts publication with only arxiv_id (positive case)", () => {
    const result = publicationRefinement.safeParse({ arxiv_id: "2406.00000" });
    expect(result.success).toBe(true);
  });

  it("accepts publication with only doi", () => {
    const result = publicationRefinement.safeParse({ doi: "10.1234/xyz" });
    expect(result.success).toBe(true);
  });

  it("rejects locally-mirrored PDF without pdf_license (SEC-007)", () => {
    const result = publicationRefinement.safeParse({
      pdf_url: "/assets/pdfs/sample.pdf",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join(" ");
      expect(messages).toMatch(/pdf_license/);
      expect(messages).toMatch(/SEC-007/);
    }
  });

  it("accepts locally-mirrored PDF with pdf_license", () => {
    const result = publicationRefinement.safeParse({
      pdf_url: "/assets/pdfs/sample.pdf",
      pdf_license: "author-accepted-manuscript",
    });
    expect(result.success).toBe(true);
  });
});
