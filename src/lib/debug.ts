/**
 * Opt-in QA surface, gated behind the `?render=` override.
 *
 * A scroll-driven 3D scene is close to impossible to diagnose from the outside:
 * "the framing is wrong" could be the camera, the scroll mapping, the beat
 * measurement or the assembly schedule, and all four look identical in a
 * screenshot. This exposes the pieces on `window.__raceon` so they can be read
 * directly.
 *
 * It exists only when the query parameter is present, so it is never reachable
 * for an ordinary visitor, and nothing on the site links to it.
 */

export interface DebugSurface {
  [key: string]: unknown;
}

export function debugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).has("render");
  } catch {
    return false;
  }
}

/** Merge a slice of debug state onto `window.__raceon`. */
export function exposeDebug(slice: PropertyDescriptorMap): () => void {
  if (!debugEnabled()) return () => {};

  const w = window as typeof window & { __raceon?: DebugSurface };
  w.__raceon ??= {};
  Object.defineProperties(w.__raceon, slice);

  return () => {
    for (const key of Object.keys(slice)) {
      delete (w.__raceon as DebugSurface)[key];
    }
  };
}
