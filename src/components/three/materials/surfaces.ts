import * as THREE from "three";
import { clamp01, fbm2D, lerp } from "@/lib/noise";

/**
 * Runtime-generated PBR texture sets for every surface Racion installs.
 *
 * All three maps (albedo, roughness, normal) come out of a single pixel loop —
 * they share the same underlying height field, which is also why they agree
 * with each other. Generating them separately is how you get wood whose
 * specular highlight doesn't sit in its own grain.
 */

export interface SurfaceMaps {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  dispose: () => void;
}

interface SurfaceRecipe {
  /** Darkest and lightest points of the broad tonal variation. */
  base: [string, string];
  /** Colour of the grain / speckle detail. */
  detail: string;
  /** How strongly grain lines read. 0 for surfaces with no grain. */
  grain: number;
  /** Grain lines across the board width. */
  grainFrequency: number;
  /** How much the grain wanders along the board length. */
  grainWarp: number;
  /** Fine surface texture: pores in wood, aggregate in acrylic. */
  poreScale: number;
  poreDepth: number;
  /** Gloss. 0.15 = wet-look lacquer, 0.9 = matte acrylic. */
  roughness: [number, number];
  /** Height relief in the normal map. */
  relief: number;
}

const RECIPES: Record<string, SurfaceRecipe> = {
  /** Hard maple under two coats of polyurethane — the BWF-grade reference. */
  maple: {
    base: ["#b8834a", "#e6c69b"],
    detail: "#8a5a2b",
    grain: 1,
    grainFrequency: 5.5,
    grainWarp: 0.42,
    poreScale: 150,
    poreDepth: 0.1,
    roughness: [0.18, 0.34],
    relief: 0.55,
  },
  /** European beech — pinker, tighter figure, slightly harder. */
  beech: {
    base: ["#c08d63", "#ecd3b4"],
    detail: "#9a6a44",
    grain: 0.75,
    grainFrequency: 8,
    grainWarp: 0.22,
    poreScale: 190,
    poreDepth: 0.07,
    roughness: [0.2, 0.36],
    relief: 0.4,
  },
  /** Seamless poured polyurethane. Near-uniform, soft sheen, faint orange peel. */
  pu: {
    base: ["#1d4f3e", "#256250"],
    detail: "#173f31",
    grain: 0,
    grainFrequency: 0,
    grainWarp: 0,
    poreScale: 46,
    poreDepth: 0.22,
    roughness: [0.44, 0.58],
    relief: 0.22,
  },
  /** Calendered vinyl roll with an embossed anti-slip grain. */
  vinyl: {
    base: ["#1b4b6b", "#25617f"],
    detail: "#12384f",
    grain: 0.28,
    grainFrequency: 120,
    grainWarp: 0.9,
    poreScale: 300,
    poreDepth: 0.3,
    roughness: [0.36, 0.52],
    relief: 0.75,
  },
  /** Acrylic over asphalt — visible sand aggregate, fully matte. */
  acrylic: {
    base: ["#8a3b2e", "#a8503d"],
    detail: "#6d2c22",
    grain: 0,
    grainFrequency: 0,
    grainWarp: 0,
    poreScale: 520,
    poreDepth: 0.55,
    roughness: [0.78, 0.92],
    relief: 0.95,
  },
};

export type SurfaceKind = keyof typeof RECIPES;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * @param size    texture resolution. 512 is enough for anything but the hero
 *                wood, where the camera gets close enough to read grain.
 * @param repeatU how many times the tile wraps along a board's length. Higher
 *                values keep grain fine when a texture covers a 13m court.
 */
export function createSurfaceMaps(
  kind: SurfaceKind,
  size = 512,
  seed = 1,
): SurfaceMaps {
  const recipe = RECIPES[kind];
  const [darkR, darkG, darkB] = hexToRgb(recipe.base[0]);
  const [liteR, liteG, liteB] = hexToRgb(recipe.base[1]);
  const [detR, detG, detB] = hexToRgb(recipe.detail);

  const albedo = new ImageData(size, size);
  const rough = new ImageData(size, size);
  const normal = new ImageData(size, size);

  // Height field first: albedo, roughness and normal all derive from it, which
  // is what keeps the three maps physically consistent with one another.
  const height = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      // Broad colour drift across the board — the slow variation that stops
      // a repeated tile from reading as a repeated tile.
      const tone = fbm2D(u * 1.7, v * 3.4, 3, 2, 0.5, seed);

      // Grain: lines running along the board length, wandering as they go.
      let grainLine = 0;
      if (recipe.grain > 0) {
        const warp =
          (fbm2D(u * 2.2, v * 6, 4, 2, 0.5, seed + 17) - 0.5) * recipe.grainWarp;
        const t = (v * recipe.grainFrequency + warp) % 1;
        const band = t < 0 ? t + 1 : t;
        // Thin dark line with a soft shoulder on both sides.
        grainLine =
          recipe.grain *
          Math.pow(1 - Math.min(1, Math.abs(band - 0.5) * 4.5), 3);
      }

      // Fine surface detail: wood pores, vinyl emboss, acrylic aggregate.
      const pore = fbm2D(
        u * recipe.poreScale,
        v * recipe.poreScale,
        2,
        2,
        0.5,
        seed + 91,
      );

      const h = clamp01(1 - grainLine * 0.7 - (0.5 - pore) * recipe.poreDepth);
      height[y * size + x] = h;

      const i = (y * size + x) * 4;

      // Albedo: tonal mix, darkened into the grain, modulated by pores.
      const mix = clamp01(tone * 1.15 - 0.05);
      const poreShade = 1 - (0.5 - pore) * recipe.poreDepth * 0.55;
      albedo.data[i] =
        lerp(lerp(darkR, liteR, mix), detR, grainLine) * poreShade;
      albedo.data[i + 1] =
        lerp(lerp(darkG, liteG, mix), detG, grainLine) * poreShade;
      albedo.data[i + 2] =
        lerp(lerp(darkB, liteB, mix), detB, grainLine) * poreShade;
      albedo.data[i + 3] = 255;

      // Roughness: open grain and pores scatter more than the flat lacquer
      // between them. This is the map that makes light travel across wood.
      const r = clamp01(
        lerp(recipe.roughness[0], recipe.roughness[1], 1 - h) +
          (pore - 0.5) * 0.08,
      );
      const rv = r * 255;
      rough.data[i] = rv;
      rough.data[i + 1] = rv;
      rough.data[i + 2] = rv;
      rough.data[i + 3] = 255;
    }
  }

  // Sobel the height field into a tangent-space normal map.
  const strength = recipe.relief * 2.2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const ym = (y - 1 + size) % size;
      const yp = (y + 1) % size;

      const dx = (height[y * size + xp] - height[y * size + xm]) * strength;
      const dy = (height[yp * size + x] - height[ym * size + x]) * strength;

      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * size + x) * 4;
      normal.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      normal.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      normal.data[i + 2] = (1 / len) * 0.5 * 255 + 127.5;
      normal.data[i + 3] = 255;
    }
  }

  const map = toTexture(albedo, size, THREE.SRGBColorSpace);
  const roughnessMap = toTexture(rough, size);
  const normalMap = toTexture(normal, size);

  return {
    map,
    roughnessMap,
    normalMap,
    dispose: () => {
      map.dispose();
      roughnessMap.dispose();
      normalMap.dispose();
    },
  };
}

function toTexture(
  data: ImageData,
  size: number,
  colorSpace: THREE.ColorSpace = THREE.NoColorSpace,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d")!.putImageData(data, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = colorSpace;
  // Wood is viewed at a grazing angle for most of the narrative, which is
  // exactly the case bilinear filtering handles worst.
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
