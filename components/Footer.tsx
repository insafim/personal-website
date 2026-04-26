import { siteConfig } from "#site/content";

export function Footer() {
  const social = (siteConfig.nav?.social ?? []).slice().sort((a, b) => a.order - b.order);
  const footerLinks = (siteConfig.nav?.footer ?? []).slice().sort((a, b) => a.order - b.order);
  const year = new Date().getFullYear();

  return (
    <div className="px-4 py-8 border-t border-[var(--color-border)] text-sm text-[var(--color-fg-muted)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <p>
        © {year} {siteConfig.site_name}
      </p>
      <ul className="flex flex-wrap gap-4">
        {footerLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...(link.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
              className="hover:text-[var(--color-fg)] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
        {social.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-[var(--color-fg)] transition-colors"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
