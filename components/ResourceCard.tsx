import type { Resource } from "#site/content";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="border border-[var(--color-border)] rounded p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold leading-tight">
          <a
            href={resource.url}
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-[var(--color-accent)]"
          >
            {resource.title}
          </a>
        </h3>
        <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]">
          {resource.kind}
        </span>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)]">{resource.why_this_matters}</p>
    </article>
  );
}
