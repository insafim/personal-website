# Editing the site content

This site auto-deploys to Vercel on every push to `main`. To update content:
edit a file in `content/`, drop any new images or PDFs in `public/assets/`,
commit, push. The build validates everything; if a field is wrong you will
see the failure in the Vercel build log (or locally with `pnpm dev`).

## Where do I edit X?

| Section / thing                | File or folder                                    |
|--------------------------------|---------------------------------------------------|
| About bio + headshot + socials | `content/person.mdx`                              |
| Career timeline (one job)      | `content/career/<file>.yaml`                      |
| Education timeline (one degree)| `content/education/<file>.yaml`                   |
| Company / employer info + logo | `content/companies/<slug>.yaml`                   |
| University / school info + logo| `content/schools/<slug>.yaml`                     |
| A single project page          | `content/projects/<slug>.mdx`                     |
| A single publication           | `content/publications/<slug>.mdx`                 |
| A talk / repo / writing link   | `content/resources/<slug>.mdx`                    |
| A hobby                        | `content/hobbies/<slug>.mdx`                      |
| Site nav, feature flags        | `content/site-config.yaml`                        |
| URL redirects                  | `content/redirects.yaml`                          |
| Headshot, CV, project covers   | `public/assets/<folder>/<file>`                   |

## Where do I drop uploaded files (logos, CV, screenshots)?

```
public/assets/
  companies/        company logos referenced from content/companies/*.yaml
  schools/          school logos referenced from content/schools/*.yaml
  profile/          headshots
  projects/         project cover images / screenshots
  publications/     locally-mirrored PDFs and thumbnails
  cv/               CV PDF, e.g. insaf-ismath-cv.pdf
```

Filenames are public URLs. A file at `public/assets/companies/2pointzero.svg`
is reachable at `/assets/companies/2pointzero.svg` on the site. Reference it
from YAML / MDX with that leading-slash path.

Recommended formats:
- Logos: SVG when available, otherwise PNG with transparent background
- Headshots: JPG, around 600x600 or larger
- CV: PDF, keep filename stable (e.g. `insaf-ismath-cv.pdf`) so links don't break
- Project covers: JPG or WebP, 1600x900 ideal

## How do I add a new job?

1. If the company is new, create `content/companies/<slug>.yaml`:

   ```yaml
   slug: acme               # kebab-case, must match the filename
   name: Acme Corp
   url: https://acme.com    # optional
   location: Dubai, UAE     # optional
   logo: /assets/companies/acme.svg   # optional, drop the file first
   ```

2. Create `content/career/<year>-<slug>-<role>.yaml`:

   ```yaml
   order: 1                 # 1 = newest, ascending. Bump existing rows down.
   year_range: Mar 2027 - Present
   role: Senior AI Engineer
   company: acme            # must match the slug above
   summary: One paragraph in your own voice.
   ```

3. Drop the logo image into `public/assets/companies/acme.svg` (if you set one).
4. `git add . && git commit -m "career: add Acme role" && git push`. Vercel
   redeploys automatically.

## How do I reorder career or education rows?

Edit the `order:` field in each YAML file. `order: 1` is rendered first
(currently presented as "most recent first"). The numbers do not have to be
contiguous, only their relative order matters.

## How do I add my CV?

1. Put the PDF at `public/assets/cv/insaf-ismath-cv.pdf`.
2. In `content/person.mdx`, uncomment and set `cv_url`:

   ```yaml
   cv_url: /assets/cv/insaf-ismath-cv.pdf
   ```

The download link will appear automatically anywhere `cv_url` is consumed
(currently the CV link UI is not yet wired; see the followups list below).

## How do I add a project or publication?

Each lives in its own MDX file under `content/projects/` or
`content/publications/`. Frontmatter (the YAML at the top between `---`
markers) must satisfy the schema in `velite.config.ts`. The simplest path:
copy an existing file, change the slug, edit the fields. Common errors are
caught at build time with a clear message naming the field.

For publications, at least one of `arxiv_id`, `doi`, `pdf_url` must be set
(NFR-026). Locally-mirrored PDFs (`pdf_url` under `/assets/pdfs/`) require a
`pdf_license` value (SEC-007).

## What runs the build?

- `pnpm dev`: runs the site locally at http://localhost:3000 with hot reload
- `pnpm build`: production build (what Vercel runs)
- `pnpm test`: runs the unit / schema test suite (Vitest)
- Vercel auto-builds on every push to `main`

If a build fails, the error message tells you which file and which field is
wrong (Velite validates against the Zod-style schemas in `velite.config.ts`).

## Followups not yet wired

- A UI surface for the CV download link (the data is in `cv_url` but no
  component reads it yet, easy follow-up).
- Company / school logos on `ProjectCard` and `PublicationCard` (currently
  only the About page timeline shows logos).
