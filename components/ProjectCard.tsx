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

// Exported so the unit test in tests/lib/project-pulse.test.ts can verify the
// status→pulse contract content-independently. All current projects ship with
// status:"shipped", so the e2e test's positive branch (active project = pulsing
// dot) cannot be exercised against the live content fixture.
export function activeDotPulseClass(status: Project["status"]): string {
  return status === "active" ? "motion-safe:animate-pulse" : "";
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const status = STATUS_PALETTE[project.status];
  const truncate = featured ? 260 : 140;

  return (
    <article className="surface-elevated is-interactive relative h-full flex flex-col overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 ${featured ? "w-1.5" : "w-1"} ${CATEGORY_BAR[project.category]}`}
        aria-hidden="true"
      />
      <div className={`flex flex-col h-full ${featured ? "p-6 pl-7 md:p-8 md:pl-9" : "p-5 pl-6"}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full ${status.bg} ${status.text}`}
          >
            {/*
             * Pulsing dot only when the project is actively in flight, so the
             * "active" pill reads as live signal vs the static shipped/archived
             * states. motion-safe gates the animation for prefers-reduced-motion
             * users (NFR-015 reduced-motion guard already in app/globals.css).
             */}
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.dot} ${activeDotPulseClass(project.status)}`}
              aria-hidden="true"
            />
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
        {/*
         * Hero-metric pattern (Brittany Chiang-style "100k+ Installs"): promote
         * the first scale_metric to display-size as the card's anchor number,
         * keep the rest at small text below. Inspired by:
         * https://brittanychiang.com (verified 2026-04-27).
         *
         * `?.[0]` is required (not just `[0]`) because tsconfig sets
         * `noUncheckedIndexedAccess: true`, so array index access returns
         * `T | undefined` and must be guarded.
         *
         * `data-hero-metric` is a load-bearing e2e selector, not a styling
         * hook - it anchors tests/e2e/smoke.spec.ts. Do not remove it.
         */}
        {featured && project.scale_metrics?.[0] && (
          <div
            data-hero-metric=""
            className="mb-5 pb-5 border-b border-[var(--color-border)]"
          >
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span
                data-metric-value=""
                className="display tabular-nums text-4xl md:text-5xl font-bold leading-none tracking-tight text-[var(--color-fg)]"
              >
                {project.scale_metrics[0].value}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-muted)] font-medium">
                {project.scale_metrics[0].label}
              </span>
            </div>
            {project.scale_metrics.length > 1 && (
              <dl className="grid grid-cols-2 gap-4">
                {project.scale_metrics.slice(1, 3).map((m) => (
                  <div key={m.label}>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
                      {m.label}
                    </dt>
                    <dd className="text-sm font-semibold text-[var(--color-fg)] tabular-nums mt-0.5">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
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
