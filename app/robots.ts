import type { MetadataRoute } from "next";
import { siteConfig } from "#site/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.ai_crawler_allowlist.map((userAgent) => ({
      userAgent,
      allow: "/",
    })),
    sitemap: `${siteConfig.site_url}/sitemap.xml`,
    host: siteConfig.site_url,
  };
}
