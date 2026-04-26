import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { build } from "velite";

// Run Velite at config-load (ADR-002) — top-level await, NOT VeliteWebpackPlugin.
const isDev = process.env.NODE_ENV === "development";
await build({ watch: isDev, clean: true });

// Parse content/redirects.yaml at build time so next.config emits them.
let parsedRedirects = [];
try {
  const raw = readFileSync(join(process.cwd(), "content", "redirects.yaml"), "utf8");
  const data = yaml.load(raw);
  parsedRedirects = data?.entries ?? [];
} catch {
  // No redirects.yaml — fine.
}

const isProd = process.env.VERCEL_ENV === "production";

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // ADR-010: 'unsafe-inline' tradeoff for RSC hydration
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://avatars.githubusercontent.com https://arxiv.org",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  },
  ...(isProd ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/og/:path*",
        headers: [
          { key: "Cache-Control", value: "public, immutable, no-transform, max-age=31536000" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, immutable, max-age=31536000" }],
      },
    ];
  },
  async redirects() {
    return parsedRedirects.map((r) => ({
      source: r.from_path,
      destination: r.to_path,
      permanent: r.status_code === 301 || r.status_code === 308,
    }));
  },
};

export default config;
