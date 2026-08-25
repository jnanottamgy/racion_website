import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Sports Lighting",
  description:
    "150W high-performance fixtures for glare-free, even illumination, complete with supports and fittings — installed by RACEON across courts in Karnataka and South India.",
};

const lightingCourts = projects
  .filter((p) => p.scope === "lighting" || p.scope === "court-lighting")
  .reduce((n, p) => n + p.courts, 0);

export default function LightingPage() {
  const hero = plate("lighting");

  return (
    <PageShell
      eyebrow="Lighting"
      title={<>Even light, and none of it in a player&rsquo;s eye.</>}
      lede="150W high-performance fixtures for glare-free, even illumination — complete with supports and fittings, positioned for professional court standards."
    >
      <Section>
        <Image
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          placeholder="blur"
          blurDataURL={hero.blurDataURL}
          sizes="(min-width: 1280px) 1240px, 100vw"
          className="w-full border border-hairline"
        />
      </Section>

      <Section title="Positioning">
        <div className="grid gap-12 lg:grid-cols-2">
          <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
            Fixtures run outboard of the sidelines and parallel to the length of
            the court, so a player tracking a high clear looks up into ceiling
            rather than into a lamp. On a shuttle sport, where the ball spends
            most of its flight above head height, that decision is the
            difference between a court people want to play on and one they
            don&rsquo;t.
          </p>
          <dl className="grid grid-cols-2 gap-y-10 self-start">
            <div>
              <dt className="label">Per fitting</dt>
              <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-accent-text">
                150 W
              </dd>
            </div>
            <div>
              <dt className="label">At the surface</dt>
              <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-accent-text">
                500–525
                <span className="ml-2 text-xs tracking-[0.14em] text-bone-faint">
                  LUX
                </span>
              </dd>
            </div>
            <div>
              <dt className="label">Courts lit</dt>
              <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-bone">
                {lightingCourts}
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section title="Scope">
        <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "150W high-performance lights for glare-free, even illumination",
            "Complete with supports and fittings for professional court standards",
            "Optimized positioning for indoor sports arenas",
            "Installation of LED lighting and supports",
            "Supplied with a full wooden court, or as a standalone installation",
            "Delivered across academies, associations and government facilities",
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
    </PageShell>
  );
}
