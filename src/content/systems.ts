/**
 * The RACEON court build-up.
 *
 * Every `spec` string is taken verbatim from the company brochure. Where the
 * brochure states a dimension it is quoted exactly; where it doesn't, the layer
 * is described qualitatively rather than invented — these numbers end up in
 * front of architects, and a spec RACEON can't defend on site is worse than no
 * spec at all.
 *
 * `modelMm` is a separate, visual-only figure used to proportion the exploded
 * 3D view. Real build-ups are mostly air and pine; drawn to true scale the teak
 * would be a hairline. Exaggerating relative thickness is standard practice for
 * a build-up drawing and is flagged as such in the UI.
 */

export interface BuildLayer {
  index: number;
  code: string;
  name: string;
  /** One line, the way it would be said on site. */
  summary: string;
  /** Brochure-sourced detail. */
  spec: string[];
  /** True when every figure in `spec` is quoted from the brochure. */
  dimensioned: boolean;
  /** Visual thickness for the exploded view, in millimetres. */
  modelMm: number;
  /** Base colour for the 3D layer. */
  tone: string;
}

/** Ordered bottom-up, the order they are actually laid. */
export const buildUp: BuildLayer[] = [
  {
    index: 1,
    code: "L01",
    name: "Vapour Barrier System",
    summary: "A sealed membrane between the slab and everything above it.",
    spec: [
      "6-mil moisture-resistant plastic sheet beneath the flooring",
      "Prevents humidity damage and extends floor life",
    ],
    dimensioned: true,
    modelMm: 6,
    tone: "#2f2a3a",
  },
  {
    index: 2,
    code: "L02",
    name: "Air Shox Cushioning System",
    summary: "The layer a player's knees feel, and never think about.",
    spec: [
      "18 mm button-type shock pads to reduce impact and player fatigue",
      "Optimized spacing ensures uniform load distribution across the court",
    ],
    dimensioned: true,
    modelMm: 18,
    tone: "#1f5c47",
  },
  {
    index: 3,
    code: "L03",
    name: "Pine Wood Base Structure",
    summary:
      "A box structure of termite-treated pine — the reason the floor is still flat in ten years.",
    spec: [
      "Termite-treated, seasoned pine with interlocking runner framework",
      "Box layout: vertical runners connected to horizontal for stability",
      "Allows air circulation to handle environmental expansion",
      "Engineered runner dimensions for long-term strength and load support",
    ],
    dimensioned: false,
    modelMm: 50,
    tone: "#c8a97a",
  },
  {
    index: 4,
    code: "L04",
    name: "African Teak Flooring",
    summary: "Premium teak, blind-nailed through the tongue so nothing shows.",
    spec: [
      "Premium African teak planks, 20–21 mm",
      "Tongue & groove locking for stability",
      "Pneumatic pressurized nailing system",
      "Hidden nailing along the tongue for a seamless finish",
    ],
    dimensioned: true,
    modelMm: 21,
    tone: "#b97e50",
  },
  {
    index: 5,
    code: "L05",
    name: "Sanding & PU Court Finish",
    summary: "Precision-sanded flat, then sealed in water-based polyurethane.",
    spec: [
      "Precision-sanded and PU water-based court finish",
      "Smooth, durable play surface",
      "Professional sanding and polishing",
    ],
    dimensioned: false,
    modelMm: 3,
    tone: "#e0a96b",
  },
  {
    index: 6,
    code: "L06",
    name: "Markings, Poles & Nets",
    summary: "Set out to international dimensions and handed over match-ready.",
    spec: [
      "International-standard badminton court finish",
      "Professional-grade poles and nets for indoor wooden courts",
      "Designed for stability, durability, and match-ready performance",
    ],
    dimensioned: false,
    modelMm: 2,
    tone: "#f3efe9",
  },
];

/** What RACEON sells, in the order the site presents it. */
export const capabilities = [
  {
    slug: "wooden-courts",
    title: "Wooden Courts",
    lede: "Badminton and squash courts in African teak, built from the slab up.",
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
 * Installation sequence. The brochure lists these as services; sequenced, they
 * become the argument for hiring one contractor instead of four.
 */
export const process = [
  { step: "01", title: "Survey & set-out", detail: "Site measured, levels taken, court positions set out to international dimensions." },
  { step: "02", title: "Vapour barrier", detail: "6-mil moisture-resistant sheet laid over the base slab and sealed." },
  { step: "03", title: "Cushioning", detail: "18 mm button-type shock pads set out at optimized spacing for uniform load distribution." },
  { step: "04", title: "Base structure", detail: "Termite-treated seasoned pine runners built into an interlocking box structure that breathes." },
  { step: "05", title: "Teak flooring", detail: "20–21 mm African teak laid tongue-and-groove and blind-nailed pneumatically through the tongue." },
  { step: "06", title: "Sanding & finish", detail: "Precision-sanded flat, then sealed with a water-based PU court finish." },
  { step: "07", title: "Markings, poles & nets", detail: "Court lines set out and marked; professional poles and nets installed." },
  { step: "08", title: "Lighting", detail: "150W fixtures and supports installed and positioned for glare-free play." },
  { step: "09", title: "Measurement & handover", detail: "Final measurements taken post-completion; billing based on actual site dimensions." },
] as const;
