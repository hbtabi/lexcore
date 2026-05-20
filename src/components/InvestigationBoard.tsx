import { useEffect, useState } from "react";

interface Evidence {
  id: string;
  text: string;
  x: number;
  y: number;
  type: "fact" | "law" | "analysis" | "conclusion";
  connections: string[];
}

export default function InvestigationBoard({ active, items, onClose }: { active: boolean; items: string[]; onClose?: () => void }) {
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  useEffect(() => {
    if (!active) { setEvidences([]); return; }

    const types: Evidence["type"][] = ["fact", "law", "analysis", "conclusion"];
    const newEvidences = items.map((text, i) => ({
      id: `ev-${i}`,
      text: text.slice(0, 60) + (text.length > 60 ? "..." : ""),
      x: 10 + (i % 3) * 30,
      y: 10 + Math.floor(i / 3) * 25,
      type: types[i % types.length],
      connections: i > 0 ? [`ev-${i - 1}`] : [],
    }));
    setEvidences(newEvidences);
  }, [active, items]);

  if (!active) return null;

  const typeConfig = {
    fact: { color: "#60A5FA", label: "FACT", border: "border-blue-500/30" },
    law: { color: "#D9A02D", label: "LAW", border: "border-amber-500/30" },
    analysis: { color: "#A78BFA", label: "ANALYSIS", border: "border-purple-500/30" },
    conclusion: { color: "#34D399", label: "CONCLUSION", border: "border-emerald-500/30" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030303]/90 backdrop-blur-md">
      <div className="relative w-[90vw] h-[85vh] max-w-5xl rounded-2xl border border-[#D9A02D]/15 bg-[#0A0A0B]/90 overflow-hidden">
        {/* Corkboard texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(217,160,45,0.05) 2px, rgba(217,160,45,0.05) 3px)",
            backgroundSize: "100% 3px",
          }}
        />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(217,160,45,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(217,160,45,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#94A3B8]/8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#64748B] ml-3">Investigation Board</span>
          </div>
          <button onClick={onClose} className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#64748B] hover:text-[#FAFAFA] transition-colors">
            Close
          </button>
        </div>

        {/* Evidence area */}
        <div className="relative p-6 h-[calc(100%-60px)]">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {evidences.map((ev) =>
              ev.connections.map((connId) => {
                const target = evidences.find(e => e.id === connId);
                if (!target) return null;
                return (
                  <line
                    key={`${ev.id}-${connId}`}
                    x1={`${ev.x}%`}
                    y1={`${ev.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="rgba(217,160,45,0.08)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })
            )}
          </svg>

          {/* Evidence cards */}
          {evidences.map((ev, i) => {
            const cfg = typeConfig[ev.type];
            return (
              <div
                key={ev.id}
                className="absolute animate-evidence-appear"
                style={{
                  left: `${ev.x}%`,
                  top: `${ev.y}%`,
                  animationDelay: `${i * 0.15}s`,
                  zIndex: 2,
                }}
              >
                <div className={`relative max-w-[220px] p-3 rounded-lg border ${cfg.border} bg-[#0F172A]/80 backdrop-blur-sm hover:bg-[#0F172A]/90 transition-all duration-300 group`}>
                  {/* Pin */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_4px_rgba(248,113,113,0.5)]" />
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-red-400/30" />

                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[7px] uppercase tracking-[0.15em]" style={{ color: cfg.color }}>{cfg.label}</span>
                    {i === evidences.length - 1 && (
                      <span className="text-[8px] animate-pulse">\uD83D\uDCCC</span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="font-body text-[11px] text-[#94A3B8] leading-relaxed">{ev.text}</p>

                  {/* Thread string */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gradient-to-r from-transparent via-[#D9A02D]/20 to-transparent" />
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-[#0A0A0B]/80 backdrop-blur-sm rounded-lg border border-[#94A3B8]/8 px-4 py-2 z-10">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-[#64748B]">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
