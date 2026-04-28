"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { person, siteConfig } from "#site/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav() {
  const items = (siteConfig.nav?.primary ?? []).slice().sort((a, b) => a.order - b.order);
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  // Close the mobile menu when the route changes so a tap on a link doesn't
  // leave the panel hanging open over the next page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu (WCAG dialog dismissal pattern, applied here to a
  // dropdown panel for keyboard parity with the click-outside behavior).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the panel is open so swipes scroll the menu, not
  // the page beneath it. Restoring the original value (rather than blanking it)
  // preserves any inline overflow set elsewhere.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/82 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--color-bg)]/68"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
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

        {/* Desktop controls: full menu + theme toggle inline. */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <ul className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)]/92 p-1 shadow-[var(--shadow-card)]">
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

        {/* Mobile controls: theme toggle + hamburger; menu lives in the
            dropdown panel below. */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)]/92 p-1 shadow-[var(--shadow-card)]">
            <ThemeToggle />
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)]/92 text-lg text-[var(--color-fg)] shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-bg-subtle)]"
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden"
        >
          <ul className="flex flex-col gap-1 p-3">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-4 py-3 text-base font-medium transition-colors ${
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
        </div>
      )}
    </nav>
  );
}
