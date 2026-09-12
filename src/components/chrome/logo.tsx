import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * The logo, rebuilt from the vector paths inside RACEON's own brochure PDF —
 * pixel-accurate to the original at 10 KB, so it stays sharp at any size
 * without a raster fallback.
 */
/**
 * `head` is the centre of the figure's head, as a fraction of the asset's
 * width — measured off the rendered SVG by scanning for the row where a second
 * green run appears beside the raised arm, not eyeballed.
 *
 * The portrait sits over the head. The raised arm reaches higher than the head
 * does and for a while the portrait sat on the hand instead, which put it a
 * third of the way across the lockup and read as the figure holding something
 * out to one side. Over the head it reads as what it is.
 */
const VARIANTS = {
  /** Stacked lockup, as it appears in the brochure. For large placements. */
  full: { src: "/brand/raceon-logo.svg", ratio: 104.5 / 80.8, head: 0.239 },
  /**
   * Horizontal lockup, rebuilt for the navigation bar. The stacked original
   * sets RACEON at 22% of the figure's height, which is fine under a print
   * logo and illegible at 38px in a nav. Here the wordmark is set to 30% and
   * moved alongside — the standard rebalance any identity gets when it has to
   * work in a horizontal slot.
   */
  lockup: { src: "/brand/raceon-lockup.svg", ratio: 166.41 / 79.39, head: 0.150 },
  /** Figure and orbit only. Favicons, tight spaces, loading states. */
  mark: { src: "/brand/raceon-mark.svg", ratio: 53.1 / 79.4, head: 0.470 },
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
  guruPadClass,
  guruAnchor,
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
  /** Top padding reserving the portrait's height. Match it to `guruClass`. */
  guruPadClass?: string;
  /**
   * Override where the portrait is centred, as a fraction of the logo's width.
   * The default is the measured head; this is for nudging by eye.
   */
  guruAnchor?: number;
}) {
  const { src, ratio, head } = VARIANTS[variant];
  const guruHeight = Math.round(height * guruScale);

  const logo = (
    <Image
      src={src}
      alt=""
      width={Math.round(height * ratio)}
      height={height}
      className={markClass}
      priority
    />
  );

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label={`${site.name} — home`}
    >
      {/* Both images are decorative: the link already carries the accessible
          name, and a second copy of it here would have a screen reader read
          the company twice on every page. */}
      {guru ? (
        // The portrait goes over the raised hand, not over the middle of the
        // lockup. Reserved as padding on the box and then placed inside it, so
        // it takes up its own height in the layout — absolutely positioned
        // without the padding it would hang out of the header — while being
        // free to sit off-centre, which centring in a flex column cannot do.
        <span className={`relative block leading-none ${guruPadClass}`}>
          <Image
            src={GURU.src}
            alt=""
            width={Math.round(guruHeight * GURU.ratio)}
            height={guruHeight}
            className={`absolute top-0 -translate-x-1/2 ${guruClass ?? ""}`}
            style={{ left: `${(guruAnchor ?? head) * 100}%` }}
            priority
          />
          {logo}
        </span>
      ) : (
        logo
      )}
    </Link>
  );
}
