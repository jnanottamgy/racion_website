/**
 * The bridge between DOM scroll and the WebGL scene.
 *
 * ScrollTrigger writes into this plain mutable object; the canvas reads it
 * inside `useFrame`. Deliberately NOT React state — routing scroll through a
 * re-render means the scene updates at React's pace instead of the display's,
 * and a scrubbed 3D sequence is the one place where that difference is
 * immediately visible.
 */

/** The eight beats of the homepage narrative, in scroll order. */
export const BEATS = [
  "hero",
  "descent",
  "exploded",
  "materials",
  "lighting",
  "court",
  "configurator",
  "proof",
] as const;

export type Beat = (typeof BEATS)[number];

/** Surfaces the court can wear, in the order beat 03 cycles them. */
export const SURFACES = ["maple", "pu", "vinyl", "acrylic"] as const;
export type Surface = (typeof SURFACES)[number];

export interface SceneState {
  /** 0 → 1 across the entire narrative. The master clock. */
  progress: number;
  /** Index into BEATS of the beat currently on screen. */
  beat: number;
  /** 0 → 1 within the current beat. */
  beatProgress: number;

  /** Layer separation in beat 02. 0 = assembled floor, 1 = fully exploded. */
  explode: number;
  /** Which layer is being read, or -1. Drives the highlight + spec callout. */
  activeLayer: number;

  /** Fractional index into SURFACES; 1.5 means half-way between pu and vinyl. */
  surface: number;
  /** 0 → 1 luminaire ignition across the rig. */
  lights: number;
  /** Illuminance readout, animated 0 → 1500. */
  lux: number;

  /** Normalised pointer, -1 → 1 on both axes. Drives parallax, never camera. */
  pointer: { x: number; y: number };
  /** Scroll velocity in px/frame, signed. Used for motion blur + wood sheen. */
  velocity: number;
}

export const sceneState: SceneState = {
  progress: 0,
  beat: 0,
  beatProgress: 0,
  explode: 0,
  activeLayer: -1,
  surface: 0,
  lights: 0,
  lux: 0,
  pointer: { x: 0, y: 0 },
  velocity: 0,
};

/** Reset between route changes so a remounted canvas doesn't inherit state. */
export function resetSceneState() {
  Object.assign(sceneState, {
    progress: 0,
    beat: 0,
    beatProgress: 0,
    explode: 0,
    activeLayer: -1,
    surface: 0,
    lights: 0,
    lux: 0,
    velocity: 0,
  });
  sceneState.pointer.x = 0;
  sceneState.pointer.y = 0;
}

/**
 * Frame-rate independent exponential smoothing.
 *
 * `lerp(a, b, 0.1)` every frame gives a different result at 60fps and 144fps —
 * the same animation runs visibly faster on a gaming monitor. This is the fix,
 * and every eased value in the scene goes through it.
 *
 * @param lambda higher = snappier. 4 is languid, 12 is responsive.
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  delta: number,
): number {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

/** Clamped, eased 0→1 ramp between two thresholds of a 0→1 driver. */
export function ramp(value: number, from: number, to: number): number {
  if (to === from) return value >= to ? 1 : 0;
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t;
}

/** Smootherstep — zero first and second derivative at both ends. */
export function smoother(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}
