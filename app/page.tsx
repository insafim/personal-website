import type { Metadata } from "next";
import { home, profile, projects, publications } from "#site/content";
import { Hero } from "@/components/Hero";
import { HomeSignals } from "@/components/HomeSignals";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { buildMetadata } from "@/lib/metadata";
import { sortByYearDesc as sortProjectsByYearDesc } from "@/lib/projects";
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
  // Pick the most recent project as the home-page signal. Previously this was
  // a category+status filter ("enterprise" + "shipped") that disappeared with
  // the schema migration; year-desc keeps the home page automatically pointing
  // at fresh work without a hard-coded slug list.
  const featuredProject = sortProjectsByYearDesc(projects)[0];

  return (
    <>
      <Hero profile={profile} home={home} />
      <HomeSignals latestPublication={latestPublication} featuredProject={featuredProject} />
      <PersonJsonLd />
    </>
  );
}
