"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Collection", href: "#collection" },
  { label: "Atelier", href: "#viewer" },
  { label: "Heritage", href: "#about" },
  { label: "Signature", href: "#signature" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-noir/70 backdrop-blur-xl border-b border-gold/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
        <a href="#" className="group flex items-center gap-3">
          <span className="text-display text-2xl italic text-gold">MJ</span>
          <span className="hidden text-eyebrow text-cream md:block">
            Madina Jewellers
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-xs font-light uppercase tracking-[0.3em] text-cream/80 transition-colors hover:text-gold"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden text-xs font-light uppercase tracking-[0.3em] text-gold transition-opacity hover:opacity-70 md:block"
        >
          Enquire
        </a>

        <button
          aria-label="Menu"
          className="flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden"
        >
          <span className="block h-px w-6 bg-gold" />
          <span className="block h-px w-4 bg-gold" />
        </button>
      </div>
    </motion.header>
  );
}
