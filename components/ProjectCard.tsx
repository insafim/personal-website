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

export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_PALETTE[project.status];
  return (
    <article className="surface-card relative h-full flex flex-col overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${CATEGORY_BAR[project.category]}`}
        aria-hidden="true"
      />
      <div className="p-5 pl-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
            {project.status}
          </span>
          <span className="ml-auto text-xs font-mono text-[var(--color-fg-muted)]">
            {project.year}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-tight mb-2">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)] mb-4 flex-1 leading-relaxed">
          {project.problem.slice(0, 140)}
          {project.problem.length > 140 ? "…" : ""}
        </p>
        <ul className="flex flex-wrap gap-1.5 mt-auto">
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
  );
}
