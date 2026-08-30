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

  /**
   * Header navigation.
   *
   * The two service pages lead it, because they are what the business sells and
   * what a stranger arriving from a search needs to find. Everything after them
   * is evidence for the claim the first two make.
   */
  nav: [
    { label: "Badminton", href: "/badminton-court-flooring" },
    { label: "Squash", href: "/squash-court-flooring" },
    { label: "Lighting", href: "/lighting" },
    { label: "Systems", href: "/systems" },
    { label: "Process", href: "/process" },
    { label: "Tools", href: "/tools" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
  ],

  /**
   * Footer navigation, grouped — and written out in full.
   *
   * The header has to fit nine links across a bar, so its labels are one word
   * each. The footer has no such constraint, and the words a link is made of
   * are the strongest thing on a page for telling a search engine what sits at
   * the other end of it. "Wooden badminton courts" pointing at the badminton
   * page is worth having on all twelve routes; "Badminton" is worth much less.
   */
  footerGroups: [
    {
      label: "What RACEON builds",
      links: [
        { label: "Wooden badminton court flooring", href: "/badminton-court-flooring" },
        { label: "Maple squash court flooring", href: "/squash-court-flooring" },
        { label: "Badminton court lighting", href: "/lighting" },
        { label: "Court flooring in Bangalore", href: "/badminton-court-flooring-bangalore" },
        { label: "The five-layer court system", href: "/systems" },
      ],
    },
    {
      label: "The work",
      links: [
        { label: "How a court is built", href: "/process" },
        { label: "Installation machinery", href: "/tools" },
        { label: "Courts delivered", href: "/projects" },
        { label: "Photographs", href: "/gallery" },
        { label: "About RACEON", href: "/about" },
      ],
    },
  ],
} as const;

