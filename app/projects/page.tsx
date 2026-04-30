import type { Metadata } from "next";
import { projects } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { buildMetadata } from "@/lib/metadata";
import { sortByYearDesc } from "@/lib/projects";

export const metadata: Metadata = buildMetadata({
  path: "/projects",
  title: "Projects",
  description: "Selected engineering and research project work.",
});

export default function ProjectsPage() {
  // Flat list, year descending. The first item becomes the featured card so
  // the index keeps a single visual anchor without re-introducing the prior
  // category-based grouping.
  const sorted = sortByYearDesc(projects);
  const [first, ...rest] = sorted;

  return (
    <div className="px-4 max-w-6xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Selected work"
        title="Projects"
        description="Production AI systems and research builds across 2PointZero, MBZUAI, VisionLabs, the University of Peradeniya, and independent work."
      />
      <ProjectFilter projects={projects} />
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
    </div>
  );
}
