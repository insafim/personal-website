import Link from "next/link";
import type { Project } from "#site/content";

const STATUS_PALETTE: Record<Project["status"], { dot: string; text: string; bg: string }> = {
  shipped: {
    dot: "bg-[var(--color-status-shipped)]",
    text: "text-[var(--color-status-shipped)]",
    bg: "bg-[var(--color-status-shipped-soft)]",
  },
  active: {
    dot: "bg-[var(--color-status-active)]",
    text: "text-[var(--color-status-active)]",
    bg: "bg-[var(--color-status-active-soft)]",
  },
  archived: {
    dot: "bg-[var(--color-status-archived)]",
    text: "text-[var(--color-status-archived)]",
    bg: "bg-[var(--color-status-archived-soft)]",
  },
  "in-progress": {
    dot: "bg-[var(--color-status-in-progress)]",
    text: "text-[var(--color-status-in-progress)]",
    bg: "bg-[var(--color-status-in-progress-soft)]",
  },
};

const CATEGORY_BAR: Record<Project["category"], string> = {
  enterprise: "bg-[var(--color-enterprise)]",
  research: "bg-[var(--color-research)]",
  independent: "bg-[var(--color-independent)]",
};

const CATEGORY_LABEL: Record<Project["category"], string> = {
  enterprise: "Enterprise",
  research: "Research",
  independent: "Independent",
};

type ProjectCardProps = { project: Project; featured?: boolean };

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const status = STATUS_PALETTE[project.status];
  const truncate = featured ? 260 : 140;

  return (
    <article
      className={`surface-elevated is-interactive relative h-full flex flex-col overflow-hidden ${
        featured ? "" : ""
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 ${featured ? "w-1.5" : "w-1"} ${CATEGORY_BAR[project.category]}`}
        aria-hidden="true"
      />
      <div className={`flex flex-col h-full ${featured ? "p-6 pl-7 md:p-8 md:pl-9" : "p-5 pl-6"}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
            {project.status}
          </span>
          {featured && (
            <span className="metadata uppercase">{CATEGORY_LABEL[project.category]}</span>
          )}
          <span className="ml-auto metadata">{project.year}</span>
        </div>
        <h3
          className={`font-semibold leading-tight mb-2 ${
            featured ? "text-2xl md:text-3xl display tracking-tight" : "text-lg"
          }`}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {project.title}
          </Link>
        </h3>
        <p
          className={`text-[var(--color-fg-muted)] mb-4 flex-1 leading-relaxed ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {project.problem.slice(0, truncate)}
          {project.problem.length > truncate ? "…" : ""}
        </p>
        {featured && project.scale_metrics && project.scale_metrics.length > 0 && (
          <dl className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-[var(--color-border)]">
            {project.scale_metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <dd className="text-base md:text-lg font-semibold text-[var(--color-fg)] tabular-nums">
                  {m.value}
                </dd>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)] mt-0.5">
                  {m.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
        <ul className="flex flex-wrap gap-1.5 mt-auto">
          {project.tech_stack.slice(0, featured ? 8 : 5).map((t) => (
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
  );
}
