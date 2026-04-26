import rehypeShiki from "@shikijs/rehype";
import { defineCollection, defineConfig, s } from "velite";

// Shared field shapes
const externalUrl = s.string().url();
const relativePath = s.string().regex(/^\//, "must be a relative path starting with /");
const slug = s.slug("global");

// Entity 1 — Person (singleton)
const person = defineCollection({
  name: "Person",
  pattern: "person.mdx",
  single: true,
  schema: s
    .object({
      name: s.string(),
      title: s.string(),
      location: s.string(),
      affiliation: s.string().optional(),
      specializations: s.array(s.string()).min(1),
      bio_short: s.string().min(1).max(280),
      bio_long: s.mdx(),
      career_timeline: s
        .array(
          s.object({
            year_range: s.string(),
            role: s.string(),
            org: s.string(),
            summary: s.string(),
          })
        )
        .min(1),
      avatar_url: s.string(),
      og_image_default: s.string(),
      email_obfuscated: s.string().min(1),
      github_url: externalUrl,
      scholar_url: externalUrl,
      linkedin_url: externalUrl,
      orcid_id: s.string().optional(),
      arxiv_author_url: externalUrl.optional(),
      additional_social_links: s
        .array(s.object({ platform: s.string(), url: externalUrl }))
        .optional(),
    })
    .transform((data) => ({ ...data })),
});

// Entity 2 — Project
const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      slug,
      title: s.string(),
      category: s.enum(["enterprise", "research", "independent"]),
      status: s.enum(["shipped", "active", "archived", "in-progress"]),
      year: s.number().int(),
      problem: s.string(),
      approach: s.string(),
      role: s.string(),
      scale_metrics: s.array(s.object({ label: s.string(), value: s.string() })).optional(),
      tech_stack: s.array(s.string()).min(1),
      lessons_learned: s.string().optional(),
      github_url: externalUrl.optional(),
      external_links: s.array(s.object({ label: s.string(), url: externalUrl })).optional(),
      tags: s.array(s.string()).optional(),
      cover_image: s.string().optional(),
      og_image: s.string().optional(),
      body_mdx: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/projects/${data.slug}` })),
});

// Entity 3 — Publication (with at-least-one-of arxiv_id|doi|pdf_url refinement
// per NFR-026 + ADR-012 + SEC-007 pdf_license enum when local PDF mirrored)
const publications = defineCollection({
  name: "Publication",
  pattern: "publications/**/*.mdx",
  schema: s
    .object({
      slug,
      title: s.string(),
      authors: s.array(s.string()).min(1),
      authorship_order: s.enum(["first", "co-first", "middle", "senior", "last", "corresponding"]),
      venue: s.string(),
      year: s.number().int(),
      type: s.enum(["conference", "journal", "workshop", "preprint", "thesis", "tech-report"]),
      abstract: s.string().min(1),
      contribution_summary: s.string().min(1),
      arxiv_id: s.string().optional(),
      doi: s.string().optional(),
      pdf_url: s.string().optional(),
      pdf_license: s
        .enum(["arxiv", "author-accepted-manuscript", "cc-by", "cc-by-nc", "public-domain"])
        .optional(),
      bibtex: s.string().min(1),
      code_repo_url: externalUrl.optional(),
      related_project_id: s.string().optional(),
      tags: s.array(s.string()).optional(),
      extended_abstract_mdx: s.mdx().optional(),
      og_image: s.string().optional(),
    })
    .superRefine((data, ctx) => {
      // NFR-026: at least one of arxiv_id, doi, pdf_url must be present
      if (!data.arxiv_id && !data.doi && !data.pdf_url) {
        ctx.addIssue({
          code: "custom",
          message: "Publication must include at least one of: arxiv_id, doi, pdf_url (NFR-026)",
          path: ["arxiv_id"],
        });
      }
      // SEC-007: locally-mirrored PDFs require explicit license tag
      if (data.pdf_url?.startsWith("/assets/pdfs/") && !data.pdf_license) {
        ctx.addIssue({
          code: "custom",
          message:
            "Locally-mirrored PDF (pdf_url under /assets/pdfs/) requires pdf_license: one of arxiv | author-accepted-manuscript | cc-by | cc-by-nc | public-domain (SEC-007)",
          path: ["pdf_license"],
        });
      }
    })
    .transform((data) => ({ ...data, permalink: `/publications/${data.slug}` })),
});

// Entity 4 — Resource
const resources = defineCollection({
  name: "Resource",
  pattern: "resources/**/*.mdx",
  schema: s.object({
    title: s.string(),
    kind: s.enum(["talk", "repo", "model", "writing"]),
    url: externalUrl,
    why_this_matters: s.string().min(1),
    year: s.number().int().optional(),
    tags: s.array(s.string()).optional(),
    reading_order: s.number().int().optional(),
  }),
});

// Entity 5 — Hobby
const hobbies = defineCollection({
  name: "Hobby",
  pattern: "hobbies/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    anecdotes: s.array(s.string()).min(1),
    icon: s.string().optional(),
    order: s.number().int().optional(),
  }),
});

// Entity 6 — Redirect (relative-path-only — SEC-003 open-redirect mitigation)
const redirects = defineCollection({
  name: "Redirect",
  pattern: "redirects.yaml",
  single: true,
  schema: s
    .object({
      entries: s.array(
        s.object({
          from_path: relativePath,
          to_path: relativePath,
          status_code: s.union([s.literal(301), s.literal(302), s.literal(308)]),
          reason: s.string().optional(),
        })
      ),
    })
    .superRefine((data, ctx) => {
      // No duplicate from_path
      const seen = new Set<string>();
      for (const [i, e] of data.entries.entries()) {
        if (seen.has(e.from_path)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate redirect from_path: ${e.from_path}`,
            path: ["entries", i, "from_path"],
          });
        }
        seen.add(e.from_path);
      }
    }),
});

// Entity 7 — NavigationItem (lives inside site-config.yaml's nav array)
// (defined inline as part of site-config below)

// Entity 8 — SiteConfig (singleton)
const siteConfig = defineCollection({
  name: "SiteConfig",
  pattern: "site-config.yaml",
  single: true,
  schema: s.object({
    site_url: externalUrl,
    site_name: s.string(),
    default_locale: s.string().default("en"),
    analytics_domain: s.string().optional(),
    feature_flags: s.object({
      analytics_enabled: s.boolean().default(false),
      search: s.boolean().default(false),
      reading_order: s.boolean().default(false),
      broken_link_audit: s.boolean().default(false),
      demo_embeds: s.boolean().default(false),
      scholarly_article_jsonld: s.boolean().default(false),
    }),
    ai_crawler_allowlist: s.array(s.string()).min(1),
    nav: s
      .object({
        primary: s.array(
          s.object({
            label: s.string(),
            href: relativePath,
            order: s.number().int(),
          })
        ),
        footer: s.array(
          s.object({
            label: s.string(),
            href: s.string(),
            order: s.number().int(),
            external: s.boolean().default(false),
          })
        ),
        social: s.array(
          s.object({
            label: s.string(),
            href: externalUrl,
            order: s.number().int(),
          })
        ),
      })
      .optional(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { person, projects, publications, resources, hobbies, redirects, siteConfig },
  mdx: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: { light: "github-light-default", dark: "github-dark-default" },
          defaultColor: false,
          // CSS variables transform — single HTML pass, dual theme via --shiki-light / --shiki-dark
        },
      ],
    ],
  },
});
