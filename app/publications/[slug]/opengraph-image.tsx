import { ImageResponse } from "next/og";
import { publications } from "#site/content";
import { interBold, interRegular, ogFontsAvailable } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return publications.map((p) => ({ id: p.slug, alt: p.title }));
}

export default async function PublicationOgImage({ params }: { params: { slug: string } }) {
  const pub = publications.find((p) => p.slug === params.slug);
  if (!pub) return new ImageResponse(<div>Not found</div>, size);

  const fonts = ogFontsAvailable()
    ? [
        { name: "Inter", data: interRegular!, weight: 400 as const, style: "normal" as const },
        { name: "Inter", data: interBold!, weight: 700 as const, style: "normal" as const },
      ]
    : undefined;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0f5278 0%, #2878a0 100%)",
        color: "white",
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.7, textTransform: "uppercase", letterSpacing: 2 }}>
        {pub.venue} · {pub.year}
      </div>
      <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>{pub.title}</div>
      <div style={{ fontSize: 22, opacity: 0.85 }}>
        {pub.authors.join(", ")} · {pub.authorship_order} author
      </div>
    </div>,
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
