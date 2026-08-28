import {
  byLocality,
  courtsWithScope,
  largestSite,
  totalCourts,
  totalSites,
} from "./projects";

/**
 * The questions a buyer types into Google before they type a company name.
 *
 * Every answer here is assembled from what RACEON supplied — the build-up
 * specification, the brochure copy, and the project schedule — and nothing
 * else. Where RACEON has not given a figure, the question either is not asked
 * or is answered with the thing they *did* say. That rules out the two
 * questions every competitor answers badly: there is no price per square foot
 * on this site and no programme duration, because neither was supplied, and a
 * number invented for a search engine is a number a site engineer has to
 * defend later.
 *
 * The text is deliberately plain, because it is used twice: rendered on the
 * page, and serialised into FAQPage structured data. Structured data must
 * match the visible answer word for word or it is a policy violation, so one
 * string feeds both.
 */
export interface FaqItem {
  q: string;
  a: string;
  /** Where the full answer lives, when there is more of it. */
  href?: string;
}

const courtCourts = courtsWithScope("court", "court-lighting");
const litCourts = courtsWithScope("lighting", "court-lighting");
const localities = byLocality.length;

export const badmintonFaq: FaqItem[] = [
  {
    q: "What wood is used for a badminton court floor?",
    a: "African teak, in 20–21 mm planks, tongue-and-groove locked and blind-nailed through the tongue so no fixing shows on the playing face. Squash courts are laid in maple instead. Both are finished with industrial sanding and a water-based PU court finish.",
    href: "/systems",
  },
  {
    q: "Does the teak sit on plywood?",
    a: "No. There is no plywood and no underlayment anywhere in the build-up. The boards are laid directly over the completed pine framework, which is what the framework is for.",
    href: "/systems",
  },
  {
    q: "What goes underneath a wooden badminton court?",
    a: "Four layers, in this order: a prepared and sealed concrete substrate; a 3–5 mm moisture-resistant membrane; 20–21 mm button-type shock pads for vibration absorption; and an interlocked framework of chemically treated pine. The teak is the fifth layer and the only one anybody sees.",
    href: "/systems",
  },
  {
    q: "How is the pine framework built?",
    a: "Pine members run in both directions across the floor and interlock at every intersection — each notched into the other so both occupy the same plane — forming one continuous grid rather than a set of parallel supports with a floor laid over them. The timber is chemically treated and seasoned against termite and moisture, and the framework leaves room for air circulation so the floor can handle environmental expansion.",
    href: "/systems",
  },
  {
    q: "How is the flooring fixed down?",
    a: "The entire wood-flooring work processing is carried out using pneumatic nailing machines — a nailer for the shock pads, a coil nailer for the framework, and a flooring cleat nailer that drives through the tongue of each board.",
    href: "/tools",
  },
  {
    q: "Is the court marked and fitted out as well?",
    a: "Yes. Court lines are set out to international badminton dimensions after the finish, and professional-grade freestanding poles and nets are installed. Freestanding means the poles are movable and nothing is bolted through the playing surface.",
    href: "/process",
  },
  {
    q: "Do you install the lighting too?",
    a: `Yes, either with a court or as a standalone installation. RACEON fits 150 W high-performance lights for glare-free, even illumination, complete with supports and fittings, giving 500–525 lux at the surface. ${litCourts} of the ${totalCourts} courts delivered so far have been lit by RACEON.`,
    href: "/lighting",
  },
  {
    q: "How is a wooden badminton court priced?",
    a: "Final measurements are taken after completion and billing is based on the actual site dimensions, so the invoice matches the court that was built rather than the one that was drawn. Send the hall size and the number of courts you want in it and RACEON will quote against it.",
  },
  {
    q: "How many courts can be laid in one hall?",
    a: `Anything from a single court upwards. The largest single site delivered so far is ${largestSite.name}, at ${largestSite.courts} courts, and RACEON has built for academies, schools and colleges, associations, government departments, clubs and private arenas.`,
    href: "/projects",
  },
  {
    q: "Where does RACEON build badminton courts?",
    a: `Across Karnataka and South India — ${totalCourts} courts on ${totalSites} sites in ${localities} towns and cities so far, ${courtCourts} of them wooden court installations. The company is based in Shivajinagar, Bangalore.`,
    href: "/projects",
  },
];

export const squashFaq: FaqItem[] = [
  {
    q: "What flooring is used for a squash court?",
    a: "Maple. It is a different timber from the African teak used on a badminton court — paler, tighter grained — and it is laid the same way: tongue-and-groove, blind-nailed through the tongue, then industrially sanded and sealed under a water-based PU court finish.",
    href: "/systems",
  },
  {
    q: "Is the build-up under a squash floor different?",
    a: "No. The same five layers go in: a prepared and sealed concrete substrate, a 3–5 mm moisture-resistant membrane, 20–21 mm button-type shock pads, and an interlocked chemically treated pine framework, with the maple laid straight onto it. Only the surface timber changes.",
    href: "/systems",
  },
  {
    q: "What does RACEON quote on a squash court?",
    a: "Everything on this page describes the floor — base preparation through to the finished, sealed maple surface. For anything beyond the floor on a squash court, ask, and RACEON will tell you whether it is in scope.",
  },
  {
    q: "How is a squash floor priced?",
    a: "The same way as a badminton court: final measurements are taken after completion and billing is based on the actual site dimensions.",
  },
];
