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
  person.mdx           # Singleton — bio, social links, career timeline
  projects/            # One MDX file per project
  publications/        # One MDX file per publication
  resources/           # Talks, repos, models, writing
  hobbies/             # Padel, karting, running, football
  redirects.yaml       # URL redirects (compiled into next.config redirects)
  site-config.yaml     # Nav, social links, feature flags, AI crawler allowlist
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

All site content is MDX in `content/`. Velite validates frontmatter against the Zod schemas in `velite.config.ts` — `pnpm content:build` will fail loudly on schema violations.

- **New project** → `content/projects/<slug>.mdx`
- **New publication** → `content/publications/<slug>.mdx`
- **New resource** → `content/resources/<slug>.mdx`
- **New hobby** → `content/hobbies/<slug>.mdx`

Use the existing files (e.g. `content/projects/omorfia-gis.mdx`) as templates for required frontmatter fields.

Site-wide settings (nav order, social links, feature flags) live in `content/site-config.yaml`. Identity (bio, avatar, career timeline, social URLs) lives in `content/person.mdx`.

## Redirects

Edit `content/redirects.yaml`; entries are compiled into Next.js redirects at build time by `next.config.mjs`. Run `pnpm exec tsx scripts/validate-redirects.ts` to lint the file.

## Deployment

The site deploys to **Vercel** on push to `main`.

1. Connect the repo to a Vercel project.
2. Set `NEXT_PUBLIC_SITE_URL=https://insafismath.com` in **Production** environment variables. Use the Vercel preview URL (or omit) for **Preview**.
3. Add `insafismath.com` (and `www.insafismath.com`) as custom domains in Vercel — see [Connecting the domain](#connecting-the-domain) below.
4. Vercel auto-detects Next.js — no build/output overrides needed.

Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) are applied via `next.config.mjs`. Non-production deployments emit `X-Robots-Tag: noindex, nofollow` so previews don't get indexed.

### Connecting the domain

Pick **one** of the two options below depending on whether you want Vercel to run DNS for the domain.

> **DNS values below sourced from** [Vercel — Working with DNS](https://vercel.com/docs/domains/working-with-dns) (verified 2026-04-26). If Vercel changes them, the values shown in your project's **Settings → Domains** panel are authoritative — use those.

#### Option A — Vercel nameservers (simplest)

Best if you don't already host email or other services on this domain. Vercel manages everything.

1. **Vercel** → project → **Settings → Domains** → **Add** → enter `insafismath.com`. Add `www.insafismath.com` too; pick which one is primary (apex is conventional — Vercel auto-redirects `www` → apex).
2. Vercel shows two nameservers, e.g. `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
3. At the **registrar** (where the domain was purchased), open the domain's settings → **Nameservers** → switch from "default" to "custom" → paste both Vercel nameservers → save.
4. Wait 5 min – 48 h for propagation. Vercel auto-issues a Let's Encrypt certificate once the domain resolves.

#### Option B — Keep the registrar's DNS

Use this if email (MX records) or other services live on the domain and shouldn't be migrated.

In the registrar's DNS panel, add:

| Type  | Name  | Value                  | Notes |
|-------|-------|------------------------|-------|
| A     | `@`   | `76.76.21.21`          | apex → Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | www subdomain |

Some registrars don't allow CNAME on `@`; use the A record above for the apex. Some require a trailing dot (`cname.vercel-dns.com.`).

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

## CI

Two GitHub Actions workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on PR and `main`: Biome lint, redirect validation, content build, typecheck, unit tests, Next.js build.
- **`lhci.yml`** — triggers on every Vercel `deployment_status` event; the job is gated by `if: state == 'success'`, so it only does work for successful deployments. Runs Lighthouse CI (median of 5) + Playwright smoke against the deployed URL. If you see runs marked "skipped," it's the state guard filtering out non-success events.

## License & attribution

Personal project. Source available at [github.com/insafim/personal-website](https://github.com/insafim/personal-website).
