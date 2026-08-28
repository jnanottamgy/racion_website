import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { Enquire } from "@/components/marketing/enquire";
import { FaqSection } from "@/components/marketing/faq-section";
import { badmintonFaq } from "@/content/faq";
import { plate } from "@/content/photography";
import {
  byLocality,
  courtsWithScope,
  totalCourts,
  totalSites,
} from "@/content/projects";
import { badmintonScope } from "@/content/services";
import { buildUp } from "@/content/systems";
import { faqSchema, JsonLd, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * The page a non-brand search lands on.
 *
 * Nobody types "RACEON" until they already know the name. They type "wooden
 * flooring for badminton courts" or "badminton court laying company in
 * Bangalore", and until this page existed the site had nothing whose title,
 * heading and first paragraph were about that — the copy was all voice, which
 * is right for a homepage and useless for a query.
 *
 * It is a service page, not a duplicate of `/systems`: that one is the
 * specification, this one is the scope, the places, the prices question and the
 * way in. Two pages competing for the same query would split the signal between
 * them and rank neither.
 */
const DESCRIPTION = `Wooden badminton court flooring in Bangalore and across Karnataka: 20–21 mm African teak on an interlocked, chemically treated pine framework, over shock pads and a sealed base. ${totalCourts} courts delivered across ${totalSites} sites. Flooring, lighting, poles and nets on one contract.`;

export const metadata: Metadata = pageMetadata({
  title: "Wooden Badminton Court Flooring",
  description: DESCRIPTION,
  path: "/badminton-court-flooring",
});

const courtInstallations = courtsWithScope("court", "court-lighting");

export default function BadmintonCourtFlooringPage() {
  const hero = plate("court-lit");
  const detail = plate("teak-detail");
  const lines = plate("site-court-lines");

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "Wooden badminton court flooring and installation",
          description: DESCRIPTION,
          path: "/badminton-court-flooring",
          serviceType: "Badminton court construction",
          areaServed: byLocality.map((l) => l.location),
          offers: badmintonScope.map((s) => ({
            name: s.item,
            description: s.detail,
          })),
        })}
      />
      <JsonLd data={faqSchema(badmintonFaq, "/badminton-court-flooring")} />

      <PageShell
        path="/badminton-court-flooring"
        crumb="Badminton courts"
        eyebrow="Wooden badminton court flooring"
        title={
          <>
            The floor is the
            <br />
            last thing we lay.
          </>
        }
        lede={`20–21 mm African teak on an interlocked pine framework, laid, sanded, sealed, marked and fitted with poles and nets by one contractor. ${courtInstallations} courts built this way across Karnataka and South India, from a single court in a college hall to eight in an arena.`}
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

        <Section title="What a wooden badminton court includes">
          <dl className="border-t border-hairline">
            {badmintonScope.map((s) => (
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
        </Section>

        <Section title="Five layers, and only one of them is the floor">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
                A badminton floor is judged on the two millimetres a shoe
                touches, and decided by the four layers underneath it. What is
                below the teak is where a court either stays flat or does
                not&nbsp;— which is why RACEON quotes the whole build-up rather
                than a surface.
              </p>
              <ol className="mt-10 border-t border-hairline">
                {[...buildUp].reverse().map((layer) => (
                  <li
                    key={layer.code}
                    className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-hairline py-4"
                  >
                    <span className="font-mono text-xs text-accent-text">
                      {layer.code}
                    </span>
                    <div>
                      <p className="text-bone">{layer.name}</p>
                      <p className="mt-1 text-sm leading-snug text-bone-faint">
                        {layer.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-7 text-sm text-bone-dim">
                <Link
                  href="/systems"
                  className="text-accent-text underline-offset-4 hover:underline"
                >
                  The full badminton court flooring specification &rarr;
                </Link>
              </p>
            </div>

            <Image
              src={detail.src}
              alt={detail.alt}
              width={detail.width}
              height={detail.height}
              placeholder="blur"
              blurDataURL={detail.blurDataURL}
              sizes="(min-width: 1024px) 620px, 100vw"
              className="w-full border border-hairline"
            />
          </div>
        </Section>

        <Section title="Badminton courts built across Karnataka & South India">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="max-w-[42ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
                RACEON works out of Shivajinagar, Bangalore, and has laid courts
                and lighting in {byLocality.length} towns and cities. These are
                the places with finished work in them, counted off the same
                schedule as everything else on this site.
              </p>
              <p className="mt-7 text-sm text-bone-dim">
                <Link
                  href="/projects"
                  className="text-accent-text underline-offset-4 hover:underline"
                >
                  Every project, site by site &rarr;
                </Link>
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-x-10 gap-y-5 self-start sm:grid-cols-3">
              {byLocality.map((l) => (
                <li key={l.location} className="border-t border-hairline pt-3">
                  <p className="text-sm text-bone">{l.location}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-bone-faint">
                    <span className="text-accent-text">{l.courts}</span>{" "}
                    {l.courts === 1 ? "court" : "courts"} ·{" "}
                    {l.sites === 1 ? "1 site" : `${l.sites} sites`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section>
          <Image
            src={lines.src}
            alt={lines.alt}
            width={lines.width}
            height={lines.height}
            placeholder="blur"
            blurDataURL={lines.blurDataURL}
            sizes="(min-width: 1280px) 1240px, 100vw"
            className="w-full border border-hairline"
          />
        </Section>

        <FaqSection
          items={badmintonFaq}
          title="Badminton court flooring questions"
        />

        <Enquire
          lede={`Send the hall dimensions and the number of courts you want in it. ${site.name} quotes against the site, and bills against the court as measured after it is finished.`}
        />
      </PageShell>
    </>
  );
}
