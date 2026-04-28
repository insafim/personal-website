import type { Metadata } from "next";
import { siteConfig } from "#site/content";

const SITE_URL = siteConfig.site_url;
const DEFAULT_TITLE = "Insaf Ismath - AI/ML Engineer & Researcher";

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
  const socialTitle = input.title ? `${input.title} - ${siteConfig.site_name}` : DEFAULT_TITLE;

  const metadata: Metadata = {
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: siteConfig.site_name,
      title: socialTitle,
      description,
      locale: siteConfig.default_locale ?? "en",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };

  metadata.title = input.title ?? { absolute: DEFAULT_TITLE };

  return metadata;
}

export function buildOgMeta(
  input: Pick<BuildMetadataInput, "title" | "description" | "ogImage" | "type">
): Pick<Metadata, "openGraph" | "twitter"> {
  const ogImage = input.ogImage ?? `${SITE_URL}/og/default`;
  const socialTitle = input.title ? `${input.title} - ${siteConfig.site_name}` : DEFAULT_TITLE;

  return {
    openGraph: {
      type: input.type ?? "website",
      siteName: siteConfig.site_name,
      title: socialTitle,
      description: input.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: [ogImage],
    },
  };
}
