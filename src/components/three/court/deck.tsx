"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/noise";
import { ASSEMBLY } from "@/lib/scene-state";
import { DECK, PLANK } from "./dimensions";
import { useArrival } from "./use-arrival";
import { TILE_METRES, useSurfaceMaterial } from "../materials/use-surface-material";

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

interface Plank {
  x: number;
  z: number;
  length: number;
  /** Tonal multiplier — real teak arrives sorted but never uniform. */
  shade: number;
  uvOffsetU: number;
  uvOffsetV: number;
}

/**
 * Board set-out for the whole deck.
 *
 * Seeded, so the floor is laid identically on every device and every reload —
 * a court whose plank pattern reshuffles when you refresh reads as generated,
 * which is the one impression this scene cannot afford.
 */
function layDeck(): Plank[] {
  const rnd = mulberry32(0x5ac1);
  const planks: Plank[] = [];
  const rows = Math.ceil(DECK.width / PLANK.width);
  const z0 = -DECK.width / 2 + PLANK.width / 2;

  for (let row = 0; row < rows; row++) {
    const z = z0 + row * PLANK.width;
    let x = -DECK.length / 2;

    // Stagger each row's first board so end joints never line up between
    // adjacent rows — the same reason a bricklayer offsets courses.
    let remaining = DECK.length;
    let first = true;

    while (remaining > 0.01) {
      let length =
        PLANK.minLength + rnd() * (PLANK.maxLength - PLANK.minLength);
      if (first) {
        length *= 0.35 + rnd() * 0.6;
        first = false;
      }
      length = Math.min(length, remaining);

      planks.push({
        x: x + length / 2,
        z,
        length,
        shade: 0.78 + rnd() * 0.44,
        uvOffsetU: rnd() * 8,
        uvOffsetV: rnd() * 8,
      });

      x += length + PLANK.gap;
      remaining -= length + PLANK.gap;
    }
  }
  return planks;
}

/**
 * The African teak deck: one InstancedMesh carrying every board.
 *
 * ~1,100 boards as separate meshes would be 1,100 draw calls and a scene that
 * stutters on anything but a desktop GPU. As one instanced mesh it is a single
 * draw call, and the per-instance UV offset and shade keep it from looking like
 * one.
 */
export function Deck({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const planks = useMemo(layDeck, []);

  const base = useSurfaceMaterial("teak", {
    size: 1024,
    seed: 7,
    perInstanceUv: true,
    overrides: {
      // A water-based PU court finish is glossy but not a mirror. Roughness is
      // driven by the map; this is the floor under it.
      envMapIntensity: 0.85,
    },
  });

  const material = useMemo(() => {
    const m = base.clone();
    m.transparent = true;
    m.opacity = 0;
    m.onBeforeCompile = base.onBeforeCompile;
    m.customProgramCacheKey = () => "teak-instanced-uv";
    return m;
  }, [base]);
  useLayoutEffect(() => () => material.dispose(), [material]);

  const group = useArrival(material, ASSEMBLY.teak, { drop: 0.62 });

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const uvOffset = new Float32Array(planks.length * 2);
    const uvScale = new Float32Array(planks.length * 2);

    planks.forEach((p, i) => {
      dummy.position.set(p.x, 0, p.z);
      dummy.scale.set(p.length, PLANK.thickness, PLANK.width - PLANK.gap);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Warm boards run slightly redder, pale boards slightly yellower — teak
      // varies along the hue axis, not just in brightness.
      tint.setRGB(
        p.shade,
        p.shade * (0.985 + (p.shade - 1) * 0.08),
        p.shade * (0.96 + (1 - p.shade) * 0.12),
      );
      mesh.setColorAt(i, tint);

      uvOffset[i * 2] = p.uvOffsetU;
      uvOffset[i * 2 + 1] = p.uvOffsetV;
      // Keep grain at a constant real-world scale regardless of board length.
      uvScale[i * 2] = p.length / TILE_METRES;
      uvScale[i * 2 + 1] = PLANK.width / TILE_METRES;
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
  }, [planks]);

  return (
    <group ref={group}>
      <instancedMesh
        ref={ref}
        args={[geometry, material, planks.length]}
        visible={visible}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
    </group>
  );
}

export const DECK_PLANK_COUNT = () => layDeck().length;
