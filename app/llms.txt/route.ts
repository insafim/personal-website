import { profile, siteConfig } from "#site/content";

export const runtime = "nodejs";

// llms.txt convention: a curated, human + LLM-readable Markdown summary at site root.
// Permissive AI crawler posture per IR-005 / SRS constraints.
export function GET() {
  const base = siteConfig.site_url;
  const body = `# ${siteConfig.site_name}

> ${profile.bio_short}

## About
- ${base}/about - Insaf's narrative + career timeline.

## Projects
- ${base}/projects - Selected engineering and research project work, tagged by where each project was done (2PointZero Group, MBZUAI, VisionLabs, UoP, Independent).

## Publications
- ${base}/publications - Research publications with abstracts, BibTeX, arXiv/DOI/PDF links.

## Resources
- ${base}/resources - Curated talks, repositories, models, and writing - each annotated with why it matters.

## Beyond
- ${base}/beyond - Clubs, competitions, sports, and the things Insaf shows up for outside the day job.

## Contact
- ${base}/contact - Email + social links (no consent banner; cookieless).
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
