import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scale, FileText, Shield, Lock, Zap, Globe, Brain, Gavel, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    title: "Contextual Reasoning Engine",
    description: "Unlike generic LLMs, our engine evaluates jurisdiction, precedent, circumstance, and intent before delivering advice. Every response is grounded in real legal frameworks.",
  },
  {
    icon: Gavel,
    title: "Dispute Resolution Simulator",
    description: "Simulate outcomes for landlord disputes, small claims, and employment conflicts before taking action. Understand your odds based on historical precedent in your jurisdiction.",
  },
  {
    icon: FileText,
    title: "Intelligent Document Drafting",
    description: "Generate legally-sound contracts, demand letters, and filings tailored to your specific situation. Precedent-aware synthesis from millions of legal documents.",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance Shield",
    description: "Real-time alignment with evolving regulations across all jurisdictions. Never miss a compliance requirement again with dynamic monitoring and automated updates.",
  },
  {
    icon: Zap,
    title: "Instant Case Assessment",
    description: "Upload or describe your situation and receive a comprehensive assessment within seconds. Includes confidence scoring, precedent citations, and recommended action steps.",
  },
  {
    icon: Globe,
    title: "Multi-Jurisdiction Coverage",
    description: "UK, US, EU, and expanding. Our system understands the nuances between common law, civil law, and religious legal systems to deliver accurate advice everywhere.",
  },
  {
    icon: Lock,
    title: "Zero-Trust Security",
    description: "End-to-end encryption with zero-trust architecture. Your legal matters remain confidential — no data sold, no third-party access, ever.",
  },
  {
    icon: Scale,
    title: "Fairness & Accuracy Guarantee",
    description: "Every piece of advice is traceable to source law and precedent. We don't just give answers — we show our reasoning with citations you can verify.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#features-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: "#features-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.06, ease: "power3.out",
          scrollTrigger: {
            trigger: "#features-grid",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 px-6 md:px-16 bg-gradient-section-3"
    >
      <div className="noise-overlay" />

      <div className="absolute top-[15%] left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(100,120,200,0.02)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(217,160,45,0.2) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div id="features-title" className="mb-16 md:mb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#D9A02D]/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D9A02D]">
              Everything You Need
            </span>
            <div className="h-px w-8 bg-[#D9A02D]/30" />
          </div>
          <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-7xl leading-[0.95]">
            The Full Suite
          </h2>
          <p className="font-body text-[15px] text-[#94A3B8] max-w-xl mx-auto mt-4">
            From reasoning to drafting to compliance — one platform for all your legal needs.
          </p>
        </div>

        <div
          id="features-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={feature.title}
                className="feature-card relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-500 h-full overflow-hidden card-glow ${
                    isHovered
                      ? "border-[#D9A02D]/35 bg-[#0F172A]/70 shadow-[0_0_30px_rgba(217,160,45,0.05)]"
                      : "border-[#94A3B8]/8 bg-[#0F172A]/40 shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background: "radial-gradient(ellipse at top, rgba(217,160,45,0.06) 0%, transparent 70%)",
                    }}
                  />

                  <div className="mb-5">
                    <Icon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isHovered ? "text-[#D9A02D] scale-110" : "text-[#64748B]"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="font-body text-[15px] font-semibold text-[#FAFAFA] mb-3 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="font-body text-[13px] text-[#94A3B8] leading-relaxed">
                    {feature.description}
                  </p>

                  {isHovered && (
                    <>
                      <div className="absolute top-0 right-0 w-14 h-14 overflow-hidden">
                        <div className="absolute top-4 right-4 w-6 h-px bg-gradient-to-r from-transparent to-[#D9A02D]" />
                        <div className="absolute top-4 right-4 w-px h-6 bg-gradient-to-b from-transparent to-[#D9A02D]" />
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Sparkles className="w-3 h-3 text-[#D9A02D]/50" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D9A02D]/10 to-transparent" />
    </section>
  );
}
