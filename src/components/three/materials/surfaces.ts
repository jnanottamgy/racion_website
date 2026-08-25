import * as THREE from "three";
import { clamp01, fbm2D, lerp } from "@/lib/noise";

/**
 * Runtime-generated PBR texture sets for every material in the RACEON build-up.
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
  /**
   * African teak, precision-sanded under a water-based PU court finish.
   * Tones sampled directly from photographs of RACEON's finished floors:
   * #E0A96B where the fixtures hit it, #B97E50 mid-board, #692B06 in the
   * shadow between planks.
   */
  teak: {
    base: ["#8a5424", "#dda469"],
    detail: "#5d3212",
    grain: 1,
    grainFrequency: 4.5,
    grainWarp: 0.5,
    poreScale: 130,
    poreDepth: 0.14,
    roughness: [0.16, 0.32],
    relief: 0.6,
  },
  /**
   * Chemically treated seasoned pine — the framework.
   *
   * Dark, not the pale yellow of untreated pine. RACEON's members come
   * pressure-treated against termite and moisture, which drives the timber to a
   * deep olive-brown and leaves the grain reading as tone rather than colour.
   *
   * Dark, but not black. The interlock beat exists to show the half laps, and
   * timber that swallows all its own shadow shows nothing.
   */
  pine: {
    base: ["#4e3a26", "#7d5f3e"],
    detail: "#332517",
    grain: 0.9,
    grainFrequency: 3.2,
    grainWarp: 0.7,
    poreScale: 90,
    poreDepth: 0.24,
    roughness: [0.66, 0.86],
    relief: 0.85,
  },
  /**
   * Hard maple — the squash court surface. Pale, tight, almost creamy, and a
   * completely different timber from the African teak used for badminton.
   */
  maple: {
    base: ["#c9a271", "#f0dcbb"],
    detail: "#a67c4c",
    grain: 0.6,
    grainFrequency: 7.5,
    grainWarp: 0.2,
    poreScale: 175,
    poreDepth: 0.06,
    roughness: [0.18, 0.34],
    relief: 0.34,
  },
  /** Button-type shock pad rubber — near-black, matte, slightly granular. */
  shockpad: {
    base: ["#131218", "#232129"],
    detail: "#0b0a0e",
    grain: 0,
    grainFrequency: 0,
    grainWarp: 0,
    poreScale: 210,
    poreDepth: 0.4,
    roughness: [0.72, 0.9],
    relief: 0.5,
  },
  /**
   * 3–5 mm moisture-resistant membrane — near-flat with faint creasing.
   *
   * Matte. At 0.3–0.5 it was glossy enough to return the staging light as a
   * mirror, and a 15 m spot reflected off a flat sheet is a blown white blob
   * sitting on the floor of the framework beat looking like a rendering fault.
   * A polythene-backed underlay does not do that.
   */
  membrane: {
    base: ["#23202c", "#37323f"],
    detail: "#1a1822",
    grain: 0.35,
    grainFrequency: 1.4,
    grainWarp: 1.6,
    poreScale: 40,
    poreDepth: 0.12,
    roughness: [0.62, 0.82],
    relief: 0.35,
  },
};

export type SurfaceKind = keyof typeof RECIPES;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * @param size    texture resolution. 512 is enough for anything but the teak,
 *                where beat 03 puts the camera inside a plank joint.
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
