import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { phases, stepsFor } from "@/content/process";
import { totalCourts, totalSites } from "@/content/projects";
import { process as steps } from "@/content/systems";
import { tools } from "@/content/tools";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "How a Wooden Badminton Court Is Built",
  description: `Survey to handover on one contract: how RACEON builds a wooden badminton or squash court in five phases and ${steps.length} steps, from set-out through the interlocked pine framework to a final measurement of the court as built.`,
  path: "/process",
});

export default function ProcessPage() {
  return (
    <PageShell
      path="/process"
      crumb="Process"
      eyebrow="How a wooden badminton court is built"
      title={
        <>
          One programme,
          <br />
          one site team.
        </>
      }
      lede={`Flooring, lighting, poles and nets from one contractor — so there is one sequence, one crew, and one person answerable for the result. ${steps.length} steps, in the order they happen on site.`}
    >
      {phases.map((phase) => {
        const shot = plate(phase.plate);
        const tool = phase.tool
          ? tools.find((t) => t.slug === phase.tool)
          : undefined;

        return (
          <section
            key={phase.id}
            id={phase.id}
            className="container-x border-b border-hairline py-20"
          >
            <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12 lg:items-start">
              {/* The photograph leads. Every phase has one of itself actually
                  happening on a RACEON site, which is the part a schedule of
                  works can never show. */}
              <div className="lg:col-span-5">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  placeholder="blur"
                  blurDataURL={shot.blurDataURL}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="w-full border border-hairline"
                />
                {tool && (
                  <Link
                    href="/tools"
                    className="mt-5 flex items-baseline justify-between gap-4 border-b border-hairline pb-3 transition-colors hover:border-accent"
                  >
                    <span className="label text-bone-faint">Machine</span>
                    <span className="text-sm text-bone">{tool.name}</span>
                  </Link>
                )}
              </div>

              <div className="lg:col-span-7">
                <p className="label flex items-center gap-3">
                  <span className="text-accent-text">{phase.index}</span>
                  <span className="h-px w-8 bg-hairline-bright" />
                </p>
                <h2 className="display mt-5 text-[length:var(--text-d2)] text-bone">
                  {phase.title}
                </h2>
                <p className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
                  {phase.decides}
                </p>

                <ol className="mt-10 border-t border-hairline">
                  {stepsFor(phase).map((step) => (
                    <li
                      key={step.step}
                      className="grid gap-x-6 gap-y-1 border-b border-hairline py-5 sm:grid-cols-[3rem_1fr]"
                    >
                      <span className="font-mono text-xs tracking-[0.14em] text-accent-text">
                        {step.step}
                      </span>
                      <div>
                        <h3 className="text-sm text-bone">{step.title}</h3>
                        <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-bone-faint">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        );
      })}

      <section className="container-x border-b border-hairline py-20">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">After handover</p>
            <h2 className="display mt-6 text-[length:var(--text-d2)] text-bone">
              Billed on the court that got built.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              Final measurements are taken after completion and billing follows
              the actual site dimensions &mdash; not the ones on the drawing.
              The same sequence has run {totalCourts} courts across{" "}
              {totalSites} sites.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a
              href={site.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-accent px-7 py-4 text-sm tracking-wide text-accent-text transition-colors duration-300 hover:bg-accent hover:text-stage"
            >
              Contact us
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
