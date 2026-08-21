"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";
import { Vector2 } from "three";
import { useScroll } from "@/components/providers/scroll-provider";
import { sceneState } from "@/lib/scene-state";
import { Scene } from "./scene";

/**
 * The single persistent WebGL canvas.
 *
 * Fixed behind the whole document for the length of the narrative. One canvas,
 * mounted once: every beat is the same scene under a different camera, so
 * nothing ever re-initialises, no context is ever lost, and the court the
 * viewer is looking at in beat 06 is literally the one that was assembled in
 * beat 02.
 */
export default function CanvasRoot() {
  const { capability, ready } = useScroll();

  // Pointer parallax is written straight into the mutable scene state rather
  // than React state — this fires at pointer rate and must never re-render.
  useEffect(() => {
    if (!ready || capability.tier === "static") return;

    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      sceneState.pointer.x = 0;
      sceneState.pointer.y = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [ready, capability.tier]);

  if (!ready || capability.tier === "static") return null;

  const full = capability.tier === "full";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-canvas-root=""
    >
      <Canvas
        dpr={capability.dpr}
        shadows={full}
        gl={{
          antialias: full,
          alpha: true,
          powerPreference: "high-performance",
          // The court is lit by warm fixtures against a violet room; without a
          // filmic curve the highlights on lacquered teak clip to white.
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ fov: 38, near: 0.02, far: 120, position: [14.5, 3, 11.5] }}
        // Drops resolution before it drops frames if the device can't keep up.
        performance={{ min: 0.5, max: 1, debounce: 200 }}
      >
        <Scene volumetric={full} />

        {full && (
          <EffectComposer multisampling={4} enableNormalPass={false}>
            {/* Only the fixtures and the sheen on the lacquer are above 1.0,
                so a high threshold keeps the bloom on the light itself. */}
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.28}
              kernelSize={KernelSize.LARGE}
              mipmapBlur
            />
            {/* Barely there. Enough to imply a real lens, not enough to
                notice as an effect. */}
            <ChromaticAberration offset={new Vector2(0.00012, 0.00018)} />
            <Vignette offset={0.28} darkness={0.72} eskil={false} />
            {/* Matches the CSS grain on the DOM above, so the canvas and the
                page look like one photograph rather than two layers. */}
            <Noise premultiply opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
