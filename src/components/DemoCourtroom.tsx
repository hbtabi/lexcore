import { useEffect, useRef, useState } from "react";

function RobotGlow({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute w-16 h-16 rounded-full transition-all duration-1000 ${
        active ? "bg-[#D9A02D]/20 blur-2xl scale-150" : "bg-[#D9A02D]/5 blur-xl"
      }`} />
      <div className={`w-8 h-8 rounded-full border transition-all duration-700 flex items-center justify-center ${
        active
          ? "border-[#D9A02D]/40 bg-[#D9A02D]/10 shadow-[0_0_30px_rgba(217,160,45,0.2)]"
          : "border-[#D9A02D]/10 bg-transparent"
      }`}>
        <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
          active ? "bg-[#F2C94C] shadow-[0_0_12px_rgba(242,201,76,0.6)]" : "bg-[#D9A02D]/30"
        }`} />
      </div>
    </div>
  );
}

function Pillar({ side }: { side: "left" | "right" }) {
  const x = side === "left" ? "left-[8%]" : "right-[8%]";
  const rotate = side === "left" ? "-rotate-12" : "rotate-12";
  return (
    <div className={`absolute top-[10%] bottom-[15%] ${x} w-[3px]`}>
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-[#D9A02D]/8 to-transparent ${rotate}`} />
      <div className="absolute top-[15%] -left-2 w-[18px] h-[3px] bg-[#D9A02D]/6 rounded-full" />
      <div className="absolute top-[25%] -left-2 w-[18px] h-[3px] bg-[#D9A02D]/4 rounded-full" />
      <div className="absolute top-[60%] -left-2 w-[18px] h-[3px] bg-[#D9A02D]/4 rounded-full" />
      <div className="absolute top-[70%] -left-2 w-[18px] h-[3px] bg-[#D9A02D]/6 rounded-full" />
    </div>
  );
}

export default function DemoCourtroom({ isProcessing, hasResult }: { isProcessing: boolean; hasResult: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floor gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#030303] via-[#0A0A0F]/80 to-transparent" />

      {/* Back wall */}
      <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-[#050505] via-[#08080C] to-transparent" />

      {/* Courtroom arch */}
      <div className="absolute top-[3%] left-[20%] right-[20%] h-[25%]">
        <svg viewBox="0 0 400 120" className="w-full h-full opacity-[0.04]" preserveAspectRatio="none">
          <path d="M0 120 Q100 0 200 0 Q300 0 400 120" fill="none" stroke="#D9A02D" strokeWidth="1.5" />
          <path d="M20 120 Q110 10 200 10 Q290 10 380 120" fill="none" stroke="#D9A02D" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      {/* Pillars */}
      <Pillar side="left" />
      <Pillar side="right" />

      {/* Judge bench area */}
      <div className="absolute top-[18%] left-[35%] right-[35%] flex flex-col items-center">
        <RobotGlow active={isProcessing || hasResult} />

        {/* Bench top */}
        <div className={`w-[60%] h-[3px] rounded-full transition-all duration-700 ${
          hasResult ? "bg-[#D9A02D]/30 shadow-[0_0_15px_rgba(217,160,45,0.15)]" :
          isProcessing ? "bg-[#D9A02D]/20" : "bg-[#D9A02D]/8"
        }`} />

        {/* Bench body */}
        <div className={`w-[50%] h-8 rounded-sm border transition-all duration-500 ${
          hasResult ? "border-[#D9A02D]/20 bg-[#D9A02D]/5" :
          isProcessing ? "border-[#D9A02D]/15 bg-[#D9A02D]/3" :
          "border-[#D9A02D]/6 bg-transparent"
        }`} />
      </div>

      {/* Gavel icon */}
      <div className="absolute top-[28%] left-[42%]">
        <div className="flex items-end gap-1">
          <div className="w-[2px] h-4 bg-[#D9A02D]/10" />
          <div className={`w-5 h-[2px] rounded transition-all duration-500 ${
            hasResult ? "bg-[#D9A02D]/30" : "bg-[#D9A02D]/8"
          }`} />
        </div>
      </div>

      {/* Ambient glow bottom */}
      <div className={`absolute bottom-0 left-[20%] right-[20%] h-[30%] rounded-full transition-all duration-1000 ${
        isProcessing
          ? "bg-[#D9A02D]/[0.03] blur-[60px]"
          : hasResult
          ? "bg-emerald-500/[0.02] blur-[60px]"
          : "bg-[#D9A02D]/[0.01] blur-[60px]"
      }`} />

      {/* Side decorative lines */}
      <div className="absolute left-[5%] top-[30%] bottom-[30%] w-px bg-gradient-to-b from-transparent via-[#D9A02D]/4 to-transparent" />
      <div className="absolute right-[5%] top-[30%] bottom-[30%] w-px bg-gradient-to-b from-transparent via-[#D9A02D]/4 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-[5%] left-[5%] w-6 h-6 border-t border-l border-[#D9A02D]/8 opacity-50" />
      <div className="absolute top-[5%] right-[5%] w-6 h-6 border-t border-r border-[#D9A02D]/8 opacity-50" />

      {/* Status indicator at top */}
      <div className={`absolute top-[6%] left-1/2 -translate-x-1/2 transition-all duration-500 ${
        isProcessing || hasResult ? "opacity-100" : "opacity-0"
      }`}>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-[#0A0A0B]/60 backdrop-blur-sm"
          style={{ borderColor: hasResult ? "rgba(52,211,153,0.2)" : "rgba(217,160,45,0.2)" }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            hasResult ? "bg-emerald-400" : "bg-[#D9A02D] animate-pulse"
          }`} />
          <span className="font-mono text-[7px] uppercase tracking-[0.2em]"
            style={{ color: hasResult ? "#34D399" : "#D9A02D" }}
          >
            {hasResult ? "Verdict Delivered" : isProcessing ? "Case In Progress" : "Awaiting Case"}
          </span>
        </div>
      </div>
    </div>
  );
}
