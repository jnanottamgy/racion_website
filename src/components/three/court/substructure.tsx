"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/noise";
import { ASSEMBLY, damp, ramp, sceneState, smoother } from "@/lib/scene-state";
import { DECK } from "./dimensions";
import { FRAME } from "./framework";
import { TILE_METRES, useSurfaceMaterial } from "../materials/use-surface-material";

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

/**
 * Prepared base: concrete substrate under a 6-mil moisture-resistant sheet.
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
 * Air Shox: 18 mm button-type pads, set out on the framework grid so every
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
    material.opacity = damp(material.opacity, t, 9, Math.min(delta, 1 / 20));
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

/**
 * Plywood underlayment.
 *
 * Modelled as real sheets rather than one continuous plane — a plywood deck is
 * a field of 8×4 boards with staggered joints, and the joint lines are how
 * anyone recognises it as plywood rather than as a slab of MDF.
 */
export function Plywood() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  const sheets = useMemo(() => {
    const SHEET_L = 2.44;
    const SHEET_W = 1.22;
    const GAP = 0.004;
    const rnd = mulberry32(0x9140);
    const out: { pos: [number, number]; size: [number, number]; shade: number; uv: [number, number] }[] = [];

    const rows = Math.ceil(DECK.width / SHEET_W);
    for (let r = 0; r < rows; r++) {
      const z = -DECK.width / 2 + SHEET_W / 2 + r * SHEET_W;
      // Stagger alternate rows by half a sheet so the cross joints break bond.
      let x = -DECK.length / 2 - (r % 2 ? SHEET_L / 2 : 0);
      while (x < DECK.length / 2) {
        const length = Math.min(SHEET_L, DECK.length / 2 - x);
        if (length > 0.05) {
          out.push({
            pos: [x + length / 2, z],
            size: [length - GAP, SHEET_W - GAP],
            shade: 0.92 + rnd() * 0.16,
            uv: [rnd() * 5, rnd() * 5],
          });
        }
        x += SHEET_L;
      }
    }
    return out;
  }, []);

  const base = useSurfaceMaterial("pine", {
    size: 512,
    seed: 41,
    perInstanceUv: true,
  });
  const material = useMemo(() => {
    const m = base.clone();
    m.transparent = true;
    m.opacity = 0;
    m.onBeforeCompile = base.onBeforeCompile;
    m.customProgramCacheKey = () => "pine-instanced-uv";
    return m;
  }, [base]);
  useLayoutEffect(() => () => material.dispose(), [material]);

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const uvOffset = new Float32Array(sheets.length * 2);
    const uvScale = new Float32Array(sheets.length * 2);

    sheets.forEach((sheet, i) => {
      dummy.position.set(sheet.pos[0], 0, sheet.pos[1]);
      dummy.scale.set(sheet.size[0], 0.014, sheet.size[1]);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.setScalar(sheet.shade);
      mesh.setColorAt(i, tint);
      uvOffset[i * 2] = sheet.uv[0];
      uvOffset[i * 2 + 1] = sheet.uv[1];
      uvScale[i * 2] = sheet.size[0] / TILE_METRES;
      uvScale[i * 2 + 1] = sheet.size[1] / TILE_METRES;
    });

    mesh.geometry.setAttribute("aUvOffset", new THREE.InstancedBufferAttribute(uvOffset, 2));
    mesh.geometry.setAttribute("aUvScale", new THREE.InstancedBufferAttribute(uvScale, 2));
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [sheets]);

  useFrame((_, delta) => {
    const t = smoother(
      ramp(sceneState.assembly, ASSEMBLY.plywood, ASSEMBLY.plywood + 0.12),
    );
    material.opacity = damp(material.opacity, t, 9, Math.min(delta, 1 / 20));
    if (group.current) {
      group.current.position.y = (1 - t) * 0.5;
      group.current.visible = material.opacity > 0.008;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh
        ref={ref}
        args={[geometry, material, sheets.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
    </group>
  );
}
