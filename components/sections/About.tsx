"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const GemBackdrop = dynamic(() => import("@/components/three/GemBackdrop"), {
  ssr: false,
});

const stats = [
  { value: "30+", label: "Years of Craft" },
  { value: "2,400", label: "Pieces Made" },
  { value: "100%", label: "Handcrafted" },
  { value: "1 of 1", label: "Every Design" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.0, 1.05]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-noir px-6 py-32 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Image column */}
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=80"
                  alt="A goldsmith at work, shaping a ring at the bench"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-tr from-noir/70 via-transparent to-noir/30" />

              {/* Frame */}
              <div className="pointer-events-none absolute inset-3 border border-gold/30" />
              <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-gold" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-gold" />
            </div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -right-6 hidden max-w-xs bg-noir-soft p-8 backdrop-blur-xl lg:block"
              style={{ border: "1px solid rgba(212,175,55,0.25)" }}
            >
              <div className="text-display text-5xl leading-none text-gold">&ldquo;</div>
              <p className="mt-2 text-sm font-light italic leading-relaxed text-cream/80">
                Gold remembers every hand that touches it. We work slowly, so the memory is a kind one.
              </p>
              <div className="text-eyebrow mt-4 text-gold/80">
                 Master Goldsmith & Founder
              </div>
            </motion.div>
          </div>

          {/* Copy column */}
          <div className="relative flex flex-col justify-center lg:col-span-6">
            {/* Floating 3D gem in the corner */}
            <div className="pointer-events-none absolute -right-10 -top-20 hidden h-72 w-72 opacity-90 mix-blend-screen lg:block">
              <GemBackdrop />
            </div>

            <div className="relative max-w-xl space-y-8">
              <SectionLabel index="03" label="The Heritage" />

              <h2 className="text-display text-5xl leading-[1] md:text-7xl">
                A house built on
                <span className="italic font-light gold-gradient-text"> patience</span>.
              </h2>

              <div className="space-y-5 text-base font-light leading-relaxed text-cream/70 md:text-lg">
                <p>
                  Founded by master goldsmith — three generations of artisans, one
                  workshop, one philosophy. We do not chase trends — we wait for them to pass, then
                  make pieces that outlast them.
                </p>
                <p>
                  Every ring, every chain, every clasp is shaped by hand from a single ingot.
                  No castings. No shortcuts. Only the slow, considered work of bringing 22-karat gold
                  to its quiet conclusion.
                </p>
                <p className="italic text-cream">
                  When you wear a piece from Madina Jewellers, you wear thirty years of careful hands.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    className="border-t border-gold/20 pt-4"
                  >
                    <div className="text-display text-3xl text-gold md:text-4xl">
                      {s.value}
                    </div>
                    <div className="text-eyebrow mt-1 text-cream/55">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
