import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#manifesto-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: "#manifesto",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".manifesto-line",
        { opacity: 0, x: -40, filter: "blur(4px)" },
        {
          opacity: 1, x: 0, filter: "blur(0px)", duration: 1, stagger: 0.2, ease: "power3.out",
          scrollTrigger: {
            trigger: "#manifesto",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".manifesto-body",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: {
            trigger: "#manifesto",
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full py-28 md:py-40 px-6 md:px-16 flex items-center justify-center overflow-hidden bg-gradient-section-3"
      style={{ minHeight: "80vh" }}
    >
      <div className="noise-overlay" />

      <div className="absolute top-1/3 left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />
      <div className="absolute bottom-1/3 right-[5%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(100,120,200,0.03)" }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#D9A02D]/1.5 blur-[180px] rounded-full pointer-events-none" />

      <div
        className="absolute top-12 left-12 text-[120px] md:text-[180px] font-display italic leading-none text-[#D9A02D]/3 select-none pointer-events-none"
      >
        &ldquo;
      </div>
      <div
        className="absolute bottom-12 right-12 text-[120px] md:text-[180px] font-display italic leading-none text-[#D9A02D]/3 select-none pointer-events-none"
      >
        &rdquo;
      </div>

      <div
        id="manifesto-content"
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D9A02D] mb-6 block">
          The Manifesto
        </span>

        <blockquote ref={quoteRef} className="space-y-6">
          <p className="manifesto-line font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-[#FAFAFA]">
            "LLMs do not hallucinate context.
          </p>
          <p className="manifesto-line font-display italic text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-gradient-gold">
            They engineer it."
          </p>
        </blockquote>

        <div className="mt-12 max-w-2xl mx-auto space-y-4">
          <p className="manifesto-body font-body text-[15px] text-[#94A3B8] leading-relaxed">
            Legal advice isn't expensive because lawyers are lazy — it's expensive because every situation requires contextual reasoning. Before LLMs, software couldn't do that. Now it can.
          </p>
          <p className="manifesto-body font-body text-[15px] text-[#94A3B8] leading-relaxed">
            <span className="text-[#FAFAFA]">98% of the world's legal needs go unmet.</span> A product that actually advises — not just summarizes law — for landlord disputes, employment contracts, immigration, small claims — and is right — is genuinely new.
          </p>
          <p className="manifesto-body font-body text-[15px] text-[#94A3B8] leading-relaxed">
            The constraint that made this impossible was <span className="text-[#FAFAFA]">reasoning</span>, not data. First mover to get a 'right answer' rate people can cite wins.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D]/60">
            Moat: Trust × Accuracy × Liability Model
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
        </div>
      </div>
    </section>
  );
}
