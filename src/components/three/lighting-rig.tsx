"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COURT } from "./court/dimensions";
import { damp, sceneState } from "@/lib/scene-state";

/**
 * RACEON's 150 W fixtures, set out the way they are actually installed.
 *
 * The fixtures run in two rows *parallel to the court's long axis and outboard
 * of the sidelines* — never directly over the playing area. That is what
 * "optimized positioning for glare-free play" means in practice: a player
 * tracking a high clear looks up into ceiling, not into a lamp. It is a real
 * competence, the brochure states it in six words, and it is invisible in every
 * photograph. In 3D it is obvious at a glance.
 */
export const RIG = {
  /** Mounting height above the finished floor. */
  height: 7.6,
  /** Outboard of the sideline, so no fixture sits in a player's sightline. */
  offsetZ: COURT.halfWidth + 1.35,
  /** Fixtures per row. */
  perRow: 8,
  spacingX: 2.2,
  bodyLength: 1.2,
  bodyWidth: 0.16,
  bodyDepth: 0.11,
} as const;

interface Fixture {
  x: number;
  z: number;
  /** 0 → 1 point in the ignition sequence at which this fixture strikes. */
  ignite: number;
}

function layRig(): Fixture[] {
  const out: Fixture[] = [];
  const span = (RIG.perRow - 1) * RIG.spacingX;

  for (let row = 0; row < 2; row++) {
    const z = row === 0 ? -RIG.offsetZ : RIG.offsetZ;
    for (let i = 0; i < RIG.perRow; i++) {
      const x = -span / 2 + i * RIG.spacingX;
      // Strike from the centre outwards. Ending on the far corners reads as a
      // hall coming alive; ending in the middle reads as a bug.
      const distance = Math.abs(x) / (span / 2);
      out.push({ x, z, ignite: distance * 0.72 + (row === 1 ? 0.08 : 0) });
    }
  }
  return out;
}

const dummy = new THREE.Object3D();

const BEAM_VERTEX = /* glsl */ `
  attribute float aIgnite;
  varying float vIgnite;
  varying float vY;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  varying float vProximity;

  void main() {
    vIgnite = aIgnite;
    vY = uv.y;

    vec4 local = vec4(position, 1.0);
    vec3 nrm = normal;
    vec3 apex = vec3(0.0);
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      nrm = mat3(instanceMatrix) * nrm;
      apex = instanceMatrix[3].xyz;
    #endif

    vec4 world = modelMatrix * local;
    vNormalW = normalize(mat3(modelMatrix) * nrm);
    vViewW = normalize(cameraPosition - world.xyz);

    // A beam the camera is standing inside fills the frame with flat white.
    // Fading them out as the camera closes in is what stops beat 04 turning
    // into fog.
    vec3 apexWorld = (modelMatrix * vec4(apex, 1.0)).xyz;
    vProximity = smoothstep(1.5, 5.5, distance(cameraPosition, apexWorld));

    // Light in air is only visible from inside the volume. Looking down on the
    // rig from above shows the cones' interiors as grey blobs floating around
    // the court, so the beams fade out as the camera rises past the fittings.
    vProximity *= 1.0 - smoothstep(apexWorld.y - 2.5, apexWorld.y + 0.5, cameraPosition.y);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const BEAM_FRAGMENT = /* glsl */ `
  uniform float uProgress;
  uniform float uIntensity;
  uniform vec3  uColor;
  varying float vIgnite;
  varying float vY;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  varying float vProximity;

  void main() {
    // Each fixture strikes when the sequence passes its own threshold, with a
    // short ramp so the rig lights in a wave rather than a switch.
    float lit = smoothstep(vIgnite, vIgnite + 0.14, uProgress);
    if (lit <= 0.001) discard;

    // Dense at the fitting, gone before it reaches the floor.
    float falloff = pow(1.0 - vY, 2.4);

    // Brightest where the cone faces the camera and fading to nothing at its
    // silhouette. The intuition runs the other way — grazing angles do look
    // through more medium — but a cone is a *surface*, and weighting its
    // silhouette draws a hard-edged triangle instead of a soft shaft. Sixteen
    // hard-edged triangles stacked additively is a whiteout.
    float facing = abs(dot(normalize(vNormalW), normalize(vViewW)));
    float core = pow(facing, 4.2);

    float alpha = core * falloff * lit * uIntensity * vProximity * 0.045;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * The rig: fixture housings, their emissive faces, and the light in the air
 * between them and the floor.
 */
export function LightingRig({ volumetric = true }: { volumetric?: boolean }) {
  const fixtures = useMemo(() => layRig(), []);

  const housingRef = useRef<THREE.InstancedMesh>(null);
  const lensRef = useRef<THREE.InstancedMesh>(null);
  const beamRef = useRef<THREE.InstancedMesh>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  const housingGeometry = useMemo(
    () => new THREE.BoxGeometry(RIG.bodyLength, RIG.bodyDepth, RIG.bodyWidth),
    [],
  );
  const lensGeometry = useMemo(
    () => new THREE.PlaneGeometry(RIG.bodyLength * 0.92, RIG.bodyWidth * 0.78),
    [],
  );
  const beamGeometry = useMemo(() => {
    // Open-ended cone from the lens down to a pool a little wider than the
    // court, which is roughly what a 150 W fixture at 7.6 m actually throws.
    // Narrow enough that adjacent fixtures don't overlap into a wall of light.
    const g = new THREE.CylinderGeometry(0.16, 1.05, RIG.height, 20, 1, true);
    g.translate(0, -RIG.height / 2, 0);
    return g;
  }, []);

  const housingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#15121b"),
        roughness: 0.42,
        metalness: 0.68,
      }),
    [],
  );

  const lensMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#fff6ea"),
        toneMapped: false,
        transparent: true,
      }),
    [],
  );

  const beamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BEAM_VERTEX,
        fragmentShader: BEAM_FRAGMENT,
        uniforms: {
          uProgress: { value: 0 },
          uIntensity: { value: 0 },
          uColor: { value: new THREE.Color("#fff2dd") },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  );

  useLayoutEffect(() => {
    const ignite = new Float32Array(fixtures.length);

    fixtures.forEach((f, i) => {
      ignite[i] = f.ignite;

      dummy.position.set(f.x, RIG.height, f.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      housingRef.current?.setMatrixAt(i, dummy.matrix);

      // The lens faces down, tilted slightly inboard toward the court.
      dummy.position.set(f.x, RIG.height - RIG.bodyDepth / 2 - 0.001, f.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      lensRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(f.x, RIG.height - RIG.bodyDepth / 2, f.z);
      dummy.rotation.set(0, 0, f.z > 0 ? 0.16 : -0.16);
      dummy.updateMatrix();
      beamRef.current?.setMatrixAt(i, dummy.matrix);
    });

    for (const ref of [housingRef, lensRef, beamRef]) {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    }
    beamRef.current?.geometry.setAttribute(
      "aIgnite",
      new THREE.InstancedBufferAttribute(ignite, 1),
    );
    lensRef.current?.geometry.setAttribute(
      "aIgnite",
      new THREE.InstancedBufferAttribute(ignite.slice(), 1),
    );
  }, [fixtures]);

  useLayoutEffect(() => {
    return () => {
      housingGeometry.dispose();
      lensGeometry.dispose();
      beamGeometry.dispose();
      housingMaterial.dispose();
      lensMaterial.dispose();
      beamMaterial.dispose();
    };
  }, [
    housingGeometry,
    lensGeometry,
    beamGeometry,
    housingMaterial,
    lensMaterial,
    beamMaterial,
  ]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const lights = sceneState.lights;

    beamMaterial.uniforms.uProgress.value = lights;
    beamMaterial.uniforms.uIntensity.value = damp(
      beamMaterial.uniforms.uIntensity.value,
      volumetric ? lights : 0,
      6,
      dt,
    );

    lensMaterial.opacity = lights;

    // Two real lights carry the whole rig. Sixteen shadow-casting lights would
    // be sixteen shadow-map passes a frame for a difference nobody can see.
    if (keyRef.current) {
      keyRef.current.intensity = damp(keyRef.current.intensity, lights * 2.9, 5, dt);
    }
    if (fillRef.current) {
      fillRef.current.intensity = damp(fillRef.current.intensity, lights * 16, 5, dt);
    }
  });

  return (
    <group>
      <instancedMesh
        ref={housingRef}
        args={[housingGeometry, housingMaterial, fixtures.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={lensRef}
        args={[lensGeometry, lensMaterial, fixtures.length]}
        frustumCulled={false}
      />
      {volumetric && (
        <instancedMesh
          ref={beamRef}
          args={[beamGeometry, beamMaterial, fixtures.length]}
          frustumCulled={false}
          renderOrder={10}
        />
      )}

      <directionalLight
        ref={keyRef}
        position={[3.4, RIG.height, -RIG.offsetZ]}
        intensity={0}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-bias={-0.0008}
      />
      <pointLight
        ref={fillRef}
        position={[-2.5, RIG.height - 1.4, RIG.offsetZ]}
        intensity={0}
        distance={26}
        decay={2}
        color="#ffe9cc"
      />
    </group>
  );
}
