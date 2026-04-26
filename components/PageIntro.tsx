import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  utility?: ReactNode;
  variant?: "default" | "accent";
};

export function PageIntro({
  eyebrow,
  title,
  description,
  utility,
  variant = "default",
}: PageIntroProps) {
  const wrapperClass =
    variant === "accent"
      ? "surface-accent px-6 py-10 md:px-10 md:py-12 mb-12"
      : "page-header-bg pt-6 pb-8 mb-10";

  return (
    <header className={wrapperClass}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        <div className="flex-1 min-w-0">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="display text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-fg)] mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-[var(--color-fg-muted)] max-w-prose leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {utility && <div className="shrink-0">{utility}</div>}
      </div>
    </header>
  );
}
