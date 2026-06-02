"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Returns a ref to a 0-1 scroll factor, updated every animation frame, based
 * on the position of `elementRef` relative to the viewport:
 *
 *   0 = the element's top edge is at the bottom of the viewport (entering)
 *   1 = the element's bottom edge is at the top of the viewport (exiting)
 *
 * Reading from a ref (not state) means scenes can consume the value inside
 * `useFrame` / RAF loops without triggering React re-renders on scroll —
 * essential for smooth 3D animation.
 *
 * Works correctly with Lenis smooth scroll because it reads the rendered
 * position via getBoundingClientRect.
 */
export function useScrollFactor(elementRef: RefObject<HTMLElement>) {
  const factor = useRef(0);

  useEffect(() => {
    let raf = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const el = elementRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const winH = window.innerHeight || 1;
        // Total scroll travel = element height + viewport height
        const total = winH + rect.height;
        // How much of that travel has been completed
        const passed = winH - rect.top;
        const p = passed / total;
        factor.current = Math.max(0, Math.min(1, p));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      stopped = document.hidden;
      if (!stopped) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [elementRef]);

  return factor;
}

/** Ease-out curve, the same one used across the 3D scenes. */
export const easeOutScroll = (x: number) => 1 - Math.pow(1 - x, 2.4);
