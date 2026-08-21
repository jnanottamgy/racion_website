"use client";

import dynamic from "next/dynamic";
import { useScroll } from "@/components/providers/scroll-provider";
import { StaticStage } from "./static-stage";

/**
 * Client boundary for the stage behind the narrative.
 *
 * `ssr: false` keeps three.js, drei and postprocessing out of the server render
 * *and* out of the initial JavaScript payload — the scene is fetched after the
 * page is interactive, so the 3D never delays first paint or the LCP element.
 *
 * Devices that shouldn't run it never download it: the static tier resolves
 * before this mounts, so a phone on a metered connection or a visitor who asked
 * for reduced motion pays nothing for a canvas they will not see.
 */
const CanvasRoot = dynamic(() => import("./canvas-root"), { ssr: false });

export function CanvasMount() {
  const { capability, ready } = useScroll();

  if (!ready) return null;
  if (capability.tier === "static") return <StaticStage />;

  return <CanvasRoot />;
}
