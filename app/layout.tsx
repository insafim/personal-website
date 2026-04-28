import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://insafismath.com"),
  title: {
    default: "Insaf Ismath - AI/ML Engineer & Researcher",
    template: "%s - Insaf Ismath",
  },
  description:
    "AI/ML Engineer translating business problems into end-to-end enterprise-scale AI systems, with published research on large multimodal models at EMNLP and CVPR.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      {/*
       * suppressHydrationWarning on <body> too: browser extensions like
       * Grammarly inject `data-new-gr-c-s-check-loaded` and
       * `data-gr-ext-installed` attributes on the body before React hydrates,
       * producing a noisy console error that is not actionable from our code.
       * Source: https://nextjs.org/docs/messages/react-hydration-error
       */}
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider>
          <header>
            <Nav />
          </header>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
