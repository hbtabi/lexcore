import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LegalParticles from "../components/LegalParticles";
import HeroSideContent from "../components/HeroSideContent";
import CourtroomScene from "../components/CourtroomScene";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const line0Ref = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroContent = document.querySelector("#hero-content") as HTMLElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroContent) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroContent, {
        x, y, duration: 1.2, ease: "power2.out", overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "+=600",
        pin: true,
        pinSpacing: false,
      });

      const tl = gsap.timeline();

      tl.fromTo(
        [line0Ref.current, line1Ref.current, line2Ref.current],
        { yPercent: 130, opacity: 0 },
        {
          ease: "power4.out",
          yPercent: 0,
          opacity: 1,
          duration: 1.6,
          stagger: 0.1,
        }
      );

      tl.fromTo(
        [subRef.current, bodyRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 },
        "-=0.6"
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      gsap.to("#hero-content", {
        opacity: 0,
        filter: "blur(12px)",
        scale: 0.97,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=500",
          scrub: 1.2,
        },
      });

      gsap.to(glowRef.current, {
        scale: 1.8,
        opacity: 0.2,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=400",
          scrub: 1.5,
        },
      });

      gsap.to(blob1Ref.current, {
        y: -80, x: 40, opacity: 0.6,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "+=300", scrub: 1 },
      });

      gsap.to(blob2Ref.current, {
        y: 60, x: -30, opacity: 0.5,
        scrollTrigger: { trigger: "#hero", start: "top top", end: "+=300", scrub: 1 },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-section-1" />
      <div className="noise-overlay" />
      <CourtroomScene />
      <LegalParticles />

      <div
        ref={glowRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(217,160,45,0.1) 0%, rgba(217,160,45,0.03) 40%, transparent 70%)",
        }}
      />

      <div ref={blob1Ref}
        className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none animate-blob"
        style={{ background: "radial-gradient(circle, rgba(217,160,45,0.04) 0%, transparent 70%)" }}
      />
      <div ref={blob2Ref}
        className="absolute bottom-[30%] -right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none animate-blob-delayed"
        style={{ background: "radial-gradient(circle, rgba(217,160,45,0.03) 0%, transparent 70%)" }}
      />

      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,160,45,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(217,160,45,0.15) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <HeroSideContent />

      <div className="absolute top-[20%] left-[8%] w-32 h-px bg-gradient-to-r from-[#D9A02D]/30 to-transparent" />
      <div className="absolute bottom-[20%] right-[8%] w-32 h-px bg-gradient-to-l from-[#D9A02D]/30 to-transparent" />

      <div id="hero-content" className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16 md:pt-20">
        <div ref={subRef} className="mb-8 opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A02D]/20 bg-[#D9A02D]/5 mb-4">
            <img src="/logo.png" alt="" className="h-4 w-auto" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#D9A02D]">
              AI-Powered Legal Intelligence
            </span>
          </div>
        </div>

        <h1 className="flex flex-col items-center select-none">
          <span className="block overflow-hidden">
            <span ref={line0Ref} className="slide-line editorial-heading text-[#FAFAFA] block"
              style={{ fontSize: "clamp(3rem, 13vw, 15rem)" }}
            >
              Instant Legal
            </span>
          </span>
          <span className="block overflow-hidden -mt-[0.04em]">
            <span ref={line1Ref} className="slide-line editorial-heading text-[#FAFAFA] block"
              style={{ fontSize: "clamp(3rem, 13vw, 15rem)" }}
            >
              Intelligence,
            </span>
          </span>
          <span className="block overflow-hidden -mt-[0.04em]">
            <span ref={line2Ref} className="slide-line editorial-heading text-gradient-amber block"
              style={{ fontSize: "clamp(3rem, 13vw, 15rem)" }}
            >
              For Everyone
            </span>
          </span>
        </h1>

        <div ref={bodyRef} className="mt-8 max-w-2xl mx-auto opacity-0">
          <p className="font-body text-[15px] md:text-[17px] text-[#94A3B8] leading-relaxed tracking-wide">
            Describe your dispute, contract, or legal question in plain English.
            Our AI analyzes jurisdiction, precedent, and statute to give you
            clear guidance on your rights, options, and next steps.
          </p>
        </div>

        <div ref={ctaRef} className="mt-10 flex items-center justify-center gap-6 opacity-0">
          <button onClick={() => navigate("/demo")}
            className="group font-mono text-[10px] uppercase tracking-[0.22em] bg-[#D9A02D] hover:bg-[#D9A02D]/90 text-[#030303] px-10 py-4 rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_rgba(217,160,45,0.25)] hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5">
              Try the Demo
              <span className="w-4 h-px bg-[#030303] group-hover:w-6 transition-all duration-500" />
            </span>
          </button>
          <button onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#94A3B8]/60 hover:text-[#FAFAFA] px-6 py-4 transition-colors duration-300 relative after:absolute after:bottom-2 after:left-6 after:right-6 after:h-px after:bg-[#D9A02D]/0 hover:after:bg-[#D9A02D]/40 after:transition-all after:duration-300"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#64748B]/40">
          Scroll to explore
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-[#D9A02D] to-transparent" />
      </div>
    </section>
  );
}
