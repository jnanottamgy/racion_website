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

/**
 * Which plate carries each beat. Beats without one inherit the previous.
 *
 * RACEON's own site photography, now that there is enough of it: the framework
 * beats show their actual framework going down rather than a detail of a
 * finished floor, and the lighting beat shows the fixture rows it is describing.
 * This is the path a reduced-motion, no-WebGL or software-rendered visitor
 * takes, so it carries the whole argument on its own.
 *
 * Landscape sources only. The layers are full-bleed `object-cover`, and a
 * portrait frame at 16:9 loses most of its subject off the top and bottom.
 *
 * Seven unique frames for nine beats, deliberately. Every layer sits in the
 * viewport, so each one is a full-size image fetched whether or not it is the
 * one showing — and the devices that land here are the ones least able to
 * afford that. Beats that share a subject share a plate.
 */
const PLATE_FOR_BEAT: Record<(typeof BEATS)[number], string> = {
  // The two ends keep the staged frames. A hero is doing a different job from
  // a construction photograph: it wants atmosphere, and a real hall shot under
  // its own cold fluorescents is busy behind a headline and pulls the whole
  // page blue. The middle is where documentary wins, and it is the middle that
  // was being carried by a detail of a finished floor.
  hero: "court-hero",
  base: "site-framework-going-down",
  framework: "site-framework-run",
  interlock: "site-framework-run",
  nailing: "installation",
  decking: "site-deck-laid",
  lighting: "site-hall-lighting",
  court: "court-lit",
  proof: "court-lit",
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
              // These frames are already shot dark and vignetted, so they need
              // very little help from the page. Dimming them further — which is
              // what this did at 0.68 behind a 35% scrim — buried them.
              className="scale-[1.02] object-cover opacity-[0.88]"
              priority={i === 0}
            />
          </div>
        );
      })}
      {/* Carries the page's own colour across the photography so it belongs to
          the design rather than sitting behind it. */}
      <div className="absolute inset-0 bg-stage/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-stage via-transparent to-stage/85" />
    </div>
  );
}
