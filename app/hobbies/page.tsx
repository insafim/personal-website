import type { Metadata } from "next";
import { hobbies } from "#site/content";
import { PageIntro } from "@/components/PageIntro";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/hobbies",
  title: "Hobbies",
  description: "Padel, karting, running, football — the human side.",
});

type Accent = { fg: string; soft: string };
const ACCENTS: readonly [Accent, Accent, Accent, Accent] = [
  { fg: "var(--color-research)", soft: "var(--color-research-soft)" },
  { fg: "var(--color-enterprise)", soft: "var(--color-enterprise-soft)" },
  { fg: "var(--color-independent)", soft: "var(--color-independent-soft)" },
  { fg: "var(--color-accent)", soft: "var(--color-accent-soft)" },
];

export default function HobbiesPage() {
  const sorted = [...hobbies].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="px-4 max-w-4xl mx-auto pt-12 pb-20">
      <PageIntro
        eyebrow="The human side"
        title="Off the keyboard"
        description="What I'm doing when I'm not in a terminal. Each one teaches me something I bring back to work."
      />

      <div className="space-y-12">
        {sorted.map((h, i) => {
          const accent: Accent = ACCENTS[(i % 4) as 0 | 1 | 2 | 3];
          return (
            <section key={h.title} className="surface-elevated relative overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ background: accent.fg }}
              />
              <div className="p-6 md:p-8 pl-7 md:pl-9">
                <div className="flex items-baseline gap-3 mb-3">
                  <h2
                    className="display text-3xl md:text-4xl font-bold tracking-tight"
                    style={{ color: accent.fg }}
                  >
                    {h.title}
                  </h2>
                  <span className="metadata" style={{ background: accent.soft, color: accent.fg }}>
                    <span className="px-2 py-0.5 rounded-full">
                      № {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                </div>
                <p className="text-base md:text-lg text-[var(--color-fg-muted)] mb-6 max-w-prose leading-relaxed">
                  {h.description}
                </p>
                <ul className="space-y-3">
                  {h.anecdotes.map((a) => (
                    <li key={a.slice(0, 60)} className="flex gap-3 leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1 h-1 rounded-full shrink-0"
                        style={{ background: accent.fg }}
                      />
                      <span className="text-[var(--color-fg)]">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
