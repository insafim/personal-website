import Link from "next/link";
import type { Project } from "#site/content";

type ProjectCardProps = { project: Project };

// Many project titles use a "Main - Subtitle" form (e.g. "Avatar AI Voice
// Agent - Digital delegate for 2PointZero's Growth Day"). Splitting on the
// first " - " gives the tile a clean two-line typographic hierarchy: a strong
// main title and a quieter tagline. Titles without a separator render as
// a single line.
function splitTitle(title: string): { main: string; sub: string | null } {
  const idx = title.indexOf(" - ");
  if (idx === -1) return { main: title, sub: null };
  return { main: title.slice(0, idx), sub: title.slice(idx + 3) };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { main: titleMain, sub: titleSub } = splitTitle(project.title);

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
          <h3 className="text-lg font-semibold leading-snug tracking-tight mb-1.5 line-clamp-2">
            {titleMain}
          </h3>
          {titleSub && (
            <p className="text-sm text-[var(--color-fg-muted)] mb-3 leading-snug line-clamp-2">
              {titleSub}
            </p>
          )}
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
