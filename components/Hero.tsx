import Link from "next/link";
import type { Person } from "#site/content";

export function Hero({ person }: { person: Person }) {
  return (
    <section className="px-4 pt-16 pb-12 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{person.name}</h1>
      <p className="text-xl text-[var(--color-fg)] mb-1">{person.title}</p>
      <address className="not-italic text-sm text-[var(--color-fg-muted)] mb-6">
        {person.location}
        {person.affiliation ? ` · ${person.affiliation}` : ""}
      </address>
      <p className="text-base mb-6 max-w-prose">{person.bio_short}</p>
      <ul className="flex flex-wrap gap-2 mb-8">
        {person.specializations.map((s) => (
          <li
            key={s}
            className="px-2 py-1 text-xs rounded border border-[var(--color-border)] text-[var(--color-fg-muted)]"
          >
            {s}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/publications"
          className="px-4 py-2 rounded bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-medium"
        >
          View Publications
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2 rounded border border-[var(--color-border)] font-medium"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
