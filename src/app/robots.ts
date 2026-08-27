import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Two lines of text off a constant, generated once at build. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
