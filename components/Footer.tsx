import { profile, siteConfig } from "#site/content";
import { EmailContact } from "@/components/EmailContact";
import { SocialIcon } from "@/components/SocialIcon";

export function Footer() {
  const social = (siteConfig.nav?.social ?? []).slice().sort((a, b) => a.order - b.order);
  const footerLinks = (siteConfig.nav?.footer ?? []).slice().sort((a, b) => a.order - b.order);
  const year = new Date().getFullYear();
  const links = [...footerLinks, ...social.map((item) => ({ ...item, external: true }))];

  return (
    <div className="border-t border-[var(--color-border)] px-4 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="surface-elevated px-5 py-6 md:px-6 md:py-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="display text-2xl font-semibold tracking-tight text-[var(--color-fg)] md:text-3xl">
                {siteConfig.site_name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                AI projects, research, writing, and the occasional side trail outside work.
              </p>
              {/* Email kept behind the EmailContact reveal control so the raw
                  HTML stays free of an @ + TLD pair, matching the obfuscation
                  pattern used in EmailContact.tsx and lib/email.ts. Phone is
                  already exposed in plain on /contact, so duplicating it here
                  doesn't widen the threat surface. */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-fg-muted)]">
                <EmailContact obfuscated={profile.email_obfuscated} />
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="tabular-nums hover:text-[var(--color-fg)]"
                    aria-label={`Call ${profile.phone}`}
                  >
                    {profile.phone}
                  </a>
                )}
              </div>
            </div>

            <ul className="flex flex-wrap gap-2 md:max-w-md md:justify-end">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
                  >
                    <SocialIcon label={link.label} />
                    <span>{link.label}</span>
                    {link.external && <span aria-hidden="true">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-fg-muted)]">
            <p className="metadata">© {year} {siteConfig.site_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
