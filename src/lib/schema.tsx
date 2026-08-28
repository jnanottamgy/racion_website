import { site } from "./site";
import type { FaqItem } from "@/content/faq";

/**
 * Structured data for the pages that answer a commercial search.
 *
 * The site-wide graph in `structured-data.tsx` answers "who is this business".
 * These answer "what does it sell" and "does this page answer my question" —
 * different jobs, and the second one is what a non-brand search is doing.
 *
 * Everything here links back to the same `@id` as the site-wide Organization
 * rather than describing the company again. Two descriptions of one business
 * read as two businesses; a reference reads as one.
 */
export const ORGANISATION_ID = `${site.url}/#organisation`;
export const LOCAL_BUSINESS_ID = `${site.url}/#local`;

/** Renders a JSON-LD block. Serialised from literals we build, never input. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * A `Service` node for one thing RACEON sells.
 *
 * `areaServed` is the real list of places off the project schedule, not a
 * wishlist of cities. Naming a town nothing has been built in is how a service
 * page becomes a doorway page.
 */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
  areaServed,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  areaServed: string[];
  /** The specific things included, as sub-services. */
  offers: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name,
    description,
    serviceType,
    url: `${site.url}${path}`,
    provider: { "@id": ORGANISATION_ID },
    areaServed: areaServed.map((place) => ({ "@type": "Place", name: place })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name,
      itemListElement: offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", ...offer },
      })),
    },
  };
}

/**
 * `FAQPage` for a page's question list.
 *
 * The answer text has to be the answer the visitor reads, verbatim — a summary
 * here and fuller copy on the page is a structured-data policy violation, and
 * the fix for it is not to write two versions in the first place. Both come off
 * the same string in `faq.ts`.
 */
export function faqSchema(items: FaqItem[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
