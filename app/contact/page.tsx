import type { Metadata } from "next";
import { profile, siteConfig } from "#site/content";
import { EmailContact } from "@/components/EmailContact";
import { PageIntro } from "@/components/PageIntro";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  path: "/contact",
  title: "Contact",
  description: `Get in touch with ${profile.name}.`,
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
            <EmailContact obfuscated={profile.email_obfuscated} />
          </div>

          {/* phone is optional in the Velite Profile schema; the entire block
              (including its top border) is omitted when profile.mdx does not
              set the field, so the layout collapses cleanly without an
              orphan separator above the next subsection. */}
          {profile.phone && (
            <div className="mb-7 border-t border-[var(--color-border)] pt-6">
              <p className="eyebrow mb-3">Phone & WhatsApp</p>
              <p className="text-lg md:text-xl font-medium tabular-nums mb-4">
                {profile.phone}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border-strong)] text-sm font-semibold text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-accent)] transition-colors"
                  aria-label={`Call ${profile.phone}`}
                >
                  <PhoneIcon />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^\d]/g, "")}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border-strong)] text-sm font-semibold text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-accent)] transition-colors"
                  aria-label={`Open WhatsApp chat with ${profile.phone}`}
                >
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          )}

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
            <p className="text-sm text-[var(--color-fg)]">{profile.location}</p>
            {profile.affiliation && (
              <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{profile.affiliation}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// Inline SVGs are used instead of an icon library so the contact page does not
// drag in a runtime dependency for two glyphs. Both follow the editorial tone
// of the rest of the site (currentColor stroke / fill, no fixed brand color).

function PhoneIcon() {
  // Lucide "phone" path. Source: https://lucide.dev/icons/phone (verified 2026-04-28).
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  // Simple-icons WhatsApp path. Source:
  // https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg
  // (verified 2026-04-28). Single path for compactness; uses currentColor so
  // the icon inherits the link's text color rather than the WhatsApp brand
  // green, matching the rest of the contact section's neutral palette.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
