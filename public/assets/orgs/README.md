# /public/assets/orgs/ — org logos for the Beyond page

This directory holds logo files for organisations that don't fit cleanly into
`/public/assets/companies/` (employers) or `/public/assets/schools/` (degree
institutions). Currently used by the Beyond page (`/hobbies` route) for clubs,
extracurriculars, and case-competition entries.

## Wired logos (referenced by content/hobbies/*.mdx)

| File | Wired by | Purpose |
|---|---|---|
| `aiesec.png` | `content/hobbies/aiesec.mdx` | AIESEC chapter membership |
| `bcg.png` | `content/hobbies/case-competitions.mdx` | Primary visual for the BCG / Kearney / CIMA case-competition entry |
| `mbzuai-consulting-club.png` | `content/hobbies/mbzuai-consulting-club.mdx` | Founding President role |

## Staged (not yet referenced)

| File | Likely category | Pending decision |
|---|---|---|
| `kearney.png` | Consulting firm | Could split case-competitions into per-firm entries, or stay as is (BCG carries the visual) |
| `ihc.png` | International Holding Company (parent of 2PointZero) | Already covered via the 2PointZero career entry; could surface separately if you want to highlight the parent org |

## How to wire a staged logo

1. Add a `logo: /assets/orgs/<file>.png` field to a content/hobbies/*.mdx (or move to companies/ / schools/ if that fits better).
2. Run `pnpm content:build` to regenerate `.velite/`.
3. The unit test `tests/lib/logo-assets.test.ts` automatically iterates every wired logo path and asserts the file exists.

## Safe to delete?

Files marked "Wired" must NOT be deleted — they would silently break the rendered cards. Files marked "Staged" can be removed if the placement decision is "skip permanently".
