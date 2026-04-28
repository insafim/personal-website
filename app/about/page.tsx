import type { Metadata } from "next";
import { person } from "#site/content";
import { CareerTimeline } from "@/components/CareerTimeline";
import { EducationTimeline } from "@/components/EducationTimeline";
import { PageIntro } from "@/components/PageIntro";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { ProfileFacts } from "@/components/ProfileFacts";
import { buildMetadata } from "@/lib/metadata";
import { getCareerRows, getEducationRows } from "@/lib/timeline";

export const metadata: Metadata = buildMetadata({
  path: "/about",
  title: "About",
  description: person.bio_short,
  type: "profile",
});

export default function AboutPage() {
  const careerRows = getCareerRows();
  const educationRows = getEducationRows();
  return (
    <div className="px-4 max-w-6xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="About"
        title={person.name}
        description={person.bio_short}
        variant="accent"
      />

      <div className="grid gap-10 md:gap-14 md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <article
            className="prose prose-neutral dark:prose-invert max-w-none mb-14
                       prose-headings:display prose-headings:tracking-tight
                       prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4
                       prose-p:leading-relaxed prose-p:text-[var(--color-fg)]
                       prose-strong:text-[var(--color-fg)] prose-strong:font-semibold
                       prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Velite-compiled MDX (build-time, author-controlled).
            dangerouslySetInnerHTML={{ __html: person.bio_long }}
          />

          <section className="mb-14">
            <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight mb-2 flex items-center">
              <span className="section-rule bg-[var(--color-accent)]" aria-hidden="true" />
              Career
            </h2>
            <p className="text-sm text-[var(--color-fg-muted)] mb-8 ml-[0.875rem]">
              Most recent first.
            </p>
            <CareerTimeline entries={careerRows} />
          </section>

          {educationRows.length > 0 && (
            <section>
              <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight mb-2 flex items-center">
                <span className="section-rule bg-[var(--color-accent)]" aria-hidden="true" />
                Education
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)] mb-8 ml-[0.875rem]">
                Most recent first.
              </p>
              <EducationTimeline entries={educationRows} />
            </section>
          )}
        </div>

        <ProfileFacts person={person} />
      </div>

      <PersonJsonLd />
    </div>
  );
}
