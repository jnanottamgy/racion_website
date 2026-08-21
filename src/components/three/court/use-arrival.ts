"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, ramp, sceneState, smoother } from "@/lib/scene-state";

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
    const dt = Math.min(delta, 1 / 20);

    if (material && "opacity" in material) {
      const m = material as THREE.Material & { opacity: number };
      // `peak` lets a layer settle below full opacity — the PU finish is a
      // clear seal, not a coat of paint.
      m.opacity = damp(m.opacity, t * peak, 9, dt);
      if (group.current) group.current.visible = m.opacity > 0.008;
    } else if (group.current) {
      group.current.visible = t > 0.002;
    }

    if (group.current) group.current.position.y = (1 - t) * drop;
  });

  return group;
}
