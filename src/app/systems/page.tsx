import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { buildUp, capabilities, frameworkComparison } from "@/content/systems";
import { plate } from "@/content/photography";

export const metadata: Metadata = {
  title: "Wooden Court Systems",
  description:
    "The RACEON build-up: prepared base, Air Shox cushioning, an interlocked pine framework, plywood underlayment, African teak and a PU court finish.",
};

export default function SystemsPage() {
  const hero = plate("court-teak-wide");

  return (
    <PageShell
      eyebrow="Systems"
      title={<>Six layers. Only one of them is the floor.</>}
      lede="Badminton and squash courts in African teak, built from the slab up. Everything under the teak is what decides whether the court is still flat in ten years."
    >
      <Section title="The build-up">
        <ol className="border-t border-hairline">
          {[...buildUp].reverse().map((layer) => (
            <li
              key={layer.code}
              className="grid gap-6 border-b border-hairline py-9 md:grid-cols-[5rem_1fr_1.2fr]"
            >
              <span className="font-mono text-sm text-accent-text">
                {layer.code}
              </span>
              <div>
                <h3 className="text-[length:var(--text-d3)] text-bone">
                  {layer.name}
                </h3>
                <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-bone-faint">
                  {layer.summary}
                </p>
              </div>
              <ul className="space-y-2 self-center">
                {layer.spec.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-sm leading-relaxed text-bone-dim"
                  >
                    <span aria-hidden="true" className="text-accent-text">
                      &mdash;
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="label mt-6">
          Dimensioned figures are quoted from RACEON&rsquo;s specification
        </p>
      </Section>

      <Section title="The framework">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-[length:var(--text-d2)] text-bone">
              Pine both ways,
              <br />
              locked at every crossing.
            </h2>
            <p className="mt-7 max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              Members run in both directions and interlock at their
              intersections, forming one continuous timber framework. The whole
              of the wood-flooring work processing is carried out using
              pneumatic nailing machines.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(["raceon", "typical"] as const).map((key) => {
              const panel = frameworkComparison[key];
              const primary = key === "raceon";
              return (
                <div
                  key={key}
                  className={`border p-6 ${
                    primary ? "border-accent" : "border-hairline"
                  }`}
                >
                  <p
                    className={`font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${
                      primary ? "text-accent-text" : "text-bone-faint"
                    }`}
                  >
                    {panel.subtitle}
                  </p>
                  <p className="mt-2 text-bone">{panel.title}</p>
                  <ul className="mt-5 space-y-2">
                    {panel.points.map((point) => (
                      <li key={point} className="text-sm leading-snug text-bone-dim">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <p className="label mt-8">
          Shown as a difference in construction — not a performance claim
        </p>
      </Section>

      <Section title="Delivered">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full border border-hairline"
          />
          <ul className="space-y-10">
            {capabilities.map((c) => (
              <li key={c.slug}>
                <h3 className="text-[length:var(--text-d3)] text-bone">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-bone-dim">{c.lede}</p>
                <ul className="mt-4 space-y-1.5">
                  {c.points.map((p) => (
                    <li key={p} className="text-sm text-bone-faint">
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageShell>
  );
}
