"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "#site/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const items = (siteConfig.nav?.primary ?? []).slice().sort((a, b) => a.order - b.order);
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/75 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--color-bg)]/60"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={`${siteConfig.site_name} — home`}
          className="group flex items-center gap-2.5 focus-visible:outline-none"
        >
          <span aria-hidden="true" className="relative inline-flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-[var(--color-accent)]" />
            <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] opacity-40 blur-sm group-hover:opacity-70 transition-opacity" />
          </span>
          <span className="font-bold tracking-tight text-[var(--color-fg)] hidden sm:inline">
            {siteConfig.site_name}
          </span>
          <span className="font-bold tracking-tight text-[var(--color-fg)] sm:hidden">II</span>
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto -mx-1 px-1">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-block px-2.5 py-1.5 sm:px-3 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-subtle)]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-2.5 right-2.5 sm:left-3 sm:right-3 bottom-0 h-[2px] rounded-full bg-[var(--color-accent)]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-1 pl-2 border-l border-[var(--color-border)]">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
