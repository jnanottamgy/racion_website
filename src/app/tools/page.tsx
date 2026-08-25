import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The machines RACEON work with: pneumatic nailing machines for the entire wood-flooring process, and industrial sanding before the finish goes on.",
};

export default function ToolsPage() {
  return (
    <PageShell
      eyebrow="Tools"
      title={<>The machines that do the work.</>}
      lede="Most contractors never say what they install with. RACEON's method is specific, and it is the reason the finish looks the way it does."
    >
      {tools.map((tool, i) => {
        const shot = tool.image ? plate(tool.image) : null;
        // Alternate which side the photograph sits on down the page.
        const flip = i % 2 === 1;

        return (
          <Section key={tool.slug}>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {shot && (
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  placeholder="blur"
                  blurDataURL={shot.blurDataURL}
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className={`w-full border border-hairline ${
                    flip ? "lg:order-2" : ""
                  }`}
                />
              )}
              <div>
                <p className="label">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="display mt-5 text-[length:var(--text-d2)] text-bone">
                  {tool.name}
                </h2>
                <p className="mt-6 max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
                  {tool.lede}
                </p>
                <ul className="mt-7 space-y-2">
                  {tool.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-bone-dim"
                    >
                      <span aria-hidden="true" className="text-accent-text">
                        &mdash;
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        );
      })}
    </PageShell>
  );
}
