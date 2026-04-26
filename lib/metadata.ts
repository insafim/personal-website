import type { Metadata } from "next";
import { siteConfig } from "#site/content";

const SITE_URL = siteConfig.site_url;

export interface BuildMetadataInput {
  path: string; // e.g. "/", "/about", "/projects/omorfia-gis"
  title?: string;
  description?: string;
  ogImage?: string; // absolute or relative; defaults to /og/default
  type?: "website" | "article" | "profile";
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${input.path === "/" ? "" : input.path}`;
  const ogImage = input.ogImage ?? `${SITE_URL}/og/default`;
  const description = input.description ?? "AI/ML Engineer & Researcher";

  return {
    title: input.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: siteConfig.site_name,
      title: input.title,
      description,
      locale: siteConfig.default_locale ?? "en",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [ogImage],
    },
  };
}

export function buildOgMeta(
  input: Pick<BuildMetadataInput, "title" | "description" | "ogImage" | "type">
): Pick<Metadata, "openGraph" | "twitter"> {
  const ogImage = input.ogImage ?? `${SITE_URL}/og/default`;
  return {
    openGraph: {
      type: input.type ?? "website",
      siteName: siteConfig.site_name,
      title: input.title,
      description: input.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  };
}
