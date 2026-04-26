"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Prop-tunnel pattern (ADR-007): no application imports here so RSC children
// pass through cleanly without inflating the client bundle.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
