/**
 * Device capability detection.
 *
 * The site has two genuine renderings of the same story: the live WebGL
 * narrative, and a static sequence for anyone who can't or shouldn't get it.
 * This module decides which, and it errs toward the static path — a beautiful
 * site that stutters is worse than a beautiful site that doesn't move.
 *
 * All of this is client-only and must run after mount. Server-rendered output
 * always assumes the static path so hydration is deterministic.
 */

export type RenderTier = "static" | "lite" | "full";

export interface Capability {
  tier: RenderTier;
  reducedMotion: boolean;
  webgl: boolean;
  /** Device pixel ratio we're willing to render at, already clamped. */
  dpr: [number, number];
}

/** Conservative default used for SSR and the first paint. */
export const DEFAULT_CAPABILITY: Capability = {
  tier: "static",
  reducedMotion: false,
  webgl: false,
  dpr: [1, 1],
};

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;

    // A software rasteriser reports a context but renders at single-digit fps.
    // SwiftShader / llvmpipe / "Software" in the renderer string are the tells.
    const debug = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info",
    );
    if (debug) {
      const renderer = String(
        (gl as WebGLRenderingContext).getParameter(
          debug.UNMASKED_RENDERER_WEBGL,
        ),
      ).toLowerCase();
      if (/swiftshader|llvmpipe|software|basic render/.test(renderer)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/**
 * QA override: `?render=full|lite|static`.
 *
 * The detection below is deliberately pessimistic, which makes it impossible to
 * review the scene on a machine it decides to protect — a software renderer, a
 * throttled laptop, a client on a locked-down office build. The override forces
 * a tier for one page view. It is opt-in per URL, never persisted, and no part
 * of the site links to it.
 */
function readOverride(): RenderTier | null {
  try {
    const value = new URLSearchParams(window.location.search).get("render");
    return value === "full" || value === "lite" || value === "static"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function detectCapability(): Capability {
  if (typeof window === "undefined") return DEFAULT_CAPABILITY;

  const override = readOverride();
  if (override) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return {
      tier: override,
      reducedMotion,
      webgl: override !== "static",
      dpr: override === "full" ? [1, 2] : [1, 1.4],
    };
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const nav = navigator as NavigatorWithHints;
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = /^(slow-2g|2g|3g)$/.test(
    nav.connection?.effectiveType ?? "",
  );

  // Respecting the user's stated preference and their data plan comes before
  // showing off. Both drop straight to the static sequence.
  if (reducedMotion || saveData || slowNetwork) {
    return { ...DEFAULT_CAPABILITY, reducedMotion, webgl: hasWebGL() };
  }

  const webgl = hasWebGL();
  if (!webgl) return { ...DEFAULT_CAPABILITY, reducedMotion, webgl: false };

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // "lite" keeps the scene and the scroll narrative but drops post-processing,
  // volumetrics and shadow resolution. It's the difference between a mid-range
  // phone running at 60fps and the same phone running at 22fps.
  const weak = cores <= 4 || memory <= 4;
  const tier: RenderTier = weak ? "lite" : "full";

  return {
    tier,
    reducedMotion,
    webgl: true,
    // Above 2x the extra pixels are invisible and the cost is quadratic.
    dpr: tier === "full" ? [1, coarse ? 1.75 : 2] : [1, 1.4],
  };
}
