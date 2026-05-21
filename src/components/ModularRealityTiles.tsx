import { useEffect, useState } from "react";

const tileLabels = ["Facts", "Law", "Intent", "Harm", "Precedent", "Jurisdiction"];

const tilePositions = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
];

const shuffledPositions = [
  { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 2, y: 0 },
  { x: 0, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 },
];

export default function ModularRealityTiles({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);

  const positions = phase === 0 ? tilePositions : shuffledPositions;

  return (
    <div className="relative w-40 h-28 mx-auto">
      <div className="grid grid-cols-3 gap-1 w-full h-full">
        {tileLabels.map((label, i) => {
          const pos = positions[i];
          const row = pos.y;
          const col = pos.x;
          const isMismatch = phase > 0 && (col !== i % 3 || row !== Math.floor(i / 3));

          return (
            <div key={label}
              className="flex items-center justify-center rounded border text-[6px] font-mono uppercase tracking-wider transition-all duration-500"
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                borderColor: isMismatch ? "#D9A02D" : "#1E293B",
                background: isMismatch ? "rgba(217,160,45,0.1)" : "rgba(15,23,42,0.6)",
                color: isMismatch ? "#D9A02D" : "#64748B",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      {phase === 2 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030303]/60 backdrop-blur-[1px] rounded">
          <span className="font-mono text-[8px] text-[#D9A02D] uppercase tracking-wider">Reinterpreted</span>
        </div>
      )}
    </div>
  );
}
