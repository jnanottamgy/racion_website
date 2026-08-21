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
 * The hall.
 *
 * Until this existed the court sat in an unbounded void, and the lighting beat —
 * which points the camera upward at the fixtures — was four-fifths empty grey
 * haze, because there was nothing above the rig for the light to land on. Six
 * planes fix it: the beams now terminate against a ceiling, the walls catch the
 * spill, and the fog gives the far end somewhere to dissolve into.
 *
 * Sized like a real single-court hall with run-off: 26 x 16 m on plan, 9.5 m to
 * the underside of the ceiling, with RACEON's fixtures at 7.6 m below it.
 */
function Hall() {
  const floorLevel = useMemo(
    () => -buildUp.reduce((n, l) => n + l.modelMm, 0) / 1000,
    [],
  );

  const geometry = useMemo(() => new THREE.BoxGeometry(26, 9.5, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#282133"),
        roughness: 0.94,
        metalness: 0,
        // Seen from the inside.
        side: THREE.BackSide,
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
      position={[0, floorLevel + 9.5 / 2, 0]}
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
 * The light the court sits in before the rig exists.
 *
 * Beats 00–03 happen in an unlit hall, which is dramatic and — taken
 * literally — means the hero image is a black rectangle. This is a single soft
 * spot from high and off-axis: enough to model the teak and throw the court's
 * own shadow, shaped as a pool rather than a wash so the court still reads as
 * an object in a dark room. It hands over to the fixtures as they strike, so no
 * frame is ever lit by both.
 */
function StagingLight() {
  const ref = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;
    if (target.current) light.target = target.current;
    light.intensity = damp(
      light.intensity,
      (1 - sceneState.lights) * 4.6,
      4.5,
      Math.min(delta, 1 / 20),
    );
  });

  return (
    <>
      <object3D ref={target} position={[0, 0, 0]} />
      <spotLight
        ref={ref}
        position={[7.5, 15, 9]}
        angle={0.78}
        penumbra={1}
        // Physical falloff over a 17 m throw leaves almost nothing on the
        // floor. This is a staged key light, not a real fitting — the real
        // fittings are the 150 W rig, and those keep their inverse-square.
        decay={0}
        distance={0}
        intensity={0}
        color="#efe6ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0009}
        shadow-camera-near={2}
        shadow-camera-far={44}
      />
    </>
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
      0.5 + lit * 0.8,
      5,
      dt,
    );
    if (ambient.current) {
      ambient.current.intensity = damp(ambient.current.intensity, 0.3 + lit * 0.6, 5, dt);
    }
    if (violet.current) {
      // The violet bounce is strongest *before* the rig strikes — it is what
      // makes the unlit room feel like a RACEON room rather than a black void.
      violet.current.intensity = damp(violet.current.intensity, 1.5 - lit * 0.85, 5, dt);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.14} color="#e8dcff" />
      <hemisphereLight
        ref={violet}
        intensity={1.5}
        color="#8a4bab"
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
    scene.fog = new THREE.FogExp2(new THREE.Color("#0c0710"), 0.014);
    scene.background = null;
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <RoomEnvironment />
      <RoomExposure />
      <StagingLight />
      <CameraRig />
      <Hall />
      <Slab />
      <Court />
      <LightingRig volumetric={volumetric} />
    </>
  );
}
