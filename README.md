# insafismath.com

Personal profile website for **Insaf Ismath** (AI/ML Engineer & Researcher) — about, projects, publications, resources, hobbies. Lives at [insafismath.com](https://insafismath.com).

Built with Next.js 16 (App Router) + React 19, Tailwind v4, TypeScript, and MDX content compiled by [Velite](https://velite.js.org/). Deployed on Vercel.

---

## Prerequisites

- **Node.js** `>= 20.18.0`
- **pnpm** `10.14.0` (pinned via `packageManager` in `package.json` — Corepack will pick it up automatically)
- **Git**

Enable Corepack so pnpm matches the pinned version:

```bash
corepack enable
```

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Build content (Velite compiles MDX once)
pnpm content:build

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> `next.config.mjs` runs `velite build` at config-load (with `watch: true` in development), so `pnpm dev` and `pnpm build` compile content automatically — the watcher is a side effect of loading the Next config, not part of the npm script itself. The standalone `pnpm content:build` is useful for content-only iteration or schema validation.

## Environment variables

Copy `.env.example` to `.env.local` and fill in. Production values are managed in the Vercel project dashboard.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin used for canonical tags, sitemap, JSON-LD, and OG metadata. Defaults to `https://insafismath.com`. |

`.env*.local` files are gitignored.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start Next.js dev server (Velite runs in watch mode automatically via `next.config.mjs`) |
| `pnpm build` | Production build (runs Velite, then `next build`) |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | Run Biome (lint + format check) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm content:build` | Compile MDX content with Velite |
| `pnpm content:dev` | Velite in watch mode |

End-to-end tests use Playwright:

```bash
pnpm exec playwright install --with-deps chromium
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm exec playwright test
```

## Project layout

```
app/                 # Next.js App Router routes (about, projects, publications, ...)
components/          # React components
lib/                 # Helpers (metadata, JSON-LD, fonts, content readers)
content/             # MDX source content
  profile.mdx          # Identity used on every page (name, photo, location, contact, social URLs)
  home.mdx             # Home page Hero content (specialization pills)
  about.mdx            # About page narrative (long bio markdown body)
  site-config.yaml     # Nav, social links, feature flags, AI crawler allowlist
  redirects.yaml       # URL redirects (compiled into next.config redirects)
  projects/            # One MDX file per project
  publications/        # One MDX file per publication
  resources/           # Talks, repos, models, writing
  hobbies/             # Padel, karting, running, football, etc.
  career/              # Career timeline entries
  education/           # Education entries
  schools/             # School records
  companies/           # Company records (logos, names, links)
public/              # Static assets
scripts/             # Build-time helpers (redirect validation, etc.)
tests/
  e2e/                 # Playwright specs
  schemas/             # Schema-level tests
  fixtures/            # Test fixtures
.velite/             # Generated content (gitignored)
.next/               # Build output (gitignored)
```

## Adding content

> Quick reference for non-developers: see [`docs/CONTENT.md`](docs/CONTENT.md) for a tighter "where do I edit X" cheatsheet. The detailed reference below is the source of truth.

All site content lives in `content/`. Most collections are MDX (frontmatter + body); a few timeline-style collections (career, education, schools, companies) are plain YAML. Velite validates content against the Zod schemas in `velite.config.ts`, and `pnpm content:build` will fail loudly on schema violations. The fastest workflow: copy an existing file in the same folder as a template, change the fields (and body, for MDX), save, and `pnpm dev` will hot-reload via the Velite watcher.

### Where each type of content lives

**Site-wide config**

| File | What it controls |
| --- | --- |
| `content/site-config.yaml` | Site name, nav order, social links, feature flags, AI crawler allowlist |
| `content/profile.mdx` | Site-wide identity: name, title, location, affiliation, photo, email, phone, social URLs, bio_short. Edit when contact info or photo changes. |
| `content/home.mdx` | Home page Hero content (specialization pills today). Edit when home-only content changes. |
| `content/about.mdx` | About page narrative (long bio markdown body). Edit when the about story changes. |
| `content/redirects.yaml` | URL redirects (compiled into `next.config.mjs`) |

**Section content (one file per entry)**

| Add a new... | Create file at | Template to copy |
| --- | --- | --- |
| Project | `content/projects/<slug>.mdx` | `content/projects/omorfia-gis.mdx` |
| Publication | `content/publications/<slug>.mdx` | `content/publications/promptception-emnlp2025.mdx` |
| Resource (talk, repo, writing) | `content/resources/<slug>.mdx` | `content/resources/sample-talk.mdx` |
| Hobby | `content/hobbies/<slug>.mdx` | `content/hobbies/padel.mdx` |
| Career timeline entry | `content/career/<slug>.yaml` | `content/career/2024-visionlabs-research-engineer.yaml` |
| Education entry | `content/education/<slug>.yaml` | `content/education/msc-mbzuai.yaml` |
| School record | `content/schools/<slug>.yaml` | `content/schools/mbzuai.yaml` |
| Company record | `content/companies/<slug>.yaml` | `content/companies/visionlabs.yaml` |

For collections with detail pages (projects, publications, resources, hobbies), the `<slug>` becomes the URL segment, e.g. `/projects/<slug>`. Keep those slugs lowercase, hyphenated, and stable, since changing one breaks inbound links unless you add a redirect to `content/redirects.yaml`. The career, education, schools, and companies collections do not produce routed pages, so their filenames are reference keys only.

### Where assets live

Static assets that go with content (images, PDFs, logos) belong under `public/assets/`:

```
public/assets/
  profile/         # Profile photos
  projects/        # Project hero images / screenshots
  publications/    # Publication thumbnails / PDFs
  companies/       # Company logos
  schools/         # School logos / crests
  orgs/            # Organisation logos (hobbies, clubs)
  cv/              # CV PDFs
```

Reference them from MDX with an absolute path, e.g. `/assets/projects/my-project.png`.

### Adding a new field to a collection

If you need a frontmatter field that doesn't exist yet, add it to the matching schema in `velite.config.ts`, then update content files to populate it, then run `pnpm content:build` to regenerate types. Routes in `app/` consume the typed output, so the new field becomes available there once the build succeeds.

## Redirects

Edit `content/redirects.yaml`; entries are compiled into Next.js redirects at build time by `next.config.mjs`. Run `pnpm exec tsx scripts/validate-redirects.ts` to lint the file.

## Deployment

The site deploys to **Vercel** on push to `main`.

1. In Vercel, **Add New → Project → Import** the GitHub repo. Vercel auto-detects Next.js, so leave the framework, build, and output settings at their defaults.
2. Add `NEXT_PUBLIC_SITE_URL=https://insafismath.com` to the **Production** environment. Use the Vercel preview URL (or omit) for **Preview**. Type the Key by hand rather than pasting; Vercel rejects keys with trailing whitespace or characters outside `[A-Z0-9_]`. The Value field is paste-safe.
3. Add the custom domains:
   - Add `insafismath.com` as a Production domain. **Uncheck** Vercel's default "Redirect insafismath.com to www.insafismath.com" checkbox; we want the apex as primary, not the redirect target. See [Apex vs www](#apex-vs-www-which-one-is-canonical) for the rationale.
   - Add `www.insafismath.com` separately, this time as `Redirect to Another Domain → insafismath.com` with redirect type **308 Permanent Redirect**.
   - Then point DNS at Vercel: see [Connecting the domain](#connecting-the-domain) below.

Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) are applied via `next.config.mjs`. Non-production deployments emit `X-Robots-Tag: noindex, nofollow` so previews don't get indexed.

### Apex vs www: which one is canonical

`insafismath.com` (the **apex**) is the canonical / primary host. `www.insafismath.com` is configured as a 308 permanent redirect to the apex. Reasons:

- **Code consistency.** `NEXT_PUBLIC_SITE_URL` is set to `https://insafismath.com`, and the canonical tags, `og:url` Open Graph metadata, JSON-LD, and every URL in `sitemap.xml` are derived from that env var. The primary serving host must match, or search engines see a contradiction between what the HTML claims is canonical and what is actually served.
- **Brevity.** `insafismath.com` is shorter on a CV, business card, or in conversation than `www.insafismath.com`.
- **Modern convention.** Most current platforms publish on the apex (`github.com`, `vercel.com`, `stripe.com`, `notion.so`). The `www.` prefix is a 1990s artifact from when organisations distinguished web servers (`www.`) from FTP (`ftp.`) and mail (`mail.`).
- **No technical drawback on Vercel.** The historical reason to prefer `www.` (DNS providers that did not allow CNAME on the apex, plus IP-pinning fragility) does not apply when DNS is delegated to Vercel nameservers, since Vercel resolves the apex internally.

If you ever want to flip the canonical to `www.`, three things have to change together: the `NEXT_PUBLIC_SITE_URL` env var, the primary domain in Vercel, and the redirect direction. None of them work in isolation.

### Connecting the domain

Pick **one** of the two options below depending on whether you want Vercel to run DNS for the domain.

> **DNS values below sourced from** [Vercel — Working with DNS](https://vercel.com/docs/domains/working-with-dns) (verified 2026-04-26). If Vercel changes them, the values shown in your project's **Settings → Domains** panel are authoritative — use those.

#### Option A — Vercel nameservers (simplest)

Best if you don't already host email or other services on this domain. Vercel manages everything.

1. **Vercel** → project → **Settings → Domains** → **Add Existing**. Add the domains in the order described in step 3 of [Deployment](#deployment) above (apex first as Production, then `www.` as a 308 redirect to the apex). Vercel's UI defaults to the apex-to-www redirect direction; uncheck that checkbox so the apex stays primary.
2. Vercel shows two nameservers, e.g. `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
3. At the **registrar** (where the domain was purchased), open the domain's settings → **Nameservers** → switch from "default" to "custom" → paste both Vercel nameservers → save.
4. Wait 5 min – 48 h for propagation. Vercel auto-issues a Let's Encrypt certificate once the domain resolves.

#### Option B — Keep the registrar's DNS

Use this if email (MX records) or other services live on the domain and shouldn't be migrated.

In the registrar's DNS panel, add:

| Type  | Name  | Value                  | Notes |
|-------|-------|------------------------|-------|
| A     | `@`   | `216.198.79.1`         | apex (current Vercel anycast IP; legacy `76.76.21.21` still resolves but is the deprecated address) |
| CNAME | `www` | `cname.vercel-dns.com` | www subdomain |

Some registrars don't allow CNAME on `@`; use the A record above for the apex. Some require a trailing dot (`cname.vercel-dns.com.`). The exact values shown in your project's **Settings → Domains → DNS Records** tab are authoritative; if Vercel migrates the range again, copy from there.

Then in **Vercel → Settings → Domains**, add both `insafismath.com` and `www.insafismath.com`. Vercel verifies the records and provisions TLS automatically.

#### After DNS is live

1. Confirm `NEXT_PUBLIC_SITE_URL=https://insafismath.com` is set on the **Production** environment in Vercel.
2. Trigger a redeploy (push a commit, or click **Redeploy** in Vercel) so the env var is baked in.
3. Verify:
   - `https://insafismath.com` loads.
   - `https://www.insafismath.com` redirects to the apex (or vice-versa, whichever you marked primary).
   - `https://insafismath.com/sitemap.xml` lists URLs with the correct origin.
   - `curl -I https://insafismath.com` shows the security headers from `next.config.mjs` (HSTS, CSP, etc.).

#### Gotchas

- **`www` cert pending** — usually means the CNAME hasn't propagated yet. Wait, then click **Refresh** in Vercel.
- **HSTS preload** — `next.config.mjs` sends `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Do **not** submit the domain to the [HSTS preload list](https://hstspreload.org/) until every subdomain you'll ever want is HTTPS-only — backing out is slow.
- **Slow propagation** — if previous DNS records had a long TTL (hours/days), propagation follows that old TTL, not the new record's TTL.
- **Env var key validation**: Vercel rejects environment variable keys that contain anything other than `[A-Z0-9_]` or that start with a digit. Pasting a key into the Vercel UI can carry trailing whitespace; type the key by hand if you hit an "invalid characters" error.
- **Vercel IP migration**: Vercel rotated its anycast IP from `76.76.21.21` to `216.198.79.1` during 2025. The legacy IP still resolves for backwards compatibility, but the DNS Records tab in your project's domain settings is the authoritative source for the value to use today.

### Day-to-day updates

After the initial setup, the production workflow is:

```bash
# 1. Edit content or code locally
$EDITOR content/projects/my-new-project.mdx

# 2. (optional) Sanity-check the build
pnpm content:build   # validates frontmatter against the Velite schema
pnpm dev             # live preview at http://localhost:3000

# 3. Commit and push
git add content/projects/my-new-project.mdx
git commit -m "add my-new-project"
git push origin main
```

Vercel watches the `main` branch and triggers a fresh build on every push. Builds take roughly 90 seconds. The previous deployment stays live until the new one succeeds, so a broken build cannot take the site down. Vercel sends an email on every deploy result.

For a content-only change, no other action is required. For a config change (e.g. a new env var, a redirect, a security header), set the value in Vercel's project settings before pushing the code that depends on it; otherwise the first build after the push will run without the new value.

## CI

Two GitHub Actions workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on PR and `main`: Biome lint, redirect validation, content build, typecheck, unit tests, Next.js build.
- **`lhci.yml`** — triggers on every Vercel `deployment_status` event; the job is gated by `if: state == 'success'`, so it only does work for successful deployments. Runs Lighthouse CI (median of 5) + Playwright smoke against the deployed URL. If you see runs marked "skipped," it's the state guard filtering out non-success events.

## License & attribution

Personal project. Source available at [github.com/insafim/personal-website](https://github.com/insafim/personal-website).
