import { ImageResponse } from "next/og";
import { person, siteConfig } from "#site/content";
import { getOgFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

// SEC-005 / PERF-002: this route ignores all query strings and uses ONLY
// build-time data (person, siteConfig). Identical bytes regardless of any
// ?attacker=1 input. Fonts loaded at module scope in lib/og-fonts.ts.
export async function GET() {
  const og = getOgFonts();
  const fonts = og
    ? [
        { name: "Inter", data: og.regular, weight: 400 as const, style: "normal" as const },
        { name: "Inter", data: og.bold, weight: 700 as const, style: "normal" as const },
      ]
    : undefined;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f5278 0%, #2878a0 100%)",
        color: "white",
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>{person.name}</div>
      <div style={{ fontSize: 40, fontWeight: 400, marginTop: 16, opacity: 0.9 }}>
        {person.title}
      </div>
      <div style={{ fontSize: 28, marginTop: 32, opacity: 0.8 }}>{siteConfig.site_url}</div>
    </div>,
    {
      width: 1200,
      height: 630,
      ...(fonts ? { fonts } : {}),
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    }
  );
}
