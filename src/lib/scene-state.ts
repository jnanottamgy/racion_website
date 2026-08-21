/**
 * The bridge between DOM scroll and the WebGL scene.
 *
 * ScrollTrigger writes into this plain mutable object; the canvas reads it
 * inside `useFrame`. Deliberately NOT React state — routing scroll through a
 * re-render means the scene updates at React's pace instead of the display's,
 * and a scrubbed 3D sequence is the one place where that difference is
 * immediately visible.
 */

/**
 * The beats of the homepage narrative, in scroll order.
 *
 * The middle of the sequence is RACEON's actual construction order: base, then
 * pine one way, then pine the other way, then the interlock, then the nailing,
 * then everything above it. The site doesn't describe how a RACEON court is
 * built — it builds one.
 */
export const BEATS = [
  "hero",
  "base",
  "framework",
  "interlock",
  "nailing",
  "decking",
  "lighting",
  "court",
  "proof",
] as const;

export type Beat = (typeof BEATS)[number];

/** Timbers RACEON build with. */
export const TIMBERS = ["pine", "teak"] as const;
export type Timber = (typeof TIMBERS)[number];

/**
 * Points in the assembly at which each layer arrives.
 *
 * One shared schedule so the 3D layers, the DOM callouts and the camera all
 * agree on what "the framework is going in" means.
 */
export const ASSEMBLY = {
  shockPads: 0.06,
  frameAlongX: 0.18,
  frameAlongZ: 0.34,
  plywood: 0.58,
  teak: 0.72,
  markings: 0.9,
} as const;

export interface SceneState {
  /** 0 → 1 across the entire narrative. The master clock. */
  progress: number;
  /** Index into BEATS of the beat currently on screen. */
  beat: number;
  /** 0 → 1 within the current beat. */
  beatProgress: number;

  /**
   * 0 → 1 construction progress. 0 is a bare slab, 1 is a finished court.
   * Layers arrive at the thresholds in `ASSEMBLY`.
   */
  assembly: number;
  /** Layer separation for the labelled build-up view. */
  explode: number;
  /** Which layer is being read, or -1. Drives the highlight + spec callout. */
  activeLayer: number;

  /** 0 → 1 travel of the pneumatic nailing pass along the framework. */
  nailing: number;
  /** Where the nailing tool currently is along the court, in metres. */
  nailX: number;
  /** 0 = RACEON's interlocked framework, 1 = parallel supports. */
  method: number;
  /** 0 → 1 luminaire ignition across the rig. */
  lights: number;
  /** Illuminance readout, animated 0 → 1500. */
  lux: number;

  /** Normalised pointer, -1 → 1 on both axes. Drives parallax, never camera. */
  pointer: { x: number; y: number };
  /** Scroll velocity in px/frame, signed. Used for motion blur + wood sheen. */
  velocity: number;
}

/**
 * Normalised scroll position at which each beat's section sits centred in the
 * viewport, measured from the live DOM.
 *
 * Assuming every section is exactly one viewport tall is the obvious approach
 * and it is wrong the moment one beat carries a longer list than the others —
 * the camera arrives at each shot progressively later than the copy it belongs
 * to, and by the last beat the drift is most of a screen. Measuring keeps the
 * shot and the words locked together whatever the content does.
 *
 * Seeded with the uniform assumption so the first frame before layout is sane.
 */
export const beatStops: number[] = BEATS.map((_, i) => i / (BEATS.length - 1));

export const sceneState: SceneState = {
  progress: 0,
  beat: 0,
  beatProgress: 0,
  assembly: 1,
  explode: 0,
  activeLayer: -1,
  nailing: 0,
  nailX: 0,
  method: 0,
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
    assembly: 1,
    explode: 0,
    activeLayer: -1,
    nailing: 0,
    nailX: 0,
    method: 0,
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

/**
 * Piecewise interpolation of `values` across non-uniform `stops`.
 *
 * The stops are the measured beat positions, so every scene property is defined
 * as "what it should be when this beat is on screen" rather than as a hand-tuned
 * fraction of total scroll. Change a section's height and everything still lands
 * on the right beat.
 */
export function keyframe(
  progress: number,
  stops: number[],
  values: number[],
): number {
  if (progress <= stops[0]) return values[0];
  const last = stops.length - 1;
  if (progress >= stops[last]) return values[last];

  let i = 0;
  while (i < last - 1 && progress >= stops[i + 1]) i++;

  const span = Math.max(1e-6, stops[i + 1] - stops[i]);
  const t = smoother((progress - stops[i]) / span);
  return values[i] + (values[i + 1] - values[i]) * t;
}

/** Smootherstep — zero first and second derivative at both ends. */
export function smoother(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}
