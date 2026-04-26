import type { Metadata } from "next";
import { projects } from "#site/content";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { buildMetadata } from "@/lib/metadata";
import { CATEGORIES, groupByCategory } from "@/lib/projects";

export const metadata: Metadata = buildMetadata({
  path: "/projects",
  title: "Projects",
  description: "Enterprise, research, and independent project work.",
});

export default function ProjectsPage() {
  const grouped = groupByCategory(projects);

  return (
    <section className="px-4 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <ProjectFilter projects={projects} />
      <div className="space-y-12">
        {CATEGORIES.map(({ key, label }) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <h2 className="text-2xl font-semibold mb-4">{label}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard project={p} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
