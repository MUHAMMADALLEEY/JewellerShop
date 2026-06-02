"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import type { ViewerPiece } from "@/components/three/ProductViewer";

const ProductViewer = dynamic(
  () => import("@/components/three/ProductViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold" />
      </div>
    ),
  }
);

type Piece = {
  id: ViewerPiece;
  name: string;
  category: string;
  description: string;
  materials: string[];
  price: string;
};

const pieces: Piece[] = [
  {
    id: "ring-diamond",
    name: "Céleste",
    category: "Engagement Ring",
    description:
      "A solitaire of poised brilliance. Six hand-set prongs cradle a brilliant-cut diamond above a polished 18-karat band — restrained, radiant, eternal.",
    materials: ["18K Gold", "1.2ct Diamond", "VS1 Clarity"],
    price: "On request",
  },
  {
    id: "ring-emerald",
    name: "Forêt",
    category: "Statement Ring",
    description:
      "Cool emerald set in warm gold. A meditation on contrast, sculpted for the hand that draws every eye in the room.",
    materials: ["18K Gold", "0.9ct Emerald", "Colombian origin"],
    price: "On request",
  },
  {
    id: "necklace",
    name: "Lumière",
    category: "Pendant Necklace",
    description:
      "A delicate beaded chain falls toward a single suspended stone — a quiet drop of light worn close to the heart.",
    materials: ["18K Gold chain", "0.6ct Centre stone", "16-inch length"],
    price: "On request",
  },
  {
    id: "earring",
    name: "Aurore",
    category: "Drop Earring",
    description:
      "Three articulated golden links carry a teardrop gem that catches the light with every turn. Movement, made jewellery.",
    materials: ["18K Gold", "Faceted gem drop", "French hook"],
    price: "On request",
  },
];

export default function Viewer() {
  const [active, setActive] = useState<ViewerPiece>("ring-diamond");
  const piece = pieces.find((p) => p.id === active)!;

  return (
    <section
      id="viewer"
      className="relative overflow-hidden bg-gradient-to-b from-noir via-noir-warm to-noir px-6 py-32 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-16 max-w-2xl space-y-6 md:mb-20">
          <SectionLabel index="02" label="The Atelier" />
          <h2 className="text-display text-5xl leading-[1] md:text-7xl">
            Hold a piece <span className="italic font-light gold-gradient-text">in your hands</span>.
          </h2>
          <p className="text-base font-light leading-relaxed text-cream/65">
            Rotate. Examine. Inspect every facet. An intimate view of our work,
            rendered as it would arrive at your door.
          </p>
        </div>

        {/* Stage */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* 3D viewer */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden bg-noir-soft/40 border border-gold/10">
              <ProductViewer piece={active} />

              {/* Corner ornaments */}
              <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-gold/50" />
              <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-gold/50" />
              <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b border-l border-gold/50" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-gold/50" />

              {/* Hint */}
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-eyebrow text-cream/40">
                Drag · Zoom · Rotate
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="mt-6 grid grid-cols-4 gap-3">
              {pieces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  data-hover
                  className={`group relative aspect-square overflow-hidden border transition-all duration-500 ${
                    active === p.id
                      ? "border-gold bg-gold/10"
                      : "border-gold/10 hover:border-gold/50"
                  }`}
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-display text-xl italic transition-colors ${
                      active === p.id ? "text-gold" : "text-cream/40 group-hover:text-cream/70"
                    }`}
                  >
                    {p.name.charAt(0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div>
                  <div className="text-eyebrow mb-3 text-gold/80">
                    {piece.category}
                  </div>
                  <h3 className="text-display text-6xl text-cream md:text-7xl">
                    {piece.name}
                  </h3>
                </div>

                <div className="hairline" />

                <p className="text-lg font-light leading-relaxed text-cream/75 md:text-xl">
                  {piece.description}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  {piece.materials.map((m) => (
                    <div key={m} className="space-y-1">
                      <div className="h-px w-8 bg-gold/60" />
                      <div className="text-xs font-light uppercase tracking-[0.2em] text-cream/70">
                        {m}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-eyebrow text-cream/50">Price</div>
                    <div className="text-display mt-1 text-3xl text-gold italic">
                      {piece.price}
                    </div>
                  </div>
                  <a href="#contact" className="btn-gold" data-hover>
                    Enquire
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
