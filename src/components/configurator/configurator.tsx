"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildUp } from "@/content/systems";
import {
  SPORTS,
  checkFit,
  planCourts,
  round1,
  type Sport,
} from "@/lib/court-planning";
import { CourtPlan } from "./court-plan";

const control =
  "w-full border border-hairline bg-stage-raised/60 px-4 py-3 text-bone " +
  "transition-colors duration-300 focus:border-accent focus:outline-none";

/**
 * The court planner.
 *
 * Deliberately not a product configurator. RACEON build one thing — African
 * teak on an interlocked pine framework — so a page offering a choice of
 * timbers and line colours would be inventing a catalogue that doesn't exist.
 *
 * What their buyers genuinely don't know, and what nobody in this category
 * answers online, is whether their hall fits the courts they want. That is
 * pure geometry, it is checkable, and answering it turns a browsing academy
 * owner into a qualified enquiry with a set-out already agreed.
 */
export function Configurator() {
  const [sport, setSport] = useState<Sport>("badminton");
  const [courts, setCourts] = useState(4);
  const [withLighting, setWithLighting] = useState(true);
  const [withNets, setWithNets] = useState(true);
  const [hall, setHall] = useState({ length: "", width: "" });

  const plan = useMemo(() => planCourts(sport, courts), [sport, courts]);

  const fit = useMemo(() => {
    const l = parseFloat(hall.length);
    const w = parseFloat(hall.width);
    if (!Number.isFinite(l) || !Number.isFinite(w) || l <= 0 || w <= 0) {
      return null;
    }
    return checkFit(sport, l, w, courts);
  }, [sport, courts, hall]);

  const scope = [
    `${courts} ${SPORTS[sport].label.toLowerCase()} court${courts === 1 ? "" : "s"}`,
    "Interlocked pine framework, African teak playing surface",
    withNets && "Professional poles and nets",
    withLighting && "150 W sports lighting, supports and fittings",
  ].filter(Boolean) as string[];

  const enquiry = new URLSearchParams({
    sport: SPORTS[sport].label,
    courts: String(courts),
    scope: withLighting ? "Wooden court + lighting" : "Wooden court",
    plan: `${round1(plan.hallLength)} x ${round1(plan.hallWidth)} m`,
  }).toString();

  return (
    <div className="grid gap-14 lg:grid-cols-[22rem_1fr] lg:items-start">
      {/* ------------------------------------------------------------ inputs */}
      <div className="space-y-8 lg:sticky lg:top-28">
        <fieldset>
          <legend className="label">Sport</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(SPORTS) as Sport[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSport(key)}
                aria-pressed={sport === key}
                className={`border px-4 py-3 text-sm transition-colors duration-300 ${
                  sport === key
                    ? "border-accent text-accent-text"
                    : "border-hairline text-bone-dim hover:border-hairline-bright"
                }`}
              >
                {SPORTS[key].label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="courts" className="label">
            Courts — <span className="text-accent-text">{courts}</span>
          </label>
          <input
            id="courts"
            type="range"
            min={1}
            max={12}
            value={courts}
            onChange={(e) => setCourts(Number(e.target.value))}
            className="mt-4 w-full accent-[var(--brand-green)]"
          />
        </div>

        <fieldset>
          <legend className="label">Scope</legend>
          <div className="mt-3 space-y-2">
            {[
              { on: withLighting, set: setWithLighting, label: "Sports lighting" },
              { on: withNets, set: setWithNets, label: "Poles & nets" },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => o.set(!o.on)}
                aria-pressed={o.on}
                className={`flex w-full items-center justify-between border px-4 py-3 text-sm transition-colors duration-300 ${
                  o.on
                    ? "border-accent text-accent-text"
                    : "border-hairline text-bone-dim hover:border-hairline-bright"
                }`}
              >
                {o.label}
                <span aria-hidden="true">{o.on ? "Included" : "Add"}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label">Your hall (optional)</legend>
          <p className="mt-2 text-sm leading-relaxed text-bone-faint">
            Internal clear dimensions, in metres.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Length"
              aria-label="Hall length in metres"
              value={hall.length}
              onChange={(e) => setHall((h) => ({ ...h, length: e.target.value }))}
              className={control}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="Width"
              aria-label="Hall width in metres"
              value={hall.width}
              onChange={(e) => setHall((h) => ({ ...h, width: e.target.value }))}
              className={control}
            />
          </div>

          {fit && (
            <div
              aria-live="polite"
              className={`mt-4 border p-4 text-sm leading-relaxed ${
                fit.fits ? "border-accent text-bone" : "border-hairline-bright text-bone-dim"
              }`}
            >
              {fit.fits ? (
                <>
                  <span className="text-accent-text">Fits.</span> Your hall takes{" "}
                  {courts} court{courts === 1 ? "" : "s"}
                  {fit.maxCourts > courts && <> — up to {fit.maxCourts}</>}.
                </>
              ) : (
                <>
                  Short by{" "}
                  {fit.shortfall!.length > 0 && (
                    <>{round1(fit.shortfall!.length)} m in length</>
                  )}
                  {fit.shortfall!.length > 0 && fit.shortfall!.width > 0 && " and "}
                  {fit.shortfall!.width > 0 && (
                    <>{round1(fit.shortfall!.width)} m in width</>
                  )}
                  .{" "}
                  {fit.maxCourts > 0
                    ? `This hall takes ${fit.maxCourts} court${fit.maxCourts === 1 ? "" : "s"}.`
                    : "RACEON can advise on the set-out."}
                </>
              )}
            </div>
          )}
        </fieldset>
      </div>

      {/* ------------------------------------------------------------ output */}
      <div className="space-y-10">
        <div className="border border-hairline bg-stage-sunk/60 p-6 sm:p-10">
          <CourtPlan plan={plan} />
        </div>

        <dl className="grid grid-cols-2 gap-y-8 border-y border-hairline py-8 sm:grid-cols-4">
          {[
            { label: "Hall length", value: `${round1(plan.hallLength)} m` },
            { label: "Hall width", value: `${round1(plan.hallWidth)} m` },
            { label: "Clear height", value: `${round1(plan.clearHeight)} m` },
            { label: "Boarded area", value: `${Math.round(plan.boardedArea)} m²` },
          ].map((s) => (
            <div key={s.label}>
              <dt className="label">{s.label}</dt>
              <dd className="mt-2 font-mono text-[length:var(--text-d3)] text-accent-text">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="label">
          Minimum internal dimensions using recommended clear space around each
          court — RACEON confirm the set-out on survey
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="label">Specification</h2>
            <ul className="mt-5 space-y-2">
              {scope.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-bone-dim">
                  <span aria-hidden="true" className="text-accent-text">&mdash;</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="label">Build-up</h2>
            <ol className="mt-5 space-y-2">
              {[...buildUp].reverse().map((layer) => (
                <li key={layer.code} className="flex gap-3 text-sm text-bone-dim">
                  <span className="font-mono text-xs text-accent-text">
                    {layer.code}
                  </span>
                  {layer.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Link
          href={`/contact?${enquiry}`}
          className="group inline-flex items-center gap-3 border border-accent px-7 py-4 text-sm tracking-wide text-accent-text transition-colors duration-300 hover:bg-accent hover:text-stage"
        >
          Send this specification to RACEON
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
