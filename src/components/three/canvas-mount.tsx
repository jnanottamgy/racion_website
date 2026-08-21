"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary for the WebGL canvas.
 *
 * `ssr: false` keeps three.js, drei and postprocessing out of the server render
 * *and* out of the initial JavaScript payload — the scene is fetched after the
 * page is interactive, so the 3D never delays first paint or the LCP element.
 */
const CanvasRoot = dynamic(() => import("./canvas-root"), { ssr: false });

export function CanvasMount() {
  return <CanvasRoot />;
}
