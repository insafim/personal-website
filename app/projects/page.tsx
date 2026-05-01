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
  // Flat list, year descending. Every card uses the same tile format so the
  // grid reads as one consistent shelf rather than a featured anchor + tail.
  const sorted = sortByYearDesc(projects);

  return (
    <div className="px-4 max-w-6xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Selected work"
        title="Projects"
        description="Production AI systems and research builds across 2PointZero, MBZUAI, VisionLabs, the University of Peradeniya, and independent work."
      />
      <div className="mb-6 -mt-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5 text-sm text-[var(--color-fg-muted)]">
        <span className="font-medium text-[var(--color-fg)]">Note:</span> Detail pages
        are still being refreshed. Some are richer than others.
      </div>
      <ProjectFilter projects={projects} />
      {sorted.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
