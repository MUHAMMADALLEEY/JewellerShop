import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/ui/Nav";
import Cursor from "@/components/ui/Cursor";
import GoldDust from "@/components/ui/GoldDust";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madina Jewellers — Timeless Gold, Forever Yours",
  description:
    "A house of handcrafted fine jewellery. Every piece sculpted in 22K gold by master goldsmiths.",
  openGraph: {
    title: "Madina Jewellers",
    description:
      "Handcrafted 24K gold jewellery. Heritage craftsmanship for the modern soul.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-noir text-cream antialiased">
        <SmoothScroll>
          <Cursor />
          <GoldDust />
          <Nav />
          <main className="relative">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
