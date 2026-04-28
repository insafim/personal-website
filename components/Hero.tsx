import Image from "next/image";
import Link from "next/link";
import type { Person } from "#site/content";

export function Hero({ person }: { person: Person }) {
  const highlights = [
    { label: "Based in", value: person.location },
    ...(person.affiliation ? [{ label: "Currently", value: person.affiliation }] : []),
    {
      label: "Focus",
      value: person.specializations.slice(0, 2).join(" · "),
    },
  ];

  return (
    <section className="hero-glow px-4 pt-20 pb-14 max-w-5xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">
        <div className="flex-1 min-w-0">
          <p className="eyebrow mb-3">
            {person.location}
            {person.affiliation ? ` · ${person.affiliation}` : ""}
          </p>
          <h1 className="display text-5xl md:text-7xl font-bold mb-4 leading-[1.02] tracking-tight">
            {person.name}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-fg-muted)] mb-6 font-medium">
            {person.title}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-prose leading-relaxed">
            {person.bio_short}
          </p>
          <ul className="flex flex-wrap gap-2 mb-9">
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

          <div className="surface-elevated mt-8 px-5 py-4 md:px-6 md:py-5">
            <dl className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label}>
                  <dt className="metadata uppercase mb-1">{item.label}</dt>
                  <dd className="text-sm leading-relaxed text-[var(--color-fg)] md:text-base">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
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
