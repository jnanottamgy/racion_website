import { totalCourts, totalSites } from "@/content/projects";

/**
 * Brand-level facts. Every value here comes from the RACEON company brochure.
 */
/**
 * Absolute base URL for canonical links, OG images and the sitemap.
 *
 * Resolved rather than hardcoded, in three steps: an explicit
 * NEXT_PUBLIC_SITE_URL wins, then the hostname Vercel supplies for the
 * production deployment, then the domain below.
 *
 * The fallback is the *www* host because that is the one serving production —
 * the bare raceon.co.in 308-redirects to it. A canonical has to name the URL
 * that answers, not the one that forwards; pointing every page at a redirect
 * makes a search engine take an extra hop to find out where the content really
 * lives, on every page of the site.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://www.raceon.co.in";
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

