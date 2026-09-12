import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * The logo, rebuilt from the vector paths inside RACEON's own brochure PDF —
 * pixel-accurate to the original at 10 KB, so it stays sharp at any size
 * without a raster fallback.
 */
const VARIANTS = {
  /** Stacked lockup, as it appears in the brochure. For large placements. */
  full: { src: "/brand/raceon-logo.svg", ratio: 104.5 / 80.8 },
  /**
   * Horizontal lockup, rebuilt for the navigation bar. The stacked original
   * sets RACEON at 22% of the figure's height, which is fine under a print
   * logo and illegible at 38px in a nav. Here the wordmark is set to 30% and
   * moved alongside — the standard rebalance any identity gets when it has to
   * work in a horizontal slot.
   */
  lockup: { src: "/brand/raceon-lockup.svg", ratio: 166.41 / 79.39 },
  /** Figure and orbit only. Favicons, tight spaces, loading states. */
  mark: { src: "/brand/raceon-mark.svg", ratio: 53.1 / 79.4 },
} as const;

/**
 * The portrait the founder asked to sit above the logo.
 *
 * Supplied as a cutout with a real alpha channel, so it needs no plate behind
 * it and sits directly on the stage. It is deliberately left exactly as given —
 * not tinted toward the brand palette, not desaturated to sit more quietly
 * against the dark. It is a devotional image and it is his to decide the look
 * of; the site's job is to reproduce it faithfully and place it well.
 */
const GURU = { src: "/brand/guru.webp", ratio: 620 / 760 };

export function Logo({
  variant = "full",
  className = "",
  height = 34,
  guru = false,
  /**
   * Portrait height, relative to the logo beneath it.
   *
   * Larger than the logo, because the horizontal lockup is a wide, short shape
   * and a portrait matched to its height reads as a thumbnail stuck on top.
   * At 1.3 the two read as one stacked lockup.
   */
  guruScale = 1.3,
  markClass,
  guruClass,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  height?: number;
  /** Stack the founder's portrait above the logo. */
  guru?: boolean;
  guruScale?: number;
  /**
   * Optional CSS sizing, for placements that need to change size across
   * breakpoints. `height` still sets the intrinsic dimensions so the browser
   * reserves the right box before the image arrives; these only restyle it.
   * Always set both axes — `h-* w-auto` — or Next warns about the ratio.
   */
  markClass?: string;
  guruClass?: string;
}) {
  const { src, ratio } = VARIANTS[variant];
  const guruHeight = Math.round(height * guruScale);

  return (
    <Link
      href="/"
      className={`inline-flex ${guru ? "flex-col items-center gap-1" : "items-center"} ${className}`}
      aria-label={`${site.name} — home`}
    >
      {/* Both images are decorative: the link already carries the accessible
          name, and a second copy of it here would have a screen reader read
          the company twice on every page. */}
      {guru && (
        <Image
          src={GURU.src}
          alt=""
          width={Math.round(guruHeight * GURU.ratio)}
          height={guruHeight}
          className={guruClass}
          priority
        />
      )}
      <Image
        src={src}
        alt=""
        width={Math.round(height * ratio)}
        height={height}
        className={markClass}
        priority
      />
    </Link>
  );
}
