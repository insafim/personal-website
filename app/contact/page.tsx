import type { Metadata } from "next";
import { person, siteConfig } from "#site/content";
import { EmailContact } from "@/components/EmailContact";
import { PageIntro } from "@/components/PageIntro";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/contact",
  title: "Contact",
  description: `Get in touch with ${person.name}.`,
});

const REACH_OUT_REASONS = [
  "Senior AI/ML, Forward Deployed Engineer, or AI Applied Scientist roles in Abu Dhabi or Dubai",
  "Research collaborations on multimodal LLMs, vision-language calibration, or evaluation",
  "Speaking, podcast, or panel invitations on enterprise AI and applied research",
];

export default function ContactPage() {
  const social = (siteConfig.nav?.social ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <div className="px-4 max-w-4xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="Get in touch"
        title="Contact"
        description="The fastest way to reach me is email. I read everything; I reply to most messages within a few days."
      />

      <div className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="surface-accent px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow mb-3">Email</p>
          <h2 className="display text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Send a note
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] mb-5 max-w-prose">
            One line on what you're working on and how I can help. Specific is better than long.
          </p>
          <div className="text-lg md:text-xl mb-7">
            <EmailContact obfuscated={person.email_obfuscated} />
          </div>

          <div className="border-t border-[var(--color-border)] pt-6">
            <p className="metadata uppercase mb-3">Especially keen to hear about</p>
            <ul className="space-y-2.5">
              {REACH_OUT_REASONS.map((reason) => (
                <li key={reason} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="surface-elevated p-5 md:p-6 self-start">
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-3">
            {social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="group flex items-center justify-between gap-3 px-3 py-2 -mx-3 rounded-md hover:bg-[var(--color-bg-subtle)] transition-colors"
                >
                  <span className="text-sm font-medium text-[var(--color-fg)]">{s.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
            <p className="metadata uppercase mb-2">Based in</p>
            <p className="text-sm text-[var(--color-fg)]">{person.location}</p>
            {person.affiliation && (
              <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{person.affiliation}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
