import { useEffect, useRef, useState } from "react";

interface Bubble {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  popped: boolean;
}

export default function BubbleDecision({ facts, active }: { facts: string[]; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || facts.length === 0) { setBubbles([]); return; }

    const newBubbles: Bubble[] = facts.map((f, i) => ({
      id: i,
      text: f.slice(0, 35),
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 14 + Math.random() * 8,
      popped: false,
    }));
    setBubbles(newBubbles);

    let t = 0;
    const animate = () => {
      t += 0.01;
      setBubbles(prev => prev.map(b => {
        if (b.popped) return b;
        return {
          ...b,
          x: b.x + Math.sin(t + b.id) * 0.1,
          y: b.y + Math.cos(t * 0.7 + b.id) * 0.1,
        };
      }));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [active, facts]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
  };

  if (!active || bubbles.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full h-[200px] overflow-hidden rounded-xl border border-[#94A3B8]/8 bg-[#0F172A]/20">
      {bubbles.map(b => {
        if (b.popped) return null;
        return (
          <button
            key={b.id}
            onClick={() => popBubble(b.id)}
            className="absolute flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.r * 2}px`,
              height: `${b.r * 2}px`,
              borderColor: "rgba(217,160,45,0.2)",
              background: "radial-gradient(circle at 30% 30%, rgba(217,160,45,0.1), rgba(15,23,42,0.4))",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="text-[6px] text-[#94A3B8] text-center leading-tight px-1 font-mono">{b.text}</span>
          </button>
        );
      })}

      {bubbles.every(b => b.popped) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#D9A02D]/40">All facts considered</span>
        </div>
      )}

      <div className="absolute bottom-2 left-2">
        <span className="font-mono text-[6px] text-[#64748B]/40">Click bubbles to consider each fact</span>
      </div>
    </div>
  );
}
