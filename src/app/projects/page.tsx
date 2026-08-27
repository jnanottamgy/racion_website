import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { ProjectIndex } from "@/components/projects/project-index";
import { totalCourts, totalSites } from "@/content/projects";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: `${totalCourts} courts across ${totalSites} sites — academies, colleges, associations, government departments and private arenas across Karnataka and South India.`,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <PageShell
      path="/projects"
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
