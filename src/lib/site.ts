/**
 * Brand-level facts. Every value here comes from the RACEON company brochure.
 */
export const site = {
  name: "RACEON",
  legalName: "RACEON Sports Equipment and Accessories LLP",
  /**
   * The brochure's own line is "Building professional wooden courts with
   * performance, precision & passion." That's the promise; this is the
   * compression of it that survives being set at 150px.
   */
  tagline: "The ground the game is played on.",
  description:
    "RACEON builds professional wooden badminton and squash courts — African teak on a termite-treated pine sub-structure, shock-absorbing Air Shox cushioning, and sports lighting. 91 courts delivered across Karnataka and South India.",
  url: "https://raceon.in",
  locale: "en_IN",

  contact: {
    email: "raceonsports@gmail.com",
    phone: "+91 98453 99453",
    phoneHref: "+919845399453",
    address: {
      line1: "#15, Meenakshi Koil Street",
      line2: "Shivajinagar",
      city: "Bangalore",
      postcode: "560051",
      region: "Karnataka",
      country: "India",
    },
  },

  /** Headline proof. Derived from the project schedule in `projects.ts`. */
  stats: {
    courts: 91,
    sites: 29,
    yearsPhrase: "Karnataka & South India",
  },

  nav: [
    { label: "Systems", href: "/systems" },
    { label: "Lighting", href: "/lighting" },
    { label: "Projects", href: "/projects" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
  ],
} as const;
