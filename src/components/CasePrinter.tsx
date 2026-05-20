import { useEffect, useState } from "react";

export default function CasePrinter({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  const [phase, setPhase] = useState<"idle" | "warming" | "printing" | "done">("idle");

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      return;
    }

    setPhase("warming");
    const t1 = setTimeout(() => setPhase("printing"), 800);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, onComplete]);

  if (phase === "idle") return null;

  return (
    <div className="relative py-4 px-6 rounded-xl border border-[#94A3B8]/8 bg-[#0A0A0B]/80 backdrop-blur-sm overflow-hidden">
      {/* Paper feed animation */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0 w-10 h-12 rounded border border-[#94A3B8]/15 bg-[#0F172A]/40 flex items-center justify-center">
          {phase === "warming" && (
            <div className="w-4 h-4 border-2 border-[#D9A02D] border-t-transparent rounded-full animate-spin" />
          )}
          {phase === "printing" && (
            <div className="space-y-1">
              <div className="w-5 h-[1px] bg-[#D9A02D]/60 animate-pulse" />
              <div className="w-4 h-[1px] bg-[#D9A02D]/40 animate-pulse" style={{ animationDelay: "0.1s" }} />
              <div className="w-3 h-[1px] bg-[#D9A02D]/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>
          )}
          {phase === "done" && (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: phase === "done" ? "#34D399" : "#D9A02D" }}>
              {phase === "warming" && "Warming up printer..."}
              {phase === "printing" && "Printing legal document..."}
              {phase === "done" && "Document complete"}
            </span>
            {phase === "printing" && (
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-[#D9A02D] animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-1 h-1 rounded-full bg-[#D9A02D] animate-bounce" style={{ animationDelay: "0.15s" }} />
                <div className="w-1 h-1 rounded-full bg-[#D9A02D] animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
          </div>

          {/* Paper strip coming out */}
          <div className="relative h-6 overflow-hidden rounded bg-[#0F172A]/40 border border-[#94A3B8]/5">
            <div
              className="absolute inset-0 transition-all transition-all duration-1000 ease-linear"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${
                  phase === "done" ? "#34D399" : "#D9A02D"
                } 50%, transparent 100%)`,
                opacity: phase === "warming" ? 0 : phase === "done" ? 0 : 0.15,
                transform: `translateX(${phase === "printing" ? "100%" : "-100%"})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative paper lines */}
      {phase === "printing" && (
        <div className="absolute -bottom-1 left-[20%] right-[20%] flex justify-center gap-4 opacity-20">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-12 h-[1px] bg-[#D9A02D]" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
