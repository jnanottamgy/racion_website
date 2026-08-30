import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Priority here is a statement about the site, not a request to Google.
 *
 * It is ordered by what each page is worth to the business: the two service
 * pages are what a stranger searching for a court builder needs to land on, so
 * they sit directly under the homepage, above the pages that explain and prove
 * them.
 */
const ROUTES = [
  { path: "", priority: 1 },
  { path: "/badminton-court-flooring", priority: 0.9 },
  { path: "/badminton-court-flooring-bangalore", priority: 0.8 },
  { path: "/squash-court-flooring", priority: 0.8 },
  { path: "/systems", priority: 0.8 },
  { path: "/lighting", priority: 0.7 },
  { path: "/projects", priority: 0.7 },
  { path: "/gallery", priority: 0.6 },
  { path: "/process", priority: 0.6 },
  { path: "/tools", priority: 0.5 },
  { path: "/about", priority: 0.5 },
];

/** The route list is a constant, so this is a build-time file. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
