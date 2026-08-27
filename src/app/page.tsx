import type { Metadata } from "next";
import { CanvasMount } from "@/components/three/canvas-mount";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { Narrative } from "@/components/home/narrative";
import { site } from "@/lib/site";

/**
 * The homepage needs its own canonical like every other route. Inheriting the
 * root layout's metadata leaves it as the one page on the site that never says
 * which hostname it lives at — and it is the page a brand search lands on.
 */
export const metadata: Metadata = {
  alternates: { canonical: site.url },
  openGraph: { url: site.url },
};

export default function Home() {
  return (
    <>
      <CanvasMount />
      <Header />
      <main id="main" className="relative">
        <Narrative />
      </main>
      <Footer />
    </>
  );
}
