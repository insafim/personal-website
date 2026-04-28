# knowledge/source-logos/ : source logo staging area

This directory holds the **original, full-resolution logo source files** uploaded
by the site owner. It lives under `knowledge/` because it is reference material,
not deployed assets. Next.js only serves files under `/public/`, so nothing in
this directory is web-accessible.

## How to use

1. Drop a new logo file here (PNG/SVG/WebP).
2. Copy or move the file to the right destination under `/public/assets/`:
   - **Companies** (career timeline): `/public/assets/companies/<slug>.png`
   - **Schools** (education timeline): `/public/assets/schools/<slug>.png`
   - **Other organisations** (clubs, competitions, etc., not yet wired):
     `/public/assets/orgs/<slug>.png` — see that directory's README for status.
3. Add the `logo:` field to the matching YAML in `/content/companies/`,
   `/content/schools/`, etc. The path must start with `/`, e.g.
   `logo: /assets/companies/2pointzero.png`.

## Why the duplicate

Keeping the source here lets us re-export at different sizes / formats without
re-asking the site owner for the original file. Files under `/public/assets/`
are the optimisation-ready, named-by-slug copies that the app actually serves.

## Safe to delete?

No — these are the source-of-truth uploads. If `/public/assets/...` ever needs
to be regenerated, this is where the originals live.
