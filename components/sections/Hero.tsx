"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import ScrollCue from "@/components/ui/ScrollCue";

// Vanilla Three.js port of HeroScene — no @react-three/fiber.
// The other scenes (Viewer, Signature, GemBackdrop) still use R3F for now.
const HeroScene = dynamic(() => import("@/components/three/HeroSceneVanilla"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold" />
    </div>
  ),
});

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
};

const lineVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-noir-radial"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Top corner ornaments */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-6 top-32 hidden md:block">
          <div className="text-eyebrow rotate-180 [writing-mode:vertical-rl] text-cream/40">
            EST · MMXXIV · MADINA
          </div>
        </div>
        <div className="absolute right-6 top-32 hidden md:block">
          <div className="text-eyebrow [writing-mode:vertical-rl] text-cream/40">
            22K · HANDCRAFTED · GOLD
          </div>
        </div>
      </div>

      {/* Headline overlay */}
      <div className="pointer-events-none relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          <motion.div variants={lineVariants} className="mb-8 flex justify-center">
            <div className="flex items-center gap-3 text-eyebrow text-gold">
              <span className="h-px w-10 bg-gold/60" />
              Madina Jewellers · Since MMXXIV
              <span className="h-px w-10 bg-gold/60" />
            </div>
          </motion.div>

          <h1 className="text-display text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.95]">
            <motion.span variants={lineVariants} className="block">
              <span className="gold-gradient-text">Timeless</span>
              <span className="text-cream">.</span>
            </motion.span>
            <motion.span variants={lineVariants} className="block italic font-light text-cream/90">
              Crafted by hand.
            </motion.span>
            <motion.span variants={lineVariants} className="block">
              <span className="text-cream">Forever </span>
              <span className="gold-gradient-text italic">yours</span>
              <span className="text-cream">.</span>
            </motion.span>
          </h1>

          <motion.p
            variants={lineVariants}
            className="mx-auto mt-10 max-w-xl text-base font-light leading-relaxed text-cream/70"
          >
            Each piece sculpted in 18-karat gold by master goldsmiths.
            Heirlooms made for the moments that matter most.
          </motion.p>

          <motion.div
            variants={lineVariants}
            className="pointer-events-auto mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <a href="#collection" className="btn-gold" data-hover>
              Explore Collection
            </a>
            <a href="#viewer" className="btn-ghost-gold" data-hover>
              Atelier Viewer
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        <ScrollCue label="Discover" />
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-b from-transparent to-noir" />
    </section>
  );
}
