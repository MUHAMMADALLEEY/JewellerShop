"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${
          mouseY - 3
        }px, 0)`;
      }
    };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest(
        'a, button, input, textarea, select, [role="button"], [data-hover]'
      );
    };

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target) && ringInnerRef.current && ringRef.current) {
        ringInnerRef.current.classList.add("scale-[2.6]");
        ringRef.current.classList.add("opacity-100");
      }
    };

    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) && ringInnerRef.current && ringRef.current) {
        ringInnerRef.current.classList.remove("scale-[2.6]");
        ringRef.current.classList.remove("opacity-100");
      }
    };

    let frame = 0;
    const animate = () => {
      // Higher lerp factor = snappier cursor follow
      ringX += (mouseX - ringX) * 0.45;
      ringY += (mouseY - ringY) * 0.45;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${
          ringY - 18
        }px, 0)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-gold mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      {/* Outer ring carries the translate (cursor position). Inner ring carries the scale (hover state). */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 opacity-50 transition-opacity duration-200 ease-out"
        style={{ willChange: "transform" }}
      >
        <div
          ref={ringInnerRef}
          className="h-full w-full rounded-full border border-gold/60 transition-transform duration-300 ease-out"
        />
      </div>
    </>
  );
}
