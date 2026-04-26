import Image from "next/image";
import Link from "next/link";
import type { Person } from "#site/content";

export function Hero({ person }: { person: Person }) {
  return (
    <section className="hero-glow px-4 pt-20 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            {person.location}
            {person.affiliation ? ` · ${person.affiliation}` : ""}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-[1.05] tracking-tight">
            {person.name}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-fg-muted)] mb-6 font-medium">
            {person.title}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-prose leading-relaxed">
            {person.bio_short}
          </p>
          <ul className="flex flex-wrap gap-2 mb-8">
            {person.specializations.map((s) => (
              <li
                key={s}
                className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/publications"
              className="px-5 py-2.5 rounded-md bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold shadow-sm hover:opacity-90 transition-opacity"
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
        <div className="shrink-0 self-start md:self-center">
          <div className="avatar-frame">
            <div className="rounded-full overflow-hidden bg-[var(--color-bg-raised)] w-40 h-40 md:w-56 md:h-56">
              <Image
                src={person.avatar_url}
                alt={`Portrait of ${person.name}`}
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
