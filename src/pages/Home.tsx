import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../components/Navigation";
import HeroSection from "../sections/HeroSection";
import StatsSection from "../sections/StatsSection";
import ManifestoSection from "../sections/ManifestoSection";
import IntelligenceGrid from "../sections/IntelligenceGrid";
import FeaturesSection from "../sections/FeaturesSection";
import TerminalSection from "../sections/TerminalSection";
import WaitlistSection from "../sections/WaitlistSection";
import Footer from "../sections/Footer";
import LexBot from "../components/LexBot";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
      if (progressRef.current) {
        const scrollTop = e.animatedScroll ?? e.scroll ?? 0;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressRef.current.style.width = `${pct}%`;
      }
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as any);
    };
  }, []);

  return (
    <div className="relative bg-[#030303] min-h-screen">
      <div ref={progressRef} className="scroll-progress" />
      <Navigation />
      <main>
        <HeroSection />
        <div className="gradient-divider gradient-divider-1" />
        <StatsSection />
        <div className="gradient-divider gradient-divider-2" />
        <ManifestoSection />
        <div className="gradient-divider gradient-divider-1" />
        <IntelligenceGrid />
        <div className="gradient-divider gradient-divider-2" />
        <FeaturesSection />
        <div className="gradient-divider gradient-divider-1" />
        <TerminalSection />
        <div className="gradient-divider gradient-divider-2" />
        <WaitlistSection />
      </main>
      <Footer />
      <LexBot />
    </div>
  );
}
