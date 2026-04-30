import type { Metadata } from "next";
import { projects } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { buildMetadata } from "@/lib/metadata";
import { CATEGORIES, groupByCategory } from "@/lib/projects";

export const metadata: Metadata = buildMetadata({
  path: "/projects",
  title: "Projects",
  description: "Enterprise, research, and independent project work.",
});

const RULE_COLOR: Record<(typeof CATEGORIES)[number]["key"], string> = {
  enterprise: "bg-[var(--color-enterprise)]",
  research: "bg-[var(--color-research)]",
  independent: "bg-[var(--color-independent)]",
};

const CATEGORY_BLURB: Record<(typeof CATEGORIES)[number]["key"], string> = {
  enterprise: "Production AI systems built end-to-end at 2PointZero across the IHC portfolio.",
  research:
    "Vision-language and computer-vision research from MBZUAI IVAL, VisionLabs, and Peradeniya.",
  independent: "Side work and one-off explorations.",
};

export default function ProjectsPage() {
  const grouped = groupByCategory(projects);

  return (
    <div className="px-4 max-w-6xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Selected work"
        title="Projects"
        description="Production AI systems shipped at 2PointZero, research from MBZUAI and Peradeniya, and independent work - grouped by where the work lived."
      />
      <ProjectFilter projects={projects} />
      <div className="space-y-16">
        {CATEGORIES.map(({ key, label }) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          const [first, ...rest] = items;
          return (
            <section key={key}>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold flex items-center mb-1">
                  <span className={`section-rule ${RULE_COLOR[key]}`} aria-hidden="true" />
                  {label}
                </h2>
                <p className="text-sm text-[var(--color-fg-muted)] ml-[0.875rem] max-w-2xl">
                  {CATEGORY_BLURB[key]}
                </p>
              </div>
              {first && (
                <div className="mb-5">
                  <ProjectCard project={first} featured />
                </div>
              )}
              {rest.length > 0 && (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <li key={p.slug}>
                      <ProjectCard project={p} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
