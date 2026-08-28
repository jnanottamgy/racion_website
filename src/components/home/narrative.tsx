"use client";

import Link from "next/link";
import { buildUp } from "@/content/systems";
import { projects, totalCourts, totalSites } from "@/content/projects";
import { site } from "@/lib/site";
import { Beat, BeatBody, BeatTitle } from "./beat";
import { MethodComparison } from "./method-comparison";
import { SceneReadout } from "./scene-readout";
import { useNarrative } from "./use-narrative";

const NARRATIVE_ID = "narrative";

export function Narrative() {
  useNarrative(NARRATIVE_ID);

  return (
    <div id={NARRATIVE_ID} className="relative z-10">
      {/* ---------------------------------------------------------------- 00 */}
      <section
        data-beat={0}
        className="relative flex min-h-screen flex-col justify-end container-x pb-[12vh]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[78%] bg-gradient-to-t from-stage via-stage/78 to-transparent"
        />
        <div data-enter style={{ animationDelay: "250ms" }}>
          <p className="label">{site.legalName}</p>
          <h1 className="display mt-8 text-[length:var(--text-hero)] text-bone">
            Built from
            <br />
            the frame up.
          </h1>
          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              Wooden badminton court flooring in African teak, squash courts in
              maple, on an interlocked pine framework — flooring, lighting,
              poles and nets on one contract, out of Bangalore.
            </p>
            <dl className="flex gap-10 font-mono text-xs uppercase tracking-[0.14em] text-bone-faint">
              <div>
                <dt>Courts</dt>
                <dd className="mt-1 text-2xl text-accent-text">{totalCourts}</dd>
              </div>
              <div>
                <dt>Sites</dt>
                <dd className="mt-1 text-2xl text-bone">{totalSites}</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="label mt-16" data-enter style={{ animationDelay: "1400ms" }}>
          Scroll to build one
        </p>
      </section>

      {/* ---------------------------------------------------------------- 01 */}
      <Beat id="base" index="01" label="The base" side="right">
        <BeatTitle>Everything starts on the slab.</BeatTitle>
        <BeatBody>
          The concrete substrate is prepared and sealed under a 3–5&nbsp;mm
          moisture-resistant membrane. Then 20–21&nbsp;mm button-type shock pads
          go down for vibration absorption — the layer a player&rsquo;s knees
          feel and never think about.
        </BeatBody>
      </Beat>

      {/* ---------------------------------------------------------------- 02 */}
      <Beat id="framework" index="02" label="The framework" side="left">
        <BeatTitle>
          Pine, running
          <br />
          both ways.
        </BeatTitle>
        <BeatBody>
          Chemically treated seasoned pine goes down in the first direction —
          dark, dense, and proofed against termite and moisture. Then the same
          again, perpendicular to it.
        </BeatBody>
        <BeatBody>
          Almost everything that makes a RACEON court a RACEON court happens
          below the only part you can see.
        </BeatBody>
      </Beat>

      {/* ---------------------------------------------------------------- 03 */}
      <Beat id="interlock" index="03" label="The interlock" side="left">
        <BeatTitle>
          They don&rsquo;t sit on top
          <br />
          of each other.
        </BeatTitle>
        <BeatBody>
          At every crossing the members interlock — each notched into the other
          so both occupy the same plane. What goes down is one continuous timber
          framework, not a set of individual supports with a floor laid over
          them.
        </BeatBody>
        <MethodComparison />
      </Beat>

      {/* ---------------------------------------------------------------- 04 */}
      <Beat id="nailing" index="04" label="The nailing" side="right">
        <BeatTitle>Pneumatic machines only.</BeatTitle>
        <BeatBody>
          The entire wood-flooring work processing is carried out using
          pneumatic nailing machines. Not part of it — all of it.
        </BeatBody>
        <BeatBody>
          Every connection in the framework is secured the same way, by the same
          method, at every crossing.
        </BeatBody>
      </Beat>

      {/* ---------------------------------------------------------------- 05 */}
      <Beat id="decking" index="05" label="The deck" side="left">
        <BeatTitle>
          Straight onto
          <br />
          the frame.
        </BeatTitle>
        <BeatBody>
          No plywood, no underlayment. 20–21&nbsp;mm{" "}
          <Link
            href="/badminton-court-flooring"
            className="text-accent-text underline-offset-4 hover:underline"
          >
            African teak
          </Link>{" "}
          &mdash;{" "}
          <Link
            href="/squash-court-flooring"
            className="text-accent-text underline-offset-4 hover:underline"
          >
            maple on a squash court
          </Link>{" "}
          &mdash; goes tongue and groove directly onto the completed framework,
          blind-nailed through the tongue so nothing shows on the face.
        </BeatBody>
        <BeatBody>
          Then industrial sanding and finish, sealed under water-based
          polyurethane.
        </BeatBody>

        <ol className="mt-12 divide-y divide-hairline border-y hairline border-hairline">
          {[...buildUp].reverse().map((layer) => (
            <li key={layer.code} className="grid grid-cols-[2.75rem_1fr] gap-4 py-3.5">
              <span className="font-mono text-xs text-accent-text">
                {layer.code}
              </span>
              <div>
                <p className="text-sm text-bone">{layer.name}</p>
                <p className="mt-0.5 text-sm leading-snug text-bone-faint">
                  {layer.spec[0]}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="label mt-4">Layer thicknesses exaggerated for clarity</p>
      </Beat>

      {/* ---------------------------------------------------------------- 06 */}
      <Beat id="lighting" index="06" label="The light" side="left">
        <BeatTitle>
          Even light, and none of
          <br />
          it in a player&rsquo;s eye.
        </BeatTitle>
        <BeatBody>
          The fixtures run outboard of the sidelines, parallel to the length of
          the court — so a player tracking a high clear looks up into ceiling,
          never into a lamp. 150&nbsp;W per fitting, supports and fittings
          included.
        </BeatBody>

        <div className="mt-12 flex items-baseline gap-4 border-t hairline border-hairline pt-6">
          <SceneReadout
            select={(s) => s.lux}
            format={(v) => Math.round(v).toLocaleString("en-IN")}
            className="font-mono text-[length:var(--text-d3)] tabular-nums text-accent-text"
          />
          <span className="label">lux at the surface · 500–525 installed</span>
        </div>
      </Beat>

      {/* ---------------------------------------------------------------- 07 */}
      <Beat id="handover" index="07" label="Handover" side="right">
        <BeatTitle>Match-ready, then measured.</BeatTitle>
        <BeatBody>
          Freestanding poles and nets set out, markings to international
          dimensions. Final measurements are taken after completion and billing
          follows the actual site dimensions — not the ones on the drawing.
        </BeatBody>
        <div className="mt-10">
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border border-accent px-7 py-4 text-sm tracking-wide text-accent-text transition-colors duration-300 hover:bg-accent hover:text-stage"
          >
            Contact us
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </Beat>

      {/* ---------------------------------------------------------------- 08 */}
      <Beat id="delivered" index="08" label="Delivered" side="full">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="display text-[length:var(--text-d1)] text-bone">
              {totalCourts} courts.
              <br />
              {totalSites} sites.
            </h2>
            <p className="mt-8 max-w-[40ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              Across academies, colleges, associations, government departments
              and private arenas in {site.stats.yearsPhrase}.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {projects.slice(0, 16).map((p) => (
              <li
                key={p.slug}
                className="flex items-baseline justify-between gap-4 border-b hairline border-hairline pb-2 text-sm"
              >
                <span className="text-bone-dim">{p.name}</span>
                <span className="font-mono text-xs text-bone-faint">
                  {p.location} · {p.courts}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The three links a visitor who has read this far actually wants, and
            the three a search engine most needs pointed at from the homepage —
            written out as what is at the other end rather than as "read more". */}
        <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
          <Link
            href="/projects"
            className="label transition-colors hover:text-accent-text"
          >
            All {totalSites} projects &rarr;
          </Link>
          <Link
            href="/badminton-court-flooring"
            className="label transition-colors hover:text-accent-text"
          >
            Wooden badminton court flooring &rarr;
          </Link>
          <Link
            href="/squash-court-flooring"
            className="label transition-colors hover:text-accent-text"
          >
            Maple squash court flooring &rarr;
          </Link>
        </div>
      </Beat>
    </div>
  );
}
