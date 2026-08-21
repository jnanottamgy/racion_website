"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createSurfaceMaps, type SurfaceKind } from "./surfaces";

/** Metres of real surface covered by one texture tile. */
const TILE_METRES = 0.6;

export interface SurfaceMaterialOptions {
  size?: number;
  seed?: number;
  /** Set for instanced meshes that supply `aUvOffset` / `aUvScale`. */
  perInstanceUv?: boolean;
  /** Extra material properties merged in after the maps. */
  overrides?: THREE.MeshStandardMaterialParameters;
}

/**
 * A MeshStandardMaterial backed by procedurally generated maps.
 *
 * When `perInstanceUv` is set the material is patched so each instance samples
 * a different region of the texture. Without it, an instanced floor of a
 * thousand planks is a thousand *identical* planks — the grain repeats in
 * lockstep across the whole court and the eye catches it instantly. Offsetting
 * the UVs per instance is the single cheapest thing that makes instanced timber
 * read as timber.
 */
export function useSurfaceMaterial(
  kind: SurfaceKind,
  { size = 512, seed = 1, perInstanceUv = false, overrides }: SurfaceMaterialOptions = {},
) {
  const maps = useMemo(
    () => createSurfaceMaps(kind, size, seed),
    [kind, size, seed],
  );

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: maps.map,
      roughnessMap: maps.roughnessMap,
      normalMap: maps.normalMap,
      normalScale: new THREE.Vector2(1, 1),
      metalness: 0,
      roughness: 1,
      ...overrides,
    });

    if (perInstanceUv) {
      m.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
             attribute vec2 aUvOffset;
             attribute vec2 aUvScale;`,
          )
          .replace(
            "#include <uv_vertex>",
            `#include <uv_vertex>
             #ifdef USE_MAP
               vMapUv = vMapUv * aUvScale + aUvOffset;
             #endif
             #ifdef USE_NORMALMAP
               vNormalMapUv = vNormalMapUv * aUvScale + aUvOffset;
             #endif
             #ifdef USE_ROUGHNESSMAP
               vRoughnessMapUv = vRoughnessMapUv * aUvScale + aUvOffset;
             #endif`,
          );
      };
      // Without this three reuses a cached program compiled from the unpatched
      // source and the offsets silently do nothing.
      m.customProgramCacheKey = () => `${kind}-instanced-uv`;
    }

    return m;
  }, [maps, perInstanceUv, kind, overrides]);

  useEffect(() => {
    return () => {
      material.dispose();
      maps.dispose();
    };
  }, [material, maps]);

  return material;
}

export { TILE_METRES };
