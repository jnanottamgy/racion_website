/**
 * The machines RACEON work with.
 *
 * This is a real differentiator rather than page filler: the brochure states
 * that the entire wood-flooring work processing is carried out using pneumatic
 * nailing machines only, and industrial sanding is what takes a laid floor to a
 * true plane. Most contractors in this category never say what they use.
 *
 * `image` is the plate name to show. Leave it undefined and the entry renders
 * as a text card until a photograph is supplied.
 */
export interface Tool {
  slug: string;
  name: string;
  lede: string;
  points: string[];
  image?: string;
}

export const tools: Tool[] = [
  {
    slug: "pneumatic-nailer",
    name: "Pneumatic Nailing Machines",
    lede: "The entire wood-flooring work processing is carried out using pneumatic nailing machines — not part of it, all of it.",
    points: [
      "Blind-nails through the tongue so no fixing shows on the face",
      "Every connection in the framework secured by the same method",
      "Consistent seating across the whole floor, board after board",
    ],
    image: "installation",
  },
  {
    slug: "industrial-sander",
    name: "Industrial Sanding Machines",
    lede: "Industrial sanding and finish — what takes a laid floor to a true, flat plane before it is sealed.",
    points: [
      "Multi-pass sanding across the full court",
      "Flat plane achieved before any finish is applied",
      "Followed by a water-based PU court finish",
    ],
    image: "teak-detail",
  },
];
