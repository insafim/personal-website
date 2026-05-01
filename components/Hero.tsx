import Image from "next/image";
import Link from "next/link";
import type { Home, Profile } from "#site/content";

// Split props by content file: profile carries identity (name, photo, bio
// summary, location), home carries Hero-only knobs (specialization pills).
// This mirrors the content/profile.mdx + content/home.mdx split so a content
// edit and a render edit map cleanly to one file each.
export function Hero({ profile, home }: { profile: Profile; home: Home }) {
  return (
    <section className="hero-glow px-4 pt-20 pb-14 max-w-5xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">
        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-3">
            {profile.location}
            {profile.affiliation ? ` · ${profile.affiliation}` : ""}
          </p>
          <h1 className="display text-5xl md:text-7xl font-bold mb-4 leading-[1.02] tracking-tight">
            {profile.name}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-fg-muted)] mb-6 font-medium">
            {profile.title}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-prose leading-relaxed">
            {profile.bio_short}
          </p>
          <ul className="flex flex-wrap gap-2 mb-9">
            {home.specializations.map((s) => (
              <li
                key={s}
                className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            {(profile.cv_dev_url || profile.cv_research_url) && (
              <div className="flex flex-wrap gap-3 items-center">
                {profile.cv_dev_url && (
                  <a
                    href={profile.cv_dev_url}
                    download
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
                  >
                    CV
                    <span aria-hidden="true">↓</span>
                  </a>
                )}
                {profile.cv_research_url && (
                  <a
                    href={profile.cv_research_url}
                    download
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
                  >
                    Research CV
                    <span aria-hidden="true">↓</span>
                  </a>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/publications"
                className="px-5 py-2.5 rounded-md border border-[var(--color-border-strong)] font-semibold hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                View Publications
              </Link>
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-md border border-[var(--color-border-strong)] font-semibold hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                See Projects
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2.5 font-semibold text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </div>
        <div className="shrink-0 self-start md:self-center">
          <div className="avatar-frame">
            <div className="rounded-full overflow-hidden bg-[var(--color-bg-raised)] w-40 h-40 md:w-56 md:h-56">
              <Image
                src={profile.avatar_url}
                alt={`Portrait of ${profile.name}`}
                width={224}
                height={224}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
