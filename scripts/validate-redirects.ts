/**
 * F-004 T-016 — CI gate for content/redirects.yaml.
 * - Asserts to_path is relative (^/) — SEC-003 open-redirect mitigation.
 * - Asserts no duplicate from_path.
 * - (Optional, skipped here) HTTP 200 check would require a running build; deferred to e2e.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { z } from "zod";

const RedirectEntry = z.object({
  from_path: z.string().regex(/^\//, "from_path must start with /"),
  to_path: z.string().regex(/^\//, "to_path must start with / (no third-party redirects, SEC-003)"),
  status_code: z.union([z.literal(301), z.literal(302), z.literal(308)]),
  reason: z.string().optional(),
});

const RedirectsFile = z.object({ entries: z.array(RedirectEntry) }).superRefine((data, ctx) => {
  const seen = new Set<string>();
  for (const [i, e] of data.entries.entries()) {
    if (seen.has(e.from_path)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate from_path: ${e.from_path}`,
        path: ["entries", i, "from_path"],
      });
    }
    seen.add(e.from_path);
  }
});

const path = join(process.cwd(), "content", "redirects.yaml");
const raw = readFileSync(path, "utf8");
const parsed = yaml.load(raw);

const result = RedirectsFile.safeParse(parsed);
if (!result.success) {
  for (const issue of result.error.issues) {
    console.error(`${path}: ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`OK: ${result.data.entries.length} redirect entries validated`);
