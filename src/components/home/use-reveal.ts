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
      // Deferred rather than set inline: the server renders the hidden state,
      // so flipping it synchronously here would cascade a second render before
      // the first has painted. It cannot be a useState initialiser either —
      // IntersectionObserver is always undefined on the server, which would
      // hydrate every reveal into the wrong state.
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
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
