/**
 * RACEON's delivered project schedule, transcribed from the company brochure.
 *
 * This list is the single most persuasive asset the business has and the
 * brochure buries it as four bulleted columns on the back panel. On the site it
 * becomes the proof layer: filterable, countable, and stated in the one unit a
 * buyer actually thinks in — courts.
 */

export type Scope = "court" | "court-lighting" | "lighting" | "institutional";

export interface Project {
  slug: string;
  name: string;
  /** Town or city. Bangalore projects name their locality instead. */
  location: string;
  courts: number;
  scope: Scope;
  /** Set when the client is a recognisable institution worth naming. */
  sector?: "education" | "government" | "association" | "commercial" | "private";
}

export const SCOPE_LABELS: Record<Scope, string> = {
  court: "Wooden court installation",
  "court-lighting": "Wooden court + lighting",
  lighting: "Lighting & support installation",
  institutional: "Government & institutional",
};

export const projects: Project[] = [
  // --- Wooden court installation -----------------------------------------
  { slug: "vidyaranyapura", name: "Vidyaranyapura", location: "Bangalore", courts: 8, scope: "court" },
  { slug: "udipi", name: "Udipi", location: "Udupi", courts: 6, scope: "court" },
  { slug: "pes-college-mandya", name: "PES College", location: "Mandya", courts: 6, scope: "court", sector: "education" },
  { slug: "tirupati", name: "Tirupati", location: "Tirupati", courts: 4, scope: "court" },
  { slug: "manipal-university", name: "Manipal University", location: "Manipal", courts: 4, scope: "court", sector: "education" },
  { slug: "devaraj-urs-college", name: "Devaraj Urs College", location: "Karnataka", courts: 2, scope: "court", sector: "education" },
  { slug: "tulsi-thota", name: "Tulsi Thota", location: "Bangalore", courts: 2, scope: "court" },
  { slug: "farm-house", name: "Farm House", location: "Karnataka", courts: 2, scope: "court", sector: "private" },
  { slug: "bangarpet", name: "Bangarpet", location: "Kolar", courts: 2, scope: "court" },
  { slug: "ksba", name: "KSBA", location: "Karnataka", courts: 2, scope: "court", sector: "association" },
  { slug: "eca-bangalore", name: "ECA", location: "Bangalore", courts: 2, scope: "court" },
  { slug: "tumkur", name: "Tumkur", location: "Tumakuru", courts: 1, scope: "court" },
  { slug: "dharmastala", name: "Dharmastala", location: "Dakshina Kannada", courts: 1, scope: "court" },
  { slug: "sp-office-tumkur", name: "SP Office", location: "Tumakuru", courts: 1, scope: "court", sector: "government" },
  { slug: "railways-bangalore", name: "Railways", location: "Bangalore", courts: 1, scope: "court", sector: "government" },
  { slug: "lingasur-raichur", name: "Lingasur Auditorium", location: "Raichur", courts: 1, scope: "court" },
  // Behind the ITC factory. The founder gave the site and the court count and
  // did not name a scope, so this takes the default — a wooden court
  // installation — rather than one invented for it.
  { slug: "jeevanahalli-ground", name: "Jeevanahalli Ground", location: "Bangalore", courts: 2, scope: "court" },

  // --- Wooden court installation with lighting ---------------------------
  { slug: "feather-smash-arena", name: "Feather Smash Arena", location: "Bangalore", courts: 8, scope: "court-lighting", sector: "commercial" },
  { slug: "basavanagar", name: "Basavanagar", location: "Bangalore", courts: 4, scope: "court-lighting" },
  { slug: "nehru-park", name: "Nehru Park", location: "Karnataka", courts: 3, scope: "court-lighting", sector: "government" },
  { slug: "golden-enclave", name: "Golden Enclave", location: "Bangalore", courts: 1, scope: "court-lighting", sector: "commercial" },
  { slug: "yellapur-forest", name: "Yellapur Forest Department", location: "Uttara Kannada", courts: 1, scope: "court-lighting", sector: "government" },

  // --- Lighting & support installation -----------------------------------
  { slug: "karnataka-badminton-association", name: "Karnataka Badminton Association", location: "Bangalore", courts: 10, scope: "lighting", sector: "association" },
  { slug: "karnataka-police-academy", name: "Karnataka Police Academy", location: "Mysore", courts: 8, scope: "lighting", sector: "government" },
  { slug: "bagalkot", name: "Bagalkot", location: "Bagalkot", courts: 2, scope: "lighting" },
  { slug: "abhishek-yeligar-academy", name: "Abhishek Yeligar Academy", location: "Dharwad", courts: 6, scope: "lighting", sector: "commercial" },
  { slug: "dharwad-forest", name: "Dharwad Forest Department", location: "Dharwad", courts: 1, scope: "lighting", sector: "government" },

  // --- Government & institutional ----------------------------------------
  { slug: "basavangudi-kohinoor", name: "Basavangudi Kohinoor Playground", location: "Bangalore", courts: 3, scope: "institutional", sector: "government" },
  { slug: "ksrtc-shanthinagar", name: "KSRTC Shanthinagar Bus Depot", location: "Bangalore", courts: 2, scope: "institutional", sector: "government" },
  { slug: "sri-bharathivelu-college", name: "Sri Bharathivelu Arts & Science College", location: "Tamil Nadu", courts: 2, scope: "institutional", sector: "education" },
  { slug: "audugodi-police-quarters", name: "Audugodi Police Station Quarters", location: "Bangalore", courts: 1, scope: "institutional", sector: "government" },
];

export const totalCourts = projects.reduce((n, p) => n + p.courts, 0);
export const totalSites = projects.length;

/** Marquee names, ordered for the proof strip on the homepage. */
export const flagshipProjects = [
  "karnataka-badminton-association",
  "karnataka-police-academy",
  "manipal-university",
  "feather-smash-arena",
  "pes-college-mandya",
  "vidyaranyapura",
] as const;

/** One town or city, with everything RACEON has delivered in it. */
export interface Locality {
  location: string;
  courts: number;
  sites: number;
}

/**
 * The project schedule collapsed to places, largest first.
 *
 * Somebody searching for a court builder searches with a place in it —
 * "badminton court flooring bangalore", not "badminton court flooring". This is
 * the only honest way to answer that: the towns RACEON has actually worked in,
 * counted off the same list the rest of the site counts off. No page is
 * invented for a town with nothing behind it.
 */
export const byLocality: Locality[] = Object.values(
  projects.reduce<Record<string, Locality>>((acc, p) => {
    const row = (acc[p.location] ??= { location: p.location, courts: 0, sites: 0 });
    row.courts += p.courts;
    row.sites += 1;
    return acc;
  }, {}),
).sort((a, b) => b.courts - a.courts || a.location.localeCompare(b.location));

/** Courts delivered under a given scope. */
export function courtsWithScope(...scopes: Scope[]) {
  return projects
    .filter((p) => scopes.includes(p.scope))
    .reduce((n, p) => n + p.courts, 0);
}

/** The largest single site, which is what "multi-court" means in practice. */
export const largestSite = projects.reduce((a, b) =>
  b.courts > a.courts ? b : a,
);
