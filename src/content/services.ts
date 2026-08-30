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

/**
 * The eight questions that separate one court-laying contractor from another.
 *
 * This is here because of the search it answers. People type "best badminton
 * court flooring company" and no page can honestly answer it by claiming to be
 * the best — RACEON has supplied a specification and a project list, not an
 * award. What it can do is set out what the question actually turns on, state
 * RACEON's answer to each, and let a buyer put the same eight to whoever else
 * they are quoting. That is a more useful page than a superlative, and it is
 * the only version of it this site is entitled to publish.
 *
 * Every `raceon` line is quoted from the build-up specification or the
 * brochure. None of them says anyone else is doing it wrong.
 */
export interface ContractorCheck {
  ask: string;
  why: string;
  raceon: string;
}

export const contractorChecks: ContractorCheck[] = [
  {
    ask: "What is under the boards?",
    why: "The playing surface is the layer everyone quotes on and the one that decides least. Ask for the whole build-up, bottom to top.",
    raceon:
      "A prepared and sealed concrete substrate, a 3–5 mm moisture-resistant membrane, 20–21 mm button-type shock pads, then the framework.",
  },
  {
    ask: "Is there plywood in the build-up?",
    why: "A plywood deck between the framework and the boards is a common way to build a wooden court, and it is a different floor from one without it.",
    raceon:
      "None. There is no plywood and no underlayment; the boards are laid directly over the completed pine framework.",
  },
  {
    ask: "Which way do the framework members run?",
    why: "Supports running one way and members running both ways and interlocking are two different constructions, whatever the quote calls them.",
    raceon:
      "Both directions, notched into each other at every crossing so both occupy the same plane — one continuous framework rather than a set of individual supports.",
  },
  {
    ask: "Is the timber treated, and against what?",
    why: "Untreated softwood under a sports floor in a humid hall is a decision somebody made to save money.",
    raceon:
      "Chemically treated and seasoned pine, proofed against termite and moisture, with the framework leaving room for air circulation so the floor can handle environmental expansion.",
  },
  {
    ask: "What timber is the playing surface, and how thick?",
    why: "\"Wooden flooring\" covers everything from a laminate to a solid hardwood plank. Get the species and the millimetres in writing.",
    raceon:
      "20–21 mm African teak on a badminton court, maple on a squash court, tongue-and-groove locked.",
  },
  {
    ask: "How are the boards fixed down?",
    why: "Fixings driven through the face of a board are visible for the life of the floor, and a shoe finds them.",
    raceon:
      "Blind-nailed through the tongue, so nothing shows on the playing face. The whole of the wood-flooring work processing is carried out using pneumatic nailing machines.",
  },
  {
    ask: "Who does the lighting, the poles and the nets?",
    why: "Three trades on three contracts is three people to chase when the court is not ready and each of them is waiting on another.",
    raceon:
      "The same contractor. Flooring, 150 W lighting with supports and fittings, markings to international dimensions, and freestanding poles and nets, on one contract.",
  },
  {
    ask: "How is the final bill calculated?",
    why: "A quote against a drawing and a bill against a building are rarely the same number, and the difference is usually discovered at the end.",
    raceon:
      "Final measurements are taken after completion and billing is based on the actual site dimensions.",
  },
];
