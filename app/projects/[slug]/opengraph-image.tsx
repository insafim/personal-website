import { ImageResponse } from "next/og";
import { projects } from "#site/content";
import { getOgFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return projects.map((p) => ({ id: p.slug, alt: p.title }));
}

export default async function ProjectOgImage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return new ImageResponse(<div>Not found</div>, size);

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
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0f5278 0%, #2878a0 100%)",
        color: "white",
        padding: "80px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.7, textTransform: "uppercase", letterSpacing: 2 }}>
        {project.affiliation} · {project.year}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{project.title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {project.tech_stack.slice(0, 5).map((t) => (
          <span
            key={t}
            style={{
              fontSize: 22,
              padding: "6px 14px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.15)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>,
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
