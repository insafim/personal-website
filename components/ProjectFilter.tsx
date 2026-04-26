"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "#site/content";

// US-027 (could-have): client-side filter on tag, year, tech_stack.
// Velite-emitted JSON is small, so client filtering is trivial — no need for
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
    [projects],
  );
  const allTech = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.tech_stack) set.add(t);
    return [...set].sort();
  }, [projects]);

  const filtered = projects.filter(
    (p) =>
      (tag === null || (p.tags ?? []).includes(tag)) &&
      (year === null || p.year === year) &&
      (tech === null || p.tech_stack.includes(tech)),
  );

  const reset = () => {
    setTag(null);
    setYear(null);
    setTech(null);
  };

  return (
    <div className="mb-8">
      <details className="border border-[var(--color-border)] rounded p-3">
        <summary className="cursor-pointer font-medium text-sm text-[var(--color-fg-muted)]">
          Filter ({filtered.length} of {projects.length})
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">Tag</span>
            <select
              value={tag ?? ""}
              onChange={(e) => setTag(e.target.value || null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1"
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
            <span className="text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">Year</span>
            <select
              value={year?.toString() ?? ""}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1"
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
            <span className="text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">Tech</span>
            <select
              value={tech ?? ""}
              onChange={(e) => setTech(e.target.value || null)}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1"
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
        {(tag || year || tech) && (
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-xs underline text-[var(--color-fg-muted)]"
          >
            Reset filters
          </button>
        )}
      </details>

      {filtered.length === 0 ? (
        <p className="mt-6 text-[var(--color-fg-muted)] text-sm">No projects match the selected filters.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="block border border-[var(--color-border)] rounded p-4 hover:border-[var(--color-accent)]"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-semibold">{p.title}</span>
                  <span className="text-xs font-mono text-[var(--color-fg-muted)]">{p.year}</span>
                </div>
                <p className="text-xs text-[var(--color-fg-muted)] mb-2 capitalize">{p.category}</p>
                <ul className="flex flex-wrap gap-1">
                  {p.tech_stack.slice(0, 4).map((t) => (
                    <li
                      key={t}
                      className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-fg-muted)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
