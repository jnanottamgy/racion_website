"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildUp } from "@/content/systems";
import { ASSEMBLY, damp, sceneState } from "@/lib/scene-state";
import { DECK, PLANK } from "./dimensions";
import { Deck } from "./deck";
import { PineFramework } from "./framework";
import { CourtLines, NetAssembly } from "./markings";
import { NailingPass } from "./nailing";
import { BaseSlab, Plywood, ShockPads } from "./substructure";
import { useArrival } from "./use-arrival";

/** Vertical separation between layers at full explode. */
const EXPLODE_GAP = 0.62;

/**
 * Assembled stack positions.
 *
 * Built top-down from a finished floor level of y = 0, so the court always sits
 * correctly on the ground however the build-up changes. Thicknesses come from
 * `systems.ts`, which is also what the DOM callouts read — the drawing and the
 * spec sheet cannot drift apart because they are the same data.
 */
function useStack() {
  return useMemo(() => {
    const total = buildUp.reduce((n, l) => n + l.modelMm, 0) / 1000;
    let cursor = -total;
    return buildUp.map((layer) => {
      const thickness = layer.modelMm / 1000;
      const centre = cursor + thickness / 2;
      cursor += thickness;
      return { ...layer, thickness, centre };
    });
  }, []);
}

/**
 * One layer of the build-up.
 *
 * Lifts by `explode × index × gap`, so the bottom of the stack stays put and
 * the timber rises off it — the way a joiner pulls a mock-up apart, rather than
 * the way a parts diagram scatters in all directions.
 */
function LayerGroup({
  index,
  centre,
  children,
}: {
  index: number;
  centre: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const target = centre + sceneState.explode * index * EXPLODE_GAP;
    group.position.y = damp(group.position.y, target, 7, Math.min(delta, 1 / 20));
  });

  return (
    <group ref={ref} position={[0, centre, 0]}>
      {children}
    </group>
  );
}

/** Clear water-based PU court finish — the seal over the sanded teak. */
function CourtFinish() {
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(DECK.length, DECK.width),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: 0,
        roughness: 0.14,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        color: new THREE.Color("#ffe6c4"),
        depthWrite: false,
      }),
    [],
  );
  useLayoutEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const group = useArrival(material, ASSEMBLY.markings, { drop: 0.2, peak: 0.1 });

  return (
    <group ref={group}>
      <mesh
        geometry={geometry}
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={5}
      />
    </group>
  );
}

/**
 * The RACEON court, assembling.
 *
 * Layer contents are keyed to the build-up codes in `systems.ts` rather than to
 * array positions, so re-ordering or inserting a layer in the content file
 * cannot silently put the plywood under the shock pads.
 */
export function Court() {
  const stack = useStack();

  return (
    <group>
      {stack.map((layer, i) => (
        <LayerGroup key={layer.code} index={i} centre={layer.centre}>
          {layer.code === "01" && <BaseSlab />}
          {layer.code === "02" && <ShockPads />}
          {layer.code === "03" && (
            <>
              <PineFramework />
              <NailingPass />
            </>
          )}
          {layer.code === "04" && <Plywood />}
          {layer.code === "05" && (
            <group position={[0, -PLANK.thickness / 2 + layer.thickness / 2, 0]}>
              <Deck />
            </group>
          )}
          {layer.code === "06" && (
            <>
              <CourtFinish />
              <CourtLines />
            </>
          )}
        </LayerGroup>
      ))}

      <NetAssembly />
    </group>
  );
}

export { EXPLODE_GAP };
