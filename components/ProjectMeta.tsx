import type { Project } from "#site/content";

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <dl className="grid gap-4 md:grid-cols-2">
        <div>
          <dt className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)]">Problem</dt>
          <dd className="mt-1">{project.problem}</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)]">Approach</dt>
          <dd className="mt-1">{project.approach}</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)]">Role</dt>
          <dd className="mt-1">{project.role}</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)]">Year</dt>
          <dd className="mt-1">{project.year}</dd>
        </div>
      </dl>

      {project.scale_metrics && project.scale_metrics.length > 0 && (
        <table className="border-collapse w-full text-sm">
          <caption className="text-left text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
            Scale & metrics
          </caption>
          <tbody>
            {project.scale_metrics.map((m) => (
              <tr key={m.label} className="border-t border-[var(--color-border)]">
                <th
                  scope="row"
                  className="text-left py-2 pr-4 font-normal text-[var(--color-fg-muted)]"
                >
                  {m.label}
                </th>
                <td className="py-2 font-mono">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <h3 className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
          Tech stack
        </h3>
        <ul className="flex flex-wrap gap-2">
          {project.tech_stack.map((t) => (
            <li key={t} className="px-2 py-1 text-xs rounded border border-[var(--color-border)]">
              {t}
            </li>
          ))}
        </ul>
      </div>

      {project.lessons_learned && (
        <div>
          <h3 className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)] mb-2">
            Lessons learned
          </h3>
          <p>{project.lessons_learned}</p>
        </div>
      )}

      {project.github_url && (
        <div>
          <a
            href={project.github_url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-block px-3 py-2 rounded bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-sm font-medium"
          >
            View on GitHub →
          </a>
        </div>
      )}
    </div>
  );
}
