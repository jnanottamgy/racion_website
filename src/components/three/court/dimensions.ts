/**
 * Badminton court set-out, in metres, to international dimensions.
 *
 * RACEON's brochure promises an "international-standard badminton court
 * finish", so these are the real numbers rather than something eyeballed to
 * look right. Anyone who builds courts for a living will recognise a court
 * that is subtly the wrong shape, and they are exactly who this site is for.
 *
 * Origin is the centre of the net. +X runs the length of the court, +Z across
 * it, +Y up. All lines are 40 mm wide and are drawn *inside* the area they
 * bound, so the outer edge of a boundary line is the boundary itself.
 */

export const COURT = {
  /** Doubles court, the full playing area. */
  length: 13.4,
  width: 6.1,
  halfLength: 6.7,
  halfWidth: 3.05,

  /** Singles sidelines sit 460 mm inboard of the doubles sidelines. */
  singlesInset: 0.46,
  singlesHalfWidth: 3.05 - 0.46,

  /** Short service line, measured from the net. */
  shortService: 1.98,
  /** Doubles long service line, measured in from the back boundary. */
  doublesLongServiceInset: 0.76,

  lineWidth: 0.04,

  /** Net: 1.55 m at the posts, sagging to 1.524 m at centre. */
  netHeightPost: 1.55,
  netHeightCentre: 1.524,
  netDepth: 0.76,

  /** Run-off RACEON would allow around a court in a multi-court hall. */
  runoffSide: 1.5,
  runoffEnd: 2.0,
} as const;

export interface LineRect {
  id: string;
  /** Centre of the line. */
  x: number;
  z: number;
  /** Extent along X and Z. */
  lx: number;
  lz: number;
}

const HL = COURT.halfLength;
const HW = COURT.halfWidth;
const LW = COURT.lineWidth;
const HLW = LW / 2;

/**
 * Every line on a doubles badminton court, as axis-aligned rectangles.
 *
 * Built as geometry rather than baked into a texture: the camera gets close
 * enough in beats 01 and 03 that a texture would have to be enormous to stay
 * crisp, and twenty flat rectangles cost nothing by comparison.
 */
export const COURT_LINES: LineRect[] = [
  // Back boundaries — outer edge on the boundary, so centre is inboard by half.
  { id: "back-near", x: HL - HLW, z: 0, lx: LW, lz: COURT.width },
  { id: "back-far", x: -(HL - HLW), z: 0, lx: LW, lz: COURT.width },

  // Doubles sidelines, running the full length.
  { id: "side-doubles-right", x: 0, z: HW - HLW, lx: COURT.length, lz: LW },
  { id: "side-doubles-left", x: 0, z: -(HW - HLW), lx: COURT.length, lz: LW },

  // Singles sidelines, 460 mm inboard.
  {
    id: "side-singles-right",
    x: 0,
    z: COURT.singlesHalfWidth - HLW,
    lx: COURT.length,
    lz: LW,
  },
  {
    id: "side-singles-left",
    x: 0,
    z: -(COURT.singlesHalfWidth - HLW),
    lx: COURT.length,
    lz: LW,
  },

  // Short service lines, 1.98 m each side of the net.
  {
    id: "short-service-near",
    x: COURT.shortService + HLW,
    z: 0,
    lx: LW,
    lz: COURT.width,
  },
  {
    id: "short-service-far",
    x: -(COURT.shortService + HLW),
    z: 0,
    lx: LW,
    lz: COURT.width,
  },

  // Doubles long service lines, 760 mm in from each back boundary.
  {
    id: "long-service-near",
    x: HL - COURT.doublesLongServiceInset - HLW,
    z: 0,
    lx: LW,
    lz: COURT.width,
  },
  {
    id: "long-service-far",
    x: -(HL - COURT.doublesLongServiceInset - HLW),
    z: 0,
    lx: LW,
    lz: COURT.width,
  },

  // Centre lines, from each short service line back to the boundary.
  {
    id: "centre-near",
    x: (COURT.shortService + HL) / 2,
    z: 0,
    lx: HL - COURT.shortService,
    lz: LW,
  },
  {
    id: "centre-far",
    x: -(COURT.shortService + HL) / 2,
    z: 0,
    lx: HL - COURT.shortService,
    lz: LW,
  },
];

/**
 * Teak plank set-out. Boards run the length of the court — the direction of
 * play — which is both how RACEON lay them and what makes the grain read as a
 * single sweep when the camera skims the floor in beat 01.
 */
export const PLANK = {
  /** Face width of a laid board. */
  width: 0.09,
  /** 20–21 mm per the brochure; the thickness a plank actually shows. */
  thickness: 0.021,
  /** Random end-joint stagger, so no two rows break in the same place. */
  minLength: 0.9,
  maxLength: 2.4,
  /** Hairline the tongue-and-groove joint leaves between faces. */
  gap: 0.0006,
} as const;

/** Floor area RACEON would actually board out, including run-off. */
export const DECK = {
  length: COURT.length + COURT.runoffEnd * 2,
  width: COURT.width + COURT.runoffSide * 2,
} as const;
