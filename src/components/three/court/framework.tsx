"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/noise";
import { ASSEMBLY, damp, ramp, sceneState, smoother } from "@/lib/scene-state";
import { DECK } from "./dimensions";
import { TILE_METRES, useSurfaceMaterial } from "../materials/use-surface-material";

/**
 * Set-out of the pine framework.
 *
 * Members run in both directions at the same spacing, so the grid is square —
 * which is what the reference photographs show and what makes the interlocking
 * read as one framework rather than one direction laid over another.
 */
export const FRAME = {
  /** Spacing between members, both directions. */
  spacing: 0.55,
  memberWidth: 0.05,
  memberHeight: 0.06,
  /** 18 mm button-type pads, per the brochure. */
  padThickness: 0.018,
  padDiameter: 0.07,
} as const;

export type FrameworkMode = "interlocked" | "parallel";

interface Box {
  pos: [number, number, number];
  scale: [number, number, number];
  shade: number;
  uv: [number, number];
}

/**
 * Member centrelines across `extent`, centred on the origin.
 *
 * Forced to an odd count so a member always sits *on* the centreline and the
 * two directions cross exactly at the origin — which is the crossing the
 * interlock close-up frames.
 */
function centrelines(extent: number, spacing: number): number[] {
  let count = Math.max(3, Math.floor(extent / spacing));
  if (count % 2 === 0) count += 1;
  const start = -((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
}

/**
 * The interlocked framework.
 *
 * Every crossing is a half lap: the member running one way is notched away
 * above its centreline, the member running the other way is notched away below
 * it, and the two halves fill the same cube of space. That is the whole point —
 * both members share one plane, so the framework is one thickness thick, and
 * the joint is a joint rather than a stack.
 *
 * Three.js has no CSG, so the notch is built rather than cut: each member is
 * emitted as full-height spans between crossings and half-height blocks at
 * them. The result is geometrically identical to a cut lap and costs nothing.
 */
function buildInterlocked(): { alongX: Box[]; alongZ: Box[] } {
  const xs = centrelines(DECK.length, FRAME.spacing);
  const zs = centrelines(DECK.width, FRAME.spacing);
  const W = FRAME.memberWidth;
  const H = FRAME.memberHeight;
  const half = H / 2;
  const rnd = mulberry32(0x7a11);
  const alongX: Box[] = [];
  const alongZ: Box[] = [];

  const shade = () => 0.88 + rnd() * 0.26;
  const uv = (): [number, number] => [rnd() * 6, rnd() * 6];
  const EPS = 1e-4;

  // Members running the length of the court. Notched on top, so their material
  // sits in the LOWER half at every crossing.
  for (const z of zs) {
    let cursor = -DECK.length / 2;
    for (const x of xs) {
      const a = x - W / 2;
      const b = x + W / 2;
      if (a > cursor + EPS) {
        alongX.push({
          pos: [(cursor + a) / 2, 0, z],
          scale: [a - cursor, H, W],
          shade: shade(),
          uv: uv(),
        });
      }
      alongX.push({
        pos: [x, -half / 2, z],
        scale: [W, half, W],
        shade: shade(),
        uv: uv(),
      });
      cursor = b;
    }
    if (cursor < DECK.length / 2 - EPS) {
      alongX.push({
        pos: [(cursor + DECK.length / 2) / 2, 0, z],
        scale: [DECK.length / 2 - cursor, H, W],
        shade: shade(),
        uv: uv(),
      });
    }
  }

  // Members running across the court. Notched underneath, filling the UPPER
  // half of every crossing the members above left empty.
  for (const x of xs) {
    let cursor = -DECK.width / 2;
    for (const z of zs) {
      const a = z - W / 2;
      const b = z + W / 2;
      if (a > cursor + EPS) {
        alongZ.push({
          pos: [x, 0, (cursor + a) / 2],
          scale: [W, H, a - cursor],
          shade: shade(),
          uv: uv(),
        });
      }
      alongZ.push({
        pos: [x, half / 2, z],
        scale: [W, half, W],
        shade: shade(),
        uv: uv(),
      });
      cursor = b;
    }
    if (cursor < DECK.width / 2 - EPS) {
      alongZ.push({
        pos: [x, 0, (cursor + DECK.width / 2) / 2],
        scale: [W, H, DECK.width / 2 - cursor],
        shade: shade(),
        uv: uv(),
      });
    }
  }

  return { alongX, alongZ };
}

/**
 * The arrangement RACEON describes as common elsewhere: supports in a single
 * direction, unconnected, with the flooring laid straight over them. Shown for
 * comparison only.
 */
function buildParallel(): Box[] {
  const xs = centrelines(DECK.length, FRAME.spacing);
  const rnd = mulberry32(0x7a11);

  return xs.map((x) => ({
    pos: [x, 0, 0] as [number, number, number],
    scale: [FRAME.memberWidth, FRAME.memberHeight, DECK.width] as [
      number,
      number,
      number,
    ],
    shade: 0.88 + rnd() * 0.26,
    uv: [rnd() * 6, rnd() * 6] as [number, number],
  }));
}

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

function InstancedMembers({
  boxes,
  material,
}: {
  boxes: Box[];
  material: THREE.Material;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const uvOffset = new Float32Array(boxes.length * 2);
    const uvScale = new Float32Array(boxes.length * 2);

    boxes.forEach((b, i) => {
      dummy.position.set(...b.pos);
      dummy.scale.set(...b.scale);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.setScalar(b.shade);
      mesh.setColorAt(i, tint);

      uvOffset[i * 2] = b.uv[0];
      uvOffset[i * 2 + 1] = b.uv[1];
      // Grain follows the member's length, whichever way it runs.
      uvScale[i * 2] = Math.max(b.scale[0], b.scale[2]) / TILE_METRES;
      uvScale[i * 2 + 1] = FRAME.memberWidth / TILE_METRES;
    });

    mesh.geometry.setAttribute(
      "aUvOffset",
      new THREE.InstancedBufferAttribute(uvOffset, 2),
    );
    mesh.geometry.setAttribute(
      "aUvScale",
      new THREE.InstancedBufferAttribute(uvScale, 2),
    );
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [boxes]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, boxes.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}

/**
 * The framework, assembling.
 *
 * The two directions arrive on their own beats and the second one descends
 * *into* the first, so the half laps engage on screen. That descent is the
 * whole point of the section: it is the difference between showing a grid and
 * showing two members becoming one framework.
 *
 * `sceneState.method` cross-fades the whole thing against the parallel-support
 * arrangement for the comparison, so a visitor can flick between the two — the
 * exact thing someone evaluating a construction method wants to do.
 */
function useFadingPine(seedMaterial: THREE.MeshStandardMaterial) {
  return useMemo(() => {
    const m = seedMaterial.clone();
    m.transparent = true;
    m.opacity = 0;
    m.depthWrite = true;
    m.onBeforeCompile = seedMaterial.onBeforeCompile;
    m.customProgramCacheKey = () => "pine-instanced-uv";
    return m;
  }, [seedMaterial]);
}

export function PineFramework() {
  const { alongX, alongZ } = useMemo(() => buildInterlocked(), []);
  const parallel = useMemo(() => buildParallel(), []);

  const base = useSurfaceMaterial("pine", {
    size: 512,
    seed: 23,
    perInstanceUv: true,
  });

  const matX = useFadingPine(base);
  const matZ = useFadingPine(base);
  const matP = useFadingPine(base);

  useLayoutEffect(
    () => () => {
      matX.dispose();
      matZ.dispose();
      matP.dispose();
    },
    [matX, matZ, matP],
  );

  const groupX = useRef<THREE.Group>(null);
  const groupZ = useRef<THREE.Group>(null);
  const groupP = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const { assembly, method } = sceneState;

    const arriveX = smoother(ramp(assembly, ASSEMBLY.frameAlongX, ASSEMBLY.frameAlongX + 0.13));
    const arriveZ = smoother(ramp(assembly, ASSEMBLY.frameAlongZ, ASSEMBLY.frameAlongZ + 0.15));

    matX.opacity = damp(matX.opacity, arriveX * (1 - method), 9, dt);
    matZ.opacity = damp(matZ.opacity, arriveZ * (1 - method), 9, dt);
    matP.opacity = damp(matP.opacity, method * Math.max(arriveX, arriveZ), 9, dt);

    // The drop. The second direction falls further, so it visibly seats into
    // the notches the first direction left for it.
    if (groupX.current) {
      groupX.current.position.y = (1 - arriveX) * 0.42;
      groupX.current.visible = matX.opacity > 0.008;
    }
    if (groupZ.current) {
      groupZ.current.position.y = (1 - arriveZ) * 0.68;
      groupZ.current.visible = matZ.opacity > 0.008;
    }
    if (groupP.current) {
      groupP.current.visible = matP.opacity > 0.008;
    }
  });

  return (
    <>
      <group ref={groupX}>
        <InstancedMembers boxes={alongX} material={matX} />
      </group>
      <group ref={groupZ}>
        <InstancedMembers boxes={alongZ} material={matZ} />
      </group>
      <group ref={groupP} visible={false}>
        <InstancedMembers boxes={parallel} material={matP} />
      </group>
    </>
  );
}

export { buildInterlocked, buildParallel };
