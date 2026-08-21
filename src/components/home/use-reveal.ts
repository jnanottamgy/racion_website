"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll, owned rather than borrowed.
 *
 * Motion's `whileInView` silently never fires in this setup, and the reveal is
 * the single most visible behaviour on the page — every line of copy depends on
 * it. Fifteen lines of IntersectionObserver removes the dependency and the
 * failure mode with it. Motion still handles the hero and the micro-interactions,
 * where it earns its keep.
 *
 * Fires once. If IntersectionObserver is unavailable the content is shown
 * immediately, because invisible copy is a far worse failure than un-animated
 * copy.
 */
export function useReveal<T extends HTMLElement>(rootMargin = "-12% 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, shown };
}
