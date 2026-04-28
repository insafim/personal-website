import rehypeShiki from "@shikijs/rehype";
import { defineCollection, defineConfig, s } from "velite";

// Shared field shapes
const externalUrl = s.string().url();
const relativePath = s.string().regex(/^\//, "must be a relative path starting with /");
const slug = s.slug("global");

// Entity 1: Person (singleton). Career and education rows live in their own
// per-file collections (career/, education/) so each role/degree is one small
// file and company/school logos can be reused across sections.
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
      bio_long: s.markdown(),
      avatar_url: s.string(),
      og_image_default: s.string(),
      email_obfuscated: s.string().min(1),
      // Optional phone in display format (digits and spaces, prefixed with +).
      // The contact page derives two hrefs from this single value:
      //   tel:    strips whitespace only (keeps the + prefix).
      //   wa.me/  strips all non-digits (drops the + as well; wa.me wants
      //           digits only after the slash).
      phone: s
        .string()
        .regex(/^\+[\d\s]+$/, "phone must start with + and contain only digits and spaces")
        .optional(),
      github_url: externalUrl,
      scholar_url: externalUrl,
      linkedin_url: externalUrl,
      orcid_id: s.string().optional(),
      arxiv_author_url: externalUrl.optional(),
      // Stable public URL for a downloadable CV (e.g. /assets/cv/insaf-cv.pdf).
      // Optional: when absent, the CV download link is hidden site-wide.
      cv_url: s.string().regex(/^\//, "cv_url must be a site-relative path starting with /").optional(),
      additional_social_links: s
        .array(s.object({ platform: s.string(), url: externalUrl }))
        .optional(),
    })
    .transform((data) => ({ ...data })),
});

// Entity 1a: Company (one file per organisation worked at). Referenced by
// career entries and, in future, project_meta / publication affiliations.
const companies = defineCollection({
  name: "Company",
  pattern: "companies/**/*.yaml",
  schema: s.object({
    slug: s.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
    name: s.string(),
    url: externalUrl.optional(),
    location: s.string().optional(),
    // Site-relative path to the logo image (e.g. /assets/companies/2pointzero.svg).
    // Optional: when absent, the timeline renders the org name only.
    logo: s.string().regex(/^\//, "logo must be a site-relative path starting with /").optional(),
    // Optional dark-mode variant. Provide a light-on-transparent version when
    // the default `logo` is dark-on-transparent (which would be invisible on
    // a dark surface). When set, the timeline shows `logo` in light mode and
    // `logo_dark` in dark mode, and the container uses the theme-aware bg.
    // When unset, the container falls back to .logo-frame-light so a single
    // PNG stays legible across themes.
    logo_dark: s
      .string()
      .regex(/^\//, "logo_dark must be a site-relative path starting with /")
      .optional(),
  }),
});

// Entity 1b: School (one file per institution). Same pattern as companies.
const schools = defineCollection({
  name: "School",
  pattern: "schools/**/*.yaml",
  schema: s.object({
    slug: s.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
    name: s.string(),
    url: externalUrl.optional(),
    location: s.string().optional(),
    logo: s.string().regex(/^\//, "logo must be a site-relative path starting with /").optional(),
    // See Company.logo_dark above for the dark-variant rationale.
    logo_dark: s
      .string()
      .regex(/^\//, "logo_dark must be a site-relative path starting with /")
      .optional(),
  }),
});

// Entity 1c: Career entry (one file per role). `company` is the slug of a
// content/companies/*.yaml file; cross-reference is validated at consumer time
// in lib/timeline.ts (Velite collections cannot superRefine across each other).
const career = defineCollection({
  name: "CareerEntry",
  pattern: "career/**/*.yaml",
  schema: s.object({
    // Display order on the timeline (1 = newest, ascending). Lets the user
    // reorder rows without renaming files or fiddling with dates.
    order: s.number().int().min(1),
    year_range: s.string(),
    role: s.string(),
    company: s.string().regex(/^[a-z0-9-]+$/, "company must be a kebab-case slug matching content/companies/*.yaml"),
    summary: s.string(),
    // Optional LinkedIn-style metadata; rendered as small chips next to the role.
    employment_type: s.string().optional(),  // e.g. "Internship", "Part-time", "Full-time"
    mode: s.string().optional(),             // e.g. "On-site", "Hybrid", "Remote"
  }),
});

// Entity 1d: Education entry (one file per degree). `school` is the slug of a
// content/schools/*.yaml file.
const education = defineCollection({
  name: "EducationEntry",
  pattern: "education/**/*.yaml",
  schema: s.object({
    order: s.number().int().min(1),
    year_range: s.string(),
    degree: s.string(),
    school: s.string().regex(/^[a-z0-9-]+$/, "school must be a kebab-case slug matching content/schools/*.yaml"),
    summary: s.string(),
    // Optional richer fields rendered as extra lines below the degree.
    grade: s.string().optional(),       // e.g. "3.95/4.00 (First Class Honors)"
    activities: s.string().optional(),  // e.g. "Founding President - MBZUAI Consulting Club"
  }),
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
      body_mdx: s.markdown(),
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
      extended_abstract_mdx: s.markdown().optional(),
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

// Entity 5 — Hobby (rendered under "Beyond"). Covers sports, leadership,
// extracurricular activities, and miscellaneous interests. Grouped by `category`
// on the page (app/hobbies/page.tsx); the schema leaves `category` optional and
// the page coerces missing values to "interest" so this collection has no
// uncategorised orphans at render time. The coercion lives in the page, not
// the schema — keep them in sync if a second consumer of `hobbies` is added.
const hobbies = defineCollection({
  name: "Hobby",
  pattern: "hobbies/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    anecdotes: s.array(s.string()).min(1),
    icon: s.string().optional(),
    order: s.number().int().optional(),
    category: s.enum(["sport", "leadership", "extracurricular", "interest"]).optional(),
    // Site-relative path to an org logo (e.g. /assets/orgs/aiesec.png).
    // Optional — when absent, the card's two-column header collapses to a
    // single column showing only the title; the accent bar on the left
    // remains unconditionally regardless of this field.
    logo: s.string().regex(/^\//, "logo must be a site-relative path starting with /").optional(),
    // See Company.logo_dark above for the dark-variant rationale.
    logo_dark: s
      .string()
      .regex(/^\//, "logo_dark must be a site-relative path starting with /")
      .optional(),
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
  collections: {
    person,
    companies,
    schools,
    career,
    education,
    projects,
    publications,
    resources,
    hobbies,
    redirects,
    siteConfig,
  },
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
