/**
 * Brand-level facts. Every value here comes from the RACEON company brochure.
 */
/**
 * Absolute base URL for canonical links, OG images and the sitemap.
 *
 * Resolved rather than hardcoded: until raceon.in exists, a hardcoded domain
 * makes every share card point at a 404. Vercel supplies the production
 * hostname at build time, and setting NEXT_PUBLIC_SITE_URL overrides both once
 * the real domain is live.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://raceon.in";
}

export const site = {
  name: "RACEON",
  legalName: "RACEON Sports Equipment and Accessories LLP",
  /**
   * The brochure's own line is "Building professional wooden courts with
   * performance, precision & passion." That's the promise; this is the
   * compression of it that survives being set at 150px — and it names the
   * thing RACEON actually does differently.
   */
  tagline: "Built from the frame up.",
  description:
    "RACEON builds professional wooden badminton and squash courts — African teak on a termite-treated pine sub-structure, shock-absorbing Air Shox cushioning, and sports lighting. 91 courts delivered across Karnataka and South India.",
  url: resolveSiteUrl(),
  locale: "en_IN",

  contact: {
    email: "raceonsports@gmail.com",
    phone: "+91 98453 99453",
    phoneHref: "+919845399453",
    /**
     * wa.me deep link. Opens WhatsApp Web on desktop and the app on mobile,
     * with the first message already written — a contractor gets a usable
     * enquiry instead of "hi".
     */
    whatsapp:
      "https://wa.me/919845399453?text=" +
      encodeURIComponent(
        "Hi RACEON — I'd like to talk about a wooden badminton court.",
      ),
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

