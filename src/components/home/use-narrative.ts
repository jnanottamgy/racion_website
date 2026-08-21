"use client";

import { useEffect } from "react";
import {
  BEATS,
  beatStops,
  keyframe,
  sceneState,
} from "@/lib/scene-state";
import { useScroll } from "@/components/providers/scroll-provider";

/**
 * Scene properties expressed as "what this should be when this beat is on
 * screen", one value per beat.
 *
 * Reading down a column tells you the whole state of the scene at that point in
 * the story, which is far easier to reason about — and to change — than a set of
 * independent scroll windows that have to be kept from overlapping by hand.
 *
 *                    hero  base  frame  lock  nail  deck  light  court  proof
 */
const KEYS = {
  // The court arrives finished, strips itself back to the slab, and rebuilds.
  assembly:   [1,    0,    0.31,  0.5,  0.5,  1,    1,     1,     1],
  // Mid-pass when its own beat is on screen — a pass that has already finished
  // by the time you read about it has nothing to show.
  nailing:    [0,    0,    0,     0,    0.55, 1,    1,     1,     1],
  // The 150 W rig strikes only after the floor is finished.
  lights:     [0,    0,    0,     0,    0,    0,    1,     1,     1],
  // Layers separate for the labelled build-up as the decking goes on.
  explode:    [0,    0,    0,     0,    0,    0.28, 0,     0,     0],
} as const;

/** Illuminance the readout climbs to — competition level. */
const PEAK_LUX = 1500;

export function useNarrative(containerId: string) {
  const { harnessReady, capability } = useScroll();

  useEffect(() => {
    if (!harnessReady) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    let disposed = false;
    let trigger: { kill: () => void } | undefined;

    /**
     * Where each beat's section is centred, as a fraction of the scrubbed
     * range. Recomputed on every refresh, so it survives font loading, image
     * loading and viewport resizes.
     */
    const measureStops = () => {
      const range = container.scrollHeight - window.innerHeight;
      if (range <= 0) return;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;

      BEATS.forEach((_, i) => {
        const el = container.querySelector<HTMLElement>(`[data-beat="${i}"]`);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - containerTop;
        const centre = top + el.offsetHeight / 2 - window.innerHeight / 2;
        beatStops[i] = Math.min(1, Math.max(0, centre / range));
      });

      // Guard against a content change putting two stops out of order, which
      // would make the camera run a segment backwards.
      for (let i = 1; i < beatStops.length; i++) {
        if (beatStops[i] <= beatStops[i - 1]) {
          beatStops[i] = Math.min(1, beatStops[i - 1] + 0.001);
        }
      }
    };

    const apply = (raw: number) => {
      const p = Math.min(1, Math.max(0, raw));
      sceneState.progress = p;

      let beat = 0;
      while (beat < beatStops.length - 1 && p >= beatStops[beat + 1]) beat++;
      sceneState.beat = beat;
      const span = Math.max(
        1e-6,
        (beatStops[beat + 1] ?? 1) - beatStops[beat],
      );
      sceneState.beatProgress = Math.min(1, (p - beatStops[beat]) / span);

      sceneState.assembly = keyframe(p, beatStops, [...KEYS.assembly]);
      sceneState.nailing = keyframe(p, beatStops, [...KEYS.nailing]);
      sceneState.explode = keyframe(p, beatStops, [...KEYS.explode]);

      const lights = keyframe(p, beatStops, [...KEYS.lights]);
      sceneState.lights = lights;
      sceneState.lux = Math.round(lights * PEAK_LUX);
    };

    void (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          apply(self.progress);
          sceneState.velocity = self.getVelocity();
        },
        onRefresh: (self) => {
          measureStops();
          apply(self.progress);
        },
      });

      measureStops();
      apply((trigger as unknown as { progress: number }).progress);
    })();

    return () => {
      disposed = true;
      trigger?.kill();
    };
  }, [harnessReady, containerId, capability.reducedMotion]);
}

export { KEYS, PEAK_LUX };
