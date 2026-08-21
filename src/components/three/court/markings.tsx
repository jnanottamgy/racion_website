"use client";

import { useLayoutEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ASSEMBLY } from "@/lib/scene-state";
import { COURT, COURT_LINES } from "./dimensions";
import { useArrival } from "./use-arrival";

/** Line paint sits a fraction above the boards so it never z-fights the deck. */
const LINE_LIFT = 0.0015;

/**
 * Court markings, set out to international dimensions.
 *
 * Merged into a single geometry: twelve separate meshes would be twelve draw
 * calls for what is, visually, one object, and they always move together.
 */
export function CourtLines() {
  const geometry = useMemo(() => {
    const parts = COURT_LINES.map((line) => {
      const g = new THREE.PlaneGeometry(line.lx, line.lz);
      g.rotateX(-Math.PI / 2);
      g.translate(line.x, LINE_LIFT, line.z);
      return g;
    });
    const merged = mergeGeometries(parts, false)!;
    parts.forEach((p) => p.dispose());
    return merged;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f3efe9"),
        roughness: 0.42,
        metalness: 0,
        transparent: true,
        opacity: 0,
        // Paint under lacquer picks up a touch of the light in the room; without
        // this the lines go dead grey the moment the fixtures dim.
        emissive: new THREE.Color("#f3efe9"),
        emissiveIntensity: 0.06,
      }),
    [],
  );

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const group = useArrival(material, ASSEMBLY.markings, { drop: 0.14 });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} receiveShadow />
    </group>
  );
}

/** Procedural net mesh — a fine grid with a solid tape along the top. */
function createNetTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 128;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(214,210,206,0.95)";
  ctx.lineWidth = 1.6;

  // Coarse enough that the weave survives mipmapping instead of moireing
  // into a shimmer the moment the camera moves.
  const cell = 22;
  ctx.beginPath();
  for (let x = 0; x <= W; x += cell) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
  }
  for (let y = 0; y <= H; y += cell) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
  }
  ctx.stroke();

  // The white tape along the top edge, which is the part you actually read
  // from across a hall.
  ctx.fillStyle = "rgba(246,244,240,0.98)";
  ctx.fillRect(0, 0, W, 11);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(5, 1);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Net and posts.
 *
 * The net is built with vertical segments so the cord can sag from 1.55 m at
 * the posts to 1.524 m at the centre — 26 millimetres, invisible as a number
 * and instantly recognisable as a shape to anyone who plays.
 */
export function NetAssembly() {
  const texture = useMemo(() => createNetTexture(), []);

  const netGeometry = useMemo(() => {
    const segments = 48;
    const g = new THREE.PlaneGeometry(COURT.width, COURT.netDepth, segments, 1);
    const pos = g.attributes.position;
    const sag = COURT.netHeightPost - COURT.netHeightCentre;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Parabolic sag, zero at the posts and full at the centre.
      const t = x / (COURT.width / 2);
      pos.setY(i, pos.getY(i) - sag * (1 - t * t));
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    g.rotateY(Math.PI / 2);
    g.translate(0, COURT.netHeightPost - COURT.netDepth / 2, 0);
    return g;
  }, []);

  const netMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        alphaMap: texture,
        transparent: true,
        alphaTest: 0.32,
        // Resolves the cutout against the multisample buffer instead of
        // producing a hard 1-bit edge that crawls whenever the camera moves.
        alphaToCoverage: true,
        opacity: 0,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0,
        color: new THREE.Color("#221e29"),
      }),
    [texture],
  );

  const postGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.019, 0.024, COURT.netHeightPost, 16),
    [],
  );
  const postMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1620"),
        roughness: 0.34,
        metalness: 0.72,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useLayoutEffect(() => {
    return () => {
      texture.dispose();
      netGeometry.dispose();
      netMaterial.dispose();
      postGeometry.dispose();
      postMaterial.dispose();
    };
  }, [texture, netGeometry, netMaterial, postGeometry, postMaterial]);

  // Poles and nets go in last, with the markings — the handover step.
  const group = useArrival(netMaterial, ASSEMBLY.markings, { drop: 0.9, span: 0.09 });
  useFrame(() => {
    postMaterial.opacity = netMaterial.opacity;
  });

  return (
    <group ref={group}>
      <mesh geometry={netGeometry} material={netMaterial} castShadow />
      {[-COURT.halfWidth, COURT.halfWidth].map((z) => (
        <mesh
          key={z}
          geometry={postGeometry}
          material={postMaterial}
          position={[0, COURT.netHeightPost / 2, z]}
          castShadow
        />
      ))}
    </group>
  );
}
