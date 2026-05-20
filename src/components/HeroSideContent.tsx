import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSideContent() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 });
    tl.fromTo(
      leftRef.current,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.2, ease: "power3.out" }
    );
    tl.fromTo(
      rightRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.2, ease: "power3.out" },
      "-=1.2"
    );
    tl.fromTo(
      leftContentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.6"
    );
    tl.fromTo(
      rightContentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    gsap.to(leftRef.current, {
      y: -20, opacity: 0.3,
      scrollTrigger: {
        trigger: "#hero", start: "top top", end: "+=400", scrub: 1.2,
      },
    });
    gsap.to(rightRef.current, {
      y: -20, opacity: 0.3,
      scrollTrigger: {
        trigger: "#hero", start: "top top", end: "+=400", scrub: 1.2,
      },
    });
  }, []);

  return (
    <>
      {/* LEFT — Courthouse pillar */}
      <div
        ref={leftRef}
        className="absolute left-0 top-0 h-full w-[180px] md:w-[280px] pointer-events-none overflow-hidden z-[2]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D9A02D]/[0.04] to-transparent" />
        <div className="absolute left-[5%] top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-[#D9A02D]/15 to-transparent" />
        <div className="absolute left-[15%] top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-[#D9A02D]/8 to-transparent" />

        <div className="absolute top-[25%] left-[8%] w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-[#D9A02D]/4 border-r-[60px] border-r-transparent rotate-12" />

        <div className="absolute bottom-[30%] left-[10%] w-[2px] h-32 bg-gradient-to-t from-[#D9A02D]/10 to-transparent" />

        <div
          ref={leftContentRef}
          className="absolute top-[38%] left-[12%] max-w-[120px] md:max-w-[200px]"
        >
          <div className="border-l-2 border-[#D9A02D]/15 pl-4 md:pl-6">
            <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#D9A02D]/30 leading-relaxed">
              Founded on<br />precedent.<br />Built for<br />everyone.
            </p>
          </div>
        </div>

        <div className="absolute top-[18%] left-[20%] w-8 h-8 md:w-12 md:h-12 rounded-full border border-[#D9A02D]/6" />
        <div className="absolute top-[15%] left-[18%] w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#D9A02D]/4" />
      </div>

      {/* RIGHT — Law book / gavel */}
      <div
        ref={rightRef}
        className="absolute right-0 top-0 h-full w-[180px] md:w-[280px] pointer-events-none overflow-hidden z-[2]"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#D9A02D]/[0.04] to-transparent" />
        <div className="absolute right-[5%] top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-[#D9A02D]/15 to-transparent" />
        <div className="absolute right-[15%] top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-[#D9A02D]/8 to-transparent" />

        <div className="absolute top-[30%] right-[10%] flex flex-col gap-2">
          <div className="w-20 h-[3px] md:w-28 md:h-[4px] rounded-full bg-gradient-to-r from-transparent via-[#D9A02D]/12 to-transparent" />
          <div className="w-16 h-[2px] md:w-20 md:h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#D9A02D]/8 to-transparent ml-auto" />
          <div className="w-12 h-[2px] md:w-16 md:h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#D9A02D]/6 to-transparent ml-auto" />
        </div>

        <div
          ref={rightContentRef}
          className="absolute top-[55%] right-[12%] max-w-[120px] md:max-w-[200px] text-right"
        >
          <div className="border-r-2 border-[#D9A02D]/15 pr-4 md:pr-6">
            <p className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#D9A02D]/30 leading-relaxed">
              Context is<br />everything.<br />Intelligence<br />is access.
            </p>
          </div>
        </div>

        <div className="absolute bottom-[22%] right-[18%] w-0 h-0 border-l-[40px] border-l-transparent border-t-[60px] border-t-[#D9A02D]/4 border-r-[40px] border-r-transparent -rotate-12" />

        <div className="absolute bottom-[28%] right-[12%] w-[3px] h-20 bg-gradient-to-b from-[#D9A02D]/8 to-transparent rounded-full" />
      </div>
    </>
  );
}
