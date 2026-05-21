import { useEffect, useState } from "react";

export default function FrozenTimeView({ active }: { active: boolean }) {
  const [frame, setFrame] = useState(0);
  const frames = ["Incident", "Discovery", "Filing", "Evidence", "Hearing"];

  useEffect(() => {
    if (!active) { setFrame(0); return; }
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="relative w-40 h-28 mx-auto flex flex-col items-center justify-center">
      <svg viewBox="0 0 120 60" className="w-full h-auto">
        {/* Timeline */}
        <line x1="10" y1="30" x2="110" y2="30" stroke="#1E293B" strokeWidth="1" />
        {/* Frame dots */}
        {frames.map((f, i) => (
          <g key={i}>
            <circle cx={10 + i * 25} cy="30" r={i === frame ? 5 : 3}
              fill={i === frame ? "#D9A02D" : "#1E293B"}
              stroke={i === frame ? "#D9A02D" : "none"}
              strokeWidth="1"
              className={i === frame ? "animate-pulse-soft" : ""}
              style={i === frame ? { transformOrigin: `${10 + i * 25}px 30px` } : {}}
            />
            {i === frame && (
              <text x={10 + i * 25} y="48" textAnchor="middle" fill="#D9A02D" fontSize="4" opacity="0.8">
                {f}
              </text>
            )}
          </g>
        ))}
        {/* Pause indicator */}
        <g opacity={active ? 0.6 : 0}>
          <rect x="48" y="8" width="24" height="10" rx="2" fill="#D9A02D" opacity="0.15" />
          <line x1="54" y1="10" x2="54" y2="16" stroke="#D9A02D" strokeWidth="1.5" />
          <line x1="58" y1="10" x2="58" y2="16" stroke="#D9A02D" strokeWidth="1.5" />
          <line x1="62" y1="10" x2="66" y2="13" stroke="#D9A02D" strokeWidth="1" opacity="0.5" />
          <line x1="66" y1="13" x2="62" y2="16" stroke="#D9A02D" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
      <span className="font-mono text-[7px] text-[#64748B] mt-1">Replaying key moments...</span>
    </div>
  );
}
