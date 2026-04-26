import type { Person } from "#site/content";

type CareerEntry = Person["career_timeline"][number];

export function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  return (
    <ol className="relative border-l border-[var(--color-border)] pl-6 space-y-8">
      {entries.map((e) => (
        <li key={`${e.year_range}-${e.org}`} className="relative">
          <span
            className="absolute -left-[28px] top-2 w-3 h-3 rounded-full bg-[var(--color-accent)]"
            aria-hidden="true"
          />
          <time className="text-sm text-[var(--color-fg-muted)] font-mono">{e.year_range}</time>
          <h3 className="text-lg font-semibold mt-1">
            {e.role} <span className="text-[var(--color-fg-muted)] font-normal">· {e.org}</span>
          </h3>
          <p className="mt-1 text-[var(--color-fg-muted)]">{e.summary}</p>
        </li>
      ))}
    </ol>
  );
}
