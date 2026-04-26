"use client";

import { useState } from "react";

export function BibTeXBlock({ bibtex }: { bibtex: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const onCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(bibtex);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm uppercase tracking-wide text-[var(--color-fg-muted)]">BibTeX</span>
        <button
          type="button"
          onClick={onCopy}
          className="px-3 py-1 text-sm rounded border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
        >
          {status === "copied" ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 rounded bg-[var(--color-bg-subtle)] text-sm">
        <code>{bibtex}</code>
      </pre>
      <p aria-live="polite" className="sr-only">
        {status === "copied"
          ? "BibTeX copied to clipboard"
          : status === "failed"
            ? "Copy failed"
            : ""}
      </p>
    </div>
  );
}
