import type { Metadata } from "next";
import { person } from "#site/content";
import { CareerTimeline } from "@/components/CareerTimeline";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/about",
  title: "About",
  description: person.bio_short,
  type: "profile",
});

export default function AboutPage() {
  return (
    <section className="px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">About</h1>
      <article
        className="prose prose-neutral dark:prose-invert max-w-none mb-12"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX (build-time, author-controlled).
        dangerouslySetInnerHTML={{ __html: person.bio_long }}
      />
      <h2 className="text-2xl font-semibold mb-6">Career</h2>
      <CareerTimeline entries={person.career_timeline} />
      <PersonJsonLd />
    </section>
  );
}
