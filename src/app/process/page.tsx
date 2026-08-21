import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { plate } from "@/content/photography";
import { process } from "@/content/systems";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Survey to handover: how RACEON builds a wooden badminton or squash court, from base preparation through the interlocked pine framework to final measurement.",
};

export default function ProcessPage() {
  const shot = plate("installation");

  return (
    <PageShell
      eyebrow="Process"
      title={<>Survey to handover, on one contract.</>}
      lede="Flooring, lighting, poles and nets from one contractor — so there is one programme, one site team and one person answerable for the result."
    >
      <Section>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          placeholder="blur"
          blurDataURL={shot.blurDataURL}
          sizes="(min-width: 1280px) 1240px, 100vw"
          className="mb-16 w-full border border-hairline"
        />
        <ol className="border-t border-hairline">
          {process.map((step) => (
            <li
              key={step.step}
              className="grid gap-4 border-b border-hairline py-8 md:grid-cols-[5rem_16rem_1fr]"
            >
              <span className="font-mono text-sm text-accent-text">
                {step.step}
              </span>
              <h2 className="text-bone">{step.title}</h2>
              <p className="max-w-[58ch] text-sm leading-relaxed text-bone-dim">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </PageShell>
  );
}
