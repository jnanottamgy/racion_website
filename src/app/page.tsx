import { CanvasMount } from "@/components/three/canvas-mount";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { Narrative } from "@/components/home/narrative";

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
