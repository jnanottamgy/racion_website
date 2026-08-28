/**
 * The two things RACEON is hired to lay, written as scope rather than as story.
 *
 * The rest of the site explains how a court is built, in the order it happens.
 * That is the right shape for someone already interested and the wrong shape
 * for someone comparing three contractors: they are not reading a sequence,
 * they are checking a list. So this is the list — nouns, not verbs, and every
 * line traceable to RACEON's own specification. Nothing is added here that is
 * not already stated in `systems.ts`.
 */

export interface ServiceScope {
  /** What arrives on site, or what is left behind when RACEON leaves. */
  item: string;
  detail: string;
}

export const badmintonScope: ServiceScope[] = [
  {
    item: "Survey & set-out",
    detail:
      "Site measured, levels taken, and court positions set out to international dimensions before anything is fixed down.",
  },
  {
    item: "Sealed base & membrane",
    detail:
      "Prepared concrete substrate, sealed under a 3–5 mm moisture-resistant membrane to keep humidity out of the timber.",
  },
  {
    item: "Shock pads",
    detail:
      "20–21 mm button-type pads set out across the base for vibration absorption — the layer that takes the impact off a player's knees.",
  },
  {
    item: "Interlocked pine framework",
    detail:
      "Chemically treated, seasoned pine running in both directions and notched into itself at every crossing, forming one continuous framework rather than a set of parallel supports.",
  },
  {
    item: "African teak flooring",
    detail:
      "20–21 mm planks, tongue-and-groove locked, laid straight onto the framework — no plywood, no underlayment — and blind-nailed through the tongue so nothing shows on the face.",
  },
  {
    item: "Sanding & PU finish",
    detail:
      "Industrial sanding and finish, then sealed under a water-based polyurethane court finish.",
  },
  {
    item: "Markings, poles & nets",
    detail:
      "Court lines to international badminton dimensions, and professional-grade freestanding poles and nets — movable, with nothing bolted through the playing surface.",
  },
  {
    item: "Lighting",
    detail:
      "150 W high-performance fixtures for glare-free, even illumination at 500–525 lux, complete with supports and fittings. Supplied with the court or as a standalone installation.",
  },
  {
    item: "Measurement & handover",
    detail:
      "Final measurements taken after completion, with billing based on the actual site dimensions rather than the drawing.",
  },
];

export const squashScope: ServiceScope[] = [
  {
    item: "The same base",
    detail:
      "Prepared and sealed concrete substrate, 3–5 mm moisture-resistant membrane, and 20–21 mm button-type shock pads — identical to a badminton court.",
  },
  {
    item: "The same framework",
    detail:
      "Chemically treated pine in both directions, interlocked at every crossing into one continuous framework.",
  },
  {
    item: "Maple flooring",
    detail:
      "Maple in place of African teak: paler, tighter grained, laid tongue-and-groove directly onto the framework and blind-nailed through the tongue.",
  },
  {
    item: "Sanding & PU finish",
    detail:
      "Industrial sanding and finish, then sealed under a water-based polyurethane court finish.",
  },
];
