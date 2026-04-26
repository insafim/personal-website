import Link from "next/link";
import type { Project } from "#site/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border border-[var(--color-border)] rounded p-4 h-full flex flex-col">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="text-lg font-semibold leading-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-[var(--color-accent)]">
            {project.title}
          </Link>
        </h3>
        <span className="text-xs font-mono text-[var(--color-fg-muted)]">{project.year}</span>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)] mb-3 flex-1">
        {project.problem.slice(0, 140)}
        {project.problem.length > 140 ? "…" : ""}
      </p>
      <ul className="flex flex-wrap gap-1.5 mt-auto">
        {project.tech_stack.slice(0, 5).map((t) => (
          <li
            key={t}
            className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
          >
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}
