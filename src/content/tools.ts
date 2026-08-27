import { buildUp, type BuildLayer } from "./systems";

/**
 * The machines RACEON work with.
 *
 * A real differentiator rather than page filler. The brochure states that the
 * entire wood-flooring work processing is carried out using pneumatic nailing
 * machines, and RACEON run a different machine for each fixing in the build-up:
 * one for the shock pads, one for the framework, one for the boards. Most
 * contractors in this category never say what they install with at all.
 *
 * Everything here is either visible in the supplied photograph of the tool or
 * stated by RACEON. No pressures, nail sizes, spacings or speeds — those are
 * exactly the numbers a specifier would check, and inventing them would be
 * worse than leaving them out.
 */
export interface Tool {
  slug: string;
  name: string;
  /** The build-up layer this machine fixes. Keeps the page in step with /systems. */
  layerCode: string;
  /** What it does, in one line. */
  lede: string;
  /** Observable facts only. */
  points: string[];
  /**
   * Plate name in `photography.ts`. Undefined until RACEON's photograph of the
   * machine has been through `scripts/grade-photography.mjs`; the entry renders
   * as a full-width spec row until then rather than leaving a hole in the page.
   */
  image?: string;
}

export const tools: Tool[] = [
  {
    slug: "shock-pad-nailer",
    name: "Shock Pad Nailer",
    layerCode: "02",
    lede: "Fixes the button-type shock pad rubber to the pine.",
    points: [
      "Straight magazine, air-driven",
      "Every pad fixed by the same method",
      "The absorbing layer is fastened, not just laid",
    ],
  },
  {
    slug: "framework-coil-nailer",
    name: "Framework Coil Nailer",
    layerCode: "03",
    lede: "Fixes the interlocked pine framework — every half lap, at every crossing.",
    points: [
      "Coil magazine, air-driven",
      "Both directions of the grid fixed the same way",
      "Every connection in the framework made by the same method",
    ],
  },
  {
    slug: "flooring-cleat-nailer",
    name: "Flooring Cleat Nailer",
    layerCode: "04",
    lede: "Blind-nails the playing surface — African teak, or maple on a squash court — through the tongue.",
    points: [
      "Angled shoe registers on the board's tongue",
      "Stand-up frame, worked from standing height",
      "Nothing shows on the finished face",
    ],
  },
];

/** The build-up layer a machine fixes, resolved from `systems.ts`. */
export function layerFor(tool: Tool): BuildLayer | undefined {
  return buildUp.find((l) => l.code === tool.layerCode);
}
