import Image from "next/image";
import type { EducationRow } from "@/lib/timeline";

// Mirrors CareerTimeline structurally; renders degree/institution instead of
// role/org. Kept as a separate component (rather than a polymorphic
// CareerTimeline) so the two surfaces can evolve independently - for example,
// education entries may grow GPA or thesis-title fields that career rows
// won't, and vice versa.
export function EducationTimeline({ entries }: { entries: readonly EducationRow[] }) {
  return (
    <ol className="relative pl-24 md:pl-28 space-y-9">
      {/*
       * Track line passes through the centre of the left-rail logo squares.
       * Logos cover it visually; the line only shows between entries
       * (LinkedIn-style timeline). Mirrors CareerTimeline.
       */}
      <span
        aria-hidden="true"
        className="timeline-track absolute left-10 md:left-12 top-2 bottom-2 w-px"
      />
      {entries.map((e) => (
        <li key={`${e.year_range}-${e.school.slug}`} className="relative">
          {/* See CareerTimeline for the dark-mode logo legibility design. */}
          {(() => {
            const hasDark = !!e.school.logo_dark;
            const frameBg = hasDark
              ? "bg-[var(--color-bg-raised)]"
              : "logo-frame-light";
            return (
              <span
                aria-hidden="true"
                className={`absolute -left-24 md:-left-28 top-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-md border border-[var(--color-border-strong)] overflow-hidden shadow-[var(--shadow-card)] ${frameBg}`}
              >
                {e.school.logo ? (
                  <>
                    <Image
                      src={e.school.logo}
                      alt=""
                      width={96}
                      height={96}
                      className={`h-full w-full object-contain p-1 ${hasDark ? "dark:hidden" : ""}`}
                    />
                    {hasDark && (
                      <Image
                        src={e.school.logo_dark as string}
                        alt=""
                        width={96}
                        height={96}
                        className="hidden dark:block h-full w-full object-contain p-1"
                      />
                    )}
                  </>
                ) : (
                  <span className="w-3 h-3 rounded-full bg-[var(--color-accent)]" />
                )}
              </span>
            );
          })()}
          <p className="metadata mb-1">{e.year_range}</p>
          <h3 className="text-lg font-semibold leading-snug">
            <span>{e.degree}</span>
            <span className="text-[var(--color-fg-muted)] font-normal"> · {e.school.name}</span>
          </h3>
          {/* Optional grade + activities lines, both schema-optional. */}
          {e.grade && (
            <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
              <span className="font-medium text-[var(--color-fg)]">Grade:</span> {e.grade}
            </p>
          )}
          {e.activities && (
            <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
              <span className="font-medium text-[var(--color-fg)]">Activities:</span> {e.activities}
            </p>
          )}
          <p className="mt-2 text-[var(--color-fg-muted)] leading-relaxed">{e.summary}</p>
        </li>
      ))}
    </ol>
  );
}
