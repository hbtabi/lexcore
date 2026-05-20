import { useEffect, useRef } from "react";

type RiskLevel = "low" | "moderate" | "high" | "critical";

const levelConfig: Record<RiskLevel, { color: string; label: string; glow: string }> = {
  low: { color: "#34D399", label: "Low Risk", glow: "rgba(52,211,153,0.15)" },
  moderate: { color: "#FBBF24", label: "Moderate", glow: "rgba(251,191,36,0.15)" },
  high: { color: "#F97316", label: "High Risk", glow: "rgba(249,115,22,0.15)" },
  critical: { color: "#EF4444", label: "Critical", glow: "rgba(239,68,68,0.2)" },
};

function assessRisk(text: string): { level: RiskLevel; score: number } {
  const keywords = {
    critical: ["eviction", "deportation", "criminal", "arrest", "lawsuit", "fired", "terminated", "custody", "visa revoked", "fraud", "felony"],
    high: ["suing", "sue", "contract breach", "non-compete", "deposit", "landlord", "unpaid", "invoice", "discrimination"],
    moderate: ["sponsor", "green card", "visa", "spouse", "permit", "marriage", "agreement", "lease", "notice"],
    low: ["question", "what is", "how to", "advice", "information", "rights"],
  };

  const lower = text.toLowerCase();
  let score = 50;

  for (const word of keywords.critical) {
    if (lower.includes(word)) score += 12;
  }
  for (const word of keywords.high) {
    if (lower.includes(word)) score += 6;
  }
  for (const word of keywords.moderate) {
    if (lower.includes(word)) score += 2;
  }
  for (const word of keywords.low) {
    if (lower.includes(word)) score -= 3;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) return { level: "critical", score };
  if (score >= 55) return { level: "high", score };
  if (score >= 30) return { level: "moderate", score };
  return { level: "low", score };
}

export default function RiskMeter({ text, analyzing }: { text: string; analyzing: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const result = assessRisk(text);
  const cfg = levelConfig[result.level];

  useEffect(() => {
    if (!containerRef.current || !glowRef.current || analyzing) return;
    const bar = containerRef.current.querySelector(".risk-bar-fill") as HTMLElement;
    if (bar) {
      bar.style.width = "0%";
      requestAnimationFrame(() => {
        bar.style.width = `${result.score}%`;
      });
    }
    glowRef.current.style.background = `radial-gradient(ellipse, ${cfg.glow} 0%, transparent 70%)`;
  }, [text, analyzing, result.score, cfg.glow]);

  return (
    <div ref={containerRef} className="relative px-4 py-3 rounded-xl border border-[#94A3B8]/8 bg-[#0A0A0B]/60 backdrop-blur-sm">
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-xl transition-all duration-1000 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${cfg.glow} 0%, transparent 70%)` }}
      />
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full transition-colors duration-700"
            style={{ backgroundColor: cfg.color }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: cfg.color }}>
            {analyzing ? "Analyzing..." : cfg.label}
          </span>
        </div>
        <span className="font-mono text-[9px] text-[#64748B]">
          {analyzing ? "--" : `${result.score}%`}
        </span>
      </div>
      <div className="relative h-1 rounded-full bg-[#0F172A]/60 overflow-hidden">
        <div
          className="risk-bar-fill absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: analyzing ? "50%" : "0%",
            backgroundColor: cfg.color,
            boxShadow: analyzing ? "0 0 8px rgba(217,160,45,0.3)" : `0 0 8px ${cfg.color}40`,
          }}
        />
        {analyzing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9A02D]/20 to-transparent animate-shimmer" />
        )}
      </div>
    </div>
  );
}
