import { COURT } from "@/components/three/court/dimensions";

/**
 * Court layout planning.
 *
 * The question every academy owner and facility developer asks first is "how
 * many courts fit in my hall?", and nobody in this category answers it on their
 * website. Everything here is derived from published court dimensions and
 * clear-space recommendations — geometry, not marketing — so the numbers hold
 * up when an architect checks them.
 *
 * Clear space around a court is a *recommendation*, not a regulation, and it is
 * labelled as such everywhere it surfaces. RACEON confirm the real set-out on
 * survey.
 */

export type Sport = "badminton" | "squash";

/** A squash court is a sealed room, so it is planned quite differently. */
export const SPORTS = {
  badminton: {
    label: "Badminton",
    length: COURT.length,
    width: COURT.width,
    /** Recommended clear space behind each back boundary. */
    runoffEnd: 2.0,
    /** Recommended clear space between a sideline and a wall. */
    runoffSide: 1.5,
    /** Recommended clear space between two adjacent courts. */
    between: 2.0,
    /** Recommended clear height over the court. */
    clearHeight: 9.0,
    sharesHall: true,
  },
  squash: {
    label: "Squash",
    // A singles squash court is a walled room at 9.75 × 6.4 m internally.
    length: 9.75,
    width: 6.4,
    runoffEnd: 0,
    runoffSide: 0,
    // Courts share dividing walls rather than run-off.
    between: 0.2,
    clearHeight: 5.64,
    sharesHall: false,
  },
} as const satisfies Record<Sport, unknown>;

export interface Plan {
  sport: Sport;
  courts: number;
  /** Minimum internal hall dimensions, in metres. */
  hallLength: number;
  hallWidth: number;
  clearHeight: number;
  /** Total floor area RACEON would board out. */
  boardedArea: number;
  /** Playing area alone, for comparison. */
  playingArea: number;
  /** Centreline Z offset of each court within the hall. */
  offsets: number[];
}

export function planCourts(sport: Sport, courts: number): Plan {
  const s = SPORTS[sport];
  const n = Math.max(1, Math.min(12, Math.round(courts)));

  const hallLength = s.length + s.runoffEnd * 2;
  const hallWidth =
    n * s.width + (n - 1) * s.between + s.runoffSide * 2;

  const pitch = s.width + s.between;
  const span = (n - 1) * pitch;
  const offsets = Array.from({ length: n }, (_, i) => -span / 2 + i * pitch);

  return {
    sport,
    courts: n,
    hallLength,
    hallWidth,
    clearHeight: s.clearHeight,
    boardedArea: hallLength * hallWidth,
    playingArea: n * s.length * s.width,
    offsets,
  };
}

export interface FitResult {
  fits: boolean;
  /** Largest court count that fits the given hall, or 0. */
  maxCourts: number;
  shortfall?: { length: number; width: number };
}

/** Checks a plan against a hall the buyer already has. */
export function checkFit(
  sport: Sport,
  hallLength: number,
  hallWidth: number,
  courts: number,
): FitResult {
  const plan = planCourts(sport, courts);
  const fits = hallLength >= plan.hallLength && hallWidth >= plan.hallWidth;

  let maxCourts = 0;
  for (let n = 1; n <= 12; n++) {
    const p = planCourts(sport, n);
    if (hallLength >= p.hallLength && hallWidth >= p.hallWidth) maxCourts = n;
    else break;
  }

  return {
    fits,
    maxCourts,
    shortfall: fits
      ? undefined
      : {
          length: Math.max(0, plan.hallLength - hallLength),
          width: Math.max(0, plan.hallWidth - hallWidth),
        },
  };
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
