"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { buildUp } from "@/content/systems";
import { damp, sceneState } from "@/lib/scene-state";
import { CameraRig } from "./camera-rig";
import { Court } from "./court/court";
import { DECK } from "./court/dimensions";
import { LightingRig, RIG } from "./lighting-rig";

/**
 * The slab the court is built on. Also the shadow catcher — without something
 * for the rig to throw a shadow onto, a lit court reads as a cut-out.
 */
function Slab() {
  const depth = useMemo(
    () => buildUp.reduce((n, l) => n + l.modelMm, 0) / 1000,
    [],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(DECK.length * 2.4, DECK.width * 3),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a060d"),
        roughness: 0.95,
        metalness: 0,
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
      position={[0, -depth - 0.002, 0]}
      receiveShadow
    />
  );
}

/**
 * A procedural environment, baked once.
 *
 * A downloaded HDR would be a megabyte or two of network for something the
 * viewer only ever perceives as "the floor looks wet". This is a violet room
 * with two bright strips where the fixture rows are — reflections that agree
 * with the actual lighting, for a few kilobytes of geometry.
 */
function RoomEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <mesh scale={60}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial side={THREE.BackSide} color="#120a18" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, RIG.height, side * RIG.offsetZ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[(RIG.perRow - 1) * RIG.spacingX + 2, 0.9]} />
          <meshBasicMaterial color="#fff3e2" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* A cool bounce off the far wall keeps the shadow side from going flat. */}
      <mesh position={[-24, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 14]} />
        <meshBasicMaterial color="#241436" />
      </mesh>
    </Environment>
  );
}

/**
 * Ambient level and environment intensity ride the ignition sequence, so the
 * whole room comes up with the fixtures rather than the court sitting in
 * pre-lit daylight while the lamps pretend to switch on.
 */
function RoomExposure() {
  const scene = useThree((s) => s.scene);
  const ambient = useRef<THREE.AmbientLight>(null);
  const violet = useRef<THREE.HemisphereLight>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const lit = sceneState.lights;

    scene.environmentIntensity = damp(
      scene.environmentIntensity ?? 0,
      0.12 + lit * 0.75,
      5,
      dt,
    );
    if (ambient.current) {
      ambient.current.intensity = damp(ambient.current.intensity, 0.05 + lit * 0.28, 5, dt);
    }
    if (violet.current) {
      // The violet bounce is strongest *before* the rig strikes — it is what
      // makes the unlit room feel like a RACEON room rather than a black void.
      violet.current.intensity = damp(violet.current.intensity, 0.5 - lit * 0.32, 5, dt);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.05} color="#e8dcff" />
      <hemisphereLight
        ref={violet}
        intensity={0.5}
        color="#7d3f9c"
        groundColor="#1a0d24"
      />
    </>
  );
}

export function Scene({ volumetric = true }: { volumetric?: boolean }) {
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    // Exponential fog dissolves the far end of the hall instead of ending it
    // at a hard edge, which is what sells depth in a scene with no walls.
    scene.fog = new THREE.FogExp2(new THREE.Color("#0c0710"), 0.022);
    scene.background = null;
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <RoomEnvironment />
      <RoomExposure />
      <CameraRig />
      <Slab />
      <Court />
      <LightingRig volumetric={volumetric} />
    </>
  );
}
