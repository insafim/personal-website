import type { Person } from "#site/content";

type CareerEntry = Person["career_timeline"][number];

export function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  return (
    <ol className="relative pl-8 md:pl-10 space-y-9">
      <span
        aria-hidden="true"
        className="timeline-track absolute left-2.5 md:left-3 top-2 bottom-2 w-px"
      />
      {entries.map((e, i) => (
        <li key={`${e.year_range}-${e.org}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-8 md:-left-10 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <p className="metadata mb-1">{e.year_range}</p>
          <h3 className="text-lg font-semibold leading-snug">
            {e.role}
            <span className="text-[var(--color-fg-muted)] font-normal"> · {e.org}</span>
          </h3>
          <p className="mt-2 text-[var(--color-fg-muted)] leading-relaxed">{e.summary}</p>
          {i === 0 && (
            <span className="inline-flex items-center gap-1.5 mt-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] bg-[var(--color-status-active-soft)] text-[var(--color-status-active)]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-active)]"
                aria-hidden="true"
              />
              Current
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
