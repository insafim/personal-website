"use client";

import { useState } from "react";

interface BibTeXBlockProps {
  bibtex: string;
}

export function BibTeXBlock({ bibtex }: BibTeXBlockProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const fallbackCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = bibtex;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const onCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(bibtex);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } else if (fallbackCopy()) {
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("failed");
      }
    } catch {
      if (fallbackCopy()) {
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("failed");
      }
    }
  };

  return (
    <section className="surface-elevated my-8 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 md:px-6">
        <span className="eyebrow">BibTeX</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {status === "copied" ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[var(--color-bg-subtle)] p-5 text-sm leading-relaxed md:p-6">
        <code>{bibtex}</code>
      </pre>
      <p aria-live="polite" className="sr-only">
        {status === "copied"
          ? "BibTeX copied to clipboard"
          : status === "failed"
            ? "Copy failed"
            : ""}
      </p>
    </section>
  );
}
