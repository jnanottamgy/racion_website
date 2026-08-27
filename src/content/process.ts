import { process as steps } from "./systems";

/**
 * The build, grouped into the phases a site actually runs in.
 *
 * The eleven steps are the right level of detail for someone checking that
 * nothing has been skipped, and the wrong level for someone deciding whether to
 * hire RACEON — eleven equal rows read as a checklist and flatten the two or
 * three decisions that actually determine what the finished court is like.
 * Phases restore that shape: each is a stretch of work with one photograph of
 * it happening, the machine that does it, and a line saying what that stretch
 * settles about the floor.
 *
 * `steps` stays the single source of the sequence. Nothing here restates it —
 * a phase names the range it covers and the copy is looked up, so the two
 * cannot drift.
 */
export interface Phase {
  id: string;
  index: string;
  title: string;
  /** What this stretch of work settles. Descriptive, never a performance claim. */
  decides: string;
  /** Inclusive range of step codes from `process` in systems.ts. */
  from: string;
  to: string;
  /** Plate name in `photography.ts`. */
  plate: string;
  /** Slug in `tools.ts`, where a machine does the work. */
  tool?: string;
}

export const phases: Phase[] = [
  {
    id: "set-out",
    index: "01",
    title: "Set out",
    decides:
      "Where the court sits in the hall, and whether the run-off around it works before anything is fixed to the floor.",
    from: "01",
    to: "01",
    plate: "site-timber-delivery",
  },
  {
    id: "base",
    index: "02",
    title: "The base",
    decides:
      "What the framework stands on: a sealed substrate, a moisture-resistant membrane, and the pads that take the impact.",
    from: "02",
    to: "03",
    plate: "site-framework-going-down",
    tool: "shock-pad-nailer",
  },
  {
    id: "framework",
    index: "03",
    title: "The framework",
    decides:
      "Whether what goes down is one continuous timber framework or a set of individual supports. Both directions, interlocked at every crossing.",
    from: "04",
    to: "06",
    plate: "site-framework-run",
    tool: "framework-coil-nailer",
  },
  {
    id: "floor",
    index: "04",
    title: "The floor",
    decides:
      "The plane. Boards go straight onto the framework and are blind-nailed through the tongue; the sanding after them is what makes the surface true.",
    from: "07",
    to: "08",
    plate: "site-deck-laid",
    tool: "flooring-cleat-nailer",
  },
  {
    id: "handover",
    index: "05",
    title: "Handover",
    decides:
      "What gets played on and what gets billed: markings to international dimensions, freestanding poles and nets, lighting, and a final measurement of the court as built.",
    from: "09",
    to: "11",
    plate: "site-court-nets",
  },
];

/** The steps a phase covers, resolved from the one sequence in `systems.ts`. */
export function stepsFor(phase: Phase) {
  return steps.filter((s) => s.step >= phase.from && s.step <= phase.to);
}
