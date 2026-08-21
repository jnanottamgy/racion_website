"use client";

import { useEffect, useRef, useState } from "react";
import { frameworkComparison } from "@/content/systems";
import { sceneState } from "@/lib/scene-state";

type Method = "raceon" | "typical";

/**
 * The framework comparison, driving the 3D scene directly.
 *
 * Selecting a method cross-fades the framework in the canvas behind, so the
 * visitor is comparing two real constructions rather than two illustrations of
 * them. Someone evaluating a build method wants to flick back and forth, and
 * this lets them.
 *
 * Stated as a difference in construction, not a verdict: RACEON has supplied
 * the method but not comparative load or deflection data, so the site says what
 * each arrangement *is* and leaves the judgement to a reader who builds courts
 * for a living.
 */
export function MethodComparison() {
  const [method, setMethod] = useState<Method>("raceon");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sceneState.method = method === "typical" ? 1 : 0;
  }, [method]);

  // Scrolling past the comparison must not leave the canvas showing the other
  // method for the rest of the page.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setMethod("raceon");
          sceneState.method = 0;
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    sceneState.method = 0;
  }, []);

  return (
    <div ref={ref} className="mt-12">
      <p className="label mb-4">Compare the framework</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["raceon", "typical"] as const).map((key) => {
          const panel = frameworkComparison[key];
          const active = method === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMethod(key)}
              onMouseEnter={() => setMethod(key)}
              onFocus={() => setMethod(key)}
              aria-pressed={active}
              className={`border p-5 text-left transition-colors duration-300 ${
                active
                  ? "border-accent bg-stage-raised/80"
                  : "border-hairline bg-stage/50 hover:border-hairline-bright"
              }`}
            >
              <span
                className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${
                  active ? "text-accent-text" : "text-bone-faint"
                }`}
              >
                {panel.subtitle}
              </span>
              <span className="mt-2 block text-bone">{panel.title}</span>
              <ul className="mt-4 space-y-1.5">
                {panel.points.map((point) => (
                  <li
                    key={point}
                    className="text-sm leading-snug text-bone-dim"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <p className="label mt-4">
        Shown as a difference in construction — not a performance claim
      </p>
    </div>
  );
}
