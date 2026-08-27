"use client";

import Image from "next/image";
import { useReveal } from "@/components/home/use-reveal";
import type { GalleryItem } from "@/content/gallery";
import { plate } from "@/content/photography";

const SPAN: Record<GalleryItem["span"], string> = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
};

/**
 * One photograph.
 *
 * Client-side only for the reveal. Fifteen site photographs arriving at once is
 * a wall; arriving as you reach them, each one is a picture. The delay is
 * stepped within a chapter so a row resolves left to right rather than
 * snapping in as a block.
 */
export function GalleryFigure({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  const { ref, shown } = useReveal<HTMLElement>();
  const p = plate(item.plate);

  return (
    <figure
      ref={ref}
      data-reveal={shown}
      style={{ transitionDelay: `${(index % 2) * 110}ms` }}
      className={`group col-span-12 ${SPAN[item.span]}`}
    >
      <div className="overflow-hidden border border-hairline bg-stage-sunk">
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          placeholder="blur"
          blurDataURL={p.blurDataURL}
          sizes={`(min-width: 1024px) ${Math.round((item.span / 12) * 100)}vw, 100vw`}
          className="w-full transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-4">
        <p className="text-sm text-bone">{item.title}</p>
        <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-bone-faint">
          {item.note}
        </p>
      </figcaption>
    </figure>
  );
}
