import { totalCourts, totalSites } from "@/content/projects";

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
  /**
   * The meta description, and the one sentence a search result shows under the
   * title. Counts are derived — written out, they went stale the moment two
   * more sites were added and every page inherited the wrong number.
   */
  description: `RACEON builds professional wooden badminton and squash courts — African teak and maple on an interlocked chemically treated pine framework, shock-absorbing Air Shox cushioning, and sports lighting. ${totalCourts} courts delivered across ${totalSites} sites in Karnataka and South India.`,
  url: resolveSiteUrl(),
  locale: "en_IN",

  /**
   * Profiles Google can use to bind this domain to the business, emitted as
   * `sameAs`. A branded search is won by making one entity out of the website,
   * the Google Business Profile and the social accounts; unlinked, they compete.
   *
   * Empty until RACEON supply the real URLs. Nothing is emitted for an empty
   * list — a `sameAs` pointing at a guessed handle is worse than none.
   */
  social: [] as string[],

  /**
   * Exact coordinates of the office, for `LocalBusiness.geo`.
   *
   * Null until someone reads them off the real pin. A street address geocodes
   * on its own; a wrong lat/long puts the business somewhere it isn't, and
   * that is a worse answer than no answer.
   */
  geo: null as { lat: number; lng: number } | null,

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
    courts: totalCourts,
    sites: totalSites,
    yearsPhrase: "Karnataka & South India",
  },

  nav: [
    { label: "Systems", href: "/systems" },
    { label: "Lighting", href: "/lighting" },
    { label: "Tools", href: "/tools" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
  ],
} as const;

