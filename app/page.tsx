import type { Metadata } from "next";
import { person } from "#site/content";
import { Hero } from "@/components/Hero";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/",
  description: person.bio_short,
});

export default function HomePage() {
  return (
    <>
      <Hero person={person} />
      <PersonJsonLd />
    </>
  );
}
