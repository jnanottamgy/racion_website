"use client";

import { useEffect, useRef } from "react";
import { sceneState } from "@/lib/scene-state";

/**
 * Live numeric readouts pulled from the WebGL scene.
 *
 * Written straight to `textContent` on an animation frame rather than held in
 * React state. A lux counter climbing 0 → 1500 is ~1500 renders of the whole
 * subtree if you do it the obvious way, and it is competing for the main thread
 * with the scene it is reporting on.
 */
export function SceneReadout({
  select,
  format = (v) => String(Math.round(v)),
  className,
}: {
  select: (s: typeof sceneState) => number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = "";

    const tick = () => {
      const node = ref.current;
      if (node) {
        const next = format(select(sceneState));
        if (next !== last) {
          node.textContent = next;
          last = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [select, format]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
