"use client";

import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  interest: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Tell us a little more (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-noir to-noir-warm px-6 py-32 md:px-12 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left: copy + info */}
          <div className="space-y-10 lg:col-span-5">
            <SectionLabel index="05" label="Begin a Conversation" />
            <h2 className="text-display text-5xl leading-[1] md:text-7xl">
              Commission a <span className="italic font-light gold-gradient-text">piece</span>.
            </h2>
            <p className="max-w-md text-base font-light leading-relaxed text-cream/70 md:text-lg">
              Every Madina Jewellers piece begins with a quiet conversation with Muhammad Arshad
              and his atelier. Tell us the moment, and we will draw the heirloom that meets it.
            </p>

            <div className="hairline" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.2} />
                <div>
                  <div className="text-eyebrow text-cream/55">Atelier</div>
                  <div className="mt-1 text-base font-light text-cream/90">
                    Madina Jewellers
                    <br />
                    Main Boulevard, Old City
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.2} />
                <div>
                  <div className="text-eyebrow text-cream/55">By Appointment</div>
                  <a
                    href="mailto:atelier@madinajewellers.com"
                    className="mt-1 block text-base font-light text-cream/90 hover:text-gold"
                    data-hover
                  >
                    atelier@madinajewellers.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: MessageCircle, label: "WhatsApp", href: "#" },
                { icon: Mail, label: "Email", href: "mailto:atelier@madinajewellers.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-hover
                  className="flex h-11 w-11 items-center justify-center border border-gold/30 text-gold transition-all duration-500 hover:border-gold hover:bg-gold hover:text-noir"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <div className="relative border border-gold/15 bg-noir-soft/50 p-8 backdrop-blur-sm md:p-12">
              {/* Corner ornaments */}
              <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-gold/60" />
              <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-gold/60" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l border-gold/60" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r border-gold/60" />

              {status === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="text-display text-6xl italic text-gold">Thank you.</div>
                  <p className="mt-6 max-w-sm text-base font-light text-cream/70">
                    Your enquiry is in the hands of Muhammad Arshad and our atelier. We will reply within two working days.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-ghost-gold mt-10"
                    data-hover
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                  <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                    <Field
                      label="Your Name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Field
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <div>
                    <label className="text-eyebrow text-cream/55">
                      Piece of Interest
                    </label>
                    <select
                      {...register("interest")}
                      defaultValue=""
                      className="mt-2 w-full appearance-none border-b border-gold/30 bg-transparent py-3 text-base font-light text-cream outline-none transition-colors focus:border-gold"
                    >
                      <option value="" disabled className="bg-noir">
                        Select a category
                      </option>
                      <option value="rings" className="bg-noir">Rings</option>
                      <option value="necklaces" className="bg-noir">Necklaces</option>
                      <option value="earrings" className="bg-noir">Earrings</option>
                      <option value="bracelets" className="bg-noir">Bracelets</option>
                      <option value="custom" className="bg-noir">A custom commission</option>
                    </select>
                    {errors.interest && (
                      <p className="mt-2 text-xs text-rose-300/80">
                        {errors.interest.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-eyebrow text-cream/55">
                      Tell us about the moment
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="An engagement, an anniversary, an heirloom to restore…"
                      className="mt-2 w-full resize-none border-b border-gold/30 bg-transparent py-3 text-base font-light text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold"
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-rose-300/80">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs font-light text-cream/45">
                      We reply within two working days.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-gold disabled:opacity-50"
                      data-hover
                    >
                      {status === "sending" ? "Sending…" : "Send Enquiry"}
                    </button>
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-rose-300/80">
                      Something went wrong. Please try again, or email us directly.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="hairline mt-32" />
        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-xs font-light text-cream/40 md:flex-row">
          <div className="text-eyebrow text-gold/60">
            Madina Jewellers · Muhammad Arshad · MMXXIV
          </div>
          <div>Crafted with heritage. Delivered to the world.</div>
        </div>
      </div>
    </section>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, ...rest },
  ref
) {
  return (
    <div>
      <label className="text-eyebrow text-cream/55">{label}</label>
      <input
        {...rest}
        ref={ref}
        className="mt-2 w-full border-b border-gold/30 bg-transparent py-3 text-base font-light text-cream outline-none transition-colors focus:border-gold"
      />
      {error && <p className="mt-2 text-xs text-rose-300/80">{error}</p>}
    </div>
  );
});
