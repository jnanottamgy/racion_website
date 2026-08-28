import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/chrome/page-shell";
import { GalleryFigure } from "@/components/gallery/gallery-figure";
import { chapters, galleryCount } from "@/content/gallery";
import { totalCourts, totalSites } from "@/content/projects";

export const metadata: Metadata = pageMetadata({
  title: "Wooden Badminton Court Photos",
  description: `Timber arriving, the interlocked pine framework going down, decking, finish, lighting and courts in play — ${galleryCount} photographs from RACEON's ${totalCourts} courts across ${totalSites} sites.`,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <PageShell
      path="/gallery"
      crumb="Gallery"
      eyebrow="Wooden badminton court photographs"
      title={
        <>
          A court, from
          <br />
          timber to match point.
        </>
      }
      lede="Photographs from RACEON's own sites, in the order the work actually happens — sawn teak stacked on a floor, the framework going down over it, and the hall that ends up getting used."
    >
      {chapters.map((chapter) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="container-x border-b border-hairline py-20"
        >
          <header className="grid gap-x-14 gap-y-6 lg:grid-cols-12 lg:items-end">
            {/*
              Index above the title, not beside it. Set in its own column the
              number left the heading starting a third of the way across the
              page with nothing in front of it, which reads as a mistake rather
              than as a margin.
            */}
            <div className="lg:col-span-6">
              <p className="label flex items-center gap-3">
                <span className="text-accent-text">{chapter.index}</span>
                <span className="h-px w-8 bg-hairline-bright" />
              </p>
              <h2 className="display mt-5 text-[length:var(--text-d3)] text-bone">
                {chapter.title}
              </h2>
            </div>
            <p className="max-w-[46ch] text-sm leading-relaxed text-bone-dim lg:col-span-5 lg:col-start-8">
              {chapter.lede}
            </p>
          </header>

          <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-14 lg:items-start">
            {chapter.items.map((item, i) => (
              <GalleryFigure key={item.plate} item={item} index={i} />
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
