import type { MetadataRoute } from "next";
import { hobbies, projects, publications, resources, siteConfig } from "#site/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.site_url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/projects",
    "/publications",
    "/resources",
    "/beyond",
    "/contact",
  ].map((path) => ({ url: `${base}${path}`, lastModified: now }));

  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
  }));
  const pubPages = publications.map((p) => ({
    url: `${base}/publications/${p.slug}`,
    lastModified: now,
  }));

  // resources + beyond entries are list-only (no detail routes at MVP)
  void resources;
  void hobbies;

  return [...staticPages, ...projectPages, ...pubPages];
}
