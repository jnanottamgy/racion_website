"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { photography } from "@/content/photography";
import { BEATS, sceneState } from "@/lib/scene-state";

/**
 * The narrative for anyone who isn't getting the canvas.
 *
 * Reduced motion, no WebGL, a software renderer, a metered connection — all of
 * them land here, and this is not a placeholder. It is the same nine-beat story
 * told in RACEON's own photographs, cross-faded on the same scroll progress that
 * drives the 3D. The copy above it never changes, so nothing has to be written
 * twice and nothing can go out of sync.
 *
 * Cross-fade is written straight to `style.opacity` on an animation frame
 * rather than held in React state: the alternative is a re-render per scroll
 * event on the machines least able to afford one.
 */

/** Which plate carries each beat. Beats without one inherit the previous. */
const PLATE_FOR_BEAT: Record<(typeof BEATS)[number], string> = {
  hero: "court-teak-portrait",
  base: "court-teak-wide",
  framework: "court-teak-wide",
  interlock: "court-teak-wide",
  nailing: "court-teak-wide",
  decking: "court-teak-portrait",
  lighting: "lighting-installation",
  court: "court-teak-portrait",
  proof: "court-teak-wide",
};

const ORDER = [...new Set(Object.values(PLATE_FOR_BEAT))];

export function StaticStage() {
  const layers = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const last = new Array(ORDER.length).fill(-1);

    const tick = () => {
      const beat = BEATS[Math.min(sceneState.beat, BEATS.length - 1)];
      const wanted = PLATE_FOR_BEAT[beat];

      ORDER.forEach((name, i) => {
        const node = layers.current[i];
        if (!node) return;
        const target = name === wanted ? 1 : 0;
        if (last[i] !== target) {
          node.style.opacity = String(target);
          last[i] = target;
        }
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {ORDER.map((name, i) => {
        const p = photography.find((x) => x.name === name)!;
        return (
          <div
            key={name}
            ref={(node) => {
              layers.current[i] = node;
            }}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-out-expo)]"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={p.src}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={p.blurDataURL}
              // The source frames are print-resolution, so they are deliberately
              // never shown at full bleed sharpness — a soft, darkened backdrop
              // is both the honest treatment and the flattering one.
              className="scale-105 object-cover opacity-[0.42] blur-[1px]"
              priority={i === 0}
            />
          </div>
        );
      })}
      {/* Carries the page's own colour across the photography so it belongs to
          the design rather than sitting behind it. */}
      <div className="absolute inset-0 bg-stage/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-stage via-transparent to-stage/85" />
    </div>
  );
}
