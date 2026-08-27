import { projects, totalCourts, totalSites } from "@/content/projects";
import { site } from "@/lib/site";

/**
 * The graph a search engine reads this business out of.
 *
 * Three linked nodes rather than one blob, because they answer different
 * questions. `Organization` is the entity — the thing a Knowledge Panel is
 * built around when someone searches the brand name, and the node that carries
 * the logo and the profiles. `LocalBusiness` is the same entity as a place
 * that can be visited and phoned, which is what a "near me" search matches.
 * `WebSite` binds the name to this domain, so the brand and the address are one
 * result instead of two competing ones.
 *
 * They are `@id`-linked into a single graph. Emitted as three separate scripts
 * they would read as three unrelated businesses that happen to share a name.
 */
export function StructuredData() {
  const { address, email, phone } = site.contact;

  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: `${address.line1}, ${address.line2}`,
    addressLocality: address.city,
    postalCode: address.postcode,
    addressRegion: address.region,
    addressCountry: "IN",
  };

  const organisationId = `${site.url}/#organisation`;
  const areas = [...new Set(projects.map((p) => p.location))];

  const organisation = {
    "@type": "Organization",
    "@id": organisationId,
    name: site.name,
    legalName: site.legalName,
    alternateName: [site.legalName, "RACEON Sports"],
    description: site.description,
    url: site.url,
    email,
    telephone: phone,
    address: postalAddress,
    // The logo is what a Knowledge Panel shows. Without it Google picks
    // something off the page, and it usually picks badly.
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/brand/raceon-lockup.svg`,
      caption: site.legalName,
    },
    slogan: site.tagline,
    knowsAbout: [
      "Wooden badminton court flooring",
      "Squash court construction",
      "African teak sports flooring",
      "Maple squash court flooring",
      "Interlocked pine timber framework",
      "Sports lighting installation",
    ],
  };

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": `${site.url}/#local`,
    parentOrganization: { "@id": organisationId },
    name: site.legalName,
    description: site.description,
    url: site.url,
    email,
    telephone: phone,
    address: postalAddress,
    image: `${site.url}/photography/court-lit.webp`,
    priceRange: "$$$",
    areaServed: areas.map((name) => ({ "@type": "Place", name })),
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
      { "@type": "PropertyValue", name: "Courts delivered", value: totalCourts },
      { "@type": "PropertyValue", name: "Sites delivered", value: totalSites },
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": organisationId },
    inLanguage: "en-IN",
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [organisation, localBusiness, website],
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
