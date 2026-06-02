"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { jewelry, categories, type JewelryItem } from "@/lib/jewelry";

const spanClasses: Record<NonNullable<JewelryItem["span"]> | "normal", string> = {
  normal: "md:row-span-1",
  tall: "md:row-span-2",
  wide: "md:col-span-2",
};

export default function Collection() {
  const [active, setActive] = useState<(typeof categories)[number]["id"]>("all");

  const items = active === "all" ? jewelry : jewelry.filter((j) => j.category === active);

  return (
    <section id="collection" className="relative bg-noir px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-6">
            <SectionLabel index="01" label="The Collection" />
            <h2 className="text-display text-5xl leading-[1] md:text-7xl">
              Heirlooms <span className="italic font-light gold-gradient-text">in waiting</span>.
            </h2>
            <p className="text-base font-light leading-relaxed text-cream/65">
              A curated edit of our most coveted pieces. Each is one of one,
              hand-finished in the Madina Jewellers atelier — to be worn now, treasured forever.
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                data-hover
                className={`relative px-5 py-2.5 text-xs font-light uppercase tracking-[0.3em] transition-all duration-500 ${
                  active === cat.id
                    ? "text-noir"
                    : "text-cream/60 hover:text-gold"
                }`}
              >
                {active === cat.id && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 -z-10 bg-gold"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 md:[grid-auto-rows:280px] lg:grid-cols-4 lg:[grid-auto-rows:320px]"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative overflow-hidden ${
                  spanClasses[item.span ?? "normal"]
                } card-noir`}
                data-hover
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/95 via-noir/30 to-transparent" />

                {/* Gold border on hover */}
                <div className="pointer-events-none absolute inset-0 border border-gold/0 transition-colors duration-500 group-hover:border-gold/50" />

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-eyebrow mb-1 text-gold/70">
                        {item.category}
                      </div>
                      <h3 className="text-display text-2xl text-cream md:text-3xl">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-light text-cream/55">
                        {item.materials}
                      </p>
                    </div>
                    <div className="translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-eyebrow text-gold">View →</span>
                    </div>
                  </div>
                </div>

                {/* Corner ornament */}
                <div className="absolute right-4 top-4 h-6 w-6 border-r border-t border-gold/0 transition-colors duration-500 group-hover:border-gold/60" />
                <div className="absolute left-4 top-4 h-6 w-6 border-l border-t border-gold/0 transition-colors duration-500 group-hover:border-gold/60" />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer hairline */}
        <div className="hairline mt-24" />
      </div>
    </section>
  );
}
