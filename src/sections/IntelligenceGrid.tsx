import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, FileText, ShieldCheck, Lock, ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: "CONTEXTUAL ENGINE",
    stat: "98%",
    statLabel: "accuracy rate",
    description:
      "Our AI understands the nuance of every legal scenario — from landlord disputes to employment contracts — delivering advice that accounts for jurisdiction, precedent, and circumstance.",
  },
  {
    icon: FileText,
    title: "PREDICTIVE DRAFTING",
    stat: "3x",
    statLabel: "faster drafting",
    description:
      "Precedent-aware document synthesis that learns from millions of legal documents to generate contracts, motions, and filings tailored to your exact situation.",
  },
  {
    icon: ShieldCheck,
    title: "REAL-TIME COMPLIANCE",
    stat: "24/7",
    statLabel: "monitoring",
    description:
      "Dynamic regulatory alignment ensures every piece of advice reflects the latest laws, rulings, and compliance requirements across all jurisdictions.",
  },
  {
    icon: Lock,
    title: "SECURE VAULT",
    stat: "256-bit",
    statLabel: "encryption",
    description:
      "Zero-trust data architecture with end-to-end encryption. Your legal matters stay private — always. No data sold, no third-party access, ever.",
  },
];

export default function IntelligenceGrid() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#grid-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: "#grid-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) cardsRef.current[index] = el;
  };

  return (
    <section
      id="grid"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-16 bg-gradient-section-4"
    >
      <div className="noise-overlay" />

      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />
      <div className="absolute bottom-[10%] left-[5%] w-[250px] h-[250px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(100,120,200,0.03)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,160,45,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(217,160,45,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div id="grid-title" className="mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D9A02D]/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D9A02D]">
              The Protocol
            </span>
          </div>
          <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-7xl leading-[0.95]">
            Intelligence Grid
          </h2>
          <p className="font-body text-[15px] text-[#94A3B8] max-w-xl mt-4">
            Four core capabilities that work together as a unified legal reasoning system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={feature.title}
                ref={(el) => setCardRef(el, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group cursor-pointer"
              >
                <div
                  className={`relative p-8 md:p-10 rounded-2xl border transition-all duration-500 overflow-hidden card-glow ${
                    isHovered
                      ? "border-[#D9A02D]/40 bg-[#030303]/80 shadow-[0_0_40px_rgba(217,160,45,0.06)]"
                      : "border-[#94A3B8]/8 bg-[#030303]/40 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(217,160,45,0.08) 0%, transparent 70%)",
                    }}
                  />

                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl border transition-all duration-500 ${
                      isHovered
                        ? "bg-[#D9A02D]/10 border-[#D9A02D]/30"
                        : "bg-[#0F172A]/50 border-[#94A3B8]/8"
                    }`}>
                      <Icon
                        className={`w-7 h-7 transition-colors duration-300 ${
                          isHovered ? "text-[#D9A02D]" : "text-[#64748B]"
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    {isHovered && (
                      <Sparkles className="w-4 h-4 text-[#D9A02D] animate-pulse-soft" />
                    )}
                  </div>

                  <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#FAFAFA] mb-4">
                    {feature.title}
                  </h3>

                  <div className="mb-5">
                    <span className="font-display italic text-5xl text-gradient-gold">
                      {feature.stat}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#64748B] ml-3">
                      {feature.statLabel}
                    </span>
                  </div>

                  <p className="font-body text-[14px] leading-relaxed text-[#94A3B8]">
                    {feature.description}
                  </p>

                  <div
                    className={`absolute top-0 right-0 w-20 h-20 transition-all duration-500 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute top-5 right-5 w-10 h-px bg-gradient-to-r from-transparent to-[#D9A02D]" />
                    <div className="absolute top-5 right-5 w-px h-10 bg-gradient-to-b from-transparent to-[#D9A02D]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/demo")}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#D9A02D] hover:text-[#FAFAFA] transition-all duration-300"
          >
            See it in action
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D9A02D]/15 to-transparent" />
    </section>
  );
}
