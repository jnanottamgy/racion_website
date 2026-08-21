import type { Metadata } from "next";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { process } from "@/content/systems";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Survey to handover: how RACEON builds a wooden badminton or squash court, from base preparation through the interlocked pine framework to final measurement.",
};

export default function ProcessPage() {
  return (
    <PageShell
      eyebrow="Process"
      title={<>Survey to handover, on one contract.</>}
      lede="Flooring, lighting, poles and nets from one contractor — so there is one programme, one site team and one person answerable for the result."
    >
      <Section>
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
