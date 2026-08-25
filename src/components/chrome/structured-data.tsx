import { projects, totalCourts, totalSites } from "@/content/projects";
import { site } from "@/lib/site";

/**
 * LocalBusiness schema.
 *
 * RACEON is a Bangalore contractor whose buyers search by city and by
 * standard — "badminton court flooring Bangalore", "wooden badminton court
 * contractor Karnataka". Naming the service area and the catalogue explicitly
 * is what gets the business into those results; none of the competitor sites
 * in this category do it.
 */
export function StructuredData() {
  const { address, email, phone } = site.contact;

  const areas = [...new Set(projects.map((p) => p.location))];

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organisation`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      postalCode: address.postcode,
      addressRegion: address.region,
      addressCountry: "IN",
    },
    areaServed: areas.map((name) => ({ "@type": "Place", name })),
    knowsAbout: [
      "Wooden badminton court flooring",
      "Squash court construction",
      "African teak sports flooring",
      "Maple squash court flooring",
      "Interlocked pine timber framework",
      "Sports lighting installation",
    ],
    slogan: site.tagline,
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Wooden badminton and squash court installation",
          description:
            "Turnkey wooden court construction: prepared base, shock pads, interlocked pine framework, and African teak or maple laid directly onto it with a PU court finish.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sports lighting installation",
          description:
            "150W high-performance fixtures for glare-free, even illumination, complete with supports and fittings.",
        },
      },
    ],
    // Delivered work, stated as a fact rather than a review score.
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Courts delivered",
        value: totalCourts,
      },
      { "@type": "PropertyValue", name: "Sites delivered", value: totalSites },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal we control, so there is no user input to
      // escape here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
