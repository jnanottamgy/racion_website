/**
 * Single source of truth for brand-level copy and metadata.
 * PROVISIONAL values are replaced at P0 from the client brochure.
 */
export const site = {
  name: "Racion",
  /** PROVISIONAL — the positioning line the whole site hangs from. */
  tagline: "The ground beneath the game.",
  description:
    "Racion engineers the surfaces sport is played on — sprung hardwood badminton courts, professional synthetic systems and sports lighting, delivered as one build.",
  url: "https://racion.com", // PROVISIONAL — awaiting domain
  locale: "en_IN",

  /** PROVISIONAL — awaiting brochure. */
  contact: {
    email: "hello@racion.com",
    phone: "",
    address: "",
  },

  nav: [
    { label: "Wooden Systems", href: "/systems/wooden" },
    { label: "Synthetic Systems", href: "/systems/synthetic" },
    { label: "Lighting", href: "/lighting" },
    { label: "Projects", href: "/projects" },
    { label: "Process", href: "/process" },
  ],
} as const;
