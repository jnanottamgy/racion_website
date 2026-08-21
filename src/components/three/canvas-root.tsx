"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@/components/providers/scroll-provider";
import { sceneState } from "@/lib/scene-state";
import { Scene } from "./scene";
import { StaticStage } from "./static-stage";

/**
 * The single persistent WebGL canvas.
 *
 * Deliberately no post-processing chain. It carried bloom, chromatic
 * aberration, a vignette and film grain, and it was the *only* thing separating
 * a device on the `full` tier from one on `lite` beyond cost — MSAA render
 * targets and mipmap-blur bloom are the most driver-dependent code in the whole
 * application. Phones landed on `lite` and rendered correctly; laptops landed on
 * `full` and blacked out. One render path for every device removes that entire
 * class of failure, and the grain and vignette are done in CSS over the canvas
 * where they cost nothing and cannot fail.
 *
 * Fixed behind the whole document for the length of the narrative. One canvas,
 * mounted once: every beat is the same scene under a different camera, so
 * nothing ever re-initialises, no context is ever lost, and the court the
 * viewer is looking at in beat 06 is literally the one that was assembled in
 * beat 02.
 */
export default function CanvasRoot() {
  const { capability, ready } = useScroll();
  const [contextLost, setContextLost] = useState(false);

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

  // A lost GPU context leaves a permanently black canvas with no way back.
  // Handing over to the photographic stage turns the worst failure this page
  // has — a blank screen where the whole story should be — into a page that
  // still works.
  if (contextLost) return <StaticStage />;

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
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              setContextLost(true);
            },
            { once: true },
          );
        }}
        // Drops resolution before it drops frames if the device can't keep up.
        performance={{ min: 0.5, max: 1, debounce: 200 }}
      >
        <Scene volumetric={full} />

      </Canvas>
    </div>
  );
}
