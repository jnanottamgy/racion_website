"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildUp } from "@/content/systems";
import { damp, sceneState } from "@/lib/scene-state";
import { DECK, PLANK } from "./dimensions";
import { Deck } from "./deck";
import { CourtLines, NetAssembly } from "./markings";
import { PineFrame, ShockPads, VapourBarrier } from "./substructure";

/** Vertical separation between layers at full explode. */
const EXPLODE_GAP = 0.62;

/**
 * Assembled stack positions.
 *
 * Built top-down from a finished floor level of y = 0, so the court always
 * sits correctly on the ground no matter how the build-up changes. The layer
 * thicknesses come from `systems.ts`, which is also what the DOM callouts read
 * — the drawing and the spec sheet cannot drift apart because they are the
 * same data.
 */
function useStack() {
  return useMemo(() => {
    const totalMm = buildUp.reduce((n, l) => n + l.modelMm, 0);
    const total = totalMm / 1000;

    let cursor = -total; // bottom of the whole build-up
    return buildUp.map((layer) => {
      const thickness = layer.modelMm / 1000;
      const centre = cursor + thickness / 2;
      cursor += thickness;
      return { ...layer, thickness, centre };
    });
  }, []);
}

interface LayerGroupProps {
  index: number;
  centre: number;
  children: React.ReactNode;
}

/**
 * One layer of the build-up.
 *
 * Each layer lifts by `explode × index × gap`, so the bottom of the stack stays
 * put and the timber rises off it — the way a joiner would pull a mock-up
 * apart, rather than the way an exploded parts diagram scatters in all
 * directions.
 */
function LayerGroup({ index, centre, children }: LayerGroupProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const dt = Math.min(delta, 1 / 20);
    const target = centre + sceneState.explode * index * EXPLODE_GAP;
    group.position.y = damp(group.position.y, target, 7, dt);
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
        opacity: 0.16,
        roughness: 0.08,
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

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={5}
    />
  );
}

/**
 * The whole RACEON court: six layers, a net, and the markings.
 */
export function Court() {
  const stack = useStack();

  return (
    <group>
      {stack.map((layer, i) => (
        <LayerGroup key={layer.code} index={i} centre={layer.centre}>
          {layer.code === "L01" && <VapourBarrier />}
          {layer.code === "L02" && <ShockPads />}
          {layer.code === "L03" && <PineFrame />}
          {/* The deck's planks are modelled about their own centre. */}
          {layer.code === "L04" && (
            <group position={[0, -PLANK.thickness / 2 + layer.thickness / 2, 0]}>
              <Deck />
            </group>
          )}
          {layer.code === "L05" && <CourtFinish />}
          {layer.code === "L06" && <CourtLines />}
        </LayerGroup>
      ))}

      <NetAssembly />
    </group>
  );
}

export { EXPLODE_GAP };
