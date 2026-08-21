import type { Metadata } from "next";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { Configurator } from "@/components/configurator/configurator";

export const metadata: Metadata = {
  title: "Court Planner",
  description:
    "Work out how many badminton or squash courts fit your hall, see the set-out to scale, and send RACEON a specification instead of an enquiry.",
};

export default function ConfiguratorPage() {
  return (
    <PageShell
      eyebrow="Planner"
      title={<>How many courts fit your hall?</>}
      lede="Set the sport and the number of courts to see the minimum hall it needs, drawn to scale. Enter your own dimensions and it will tell you what fits."
    >
      <Section>
        <Configurator />
      </Section>
    </PageShell>
  );
}
