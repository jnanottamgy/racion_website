"use client";

import { useLayoutEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ASSEMBLY } from "@/lib/scene-state";
import { COURT, COURT_LINES } from "./dimensions";
import { useArrival } from "./use-arrival";

/**
 * Freestanding post dimensions, from how they are actually supplied: a 50 mm
 * square steel upright on a weighted base plate, with non-marking feet and
 * transport wheels. Nothing is fixed into the floor.
 */
const POST = {
  section: 0.05,
  baseWidth: 0.36,
  baseLength: 0.86,
  baseThickness: 0.05,
  footRadius: 0.028,
  wheelRadius: 0.035,
} as const;

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

/**
 * Net cord and tape, as two textures.
 *
 * They have to be two. `alphaMap` samples the green channel of whatever texture
 * it is given, and that sample runs through the texture's colour space — so
 * feeding the same sRGB canvas in as both `map` and `alphaMap` decoded the
 * cord's 0.36 green down to 0.11 linear, under the alpha test, and deleted
 * every strand of the mesh while leaving the near-white tape above it. The net
 * hung in mid-air from a floating white line.
 *
 * The mask is authored as a linear greyscale texture, so what is drawn is what
 * the alpha test compares.
 */
function createNetTextures(): { map: THREE.Texture; alpha: THREE.Texture } {
  // ~37 mm cells, square in world space: fine enough to read as a net, coarse
  // enough to survive mipmapping instead of moireing into a shimmer.
  const CELL = 22;
  const W = 512;
  const H = 448;
  const TAPE = 40;

  const draw = (cord: string, tape: string, background: string | null) => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    ctx.strokeStyle = cord;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= W; x += CELL) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();

    // The doubled top edge and the white tape over it — the part you actually
    // read from across a hall.
    ctx.fillStyle = tape;
    ctx.fillRect(0, 0, W, TAPE);

    return canvas;
  };

  const finish = (canvas: HTMLCanvasElement, colorSpace: THREE.ColorSpace) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = colorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(7, 1);
    texture.anisotropy = 8;
    return texture;
  };

  // Colour: a lit cord reads pale against the dark end of a hall, which is
  // exactly what is behind it here.
  const map = finish(
    draw("rgba(178,172,188,1)", "rgba(244,242,238,1)", "rgba(0,0,0,1)"),
    THREE.SRGBColorSpace,
  );
  // Mask: cord and tape solid, everything between them gone.
  const alpha = finish(draw("#ffffff", "#ffffff", "#000000"), THREE.NoColorSpace);

  return { map, alpha };
}

/**
 * Net and posts.
 *
 * The net is built with vertical segments so the cord can sag from 1.55 m at
 * the posts to 1.524 m at the centre — 26 millimetres, invisible as a number
 * and instantly recognisable as a shape to anyone who plays.
 */
export function NetAssembly() {
  const { map, alpha } = useMemo(() => createNetTextures(), []);

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
        map,
        alphaMap: alpha,
        // Blended, not alpha-tested.
        //
        // A 37 mm mesh drawn from the far corner of the hall is about two
        // pixels per cell, so every mip above the first averages the strand
        // down to roughly its coverage — a tenth. Any alpha test low enough to
        // keep that also keeps the holes, and any test high enough to cut the
        // holes deletes the net. Blending is both correct and cheaper: the
        // weave resolves up close and dissolves into an even grey veil at
        // distance, which is exactly how a real net photographs.
        transparent: true,
        depthWrite: false,
        opacity: 0,
        side: THREE.DoubleSide,
        roughness: 0.72,
        metalness: 0,
        // White, so the texture shows exactly as authored.
        color: new THREE.Color("#ffffff"),
      }),
    [map, alpha],
  );

  /**
   * Freestanding posts.
   *
   * Nobody bolts badminton posts through a finished timber floor any more — you
   * would be putting fixings through the surface you just spent months laying.
   * The current standard is a 50 mm square steel upright on a weighted base
   * plate that simply stands on the court, with non-marking feet and transport
   * wheels so it can be rolled off between sessions. Modelled as it is actually
   * supplied: nothing penetrates the deck.
   */
  const postGeometry = useMemo(
    () => new THREE.BoxGeometry(POST.section, COURT.netHeightPost, POST.section),
    [],
  );
  const baseGeometry = useMemo(
    () => new THREE.BoxGeometry(POST.baseWidth, POST.baseThickness, POST.baseLength),
    [],
  );
  /** Non-marking feet at the court end, transport wheels at the outer end. */
  const footGeometry = useMemo(
    () => new THREE.CylinderGeometry(POST.footRadius, POST.footRadius, 0.02, 10),
    [],
  );
  const wheelGeometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(POST.wheelRadius, POST.wheelRadius, 0.022, 12);
    g.rotateZ(Math.PI / 2);
    return g;
  }, []);

  const postMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1620"),
        roughness: 0.42,
        metalness: 0.68,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const rubberMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#100e14"),
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  // The scene does unmount — a lost WebGL context drops it for the static
  // fallback — so everything allocated here has to be given back.
  useLayoutEffect(
    () => () => {
      [netGeometry, postGeometry, baseGeometry, footGeometry, wheelGeometry].forEach(
        (g) => g.dispose(),
      );
      [netMaterial, postMaterial, rubberMaterial].forEach((m) => m.dispose());
      map.dispose();
      alpha.dispose();
    },
    [
      netGeometry,
      postGeometry,
      baseGeometry,
      footGeometry,
      wheelGeometry,
      netMaterial,
      postMaterial,
      rubberMaterial,
      map,
      alpha,
    ],
  );

  // Poles and nets go in last, with the markings — the handover step.
  const group = useArrival(netMaterial, ASSEMBLY.markings, { drop: 0.9, span: 0.09 });
  useFrame(() => {
    postMaterial.opacity = netMaterial.opacity;
    rubberMaterial.opacity = netMaterial.opacity;
  });

  return (
    <group ref={group}>
      {/*
        No shadow from the net. A blended mesh would cast its bounding
        rectangle, and alpha-testing it into the shadow map only trades that
        for 37 mm cells sampled at 20 mm texels — noise. Under a real 525 lux
        rig the net's own shadow is barely there anyway; the posts cast theirs.
      */}
      <mesh geometry={netGeometry} material={netMaterial} />
      {[-1, 1].map((side) => {
        const z = side * COURT.halfWidth;
        // The base runs outward, away from the playing area, so it never sits
        // inside the court.
        const baseZ = z + side * (POST.baseLength / 2 - POST.section);
        const endZ = side * (POST.baseLength / 2 - 0.06);

        return (
          <group key={side}>
            <mesh
              geometry={postGeometry}
              material={postMaterial}
              position={[0, COURT.netHeightPost / 2 + POST.baseThickness, z]}
              castShadow
            />
            <mesh
              geometry={baseGeometry}
              material={postMaterial}
              position={[0, POST.baseThickness / 2, baseZ]}
              castShadow
              receiveShadow
            />
            {[-1, 1].map((x) => (
              <mesh
                key={`foot${x}`}
                geometry={footGeometry}
                material={rubberMaterial}
                position={[x * (POST.baseWidth / 2 - 0.05), 0.01, baseZ - endZ]}
              />
            ))}
            {[-1, 1].map((x) => (
              <mesh
                key={`wheel${x}`}
                geometry={wheelGeometry}
                material={rubberMaterial}
                position={[
                  x * (POST.baseWidth / 2 - 0.02),
                  POST.wheelRadius,
                  baseZ + endZ,
                ]}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
}
