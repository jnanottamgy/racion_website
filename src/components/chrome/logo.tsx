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

export function Logo({
  variant = "full",
  className = "",
  height = 34,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  height?: number;
}) {
  const { src, ratio } = VARIANTS[variant];

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label={`${site.name} — home`}
    >
      <Image
        src={src}
        alt={site.name}
        width={Math.round(height * ratio)}
        height={height}
        priority
      />
    </Link>
  );
}
