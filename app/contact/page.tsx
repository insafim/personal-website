import type { Metadata } from "next";
import { person, siteConfig } from "#site/content";
import { EmailContact } from "@/components/EmailContact";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/contact",
  title: "Contact",
  description: `Get in touch with ${person.name}.`,
});

export default function ContactPage() {
  const social = (siteConfig.nav?.social ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <section className="px-4 py-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact</h1>
      <p className="mb-2">Email:</p>
      <p className="mb-8">
        <EmailContact obfuscated={person.email_obfuscated} />
      </p>
      <h2 className="text-xl font-semibold mb-3">Elsewhere</h2>
      <ul className="flex flex-wrap gap-4">
        {social.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              rel="noopener noreferrer"
              target="_blank"
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] underline"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
