"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const SignatureScene = dynamic(
  () => import("@/components/three/SignatureScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border border-gold/30 border-t-gold" />
      </div>
    ),
  }
);

const marks = [
  { value: "40", label: "Years at the Bench" },
  { value: "All", label: "Signed by Hand" },
  { value: "1 of 1", label: "Every Signature Piece" },
];

export default function Signature() {
  return (
    <section
      id="signature"
      className="relative overflow-hidden bg-noir px-6 py-32 md:px-12 md:py-40"
    >
      {/* Decorative top hairline */}
      <div className="mx-auto mb-20 max-w-[1600px]">
        <div className="hairline" />
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        {/* 3D scene — left */}
        <div className="relative lg:col-span-7">
          <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-noir via-noir-warm to-noir lg:aspect-[5/6]">
            <SignatureScene />

            {/* Decorative inner frame */}
            <div className="pointer-events-none absolute inset-6 border border-gold/15" />

            {/* Corner ornaments */}
            <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-gold/70" />
            <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 border-r-2 border-t-2 border-gold/70" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 border-b-2 border-l-2 border-gold/70" />
            <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-gold/70" />

            {/* Signature badge — bottom centre */}
            <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
              <div className="text-eyebrow text-gold/70">
                — signed in gold —
              </div>
              <div className="text-display mt-2 text-3xl italic text-gold md:text-4xl">
                Muhammad Arshad
              </div>
            </div>
          </div>
        </div>

        {/* Copy — right */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <div className="space-y-8">
            <SectionLabel index="04" label="The Signature" />

            <h2 className="text-display text-5xl leading-[1] md:text-7xl">
              Signed in <span className="italic font-light gold-gradient-text">gold</span>
              <br />
              by Muhammad <span className="italic font-light">Arshad</span>.
            </h2>

            <div className="space-y-5 text-base font-light leading-relaxed text-cream/70 md:text-lg">
              <p>
                Every piece that leaves the Madina Jewellers atelier carries a hidden mark — three
                tiny notches struck on the inner band by{" "}
                <span className="text-cream">Muhammad Arshad</span> himself. A private signature.
                A quiet vow.
              </p>
              <p>
                The Signature Collection takes that promise further. Each design is drawn by hand
                by Muhammad, shaped at his own bench, and finished without a single second pair of
                hands. One ring. One name behind it.
              </p>
              <p className="italic text-cream">
                If gold could speak, it would say his name.
              </p>
            </div>

            {/* Marks */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              {marks.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-gold/20 pt-4"
                >
                  <div className="text-display text-3xl text-gold md:text-4xl">
                    {m.value}
                  </div>
                  <div className="text-eyebrow mt-1 text-cream/55">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6">
              <a href="#contact" className="btn-ghost-gold" data-hover>
                Commission the Signature
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="mx-auto mt-24 max-w-[1600px]">
        <div className="hairline" />
      </div>
    </section>
  );
}
