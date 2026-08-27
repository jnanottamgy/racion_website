import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { layerFor, tools } from "@/content/tools";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The machines RACEON install with: a nailer for the shock pads, a coil nailer for the interlocked pine framework, and a flooring cleat nailer that blind-nails the teak through the tongue.",
};

export default function ToolsPage() {
  return (
    <PageShell
      eyebrow="Tools"
      title={
        <>
          Three machines,
          <br />
          one for each fixing.
        </>
      }
      lede={
        <>
          The entire wood-flooring work processing is carried out using
          pneumatic nailing machines &mdash; not part of it, all of it. And not
          one machine doing everything: the pads, the framework and the boards
          each get the tool made for them.
        </>
      }
    >
      {tools.map((tool, i) => {
        const shot = tool.image ? plate(tool.image) : null;
        const layer = layerFor(tool);
        // Alternate which side the photograph sits on, once there are
        // photographs to alternate.
        const flip = i % 2 === 1;

        return (
          <Section key={tool.slug}>
            <article className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-start">
              {/*
                The layer number is the index. Numbering the tools 01–03 as
                well put two unrelated sequences side by side — tool 01 fixing
                layer 02 — and the reader has to work out which is which.
              */}
              {layer && (
                <Link
                  href="/systems"
                  className="block border-l border-hairline-bright pl-6 transition-colors hover:border-accent lg:col-span-3"
                >
                  <p className="label text-bone-faint">Fixes layer</p>
                  <p className="display mt-3 text-[length:var(--text-d3)] leading-none text-accent-text">
                    {layer.code}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-bone">
                    {layer.name}
                  </p>
                </Link>
              )}

              <div className={shot ? "lg:col-span-5" : "lg:col-span-9"}>
                <h2 className="display text-[length:var(--text-d2)] text-bone">
                  {tool.name}
                </h2>
                {/*
                  With no photograph the row would end in half a screen of
                  nothing, so the lede and the points sit side by side and fill
                  it. Once the photograph is in they stack again and it takes
                  the space instead.
                */}
                <div
                  className={
                    shot ? "" : "grid gap-x-14 gap-y-7 md:grid-cols-2 md:items-start"
                  }
                >
                  <p className="mt-7 max-w-[42ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
                    {tool.lede}
                  </p>
                  <ul className={`space-y-2.5 ${shot ? "mt-7" : "md:mt-7"}`}>
                    {tool.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-bone-dim"
                      >
                        <span aria-hidden="true" className="text-accent-text">
                          &mdash;
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {shot && (
                <div className={`lg:col-span-4 ${flip ? "lg:order-first" : ""}`}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    placeholder="blur"
                    blurDataURL={shot.blurDataURL}
                    sizes="(min-width: 1024px) 440px, 100vw"
                    className="w-full border border-hairline"
                  />
                </div>
              )}
            </article>
          </Section>
        );
      })}

      <Section>
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label">And then the sanding</p>
            <h2 className="display mt-6 text-[length:var(--text-d2)] text-bone">
              Nailed flat, then sanded true.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              Fixing the boards is not the last word on how flat a court is.
              Industrial sanding and finish takes the laid floor to a true plane
              before anything is sealed over it, and the surface goes under a
              water-based polyurethane court finish.
            </p>
          </div>
          <div className="lg:col-span-4">
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
      </Section>
    </PageShell>
  );
}
