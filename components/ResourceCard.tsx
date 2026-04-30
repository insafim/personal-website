import type { Resource } from "#site/content";

const KIND_PALETTE: Record<Resource["kind"], { glyph: string; color: string }> = {
  book: { glyph: "▣", color: "var(--color-research)" },
  blog: { glyph: "¶", color: "var(--color-enterprise)" },
  youtube: { glyph: "▶", color: "var(--color-accent)" },
};

const KIND_LABEL: Record<Resource["kind"], string> = {
  book: "Book",
  blog: "Blog",
  youtube: "YouTube",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const kind = KIND_PALETTE[resource.kind];
  return (
    <article className="surface-elevated is-interactive p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono font-bold"
          style={{ color: kind.color, background: "var(--color-bg-subtle)" }}
        >
          {kind.glyph}
        </span>
        <span
          className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em]"
          style={{ color: kind.color }}
        >
          {KIND_LABEL[resource.kind]}
        </span>
        {resource.year && <span className="ml-auto metadata">{resource.year}</span>}
      </div>
      <h3 className="text-base font-semibold leading-snug mb-1">
        {resource.url ? (
          <a
            href={resource.url}
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {resource.title} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          resource.title
        )}
      </h3>
      {resource.author && (
        <p className="text-xs text-[var(--color-fg-muted)] mb-2 italic">{resource.author}</p>
      )}
      <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed flex-1">
        {resource.why_this_matters}
      </p>
    </article>
  );
}
