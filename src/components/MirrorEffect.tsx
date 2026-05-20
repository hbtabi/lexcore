import { useEffect, useRef, useState } from "react";

interface MirrorFragment {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  rotation: number;
  delay: number;
}

export default function MirrorEffect({ text, active }: { text: string; active: boolean }) {
  const [fragments, setFragments] = useState<MirrorFragment[]>([]);

  useEffect(() => {
    if (!active || !text) {
      setFragments([]);
      return;
    }

    const words = text.split(" ").slice(0, 8);
    const frags: MirrorFragment[] = words.map((word, i) => ({
      id: i,
      text: word,
      x: 40 + (i % 4) * 15,
      y: 20 + Math.floor(i / 4) * 20,
      opacity: 0,
      rotation: (Math.random() - 0.5) * 20,
      delay: i * 0.15,
    }));
    setFragments(frags);

    // Animate fragments appearing
    frags.forEach((f, i) => {
      setTimeout(() => {
        setFragments(prev => prev.map(p =>
          p.id === f.id ? { ...p, opacity: 0.6 } : p
        ));
      }, 500 + i * 200);
    });
  }, [text, active]);

  if (!active || fragments.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Mirror frame */}
      <div className="relative w-40 h-40 rounded-full border-2 border-[#D9A02D]/15 bg-[#030303]/40 backdrop-blur-sm flex items-center justify-center">
        <div className="absolute inset-2 rounded-full border border-[#D9A02D]/10 overflow-hidden">
          {/* Mirror surface */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9A02D]/5 via-transparent to-[#D9A02D]/3" />

          {/* Reflections - split text fragments */}
          {fragments.map((frag) => (
            <span
              key={frag.id}
              className="absolute font-mono text-[6px] uppercase tracking-[0.1em] transition-all duration-700"
              style={{
                left: `${frag.x}%`,
                top: `${frag.y}%`,
                opacity: frag.opacity,
                color: "#D9A02D",
                transform: `rotate(${frag.rotation}deg) scaleX(-1)`,
                textShadow: "0 0 8px rgba(217,160,45,0.2)",
              }}
            >
              {frag.text}
            </span>
          ))}

          {/* Center reflection */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#D9A02D]/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#D9A02D]/20" />
          </div>

          {/* Scan line */}
          <div className="absolute left-0 right-0 h-[1px] bg-[#D9A02D]/10 animate-scan-line" />
        </div>

        {/* Frame corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#D9A02D]/30" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#D9A02D]/30" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#D9A02D]/30" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#D9A02D]/30" />
      </div>

      {/* Transformed interpretation */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#D9A02D]/30">
          Reflection interpreting...
        </span>
      </div>
    </div>
  );
}
