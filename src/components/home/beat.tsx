"use client";

import type { ReactNode } from "react";
import { useReveal } from "./use-reveal";

/**
 * One beat of the narrative.
 *
 * Beats are transparent and only ever occupy part of the viewport width — the
 * canvas behind them is the other half of the composition, and copy that fills
 * the frame turns a 3D site into a 3D wallpaper.
 */
export function Beat({
  id,
  index,
  label,
  side = "left",
  className = "",
  children,
}: {
  id: string;
  index: string;
  label: string;
  side?: "left" | "right" | "centre" | "full";
  className?: string;
  children: ReactNode;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();

  const align =
    side === "left"
      ? "justify-start"
      : side === "right"
        ? "justify-end"
        : "justify-center";

  const width = side === "full" ? "w-full" : "w-full max-w-[34rem]";

  return (
    <section
      id={id}
      data-beat={Number(index)}
      className={`relative flex min-h-screen items-center container-x py-32 ${align} ${className}`}
    >
      <Scrim side={side} />
      <div ref={ref} data-reveal={shown} className={`relative ${width}`}>
        <p className="label flex items-center gap-3">
          <span className="text-accent-text">{index}</span>
          <span className="h-px w-8 bg-hairline-bright" />
          {label}
        </p>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

/**
 * A gradient of the stage colour behind the copy.
 *
 * Once the rig is lit the court is genuinely bright, and bone text over a lit
 * teak floor fails contrast badly. The scrim is the cheapest honest fix: it
 * keeps the type on a dark ground without dimming the scene everyone came to
 * look at, and it fades to nothing before it reaches the middle of the frame.
 */
function Scrim({ side }: { side: "left" | "right" | "centre" | "full" }) {
  if (side === "full") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-stage/55 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
      />
    );
  }

  const position =
    side === "left"
      ? "left-0 bg-gradient-to-r"
      : side === "right"
        ? "right-0 bg-gradient-to-l"
        : "inset-x-0 bg-gradient-to-b";

  const size = side === "centre" ? "w-full" : "w-full sm:w-[62%]";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 -z-10 ${size} ${position} from-stage via-stage/62 to-transparent [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]`}
    />
  );
}

/** Section heading at display scale. */
export function BeatTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="display text-[length:var(--text-d2)] text-bone">
      {children}
    </h2>
  );
}

/** Body copy. Held to a comfortable measure regardless of the column width. */
export function BeatBody({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
      {children}
    </p>
  );
}
