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

const origRefresh = ScrollTrigger.refresh.bind(ScrollTrigger);
ScrollTrigger.refresh = function () {
  try { return origRefresh(); }
  catch (e) { console.warn("ScrollTrigger refresh error:", e); }
};

window.addEventListener("error", (e) => {
  if (
    e.message?.includes?.("NotFoundError") ||
    e.message?.includes?.("The object can not be found here") ||
    e.message?.includes?.("Node was not found") ||
    e.error?.message?.includes?.("NotFoundError") ||
    e.error?.message?.includes?.("The object can not be found here")
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = e.reason?.message || String(e.reason || "");
  if (
    msg.includes("NotFoundError") ||
    msg.includes("The object can not be found here") ||
    msg.includes("Node was not found")
  ) {
    e.preventDefault();
  }
});

export default function Home() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      content: document.getElementById("root") || undefined,
    });
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
    <div className="relative bg-[#070B11] min-h-screen">
      <div ref={progressRef} className="scroll-progress" />
      <Navigation />
      <main>
        <section className="relative">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D9A02D]/[0.02] rounded-full blur-[120px] pointer-events-none" />
          <HeroSection />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <StatsSection />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/[0.015] rounded-full blur-[100px] pointer-events-none" />
          <ManifestoSection />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <IntelligenceGrid />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#D9A02D]/[0.015] rounded-full blur-[100px] pointer-events-none" />
          <FeaturesSection />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <TerminalSection />
        </section>
        <div className="h-16 w-full" />
        <section className="relative">
          <WaitlistSection />
        </section>
      </main>
      <Footer />
      <LexBot />
    </div>
  );
}
