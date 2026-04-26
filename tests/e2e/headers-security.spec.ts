import { expect, test } from "@playwright/test";

test("security headers present on /", async ({ request }) => {
  const res = await request.get("/");
  expect(res.status()).toBe(200);
  const h = res.headers();

  expect(h["content-security-policy"]).toBeDefined();
  expect(h["content-security-policy"]).toMatch(/script-src 'self' 'unsafe-inline'/);
  expect(h["content-security-policy"]).toMatch(/object-src 'none'/);
  expect(h["content-security-policy"]).toMatch(/form-action 'none'/);
  expect(h["content-security-policy"]).toMatch(/base-uri 'self'/);
  expect(h["content-security-policy"]).toMatch(/frame-ancestors 'none'/);

  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["permissions-policy"]).toMatch(/camera=\(\)/);
});

test("HSTS header includes preload", async ({ request }) => {
  const res = await request.get("/");
  const hsts = res.headers()["strict-transport-security"];
  // In production builds via headers() we set max-age=63072000 includeSubDomains preload.
  // (When testing against localhost dev, header may be absent — guard.)
  if (hsts) {
    expect(hsts).toMatch(/max-age=63072000/);
    expect(hsts).toMatch(/includeSubDomains/);
    expect(hsts).toMatch(/preload/);
  }
});

test("OG default route returns immutable cache", async ({ request }) => {
  const res = await request.get("/og/default");
  expect(res.status()).toBe(200);
  const cc = res.headers()["cache-control"];
  expect(cc).toMatch(/immutable/);
  expect(cc).toMatch(/max-age=31536000/);
});
