/**
 * The RACEON court build-up.
 *
 * Layer numbering and composition follow RACEON's own construction reference.
 * Dimensioned figures are quoted from the company brochure; where no figure was
 * supplied the layer is described qualitatively rather than invented, because
 * these end up in front of architects and a spec RACEON can't defend on site is
 * worse than no spec at all.
 *
 * `modelMm` is a separate, visual-only figure used to proportion the exploded
 * 3D view. Exaggerating relative thickness is standard practice for a build-up
 * drawing and is flagged as such in the UI.
 */

export interface BuildLayer {
  index: number;
  code: string;
  name: string;
  /** One line, the way it would be said on site. */
  summary: string;
  spec: string[];
  /** True when every figure in `spec` is quoted from RACEON. */
  dimensioned: boolean;
  modelMm: number;
  tone: string;
}

/** Ordered bottom-up, the order they are actually laid. */
export const buildUp: BuildLayer[] = [
  {
    index: 1,
    code: "01",
    name: "Base / Subfloor",
    summary: "Prepared concrete substrate, sealed against moisture.",
    spec: [
      "Prepared concrete / substrate for a solid foundation",
      "6-mil moisture-resistant plastic sheet beneath the flooring",
      "Prevents humidity damage and extends floor life",
    ],
    dimensioned: true,
    modelMm: 80,
    tone: "#3a3340",
  },
  {
    index: 2,
    code: "02",
    name: "Shock Pads",
    summary: "The layer a player's knees feel, and never think about.",
    spec: [
      "18 mm button-type shock pads to reduce impact and player fatigue",
      "Vibration absorption for player safety and comfort",
      "Optimized spacing across the court",
    ],
    dimensioned: true,
    modelMm: 18,
    tone: "#1b1a20",
  },
  {
    index: 3,
    code: "03",
    name: "Interlocked Pine Framework",
    summary:
      "Termite-treated pine running both ways, notched into itself at every crossing.",
    spec: [
      "Pine members in both horizontal and vertical directions",
      "Interlocked at intersections to form a continuous grid",
      "Termite-treated, seasoned pine",
      "Allows air circulation to handle environmental expansion",
    ],
    dimensioned: false,
    modelMm: 60,
    tone: "#c8a97a",
    },
  {
    index: 4,
    code: "04",
    name: "Plywood / Underlayment",
    summary: "Turns a grid into a continuous, uniform plane.",
    spec: [
      "Adds stability and uniformity to the surface",
      "Laid over the completed timber framework",
    ],
    dimensioned: false,
    modelMm: 14,
    tone: "#d4b98d",
  },
  {
    index: 5,
    code: "05",
    name: "Teak Playing Surface",
    summary: "Premium African teak, blind-nailed so nothing shows on the face.",
    spec: [
      "Premium African teak planks, 20–21 mm",
      "Tongue & groove locking for stability",
      "Hidden nailing along the tongue for a seamless finish",
    ],
    dimensioned: true,
    modelMm: 21,
    tone: "#b97e50",
  },
  {
    index: 6,
    code: "06",
    name: "Court Markings & Finish",
    summary: "Precision lines, then sealed in water-based polyurethane.",
    spec: [
      "Precision-sanded and PU water-based court finish",
      "International-standard badminton court markings",
      "Professional-grade poles and nets installed",
    ],
    dimensioned: false,
    modelMm: 4,
    tone: "#f3efe9",
  },
];

/**
 * How RACEON builds the framework, against the arrangement they describe as
 * common elsewhere.
 *
 * Stated as a difference in construction, not as a verdict. RACEON has supplied
 * the method; they have not supplied load testing, deflection data or a
 * comparative study, so the site describes what each arrangement *is* and lets
 * a buyer who builds courts for a living draw the conclusion. That is also the
 * more convincing way to make the point.
 */
export const frameworkComparison = {
  raceon: {
    title: "RACEON method",
    subtitle: "Interlocked timber framework",
    points: [
      "Pine members run in both directions",
      "Members interlock at every intersection",
      "Forms one continuous timber framework",
      "Plywood and teak laid over the completed grid",
    ],
  },
  typical: {
    title: "Typical method",
    subtitle: "Parallel supports",
    points: [
      "Supports run in a single direction",
      "No interlocking between members",
      "Teak laid directly over the supports",
      "Members remain individual, not a grid",
    ],
  },
} as const;

/** What RACEON sells, in the order the site presents it. */
export const capabilities = [
  {
    slug: "wooden-courts",
    title: "Wooden Courts",
    lede: "Badminton and squash courts in African teak, built from the frame up.",
    points: [
      "Complete turnkey installation",
      "Single-court to multi-court projects",
      "Academies, institutions, clubs & stadiums",
    ],
  },
  {
    slug: "lighting",
    title: "Sports Lighting",
    lede: "150W fixtures positioned so the shuttle never disappears into a glare.",
    points: [
      "150W high-performance lights for glare-free, even illumination",
      "Complete with supports and fittings",
      "Optimized positioning for indoor sports arenas",
    ],
  },
  {
    slug: "turnkey",
    title: "Turnkey Delivery",
    lede: "Flooring, lighting, poles and nets from one contractor, on one contract.",
    points: [
      "End-to-end execution from base to final finish",
      "Final measurements taken post-completion",
      "Transparent billing based on actual site dimensions",
    ],
  },
] as const;

/**
 * Installation sequence — the seven steps of the construction story, in the
 * order the 3D narrative shows them.
 */
export const process = [
  { step: "01", title: "Survey & set-out", detail: "Site measured, levels taken, court positions set out to international dimensions." },
  { step: "02", title: "Base preparation", detail: "Concrete substrate prepared and sealed with a 6-mil moisture-resistant sheet." },
  { step: "03", title: "Shock pads", detail: "18 mm button-type pads set out across the base for vibration absorption." },
  { step: "04", title: "First pine direction", detail: "Termite-treated pine members laid across the base in the first direction." },
  { step: "05", title: "Second pine direction & interlocking", detail: "Perpendicular members brought in and interlocked at every intersection, forming one continuous framework." },
  { step: "06", title: "Pneumatic nailing", detail: "The entire wood-flooring work processing is carried out using pneumatic nailing machines only." },
  { step: "07", title: "Plywood underlayment", detail: "Plywood laid over the framework, adding stability and uniformity to the surface." },
  { step: "08", title: "Teak flooring", detail: "20–21 mm African teak laid tongue-and-groove and blind-nailed through the tongue." },
  { step: "09", title: "Sanding & finish", detail: "Precision-sanded flat, then sealed with a water-based PU court finish." },
  { step: "10", title: "Markings, poles & nets", detail: "Court lines set out to international dimensions; professional poles and nets installed." },
  { step: "11", title: "Lighting", detail: "150W fixtures and supports installed and positioned for glare-free play." },
  { step: "12", title: "Measurement & handover", detail: "Final measurements taken post-completion; billing based on actual site dimensions." },
] as const;
