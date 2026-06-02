import Hero from "@/components/sections/Hero";
import Collection from "@/components/sections/Collection";
import Viewer from "@/components/sections/Viewer";
import About from "@/components/sections/About";
import Signature from "@/components/sections/Signature";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Collection />
      <Viewer />
      <About />
      <Signature />
      <Contact />
    </>
  );
}
