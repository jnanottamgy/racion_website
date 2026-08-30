import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { Enquire } from "@/components/marketing/enquire";
import { FaqSection } from "@/components/marketing/faq-section";
import { bangaloreFaq } from "@/content/faq";
import { plate } from "@/content/photography";
import { projects, SCOPE_LABELS } from "@/content/projects";
import { badmintonScope } from "@/content/services";
import { faqSchema, JsonLd, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * A city page, and the only one on this site.
 *
 * A page per town is the standard way to chase local search and it is also the
 * thing Google calls a doorway page: twelve near-identical pages with a place
 * name swapped in, no one of which is worth reading. There is exactly one city
 * where a separate page has something to say that the service page does not —
 * the one RACEON is registered in, works out of, and has done nearly half its
 * courts in. Every other town is a row in the places list on the service page,
 * which is where a town with one court belongs.
 *
 * Nothing here is written twice: the build-up, the scope and the questions all
 * come from the same content files as everywhere else, and what this page adds
 * is the Bangalore schedule, the address, and four questions that are actually
 * specific to the city.
 */
const bangalore = projects.filter((p) => p.location === "Bangalore");
const courts = bangalore.reduce((n, p) => n + p.courts, 0);

const DESCRIPTION = `Badminton court flooring in Bangalore: ${courts} courts across ${bangalore.length} sites, from Vidyaranyapura to Shanthinagar. Wooden court laying in African teak on an interlocked pine framework, plus sports lighting, poles and nets — from a sports infrastructure company based in Shivajinagar.`;

export const metadata: Metadata = pageMetadata({
  title: "Badminton Court Flooring in Bangalore",
  description: DESCRIPTION,
  path: "/badminton-court-flooring-bangalore",
});

export default function BangalorePage() {
  const hero = plate("site-court-nets");
  const { address } = site.contact;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Badminton court flooring and laying in Bangalore",
          description: DESCRIPTION,
          path: "/badminton-court-flooring-bangalore",
          serviceType: "Badminton court flooring contractor",
          areaServed: ["Bangalore", "Bengaluru", "Karnataka"],
          offers: badmintonScope.map((s) => ({
            name: s.item,
            description: s.detail,
          })),
        })}
      />
      <JsonLd
        data={faqSchema(bangaloreFaq, "/badminton-court-flooring-bangalore")}
      />

      <PageShell
        path="/badminton-court-flooring-bangalore"
        crumb="Bangalore"
        eyebrow="Badminton court flooring in Bangalore"
        title={
          <>
            {courts} courts.
            <br />
            One city.
          </>
        }
        lede={`RACEON is a sports infrastructure company based in Shivajinagar. These are the wooden courts and lighting installations it has laid across Bangalore — ${courts} courts on ${bangalore.length} sites, from a single court at Golden Enclave to ten lit for the Karnataka Badminton Association.`}
      >
        <Section>
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            priority
            sizes="(min-width: 1280px) 1240px, 100vw"
            className="w-full border border-hairline"
          />
        </Section>

        <Section title="Courts laid in Bangalore">
          <ul className="border-t border-hairline">
            {[...bangalore]
              .sort((a, b) => b.courts - a.courts)
              .map((p) => (
                <li
                  key={p.slug}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-8 gap-y-1 border-b border-hairline py-5 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <span className="text-bone">{p.name}</span>
                  <span className="col-span-2 text-sm text-bone-faint sm:col-span-1">
                    {SCOPE_LABELS[p.scope]}
                  </span>
                  <span className="row-start-1 justify-self-end font-mono text-sm text-accent-text sm:row-auto">
                    {p.courts}
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-8 text-sm text-bone-dim">
            <Link
              href="/projects"
              className="text-accent-text underline-offset-4 hover:underline"
            >
              Every project outside Bangalore too &rarr;
            </Link>
          </p>
        </Section>

        <Section title="What a Bangalore court laying job covers">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <p className="max-w-[42ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              The same build-up everywhere: a sealed base, a moisture-resistant
              membrane, shock pads, an interlocked framework of chemically
              treated pine, and 20&ndash;21&nbsp;mm African teak laid straight
              onto it. Lighting, markings, poles and nets are on the same
              contract.
            </p>
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {badmintonScope.map((s) => (
                <li
                  key={s.item}
                  className="border-t border-hairline pt-3 text-sm text-bone-dim"
                >
                  {s.item}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-10 text-sm text-bone-dim">
            <Link
              href="/badminton-court-flooring"
              className="text-accent-text underline-offset-4 hover:underline"
            >
              Wooden badminton court flooring, in full &rarr;
            </Link>
            <span className="mx-3 text-bone-faint">·</span>
            <Link
              href="/squash-court-flooring"
              className="text-accent-text underline-offset-4 hover:underline"
            >
              Maple squash court flooring &rarr;
            </Link>
          </p>
        </Section>

        <Section title="Where RACEON works from">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="label">Office</p>
              <address className="mt-3 text-sm not-italic leading-relaxed text-bone-dim">
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.city} {address.postcode}
              </address>
            </div>
            <div>
              <p className="label">Courts in Bangalore</p>
              <p className="mt-3 font-mono text-[length:var(--text-d3)] text-accent-text">
                {courts}
              </p>
            </div>
            <div>
              <p className="label">Sites in Bangalore</p>
              <p className="mt-3 font-mono text-[length:var(--text-d3)] text-bone">
                {bangalore.length}
              </p>
            </div>
            <div>
              <p className="label">Phone</p>
              <p className="mt-3 text-sm text-bone-dim">
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="transition-colors hover:text-accent-text"
                >
                  {site.contact.phone}
                </a>
              </p>
            </div>
          </div>
        </Section>

        <FaqSection
          items={bangaloreFaq}
          title="Badminton court flooring in Bangalore — questions"
        />

        <Enquire lede="Send the hall dimensions and the number of courts. RACEON quotes against the site, and bills against the court as measured after it is finished." />
      </PageShell>
    </>
  );
}
