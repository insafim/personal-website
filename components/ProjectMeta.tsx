import type { Project } from "#site/content";

export function ProjectMeta({ project }: { project: Project }) {
  const summaryRows = [
    { label: "Affiliation", value: project.affiliation },
    { label: "Role", value: project.role },
    { label: "Year", value: String(project.year) },
  ];

  return (
    <div className="space-y-5">
      <section className="surface-elevated p-5 md:p-6">
        <p className="eyebrow mb-4">Project details</p>
        <dl className="space-y-4 text-sm">
          {summaryRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-3">
              <dt className="metadata uppercase">{row.label}</dt>
              <dd className="leading-relaxed text-[var(--color-fg)]">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {project.scale_metrics && project.scale_metrics.length > 0 && (
        <section className="surface-elevated p-5 md:p-6">
          <p className="eyebrow mb-4">Scale and metrics</p>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {project.scale_metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3"
              >
                <dd className="text-lg font-semibold tabular-nums text-[var(--color-fg)]">
                  {m.value}
                </dd>
                <dt className="metadata uppercase mt-1">{m.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="surface-elevated p-5 md:p-6">
        <p className="eyebrow mb-4">Tech stack</p>
        <ul className="flex flex-wrap gap-2">
          {project.tech_stack.map((t) => (
            <li
              key={t}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {project.lessons_learned && (
        <section className="surface-accent px-5 py-6 md:px-6 md:py-7">
          <p className="eyebrow mb-3">Lessons learned</p>
          <p className="leading-relaxed text-[var(--color-fg)]">{project.lessons_learned}</p>
        </section>
      )}

      {project.github_url && (
        <div className="flex">
          <a
            href={project.github_url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
          >
            <span>View on GitHub</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
