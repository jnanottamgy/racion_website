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
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DEFAULT_CAPABILITY,
  detectCapability,
  type Capability,
} from "@/lib/capability";

interface ScrollContextValue {
  capability: Capability;
  /** True once client-side capability detection has run. */
  ready: boolean;
  /** Programmatic scroll that respects Lenis when it's driving. */
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  /** Freeze scrolling — used by the configurator and the mobile menu. */
  setLocked: (locked: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue>({
  capability: DEFAULT_CAPABILITY,
  ready: false,
  scrollTo: () => {},
  setLocked: () => {},
});

export function useScroll() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [capability, setCapability] = useState<Capability>(DEFAULT_CAPABILITY);
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Capability first, in its own effect, so the Lenis effect below can key off
  // the resolved tier rather than guessing during the first paint.
  useEffect(() => {
    setCapability(detectCapability());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    gsap.registerPlugin(ScrollTrigger);

    // Reduced motion gets native scrolling. Inertial scroll is itself motion,
    // and hijacking it is the single most disorienting thing a site can do to
    // someone who asked for less of it.
    if (capability.reducedMotion) {
      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
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

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready, capability.reducedMotion]);

  // Fonts land after first paint and reflow every pinned section under them.
  // Without this, ScrollTrigger's cached start/end positions are wrong and the
  // whole narrative fires early.
  useEffect(() => {
    if (!ready || typeof document === "undefined") return;
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const value = useMemo<ScrollContextValue>(
    () => ({
      capability,
      ready,
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
    [capability, ready],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}
