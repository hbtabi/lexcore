import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, MessageCircle, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sectionMessages: Record<string, { tip: string; detail: string }> = {
  hero: {
    tip: "Welcome! I'm Lex — your AI legal guide.",
    detail: "I'm here to walk you through how LexCore AI works. We use advanced language models to give you clear, conversational legal guidance — for free. Ask me anything about the platform!",
  },
  stats: {
    tip: "98% of legal needs go unmet. We're fixing that.",
    detail: "The numbers tell the story: $600B+ market, 3x faster than traditional research, and 99.7% accuracy on precedent analysis. Legal intelligence at scale is finally possible.",
  },
  manifesto: {
    tip: "LLMs don't hallucinate context — they engineer it.",
    detail: "The core insight: legal advice requires contextual reasoning. Before LLMs, software couldn't do that. Now it can. We're building the first product that actually advises — not just summarizes.",
  },
  grid: {
    tip: "Four capabilities. One unified system.",
    detail: "The Intelligence Grid combines contextual reasoning, predictive drafting, real-time compliance monitoring, and a zero-trust secure vault. Each piece reinforces the others.",
  },
  features: {
    tip: "Everything you need. Nothing you don't.",
    detail: "From dispute simulation to multi-jurisdiction coverage to fairness guarantees — every feature is designed around one question: does this help you understand your legal situation better?",
  },
  terminal: {
    tip: "Move your cursor to decrypt knowledge.",
    detail: "This WebGL visualization represents how LLMs decode legal information — patterns emerge from noise, structure from chaos. The data is always there; we just help you see it.",
  },
  waitlist: {
    tip: "Join 1,000+ early adopters.",
    detail: "Be among the first to experience AI-powered legal intelligence. Sign up for the waitlist and we'll keep you updated on our launch progress.",
  },
};

const botPhrases = [
  "Need legal help? I'm here.",
  "Scroll down to explore.",
  "Ask me about your rights.",
  "Legal guidance, reimagined.",
  "Know your options.",
  "Justice should be accessible.",
];

export default function LexBot() {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const botRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const updateForSection = useCallback((sectionId: string) => {
    const msg = sectionMessages[sectionId];
    if (msg) {
      setCurrentSection(sectionId);
    }
  }, []);

  useEffect(() => {
    const sectionIds = Object.keys(sectionMessages);
    const triggers: ScrollTrigger[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateForSection(id),
        onEnterBack: () => updateForSection(id),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [updateForSection]);

  useEffect(() => {
    if (!botRef.current || open) return;
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % botPhrases.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (!bubbleRef.current || open) return;
    gsap.fromTo(
      bubbleRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, [phraseIndex, open]);

  useEffect(() => {
    if (!botRef.current) return;
    gsap.to(botRef.current, {
      y: -6,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const handleToggle = () => {
    setOpen((o) => !o);
    if (!open && botRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          className="w-[300px] md:w-[360px] rounded-2xl border border-[#D9A02D]/15 bg-[#0A0A0B]/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#94A3B8]/8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#F2C94C] flex items-center justify-center shadow-[0_0_12px_rgba(217,160,45,0.2)]">
                <span className="text-[12px] font-bold text-[#030303]">L</span>
              </div>
              <div>
                <span className="font-body text-[13px] text-[#FAFAFA] font-medium">Lex</span>
                <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#64748B] ml-2">AI Guide</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#64748B] hover:text-[#FAFAFA] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-[#D9A02D]/5 border border-[#D9A02D]/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#F2C94C] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-[#030303]">L</span>
                </div>
                <div>
                  <p className="font-body text-[13px] text-[#CBD5E1] leading-relaxed">
                    {sectionMessages[currentSection]?.detail || sectionMessages.hero.detail}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="w-3 h-3 text-[#D9A02D]" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#D9A02D]/60">
                      Current: {currentSection}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#64748B]">Quick actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Try Demo", action: () => { window.location.href = "/demo"; } },
                  { label: "Join Waitlist", action: () => { document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }); } },
                  { label: "Learn More", action: () => { document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" }); } },
                  { label: "View Features", action: () => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); } },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className="font-mono text-[9px] uppercase tracking-[0.15em] px-3 py-2.5 rounded-lg border border-[#94A3B8]/10 bg-[#0F172A]/40 hover:bg-[#D9A02D]/10 hover:border-[#D9A02D]/20 text-[#94A3B8] hover:text-[#FAFAFA] transition-all duration-300"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-t border-[#94A3B8]/8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#64748B]">
              Always listening — scroll to see context
            </span>
          </div>
        </div>
      )}

      {!open && (
        <div
          ref={bubbleRef}
          className="px-4 py-2 rounded-2xl bg-[#0A0A0B]/80 backdrop-blur-xl border border-[#D9A02D]/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3 h-3 text-[#D9A02D]" />
            <span className="font-body text-[11px] text-[#94A3B8] whitespace-nowrap">
              {botPhrases[phraseIndex]}
            </span>
          </div>
        </div>
      )}

      <button
        ref={botRef}
        onClick={handleToggle}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#F2C94C] flex items-center justify-center shadow-[0_0_30px_rgba(217,160,45,0.2)] hover:shadow-[0_0_50px_rgba(217,160,45,0.35)] transition-shadow duration-500 cursor-pointer group"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D9A02D]/20 to-transparent animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D9A02D]/10 to-transparent animate-pulse-soft" />
        {open ? (
          <X className="w-5 h-5 text-[#030303]" />
        ) : (
          <>
            <span className="text-[18px] font-bold text-[#030303] relative z-10">L</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030303]" />
          </>
        )}
      </button>
    </div>
  );
}
