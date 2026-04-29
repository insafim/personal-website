import type { Metadata } from "next";
import { home, profile, projects, publications } from "#site/content";
import { Hero } from "@/components/Hero";
import { HomeSignals } from "@/components/HomeSignals";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { buildMetadata } from "@/lib/metadata";
import { sortByYearDesc } from "@/lib/publications";

const HOME_TITLE = "Insaf Ismath - AI/ML Engineer & Researcher";

const baseMetadata = buildMetadata({
  path: "/",
  description: profile.bio_short,
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: { absolute: HOME_TITLE },
  openGraph: {
    ...baseMetadata.openGraph,
    title: HOME_TITLE,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: HOME_TITLE,
  },
};

export default function HomePage() {
  const latestPublication = sortByYearDesc(publications)[0];
  const featuredProject =
    projects.find((p) => p.category === "enterprise" && p.status === "shipped") ?? projects[0];
  const currentFocus = "Production AI at 2PointZero (IHC)";

  return (
    <>
      <Hero profile={profile} home={home} />
      <HomeSignals
        latestPublication={latestPublication}
        featuredProject={featuredProject}
        currentFocus={currentFocus}
      />
      <PersonJsonLd />
    </>
  );
}
