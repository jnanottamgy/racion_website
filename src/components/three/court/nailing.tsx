"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, ramp, sceneState, smoother } from "@/lib/scene-state";
import { DECK } from "./dimensions";
import { FRAME } from "./framework";

/**
 * The pneumatic nailing pass.
 *
 * RACEON's stated method is that the entire wood-flooring work processing is
 * carried out using pneumatic nailing machines only, so the site shows the pass
 * rather than describing it. Deliberately quiet: a tool travelling the length of
 * the framework and fixings appearing behind it. The competence being
 * demonstrated is control, and control doesn't look frantic.
 */
const dummy = new THREE.Object3D();

/** Fixings at every crossing of the framework, sorted along the pass. */
function layFixings() {
  const cols = Math.floor(DECK.length / FRAME.spacing);
  const rows = Math.floor(DECK.width / FRAME.spacing);
  const x0 = -((cols - 1) * FRAME.spacing) / 2;
  const z0 = -((rows - 1) * FRAME.spacing) / 2;

  const out: [number, number][] = [];
  // Column-major, so the set order runs the length of the court and the tool
  // sweeps across it rather than hopping about.
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      out.push([x0 + c * FRAME.spacing, z0 + r * FRAME.spacing]);
    }
  }
  return { fixings: out, cols, rows, x0, z0 };
}

export function NailingPass() {
  const { fixings, x0 } = useMemo(layFixings, []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const toolRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const headGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.006, 0.005, 0.004, 8),
    [],
  );
  const headMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8d8a93"),
        roughness: 0.28,
        metalness: 0.95,
      }),
    [],
  );

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#17141c"),
        roughness: 0.34,
        metalness: 0.8,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#65c100"),
        emissive: new THREE.Color("#65c100"),
        emissiveIntensity: 1.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    [],
  );

  useLayoutEffect(
    () => () => {
      headGeometry.dispose();
      headMaterial.dispose();
      bodyMaterial.dispose();
      accentMaterial.dispose();
    },
    [headGeometry, headMaterial, bodyMaterial, accentMaterial],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    fixings.forEach(([x, z], i) => {
      dummy.position.set(x, 0, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.count = 0;
  }, [fixings]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);

    // The pass only exists once the framework is complete, and it stays put
    // afterwards — the fixings don't vanish when the plywood goes on.
    const framed = smoother(ramp(sceneState.assembly, 0.42, 0.5));
    const pass = sceneState.nailing;

    const mesh = meshRef.current;
    if (mesh) {
      // `count` is the whole trick: the fixings are pre-sorted along the pass,
      // so revealing them is one integer per frame rather than 500 matrix
      // writes.
      mesh.count = Math.round(fixings.length * pass * framed);
    }

    const active = framed * (pass > 0.001 && pass < 0.999 ? 1 : 0);
    bodyMaterial.opacity = damp(bodyMaterial.opacity, active, 7, dt);
    accentMaterial.opacity = damp(accentMaterial.opacity, active, 7, dt);

    if (toolRef.current) {
      // Follow the fixing being set, so the tool is always where the work is.
      const index = Math.min(
        fixings.length - 1,
        Math.max(0, Math.round(fixings.length * pass) - 1),
      );
      const [x, z] = fixings[index] ?? [x0, 0];
      toolRef.current.position.set(x, 0.1, z);
      toolRef.current.visible = bodyMaterial.opacity > 0.01;
    }
    if (glowRef.current) {
      glowRef.current.intensity = damp(glowRef.current.intensity, active * 2.2, 8, dt);
    }
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[headGeometry, headMaterial, fixings.length]}
        frustumCulled={false}
      />

      {/* The tool. Kept to simple, credible masses — a detailed model at this
          scale would read as a toy, and the point is the pass, not the gun. */}
      <group ref={toolRef} visible={false}>
        <mesh material={bodyMaterial} position={[0, 0.055, 0]}>
          <boxGeometry args={[0.15, 0.11, 0.1]} />
        </mesh>
        <mesh material={bodyMaterial} position={[0, 0.16, -0.02]} rotation={[0.32, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.046, 0.17, 14]} />
        </mesh>
        <mesh material={bodyMaterial} position={[0, 0.012, 0]}>
          <boxGeometry args={[0.2, 0.024, 0.13]} />
        </mesh>
        <mesh material={accentMaterial} position={[0, 0.055, 0.051]}>
          <boxGeometry args={[0.1, 0.012, 0.004]} />
        </mesh>
        <pointLight
          ref={glowRef}
          color="#8be034"
          intensity={0}
          distance={1.6}
          decay={2}
          position={[0, 0.09, 0]}
        />
      </group>
    </group>
  );
}
