import type { Metadata } from "next";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { ProjectIndex } from "@/components/projects/project-index";
import { totalCourts, totalSites } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `${totalCourts} courts across ${totalSites} sites — academies, colleges, associations, government departments and private arenas across Karnataka and South India.`,
};

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Projects"
      title={
        <>
          {totalCourts} courts.
          <br />
          {totalSites} sites.
        </>
      }
      lede="Academies, colleges, associations, government departments and private arenas across Karnataka and South India."
    >
      <Section>
        <ProjectIndex />
      </Section>
    </PageShell>
  );
}
