import Link from "next/link";
import type { Project, Publication } from "#site/content";

type HomeSignalsProps = {
  latestPublication: Publication | undefined;
  featuredProject: Project | undefined;
};

// Two cards by design (latest publication + featured project) so the home page
// stays a tight scannable pitch and lets the about page own narrative content
// like "currently" / "open to roles". The SignalCard `live` prop is intentionally
// preserved for future use (e.g. a now-page-style update) even though no card
// sets it today.
export function HomeSignals({ latestPublication, featuredProject }: HomeSignalsProps) {
  return (
    <section aria-label="Current signals" className="px-4 pb-16 max-w-5xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2">
        {latestPublication && (
          <SignalCard
            label="Latest publication"
            color="research"
            title={latestPublication.title}
            meta={`${latestPublication.venue} · ${latestPublication.year}`}
            href={`/publications/${latestPublication.slug}`}
          />
        )}
        {featuredProject && (
          <SignalCard
            label="Featured project"
            color="enterprise"
            title={featuredProject.title}
            meta={`${featuredProject.category} · ${featuredProject.year}`}
            href={`/projects/${featuredProject.slug}`}
          />
        )}
      </div>
    </section>
  );
}

function SignalCard({
  label,
  color,
  title,
  meta,
  href,
  live = false,
}: {
  label: string;
  color: "research" | "enterprise" | "independent";
  title: string;
  meta: string;
  href: string;
  // When true, renders a pulsing accent dot next to the label as a "now"
  // freshness signal. Animation is gated by motion-safe so reduced-motion
  // users see a static dot. Pattern borrowed from leerob.com.
  live?: boolean;
}) {
  const accent =
    color === "research"
      ? "var(--color-research)"
      : color === "enterprise"
        ? "var(--color-enterprise)"
        : "var(--color-independent)";

  return (
    <Link
      href={href}
      data-live={live ? "" : undefined}
      className="surface-elevated is-interactive group block p-5 relative overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: accent }}
      />
      <p
        className={`text-[10px] font-mono font-semibold uppercase tracking-[0.18em] mb-2${
          live ? " inline-flex items-center gap-1.5" : ""
        }`}
        style={{ color: accent }}
      >
        {live && (
          <span
            aria-hidden="true"
            className="inline-block w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
            style={{ background: accent }}
          />
        )}
        {label}
      </p>
      <h3 className="text-base font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-fg-muted)] line-clamp-2">{meta}</p>
    </Link>
  );
}
