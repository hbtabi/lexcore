import { useEffect, useState } from "react";

type Expression = "neutral" | "listening" | "processing" | "delivering" | "concerned";

const expressions: Record<Expression, { eyeColor: string; glowIntensity: string; symbol: string }> = {
  neutral: { eyeColor: "#D9A02D", glowIntensity: "0.15", symbol: "\u2696" },
  listening: { eyeColor: "#60A5FA", glowIntensity: "0.3", symbol: "\uD83D\uDC42" },
  processing: { eyeColor: "#FBBF24", glowIntensity: "0.5", symbol: "\uD83E\uDDE0" },
  delivering: { eyeColor: "#34D399", glowIntensity: "0.7", symbol: "\u2696" },
  concerned: { eyeColor: "#EF4444", glowIntensity: "0.4", symbol: "\u26A0" },
};

export default function AIJudgeAvatar({ expression, analyzing }: { expression?: Expression; analyzing?: boolean }) {
  const [currentExp, setCurrentExp] = useState<Expression>("neutral");

  useEffect(() => {
    if (expression) {
      setCurrentExp(expression);
      return;
    }
    if (analyzing) {
      setCurrentExp("processing");
      return;
    }
  }, [expression, analyzing]);

  const cfg = expressions[currentExp];

  return (
    <div className="relative flex flex-col items-center">
      {/* Holographic glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse, rgba(217,160,45,${cfg.glowIntensity}) 0%, transparent 70%)`,
        }}
      />

      {/* Robot judge avatar */}
      <div className="relative w-16 h-16">
        {/* Head */}
        <div className="absolute inset-2 rounded-lg border-2 transition-all duration-500 flex items-center justify-center"
          style={{
            borderColor: `${cfg.eyeColor}40`,
            background: `linear-gradient(135deg, rgba(217,160,45,0.1) 0%, rgba(15,23,42,0.4) 100%)`,
            boxShadow: analyzing ? `0 0 20px ${cfg.eyeColor}20` : "none",
          }}
        >
          {/* Eyes */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: cfg.eyeColor,
                boxShadow: `0 0 6px ${cfg.eyeColor}`,
              }}
            />
            <div className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: cfg.eyeColor,
                boxShadow: `0 0 6px ${cfg.eyeColor}`,
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="absolute bottom-0 left-4 right-4 h-6 rounded-sm border border-[#D9A02D]/10 bg-[#0F172A]/30" />

        {/* Pulsing ring when processing */}
        {analyzing && (
          <div className="absolute -inset-2 rounded-full border border-[#D9A02D]/20 animate-ping" />
        )}
      </div>

      {/* Label */}
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-[10px]" style={{ color: cfg.eyeColor }}>
          {cfg.symbol}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.15em] transition-all duration-500"
          style={{ color: cfg.eyeColor }}
        >
          {currentExp}
        </span>
      </div>
    </div>
  );
}
