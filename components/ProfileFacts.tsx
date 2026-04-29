import Link from "next/link";
import type { Home, Profile } from "#site/content";

// Same split as Hero: profile holds identity (location, affiliation, social
// URLs), home holds the specialization pills. Caller (app/about/page.tsx)
// passes both so this aside can render without re-merging in the page.
export function ProfileFacts({ profile, home }: { profile: Profile; home: Home }) {
  return (
    <aside
      aria-label="At a glance"
      className="surface-elevated p-5 md:p-6 sticky top-20 self-start"
    >
      <p className="eyebrow mb-4">At a glance</p>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="metadata uppercase mb-1">Based in</dt>
          <dd className="text-[var(--color-fg)]">{profile.location}</dd>
        </div>
        {profile.affiliation && (
          <div>
            <dt className="metadata uppercase mb-1">Currently</dt>
            <dd className="text-[var(--color-fg)]">{profile.affiliation}</dd>
          </div>
        )}
        <div>
          <dt className="metadata uppercase mb-2">Focus areas</dt>
          <dd>
            <ul className="flex flex-wrap gap-1.5">
              {home.specializations.map((s) => (
                <li
                  key={s}
                  className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="metadata uppercase mb-2">Reach me</dt>
          <dd>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-[var(--color-accent)] hover:underline font-medium"
                >
                  Get in touch →
                </Link>
              </li>
              <li>
                <a
                  href={profile.linkedin_url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href={profile.github_url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href={profile.scholar_url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                >
                  Google Scholar ↗
                </a>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
