import type { Metadata } from "next";
import { hobbies } from "#site/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/hobbies",
  title: "Hobbies",
  description: "Padel, karting, running, football — the human side.",
});

export default function HobbiesPage() {
  const sorted = [...hobbies].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <section className="px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Hobbies</h1>
      <div className="space-y-12">
        {sorted.map((h) => (
          <section key={h.title}>
            <h2 className="text-2xl font-semibold mb-2">{h.title}</h2>
            <p className="text-[var(--color-fg-muted)] mb-4">{h.description}</p>
            <ul className="space-y-3 list-disc list-inside">
              {h.anecdotes.map((a) => (
                <li key={a.slice(0, 60)}>{a}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
