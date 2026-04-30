"use client";

import { useEffect, useState } from "react";
import { decodeEmail } from "@/lib/email";

// "i.m.insaf@gmail.com" -> "i.m.insaf at gmail dot com".
// Calling decodeEmail server-side is safe because toReadable always runs
// on its output before render, so the raw HTML never carries an @ + TLD
// pair (NFR-009 / ADR-015).
function toReadable(email: string): string {
  return email.replace("@", " at ").replace(/\./g, " dot ");
}

export function EmailContact({ obfuscated }: { obfuscated: string }) {
  const [decoded, setDecoded] = useState<string | null>(null);

  useEffect(() => {
    setDecoded(decodeEmail(obfuscated));
  }, [obfuscated]);

  if (decoded) {
    return (
      <a
        href={`mailto:${decoded}`}
        rel="noopener noreferrer"
        className="text-[var(--color-accent)] underline"
      >
        {decoded}
      </a>
    );
  }

  return <span>{toReadable(decodeEmail(obfuscated))}</span>;
}
