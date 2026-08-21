"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/noise";
import { DECK } from "./dimensions";
import { TILE_METRES, useSurfaceMaterial } from "../materials/use-surface-material";

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

/** Runner and pad set-out for the pine box structure. */
export const FRAME = {
  /** Bottom runners span the length of the hall. */
  lowerSpacingZ: 0.6,
  /** Upper runners cross them, and the teak is nailed to these. */
  upperSpacingX: 0.4,
  runnerWidth: 0.05,
  runnerHeight: 0.045,
  /** 18 mm button-type pads, per the brochure. */
  padThickness: 0.018,
  padDiameter: 0.06,
} as const;

/**
 * Termite-treated pine, built into an interlocking box structure.
 *
 * Two crossed layers of runners, which is what "vertical connected to
 * horizontal" means on site — and the void between them is the air circulation
 * the brochure credits for handling environmental expansion. Modelling it as a
 * solid slab would have thrown away the one thing that layer is *for*.
 */
export function PineFrame() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const runners = useMemo(() => {
    const rnd = mulberry32(0x91e5);
    const out: { pos: [number, number, number]; scale: [number, number, number]; shade: number; uv: [number, number] }[] = [];

    // Lower layer: runs along X, laid out across Z.
    const lowerCount = Math.floor(DECK.width / FRAME.lowerSpacingZ);
    for (let i = 0; i <= lowerCount; i++) {
      const z = -DECK.width / 2 + i * FRAME.lowerSpacingZ;
      out.push({
        pos: [0, -FRAME.runnerHeight / 2, z],
        scale: [DECK.length, FRAME.runnerHeight, FRAME.runnerWidth],
        shade: 0.88 + rnd() * 0.24,
        uv: [rnd() * 6, rnd() * 6],
      });
    }

    // Upper layer: crosses them, running across Z. The teak nails into these.
    const upperCount = Math.floor(DECK.length / FRAME.upperSpacingX);
    for (let i = 0; i <= upperCount; i++) {
      const x = -DECK.length / 2 + i * FRAME.upperSpacingX;
      out.push({
        pos: [x, FRAME.runnerHeight / 2, 0],
        scale: [FRAME.runnerWidth, FRAME.runnerHeight, DECK.width],
        shade: 0.88 + rnd() * 0.24,
        uv: [rnd() * 6, rnd() * 6],
      });
    }
    return out;
  }, []);

  const material = useSurfaceMaterial("pine", {
    size: 512,
    seed: 23,
    perInstanceUv: true,
  });
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const uvOffset = new Float32Array(runners.length * 2);
    const uvScale = new Float32Array(runners.length * 2);

    runners.forEach((r, i) => {
      dummy.position.set(...r.pos);
      dummy.scale.set(...r.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.setScalar(r.shade);
      mesh.setColorAt(i, tint);
      uvOffset[i * 2] = r.uv[0];
      uvOffset[i * 2 + 1] = r.uv[1];
      uvScale[i * 2] = Math.max(r.scale[0], r.scale[2]) / TILE_METRES;
      uvScale[i * 2 + 1] = FRAME.runnerWidth / TILE_METRES;
    });

    mesh.geometry.setAttribute("aUvOffset", new THREE.InstancedBufferAttribute(uvOffset, 2));
    mesh.geometry.setAttribute("aUvScale", new THREE.InstancedBufferAttribute(uvScale, 2));
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [runners]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, runners.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}

/**
 * Air Shox: 18 mm button-type pads on a grid.
 *
 * Set out at the runner intersections, which is where the load actually
 * arrives — the brochure's "optimized spacing ensures uniform load
 * distribution" made visible rather than asserted.
 */
export function ShockPads() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const pads = useMemo(() => {
    const out: [number, number][] = [];
    const cols = Math.floor(DECK.length / FRAME.upperSpacingX);
    const rows = Math.floor(DECK.width / FRAME.lowerSpacingZ);
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        out.push([
          -DECK.length / 2 + c * FRAME.upperSpacingX,
          -DECK.width / 2 + r * FRAME.lowerSpacingZ,
        ]);
      }
    }
    return out;
  }, []);

  const material = useSurfaceMaterial("shockpad", { size: 256, seed: 5 });
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(FRAME.padDiameter / 2, FRAME.padDiameter / 2 * 1.08, FRAME.padThickness, 12),
    [],
  );
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    pads.forEach(([x, z], i) => {
      dummy.position.set(x, 0, z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [pads]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, pads.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}

/** 6-mil vapour barrier over the slab. */
export function VapourBarrier() {
  const material = useSurfaceMaterial("membrane", {
    size: 256,
    seed: 11,
    overrides: { transparent: true, opacity: 0.9, side: THREE.DoubleSide },
  });
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(DECK.length, DECK.width),
    [],
  );
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    // The membrane covers 17 m of floor; without repeating, one 0.6 m tile of
    // creasing is stretched across the whole thing.
    const maps = [material.map, material.roughnessMap, material.normalMap];
    for (const m of maps) {
      if (!m) continue;
      m.repeat.set(DECK.length / TILE_METRES / 4, DECK.width / TILE_METRES / 4);
      m.needsUpdate = true;
    }
  }, [material]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    />
  );
}
