"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { person, siteConfig } from "#site/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const items = (siteConfig.nav?.primary ?? []).slice().sort((a, b) => a.order - b.order);
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/82 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--color-bg)]/68"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          aria-label={`${siteConfig.site_name}, home`}
          className="group flex min-w-0 items-center gap-3 rounded-full pr-3 focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="relative inline-block h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-raised)] shadow-[var(--shadow-card)] transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            {/*
             * `alt=""` is intentional - the parent <Link> at the top of this
             * file already carries `aria-label`, so the image is decorative to
             * assistive tech. Setting alt="Insaf Ismath" would create a
             * duplicate screen-reader announcement.
             *
             * `priority` matches the Hero's usage of the same asset and
             * preloads it for sticky-nav above-the-fold rendering on every
             * route (LCP candidate on non-home pages where Hero is absent).
             */}
            <Image
              src={person.avatar_url}
              alt=""
              width={40}
              height={40}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight text-[var(--color-fg)] sm:text-lg">
              {siteConfig.site_name}
            </span>
          </span>
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <ul className="flex items-center gap-1 overflow-x-auto rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)]/92 p-1 shadow-[var(--shadow-card)]">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    /*
                     * Active-state pattern (Distill / colah / Lil'Log convention):
                     * keep the soft accent-fill pill AND add an accent-colored
                     * text underline to give a stronger "you are here" signal
                     * than the fill alone. Inspired by:
                     * https://distill.pub (verified 2026-04-27).
                     */
                    className={`relative inline-block rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-fg)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-[6px]"
                        : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)]/92 p-1 shadow-[var(--shadow-card)]">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
