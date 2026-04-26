// ADR-015 email obfuscation. Person.email_obfuscated stores the email as base64.
// This helper decodes it client-side so the raw HTML never contains an @ + TLD pair.

export function decodeEmail(encoded: string): string {
  try {
    if (typeof atob === "function") return atob(encoded);
    // Node fallback (used in tests)
    return Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return "";
  }
}

export function encodeEmail(plain: string): string {
  if (typeof btoa === "function") return btoa(plain);
  return Buffer.from(plain, "utf8").toString("base64");
}
