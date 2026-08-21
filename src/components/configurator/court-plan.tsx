import { COURT } from "@/components/three/court/dimensions";
import { SPORTS, round1, type Plan } from "@/lib/court-planning";

/**
 * A to-scale plan of the hall.
 *
 * Drawn as SVG rather than rendered in 3D on purpose: this is the drawing an
 * architect or a facility developer actually wants — dimensioned, printable,
 * legible at a glance, and correct at any zoom. A perspective render is
 * persuasive; a plan is useful.
 *
 * Everything is drawn in metres and scaled by a single factor, so the geometry
 * in the file is the geometry on site.
 */

const SCALE = 10; // SVG units per metre
const PAD = 4.2; // metres of margin for the dimension lines

export function CourtPlan({ plan }: { plan: Plan }) {
  const s = SPORTS[plan.sport];
  const { hallLength: L, hallWidth: W } = plan;

  const vbW = (L + PAD * 2) * SCALE;
  const vbH = (W + PAD * 2) * SCALE;
  const ox = PAD * SCALE;
  const oy = PAD * SCALE;

  const m = (v: number) => v * SCALE;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      // Twelve courts side by side make a hall twice as deep as it is long, and
      // an unconstrained SVG would grow to several screens tall. Capping the
      // height lets the drawing scale down instead of taking over the page.
      className="mx-auto block max-h-[68vh] w-full"
      role="img"
      aria-label={`Plan of ${plan.courts} ${s.label.toLowerCase()} court${plan.courts === 1 ? "" : "s"} in a ${round1(L)} by ${round1(W)} metre hall`}
    >
      <g transform={`translate(${ox} ${oy})`}>
        {/* Hall */}
        <rect
          x={0}
          y={0}
          width={m(L)}
          height={m(W)}
          fill="var(--brand-stage-raised)"
          stroke="var(--brand-hairline-bright)"
          strokeWidth={1.6}
        />

        {plan.offsets.map((offset, i) => {
          // Court centre within the hall.
          const cx = m(L / 2);
          const cy = m(W / 2 + offset);
          const hl = m(s.length / 2);
          const hw = m(s.width / 2);

          return (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <rect
                x={-hl}
                y={-hw}
                width={m(s.length)}
                height={m(s.width)}
                fill="var(--brand-teak-shadow)"
                fillOpacity={0.5}
                stroke="var(--brand-bone)"
                strokeWidth={1.4}
              />

              {plan.sport === "badminton" && (
                <g
                  stroke="var(--brand-bone)"
                  strokeWidth={0.9}
                  strokeOpacity={0.75}
                  fill="none"
                >
                  {/* Singles sidelines */}
                  <line x1={-hl} y1={-m(COURT.singlesHalfWidth)} x2={hl} y2={-m(COURT.singlesHalfWidth)} />
                  <line x1={-hl} y1={m(COURT.singlesHalfWidth)} x2={hl} y2={m(COURT.singlesHalfWidth)} />
                  {/* Short service lines */}
                  <line x1={-m(COURT.shortService)} y1={-hw} x2={-m(COURT.shortService)} y2={hw} />
                  <line x1={m(COURT.shortService)} y1={-hw} x2={m(COURT.shortService)} y2={hw} />
                  {/* Doubles long service lines */}
                  <line x1={-hl + m(COURT.doublesLongServiceInset)} y1={-hw} x2={-hl + m(COURT.doublesLongServiceInset)} y2={hw} />
                  <line x1={hl - m(COURT.doublesLongServiceInset)} y1={-hw} x2={hl - m(COURT.doublesLongServiceInset)} y2={hw} />
                  {/* Centre lines */}
                  <line x1={-hl} y1={0} x2={-m(COURT.shortService)} y2={0} />
                  <line x1={m(COURT.shortService)} y1={0} x2={hl} y2={0} />
                  {/* Net */}
                  <line x1={0} y1={-hw} x2={0} y2={hw} stroke="var(--brand-green)" strokeWidth={1.8} />
                </g>
              )}

              <text
                x={0}
                y={hw + 12}
                textAnchor="middle"
                className="fill-[var(--brand-bone-faint)] font-mono"
                fontSize={9}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}

        {/* Dimensions */}
        <Dimension
          x1={0}
          y1={m(W) + 22}
          x2={m(L)}
          y2={m(W) + 22}
          label={`${round1(L)} m`}
        />
        <Dimension
          x1={m(L) + 22}
          y1={0}
          x2={m(L) + 22}
          y2={m(W)}
          label={`${round1(W)} m`}
          vertical
        />
      </g>
    </svg>
  );
}

/** A dimension line with ticks and a centred label. */
function Dimension({
  x1,
  y1,
  x2,
  y2,
  label,
  vertical = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  vertical?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const t = 5;

  return (
    <g stroke="var(--brand-bone-faint)" strokeWidth={0.9}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line
        x1={vertical ? x1 - t : x1}
        y1={vertical ? y1 : y1 - t}
        x2={vertical ? x1 + t : x1}
        y2={vertical ? y1 : y1 + t}
      />
      <line
        x1={vertical ? x2 - t : x2}
        y1={vertical ? y2 : y2 - t}
        x2={vertical ? x2 + t : x2}
        y2={vertical ? y2 : y2 + t}
      />
      <text
        x={vertical ? mx + 14 : mx}
        y={vertical ? my : my + 16}
        textAnchor={vertical ? "start" : "middle"}
        dominantBaseline={vertical ? "middle" : "auto"}
        className="fill-[var(--brand-bone-dim)] font-mono"
        fontSize={11}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}
