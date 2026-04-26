import Link from "next/link";
import { siteConfig } from "#site/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const items = (siteConfig.nav?.primary ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/75 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--color-bg)]/60"
    >
      <Link
        href="/"
        className="font-bold tracking-tight text-[var(--color-fg)] focus-visible:outline-none flex items-center gap-2"
      >
        <span
          aria-hidden="true"
          className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]"
        />
        {siteConfig.site_name}
      </Link>
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="px-3 py-1.5 rounded-md text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="ml-1">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
