import Link from "next/link";
import type { Project } from "#site/content";

type ProjectCardProps = { project: Project };

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <article className="surface-elevated is-interactive relative h-full flex flex-col overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1 bg-[var(--color-accent)]"
          aria-hidden="true"
        />
        <div className="flex flex-col h-full p-5 pl-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              data-affiliation={project.affiliation}
              className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
            >
              {project.affiliation}
            </span>
            <span className="ml-auto metadata">{project.year}</span>
          </div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight mb-3 line-clamp-3">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-fg-muted)] mb-4 leading-relaxed line-clamp-4">
            {project.problem}
          </p>
          <ul className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {project.tech_stack.slice(0, 5).map((t) => (
              <li
                key={t}
                className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border border-[var(--color-border)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Link>
  );
}
