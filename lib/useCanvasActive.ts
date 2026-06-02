"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Activates a Canvas only while its wrapper element is on-screen (with a 200px margin
 * so it warms up just before scrolling into view). Use the returned `frameloop`
 * value as the Canvas's `frameloop` prop — "always" while visible, "never" when
 * offscreen — so off-screen scenes do not burn GPU cycles.
 */
export function useCanvasActive() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(el);

    const onVisibility = () => {
      // also pause when the tab is hidden
      if (document.hidden) setActive(false);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { ref, active, frameloop: (active ? "always" : "never") as "always" | "never" };
}
