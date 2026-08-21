"use client";

import { useMemo, useState } from "react";
import {
  SCOPE_LABELS,
  projects,
  type Scope,
} from "@/content/projects";

type Filter = Scope | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "court", label: "Wooden courts" },
  { key: "court-lighting", label: "Court + lighting" },
  { key: "lighting", label: "Lighting" },
  { key: "institutional", label: "Government & institutional" },
];

/**
 * The project schedule, filterable by scope.
 *
 * Sorted by court count rather than alphabetically: the ten-court Karnataka
 * Badminton Association job is the one that wins the next contract, and burying
 * it under "Audugodi" because A comes first would be a strange thing to do with
 * the strongest asset the business has.
 */
export function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    const list =
      filter === "all" ? projects : projects.filter((p) => p.scope === filter);
    return [...list].sort((a, b) => b.courts - a.courts);
  }, [filter]);

  const courts = shown.reduce((n, p) => n + p.courts, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`border px-4 py-2 text-sm transition-colors duration-300 ${
                active
                  ? "border-accent text-accent-text"
                  : "border-hairline text-bone-dim hover:border-hairline-bright hover:text-bone"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="label mt-6" aria-live="polite">
        {shown.length} {shown.length === 1 ? "site" : "sites"} · {courts} courts
      </p>

      <ul className="mt-10 border-t border-hairline">
        {shown.map((p) => (
          <li
            key={p.slug}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-hairline py-5 sm:grid-cols-[1.4fr_1fr_auto]"
          >
            <span className="text-bone">{p.name}</span>
            <span className="order-3 font-mono text-xs uppercase tracking-[0.14em] text-bone-faint sm:order-none">
              {SCOPE_LABELS[p.scope]}
            </span>
            <span className="text-right">
              <span className="font-mono text-lg text-accent-text">
                {p.courts}
              </span>
              <span className="ml-2 text-xs text-bone-faint">
                {p.courts === 1 ? "court" : "courts"}
              </span>
              <span className="mt-0.5 block text-xs text-bone-faint">
                {p.location}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
