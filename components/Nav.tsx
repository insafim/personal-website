import Link from "next/link";
import { siteConfig } from "#site/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const items = (siteConfig.nav?.primary ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <nav
      aria-label="Primary"
      className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-border)]"
    >
      <Link href="/" className="font-bold text-[var(--color-fg)] focus-visible:outline-none">
        {siteConfig.site_name}
      </Link>
      <ul className="flex items-center gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
