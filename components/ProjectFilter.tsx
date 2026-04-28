"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "#site/content";

// US-027 (could-have): client-side filter on tag, year, tech_stack.
// Velite-emitted JSON is small, so client filtering is trivial - no need for
// a search index at this scale.

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [tech, setTech] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.tags ?? []) set.add(t);
    return [...set].sort();
  }, [projects]);
  const allYears = useMemo(
    () => [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a),
    [projects]
  );
  const allTech = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.tech_stack) set.add(t);
    return [...set].sort();
  }, [projects]);

  const active = tag !== null || year !== null || tech !== null;

  const filtered = projects.filter(
    (p) =>
      (tag === null || (p.tags ?? []).includes(tag)) &&
      (year === null || p.year === year) &&
      (tech === null || p.tech_stack.includes(tech))
  );

  const reset = () => {
    setTag(null);
    setYear(null);
    setTech(null);
  };

  return (
    <div className="mb-10">
      <details className="surface-elevated">
        <summary className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-fg-muted)]">
          <span className="eyebrow text-[10px]">Filter</span>
          <span className="text-[var(--color-fg)]">
            {active ? `${filtered.length} of ${projects.length}` : "All projects"}
          </span>
          <span className="ml-auto text-[var(--color-fg-muted)]">▾</span>
        </summary>
        <div className="px-4 pb-4 grid gap-3 sm:grid-cols-3 text-sm border-t border-[var(--color-border)] pt-4">
          <label className="flex flex-col gap-1">
            <span className="metadata uppercase">Tag</span>
            <select
              value={tag ?? ""}
              onChange={(e) => setTag(e.target.value || null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2 py-1.5 focus-visible:border-[var(--color-accent)]"
            >
              <option value="">All</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="metadata uppercase">Year</span>
            <select
              value={year?.toString() ?? ""}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2 py-1.5 focus-visible:border-[var(--color-accent)]"
            >
              <option value="">All</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="metadata uppercase">Tech</span>
            <select
              value={tech ?? ""}
              onChange={(e) => setTech(e.target.value || null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2 py-1.5 focus-visible:border-[var(--color-accent)]"
            >
              <option value="">All</option>
              {allTech.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        {active && (
          <div className="px-4 pb-4 -mt-2">
            <button
              type="button"
              onClick={reset}
              className="text-xs underline text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              Reset filters
            </button>
          </div>
        )}
      </details>

      {active &&
        (filtered.length === 0 ? (
          <p className="mt-6 text-[var(--color-fg-muted)] text-sm">
            No projects match the selected filters.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="surface-elevated is-interactive block p-4"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-semibold">{p.title}</span>
                    <span className="metadata">{p.year}</span>
                  </div>
                  <p className="metadata uppercase mb-2">{p.category}</p>
                  <ul className="flex flex-wrap gap-1">
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <li
                        key={t}
                        className="text-xs px-1.5 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)] border border-[var(--color-border)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
