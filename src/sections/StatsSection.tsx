import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "98%", label: "of legal needs go unmet globally" },
  { value: "$600B+", label: "addressable market opportunity" },
  { value: "3x", label: "faster than traditional research" },
  { value: "99.7%", label: "accuracy on precedent analysis" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === "#stats" || t.trigger?.id === "stats") t.kill();
      });
    } catch {}
    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.fromTo(
          "#stats-content",
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: "#stats",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          ".stat-item",
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
            scrollTrigger: {
              trigger: "#stats",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    } catch {}
    return () => {
      try { ctx?.revert(); } catch {}
      try { ScrollTrigger.getAll().forEach(t => { if (t.trigger && !document.body.contains(t.trigger)) t.kill(); }); } catch {}
    };
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-16 bg-gradient-section-2"
    >
      <div className="noise-overlay" />

      <div className="absolute top-[10%] right-[10%] w-[250px] h-[250px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />

      <div
        id="stats-content"
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D9A02D] mb-3 block">
            The Market Reality
          </span>
          <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-6xl leading-[0.95]">
            Why Now
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <div className="font-display italic text-5xl md:text-6xl text-gradient-gold mb-3">
                {stat.value}
              </div>
              <p className="font-body text-[13px] text-[#94A3B8] leading-relaxed max-w-[180px] mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="font-body text-[14px] text-[#64748B] leading-relaxed">
            The constraint that made this impossible was <span className="text-[#FAFAFA]">reasoning</span>, not data. A product that actually advises — not just summarizes law — for landlord disputes, employment contracts, immigration, and small claims, and is <span className="text-[#FAFAFA]">right</span>, is genuinely new.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-1 h-1 rounded-full bg-[#D9A02D]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D]/60">
              Moat: Trust &times; Accuracy &times; Liability Model
            </span>
            <div className="w-1 h-1 rounded-full bg-[#D9A02D]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D9A02D]/15 to-transparent" />
    </section>
  );
}
