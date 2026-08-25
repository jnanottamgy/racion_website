"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, ramp, sceneState, smoother } from "@/lib/scene-state";

/**
 * Snap an eased value onto its target once it is close enough to be there.
 *
 * Exponential easing never actually arrives, which is fine for a camera and is
 * not fine for opacity: a layer resting at 0.94 is a translucent layer, and one
 * resting at 0.09 is a layer that was supposed to be gone. On a machine holding
 * 60fps the gap closes fast enough that nobody sees it. On one rendering this
 * scene at two or three frames a second — which is the machine that complained
 * — every step is a fifth of the distance, so the framework sat visibly
 * see-through and the finished court it had just stripped back was still
 * hanging over it at a tenth.
 *
 * Two hundredths is below the threshold of a visible difference and well above
 * where the tail costs anything.
 */
export function snap(value: number, target: number, epsilon = 0.02) {
  return Math.abs(value - target) < epsilon ? target : value;
}

/**
 * Drives a layer arriving in the assembly.
 *
 * Each layer fades up and settles down into place as `sceneState.assembly`
 * passes its threshold. Shared by every layer so the whole build reads as one
 * continuous operation rather than six components each doing their own thing.
 *
 * Returns a group ref to attach to the layer's contents.
 */
export function useArrival(
  material: THREE.Material | null,
  threshold: number,
  {
    span = 0.12,
    drop = 0.5,
    peak = 1,
  }: { span?: number; drop?: number; peak?: number } = {},
) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const t = smoother(ramp(sceneState.assembly, threshold, threshold + span));
    // Clamped at 10fps rather than 20, to match the camera rig. The clamp is
    // there so a backgrounded tab does not resume by teleporting; set tighter
    // than the frame time it also runs the fade in slow motion on exactly the
    // machines least able to hide it.
    const dt = Math.min(delta, 1 / 10);

    if (material && "opacity" in material) {
      const m = material as THREE.Material & { opacity: number };
      // `peak` lets a layer settle below full opacity — the PU finish is a
      // clear seal, not a coat of paint.
      const goal = t * peak;
      m.opacity = snap(damp(m.opacity, goal, 9, dt), goal);
      // Opaque layers belong in the opaque queue. Left on the transparent one
      // they blend against whatever is behind them in an arbitrary order, and
      // an InstancedMesh — which has no per-instance sort at all — turns into a
      // wireframe of itself.
      m.transparent = m.opacity < 0.999;
      if (group.current) group.current.visible = m.opacity > 0.008;
    } else if (group.current) {
      group.current.visible = t > 0.002;
    }

    if (group.current) group.current.position.y = (1 - t) * drop;
  });

  return group;
}
