import { useEffect, useState } from "react";

const stakeholders = ["Plaintiff", "Defendant", "Witness", "Judge", "Jury", "State"];

export default function BoxedPerspective({ active }: { active: boolean }) {
  const [openIdx, setOpenIdx] = useState(-1);

  useEffect(() => {
    if (!active) { setOpenIdx(-1); return; }
    const interval = setInterval(() => {
      setOpenIdx(i => (i + 1) % (stakeholders.length + 1) - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative w-40 h-32 mx-auto">
      <div className="grid grid-cols-3 gap-1.5 w-full h-full">
        {stakeholders.map((s, i) => {
          const isOpen = i === openIdx;
          return (
            <div key={s}
              className="relative flex items-center justify-center rounded border transition-all duration-300"
              style={{
                borderColor: isOpen ? "#D9A02D" : "#1E293B",
                background: isOpen ? "rgba(217,160,45,0.12)" : "rgba(15,23,42,0.4)",
                boxShadow: isOpen ? "0 0 15px rgba(217,160,45,0.15)" : "none",
                transform: isOpen ? "scale(1.05)" : "scale(1)",
                zIndex: isOpen ? 10 : 1,
              }}
            >
              <span className="font-mono text-[5px] uppercase tracking-wider text-[#94A3B8] text-center leading-tight px-0.5">
                {isOpen ? `"${s}"` : s}
              </span>
              {isOpen && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D9A02D] animate-pulse-soft" />
              )}
            </div>
          );
        })}
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[6px] text-[#64748B] whitespace-nowrap">
        {openIdx >= 0 ? `Viewing: ${stakeholders[openIdx]}` : "Opening boxes..."}
      </div>
    </div>
  );
}
