import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { Enquire } from "@/components/marketing/enquire";
import { FaqSection } from "@/components/marketing/faq-section";
import { squashFaq } from "@/content/faq";
import { plate } from "@/content/photography";
import { byLocality } from "@/content/projects";
import { squashScope } from "@/content/services";
import { faqSchema, JsonLd, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

/**
 * Squash gets its own page because it is its own search.
 *
 * Maple was a clause in a sentence on three other pages — enough for a reader
 * already on the site, nothing at all for somebody typing "maple squash court
 * flooring". It is also a far less contested query than badminton, so a page
 * that answers it plainly is the cheapest ranking on this site.
 *
 * The scope is stated narrowly and on purpose. RACEON supplied the floor; the
 * page describes the floor. Walls, glass and fit-out are not claimed either
 * way, because nobody has told us, and a scope invented to look complete is the
 * kind of thing that gets discovered on site.
 */
const DESCRIPTION =
  "Maple squash court flooring, laid on the same interlocked chemically treated pine framework RACEON builds under a badminton court — sealed base, moisture-resistant membrane, shock pads, then maple sanded and sealed under a water-based PU court finish. Bangalore and across Karnataka.";

export const metadata: Metadata = pageMetadata({
  title: "Maple Squash Court Flooring",
  description: DESCRIPTION,
  path: "/squash-court-flooring",
});

export default function SquashCourtFlooringPage() {
  const hero = plate("site-squash-court");

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Maple squash court flooring",
          description: DESCRIPTION,
          path: "/squash-court-flooring",
          serviceType: "Squash court flooring installation",
          areaServed: byLocality.map((l) => l.location),
          offers: squashScope.map((s) => ({
            name: s.item,
            description: s.detail,
          })),
        })}
      />
      <JsonLd data={faqSchema(squashFaq, "/squash-court-flooring")} />

      <PageShell
        path="/squash-court-flooring"
        crumb="Squash courts"
        eyebrow="Maple squash court flooring"
        title={
          <>
            Maple, on the
            <br />
            same frame.
          </>
        }
        lede="A squash floor changes one layer and one layer only. The base, the membrane, the shock pads and the interlocked pine framework are the ones RACEON builds under a badminton court; the timber laid over them is maple instead of African teak."
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

        <Section title="Why maple and not teak">
          <div className="grid gap-12 lg:grid-cols-2">
            <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              They are different timbers for different rooms. African teak is
              what RACEON lays on a badminton court; maple is what goes into a
              squash court — pale, tight grained, and a completely different
              board from the one next door. Everything else about how it is
              fixed is identical: tongue and groove, blind-nailed through the
              tongue, straight onto the framework with no plywood underneath.
            </p>
            <dl className="grid grid-cols-2 gap-y-10 self-start">
              <div>
                <dt className="label">Badminton</dt>
                <dd className="mt-2 text-[length:var(--text-d3)] text-bone">
                  African teak
                </dd>
              </div>
              <div>
                <dt className="label">Squash</dt>
                <dd className="mt-2 text-[length:var(--text-d3)] text-accent-text">
                  Maple
                </dd>
              </div>
              <div>
                <dt className="label">Plank</dt>
                <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-bone">
                  20–21
                  <span className="ml-2 text-xs tracking-[0.14em] text-bone-faint">
                    MM
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label">Fixing</dt>
                <dd className="mt-2 text-[length:var(--text-d3)] text-bone">
                  Blind-nailed
                </dd>
              </div>
            </dl>
          </div>
        </Section>

        <Section title="What a squash court floor includes">
          <dl className="border-t border-hairline">
            {squashScope.map((s) => (
              <div
                key={s.item}
                className="grid gap-3 border-b border-hairline py-7 md:grid-cols-[1fr_1.6fr] md:gap-12"
              >
                <dt className="text-[length:var(--text-d3)] leading-[1.15] text-bone">
                  {s.item}
                </dt>
                <dd className="max-w-[62ch] self-center leading-relaxed text-bone-dim">
                  {s.detail}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-bone-dim">
            <Link
              href="/systems"
              className="text-accent-text underline-offset-4 hover:underline"
            >
              The full five-layer build-up &rarr;
            </Link>
            <span className="mx-3 text-bone-faint">·</span>
            <Link
              href="/badminton-court-flooring"
              className="text-accent-text underline-offset-4 hover:underline"
            >
              Wooden badminton court flooring &rarr;
            </Link>
          </p>
        </Section>

        <FaqSection items={squashFaq} title="Squash court flooring questions" />

        <Enquire lede="Send the room dimensions and RACEON will quote the floor against them. Final measurements are taken after completion and billing follows the actual site dimensions." />
      </PageShell>
    </>
  );
}
