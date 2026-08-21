"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import {
  DEFAULT_CAPABILITY,
  detectCapability,
  type Capability,
} from "@/lib/capability";
import { exposeDebug } from "@/lib/debug";

interface ScrollContextValue {
  capability: Capability;
  /** True once client-side capability detection has run. */
  ready: boolean;
  /** True once the deferred scroll harness has loaded. */
  harnessReady: boolean;
  /** Programmatic scroll that respects Lenis when it's driving. */
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  /** Freeze scrolling — used by the configurator and the mobile menu. */
  setLocked: (locked: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue>({
  capability: DEFAULT_CAPABILITY,
  ready: false,
  harnessReady: false,
  scrollTo: () => {},
  setLocked: () => {},
});

export function useScroll() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [capability, setCapability] = useState<Capability>(DEFAULT_CAPABILITY);
  const [ready, setReady] = useState(false);
  /** True once GSAP and Lenis have actually landed. */
  const [harnessReady, setHarnessReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Capability first, in its own effect, so the Lenis effect below can key off
  // the resolved tier rather than guessing during the first paint.
  useEffect(() => {
    // Deferred by a frame. Detection has to happen on the client — the server
    // has no GPU, no pointer and no connection hints — but setting it inline
    // cascades a second render before the first has painted. One frame later
    // costs nothing and keeps the first paint clean.
    const id = requestAnimationFrame(() => {
      setCapability(detectCapability());
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!ready) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // GSAP, ScrollTrigger and Lenis are ~100 KB gzipped between them and none
    // of it is needed to paint the page. Importing them here keeps them off the
    // critical path: the first moments use native scrolling and the harness
    // takes over as soon as it lands, which nobody notices.
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      setHarnessReady(true);

      // Reduced motion gets native scrolling. Inertial scroll is itself motion,
      // and hijacking it is the single most disorienting thing a site can do to
      // someone who asked for less of it.
      if (capability.reducedMotion) {
        ScrollTrigger.refresh();
        cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
        return;
      }

      const lenis = new Lenis({
      duration: 1.15,
      // Expo-out. Long tail, no bounce — the scroll should feel weighted,
      // like pushing something heavy that keeps gliding.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Trackpads and touch already have their own inertia; smoothing those
      // too stacks two easing curves and feels like lag.
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
        wheelMultiplier: 1,
      });
      lenisRef.current = lenis;

      // Lenis and ScrollTrigger must share one clock. Two independent RAF loops
      // means the DOM and the canvas drift a frame apart, which reads as jitter
      // on any scrubbed animation.
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ready, capability.reducedMotion]);

  // Fonts land after first paint and reflow every pinned section under them.
  // Without this, ScrollTrigger's cached start/end positions are wrong and the
  // whole narrative fires early.
  useEffect(() => {
    if (!harnessReady || typeof document === "undefined") return;
    let cancelled = false;
    void document.fonts?.ready.then(async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [harnessReady]);

  const value = useMemo<ScrollContextValue>(
    () => ({
      capability,
      ready,
      harnessReady,
      scrollTo: (target, offset = 0) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset, duration: 1.4 });
          return;
        }
        const el =
          typeof target === "string"
            ? document.querySelector(target)
            : typeof target === "number"
              ? null
              : target;
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        else if (typeof target === "number") window.scrollTo(0, target + offset);
      },
      setLocked: (locked) => {
        const lenis = lenisRef.current;
        if (lenis) (locked ? lenis.stop : lenis.start).call(lenis);
        document.documentElement.classList.toggle("lenis-stopped", locked);
      },
    }),
    [capability, ready, harnessReady],
  );

  // Lenis owns the scroll position and restores it on its own RAF, so a plain
  // `window.scrollTo` from a test harness is quietly reverted a frame later.
  // Exposing Lenis's own scrollTo is the only reliable way to drive the page
  // from outside.
  useEffect(
    () =>
      exposeDebug({
        scrollTo: {
          value: (y: number) =>
            lenisRef.current
              ? lenisRef.current.scrollTo(y, { immediate: true })
              : window.scrollTo(0, y),
          configurable: true,
          writable: true,
        },
      }),
    [harnessReady],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}
