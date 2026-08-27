import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata, with the canonical the site was missing.
 *
 * A canonical cannot live on the root layout — declared there it inherits to
 * every route, and each page ends up telling Google it is a duplicate of the
 * homepage. Removing it fixed that and left the opposite problem: none at all.
 *
 * This site is reachable at more than one hostname — the Vercel deployment URL
 * and, shortly, the real domain — and without a canonical each is a separate
 * copy competing with the other for the same brand name. Emitting an absolute
 * canonical on every page says which hostname counts, so the signals land on
 * one address instead of being divided between two.
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  /** Route path, leading slash. "" for the homepage. */
  path: string;
  images?: string[];
}): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      // Google shows the brand next to the result; carrying it in the share
      // title too keeps one name across every surface a link appears on.
      title: `${title} — ${site.name}`,
      description,
      url,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
    },
  };
}
