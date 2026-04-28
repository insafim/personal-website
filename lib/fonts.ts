import { Inter } from "next/font/google";

// Inter weights constrained to 400/600/700 per ADR-006 - full variable range
// is ~160KB, three static subset files total ~40KB. NFR-001 LCP budget on
// Slow 3G depends on this constraint.
//
// next/font/google self-hosts the font files at build time (no runtime
// Google Fonts requests, automatic size-adjust for zero CLS, font-display: swap).
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
