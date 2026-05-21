import { useEffect, useState } from "react";

export default function JudgmentBeam({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  const [phase, setPhase] = useState<"idle" | "charging" | "striking" | "done">("idle");

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      return;
    }

    setPhase("charging");
    const t1 = setTimeout(() => setPhase("striking"), 400);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, onComplete]);

  if (phase === "idle") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Charging glow */}
      {phase === "charging" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-0 animate-beam-charge">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9A02D] blur-xl opacity-60" />
        </div>
      )}

      {/* Striking beam */}
      {phase === "striking" && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full animate-beam-strike">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D9A02D]/60 via-[#D9A02D]/30 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9A02D] blur-xl opacity-20" />
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-24 h-24 bg-[#D9A02D] blur-2xl opacity-5 rounded-full" />
          </div>

          {/* Flash */}
          <div className="absolute inset-0 bg-[#D9A02D] animate-beam-flash pointer-events-none" />

          {/* Light rays */}
          <div className="absolute top-[5%] left-[20%] w-[1px] h-[60%] bg-gradient-to-b from-[#D9A02D]/10 to-transparent rotate-12" />
          <div className="absolute top-[5%] right-[20%] w-[1px] h-[60%] bg-gradient-to-b from-[#D9A02D]/10 to-transparent -rotate-12" />
          <div className="absolute top-[10%] left-[35%] w-[1px] h-[50%] bg-gradient-to-b from-[#D9A02D]/5 to-transparent rotate-6" />
          <div className="absolute top-[10%] right-[35%] w-[1px] h-[50%] bg-gradient-to-b from-[#D9A02D]/5 to-transparent -rotate-6" />
        </>
      )}
    </div>
  );
}
