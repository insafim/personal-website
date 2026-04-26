import type { Resource } from "#site/content";

const KIND_PALETTE: Record<Resource["kind"], { glyph: string; color: string }> = {
  talk: { glyph: "▶", color: "var(--color-research)" },
  repo: { glyph: "{ }", color: "var(--color-enterprise)" },
  model: { glyph: "◆", color: "var(--color-accent)" },
  writing: { glyph: "¶", color: "var(--color-independent)" },
};

const KIND_LABEL: Record<Resource["kind"], string> = {
  talk: "Talk",
  repo: "Repo",
  model: "Model",
  writing: "Writing",
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
      <h3 className="text-base font-semibold leading-snug mb-2">
        <a
          href={resource.url}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:text-[var(--color-accent)] transition-colors"
        >
          {resource.title} <span aria-hidden="true">↗</span>
        </a>
      </h3>
      <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed flex-1">
        {resource.why_this_matters}
      </p>
    </article>
  );
}
