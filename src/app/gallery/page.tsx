import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { gallery } from "@/content/gallery";
import { plate } from "@/content/photography";
import { totalCourts } from "@/content/projects";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Finished courts, framework and installation work from RACEON — ${totalCourts} courts delivered across Karnataka and South India.`,
};

export default function GalleryPage() {
  return (
    <PageShell
      eyebrow="Gallery"
      title={<>The work, up close.</>}
      lede="Finished floors, the framework underneath them, and the machines that put them down."
    >
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {gallery.map((item, i) => {
            const p = plate(item.plate);
            // The first pair run full width on their own row; the rest pair up.
            const wide = i < 2;
            return (
              <li
                key={item.plate}
                className={wide ? "md:col-span-2" : undefined}
              >
                <figure className="group">
                  <div className="overflow-hidden border border-hairline">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      placeholder="blur"
                      blurDataURL={p.blurDataURL}
                      sizes={
                        wide
                          ? "(min-width: 1280px) 1240px, 100vw"
                          : "(min-width: 768px) 620px, 100vw"
                      }
                      className="w-full transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="text-sm text-bone-dim">{item.caption}</span>
                    {item.project && (
                      <span className="label shrink-0">{item.project}</span>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </Section>
    </PageShell>
  );
}
