import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const ROUTES = [
  { path: "", priority: 1 },
  { path: "/systems", priority: 0.9 },
  { path: "/lighting", priority: 0.8 },
  { path: "/projects", priority: 0.8 },
  { path: "/configurator", priority: 0.8 },
  { path: "/process", priority: 0.6 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
