import Image from "next/image";
import type { CareerRow } from "@/lib/timeline";

export function CareerTimeline({ entries }: { entries: readonly CareerRow[] }) {
  return (
    <ol className="relative pl-24 md:pl-28 space-y-9">
      {/*
       * Track line is positioned so it passes through the centre of the
       * left-rail logo squares. Logos cover it visually; the line only shows
       * between entries (LinkedIn-style timeline).
       */}
      <span
        aria-hidden="true"
        className="timeline-track absolute left-10 md:left-12 top-2 bottom-2 w-px"
      />
      {entries.map((e, i) => (
        <li key={`${e.year_range}-${e.company.slug}`} className="relative">
          {/*
           * Logo on the left rail. When a company has no logo, fall back to a
           * small accent bullet so the timeline visual rhythm survives.
           *
           * Dark-mode legibility: when the company has only `logo` (typically a
           * dark-on-transparent PNG), the container is forced to .logo-frame-light
           * so the same image stays visible in dark mode. When `logo_dark` is
           * also provided, the container keeps the theme-aware bg-bg-raised
           * surface and the two <Image> elements toggle visibility via the
           * project's `.dark` class variant.
           */}
          {(() => {
            const hasDark = !!e.company.logo_dark;
            const frameBg = hasDark
              ? "bg-[var(--color-bg-raised)]"
              : "logo-frame-light";
            return (
              <span
                aria-hidden="true"
                className={`absolute -left-24 md:-left-28 top-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-md border border-[var(--color-border-strong)] overflow-hidden shadow-[var(--shadow-card)] ${frameBg}`}
              >
                {e.company.logo ? (
                  <>
                    <Image
                      src={e.company.logo}
                      alt=""
                      width={96}
                      height={96}
                      className={`h-full w-full object-contain p-1 ${hasDark ? "dark:hidden" : ""}`}
                    />
                    {hasDark && (
                      <Image
                        src={e.company.logo_dark as string}
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
            <span>{e.role}</span>
            <span className="text-[var(--color-fg-muted)] font-normal">
              {" · "}
              {e.company.url ? (
                <a
                  href={e.company.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-[var(--color-fg)] hover:underline"
                >
                  {e.company.name}
                </a>
              ) : (
                e.company.name
              )}
            </span>
          </h3>
          {/*
           * LinkedIn-style metadata strip: employment type + mode shown as
           * small text under the role. Both are optional in the schema and
           * collapse silently when absent.
           */}
          {(e.employment_type || e.mode) && (
            <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
              {[e.employment_type, e.mode].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-2 text-[var(--color-fg-muted)] leading-relaxed">{e.summary}</p>
          {i === 0 && (
            <span className="inline-flex items-center gap-1.5 mt-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] bg-[var(--color-status-active-soft)] text-[var(--color-status-active)]">
              {/*
               * "Current" career entry - pulse the indicator dot so the badge
               * reads as live. motion-safe gates the animation for users with
               * prefers-reduced-motion (paired with the NFR-015 reduced-motion
               * override in app/globals.css for belt-and-suspenders).
               */}
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-active)] motion-safe:animate-pulse"
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
