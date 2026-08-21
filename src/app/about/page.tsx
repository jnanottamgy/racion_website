import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { projects, totalCourts, totalSites } from "@/content/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.legalName} — a specialized sports infrastructure company delivering wooden sports flooring and complete badminton and squash court solutions.`,
};

const sectors = [
  { label: "Education", match: "education" },
  { label: "Government", match: "government" },
  { label: "Associations", match: "association" },
  { label: "Commercial", match: "commercial" },
] as const;

export default function AboutPage() {
  const hero = plate("court-teak-portrait");

  return (
    <PageShell
      eyebrow="About"
      title={<>A sports infrastructure company, not a flooring supplier.</>}
      lede={`${site.legalName} delivers high-quality wooden sports flooring and complete badminton and squash court solutions — base structure, teak flooring, lighting, poles and nets.`}
    >
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-7 text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
            <p>
              RACEON works with termite-treated pine, African teak flooring and
              advanced shock-absorption systems to build courts that meet
              professional playing standards while ensuring safety, durability
              and performance.
            </p>
            <p>
              Projects have been executed across sports academies, educational
              institutions, government facilities, clubs and private arenas. The
              turnkey approach — from base structure formation and teak flooring
              installation through to sports lighting, poles and nets — means one
              programme, one site team and one contractor answerable for the
              result.
            </p>
            <p>
              The growing project footprint stands as a record of that: {" "}
              <Link href="/projects" className="text-accent-text underline-offset-4 hover:underline">
                {totalCourts} courts across {totalSites} sites
              </Link>
              , in Karnataka and South India.
            </p>
          </div>

          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="w-full border border-hairline"
          />
        </div>
      </Section>

      <Section title="Key highlights">
        <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Termite-treated & moisture-protected flooring system",
            "International-standard badminton court finish",
            "Shock-absorbing, player-friendly design",
            "Proven execution across Karnataka & South India",
            "Suitable for schools, colleges, stadiums, clubs & academies",
            "Pneumatic nailing machines used throughout the wood-flooring work",
          ].map((line) => (
            <li
              key={line}
              className="border-t border-hairline pt-4 text-sm leading-relaxed text-bone-dim"
            >
              {line}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Who RACEON builds for">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {sectors.map((s) => {
            const count = projects
              .filter((p) => p.sector === s.match)
              .reduce((n, p) => n + p.courts, 0);
            return (
              <div key={s.label}>
                <dt className="label">{s.label}</dt>
                <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-accent-text">
                  {count}
                  <span className="ml-2 text-xs tracking-[0.14em] text-bone-faint">
                    COURTS
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>
    </PageShell>
  );
}
