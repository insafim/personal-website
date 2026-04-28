"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Mount guard to avoid hydration mismatch - server can't know the client's theme.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span aria-hidden="true" className="inline-block w-6 h-6" />;
  }

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      aria-pressed={isDark}
      onClick={() => setTheme(next)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)] focus-visible:outline-none"
    >
      {isDark ? "☼" : "☾"}
    </button>
  );
}
