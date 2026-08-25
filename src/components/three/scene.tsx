"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { buildUp } from "@/content/systems";
import { damp, sceneState } from "@/lib/scene-state";
import { exposeDebug } from "@/lib/debug";
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
    // Steps back as the work lamp comes up. Two keys at full strength is a
    // wash, and a wash is what bleached the treated pine pale in the close-up:
    // the staged light sits at fifty degrees and lands flat on every top face
    // at once, so no amount of raking from the lamp could carve anything out of
    // it. It hands the construction beats over and takes them back after.
    light.intensity = damp(
      light.intensity,
      (1 - sceneState.lights) * (4.6 - sceneState.work * 3.4),
      4.5,
      Math.min(delta, 1 / 10),
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
 * The installers' work lamp.
 *
 * Beats 01–04 are a construction site: the fixtures have not been hung yet, so
 * the only light there would honestly be on the framework is the one the crew
 * stood on the slab. That is also the light the interlock beat needs. The
 * staging key sits at fifty degrees, which lands on the top of every member
 * equally and leaves the half laps in the same tone as the timber around them —
 * the notches are there and nobody can see them. This rakes in at twenty-five
 * degrees from the far side instead, so each lap throws a shadow into the
 * member it is notched into and the joint reads as a joint.
 *
 * Warm, because a site lamp is, and because it separates the construction beats
 * from the cool staged light of the hero without touching either.
 */
function WorkLight() {
  const ref = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;
    if (target.current) light.target = target.current;
    light.intensity = damp(
      light.intensity,
      sceneState.work * 44,
      4.5,
      Math.min(delta, 1 / 10),
    );
  });

  return (
    <>
      <object3D ref={target} position={[0.3, -0.02, 0]} />
      <spotLight
        ref={ref}
        position={[-3.4, 1.55, 1.35]}
        angle={0.62}
        penumbra={0.85}
        // A real lamp on a real stand, so it keeps its inverse-square — which
        // is what makes the far end of the framework fall away into the hall
        // instead of the whole floor coming up as one flat sheet.
        decay={1.55}
        distance={0}
        intensity={0}
        color="#ffd7a3"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.012}
        shadow-camera-near={0.4}
        shadow-camera-far={22}
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
    const dt = Math.min(delta, 1 / 10);
    const lit = sceneState.lights;

    // The environment is a room with two bright fixture strips in it, so it has
    // no business being half-strength before those fixtures have struck. At 0.5
    // it was the brightest thing in every construction beat — bright enough to
    // bleach the treated pine back to the pale untreated colour the whole pass
    // was meant to get rid of, and to do it from a source that, in the story
    // the scene is telling, is not switched on yet.
    scene.environmentIntensity = damp(
      scene.environmentIntensity ?? 0,
      0.16 + lit * 1.14,
      5,
      dt,
    );
    if (ambient.current) {
      ambient.current.intensity = damp(ambient.current.intensity, 0.3 + lit * 0.6, 5, dt);
    }
    if (violet.current) {
      // The violet bounce is what makes the unlit room feel like a RACEON room
      // rather than a black void — but it has to get out of the way once the
      // fixtures strike. A lavender hall directly contradicts the lux
      // readout sitting next to it.
      violet.current.intensity = damp(violet.current.intensity, 1.5 - lit * 1.2, 5, dt);
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

  /**
   * Every drawn mesh, with the material state that decides how it composites.
   *
   * A screenshot cannot tell a translucent member from a shadow falling across
   * an opaque one, and both look like a bug. This says which it is.
   */
  useEffect(
    () =>
      exposeDebug({
        layers: {
          get: () => {
            const rows: Record<string, unknown>[] = [];
            scene.traverse((o) => {
              const mesh = o as THREE.Mesh;
              if (!mesh.isMesh || !mesh.visible) return;
              const mats = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              mats.forEach((m) => {
                const std = m as THREE.MeshStandardMaterial;
                rows.push({
                  type: mesh.type,
                  name: mesh.name || std.type,
                  transparent: std.transparent,
                  opacity: +std.opacity.toFixed(3),
                  blending: std.blending,
                  depthWrite: std.depthWrite,
                  renderOrder: mesh.renderOrder,
                });
              });
            });
            return rows;
          },
          configurable: true,
        },
      }),
    [scene],
  );

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
      <WorkLight />
      <CameraRig />
      <Hall />
      <Slab />
      <Court />
      <LightingRig volumetric={volumetric} />
    </>
  );
}
