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

const RULE_COLOR: Record<(typeof CATEGORIES)[number]["key"], string> = {
  enterprise: "bg-[var(--color-enterprise)]",
  research: "bg-[var(--color-research)]",
  independent: "bg-[var(--color-independent)]",
};

export default function ProjectsPage() {
  const grouped = groupByCategory(projects);

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] mb-2">
          Selected work
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Projects</h1>
        <p className="text-[var(--color-fg-muted)] max-w-prose">
          Enterprise systems shipped at 2PointZero, research from MBZUAI and Peradeniya, and
          independent work — grouped by where the work lived.
        </p>
      </div>
      <ProjectFilter projects={projects} />
      <div className="space-y-14">
        {CATEGORIES.map(({ key, label }) => {
          const items = grouped[key];
          if (items.length === 0) return null;
          return (
            <section key={key}>
              <h2 className="text-2xl font-semibold mb-5 flex items-center">
                <span className={`section-rule ${RULE_COLOR[key]}`} aria-hidden="true" />
                {label}
                <span className="ml-3 text-sm font-normal text-[var(--color-fg-muted)] font-mono">
                  ({items.length})
                </span>
              </h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
