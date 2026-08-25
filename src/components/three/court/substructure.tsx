"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { snap } from "./use-arrival";
import { ASSEMBLY, damp, ramp, sceneState, smoother } from "@/lib/scene-state";
import { DECK } from "./dimensions";
import { FRAME } from "./framework";
import { TILE_METRES, useSurfaceMaterial } from "../materials/use-surface-material";

const dummy = new THREE.Object3D();

/**
 * Prepared base: concrete substrate under a 3–5 mm moisture-resistant membrane.
 *
 * Always present — it's the thing everything else is built on, and stripping it
 * away would leave the court floating.
 */
export function BaseSlab() {
  const material = useSurfaceMaterial("membrane", {
    size: 256,
    seed: 11,
    overrides: { side: THREE.DoubleSide },
  });
  const geometry = useMemo(
    () => new THREE.BoxGeometry(DECK.length, 0.08, DECK.width),
    [],
  );
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    // One 0.6 m tile stretched over 17 m of slab reads as a smear.
    for (const m of [material.map, material.roughnessMap, material.normalMap]) {
      if (!m) continue;
      m.repeat.set(DECK.length / TILE_METRES / 3, DECK.width / TILE_METRES / 3);
      m.needsUpdate = true;
    }
  }, [material]);

  return <mesh geometry={geometry} material={material} receiveShadow />;
}

/**
 * Air Shox: 20–21 mm button-type pads, set out on the framework grid so every
 * crossing of the timber lands on one.
 */
export function ShockPads() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  const pads = useMemo(() => {
    const out: [number, number][] = [];
    const cols = Math.floor(DECK.length / FRAME.spacing);
    const rows = Math.floor(DECK.width / FRAME.spacing);
    const x0 = -((cols - 1) * FRAME.spacing) / 2;
    const z0 = -((rows - 1) * FRAME.spacing) / 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        out.push([x0 + c * FRAME.spacing, z0 + r * FRAME.spacing]);
      }
    }
    return out;
  }, []);

  const base = useSurfaceMaterial("shockpad", { size: 256, seed: 5 });
  const material = useMemo(() => {
    const m = base.clone();
    m.transparent = true;
    m.opacity = 0;
    return m;
  }, [base]);
  useLayoutEffect(() => () => material.dispose(), [material]);

  const geometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        FRAME.padDiameter / 2,
        (FRAME.padDiameter / 2) * 1.12,
        FRAME.padThickness,
        14,
      ),
    [],
  );
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    pads.forEach(([x, z], i) => {
      dummy.position.set(x, 0, z);
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [pads]);

  useFrame((_, delta) => {
    const t = smoother(
      ramp(sceneState.assembly, ASSEMBLY.shockPads, ASSEMBLY.shockPads + 0.1),
    );
    material.opacity = snap(
      damp(material.opacity, t, 9, Math.min(delta, 1 / 10)),
      t,
    );
    material.transparent = material.opacity < 0.999;
    if (group.current) {
      group.current.position.y = (1 - t) * 0.22;
      group.current.visible = material.opacity > 0.008;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={ref}
        args={[geometry, material, pads.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
    </group>
  );
}

