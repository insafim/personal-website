"use client";

import { useEffect, useState } from "react";
import { decodeEmail } from "@/lib/email";

export function EmailContact({ obfuscated }: { obfuscated: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setEmail(decodeEmail(obfuscated));
  }, [obfuscated]);

  // Mounted with JS — render mailto: anchor.
  if (email && revealed) {
    return (
      <a
        href={`mailto:${email}`}
        rel="noopener noreferrer"
        className="text-[var(--color-accent)] underline"
      >
        {email}
      </a>
    );
  }

  // Pre-mount or pre-reveal: show button (no @ in raw HTML — NFR-009).
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="text-[var(--color-accent)] underline"
      aria-label="Reveal contact email"
    >
      Reveal email
    </button>
  );
}
