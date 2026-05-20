import { useEffect, useState } from "react";

interface Gear {
  id: number;
  size: number;
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  teeth: number;
}

export default function MechanicalJusticeEngine({ active }: { active: boolean }) {
  const [gears] = useState<Gear[]>(() =>
    [
      { size: 40, x: 20, y: 30, speed: 0.3, direction: 1 as const, teeth: 8 },
      { size: 28, x: 50, y: 25, speed: 0.4, direction: -1 as const, teeth: 6 },
      { size: 34, x: 75, y: 35, speed: 0.25, direction: 1 as const, teeth: 7 },
      { size: 22, x: 35, y: 55, speed: 0.35, direction: -1 as const, teeth: 5 },
      { size: 30, x: 60, y: 60, speed: 0.2, direction: 1 as const, teeth: 6 },
      { size: 18, x: 80, y: 55, speed: 0.5, direction: -1 as const, teeth: 4 },
    ].map((g, id) => ({ ...g, id }))
  );

  const [rotation, setRotation] = useState<number[]>(gears.map(() => 0));

  useEffect(() => {
    if (!active) return;
    let animFrame: number;
    const animate = () => {
      setRotation(prev => prev.map((r, i) => r + gears[i].speed * gears[i].direction));
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [active, gears]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="gearGlow">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        {gears.map((gear, i) => (
          <g
            key={gear.id}
            transform={`translate(${gear.x}, ${gear.y}) rotate(${rotation[i]})`}
            filter="url(#gearGlow)"
          >
            {/* Gear body */}
            <circle
              r={gear.size / 2}
              fill="none"
              stroke="#D9A02D"
              strokeWidth="0.8"
              opacity={0.5}
            />
            {/* Gear teeth */}
            {Array.from({ length: gear.teeth }).map((_, t) => {
              const angle = (t / gear.teeth) * 360;
              const rad = (angle * Math.PI) / 180;
              const innerR = gear.size / 2 - 2;
              const outerR = gear.size / 2 + 1;
              return (
                <line
                  key={t}
                  x1={Math.cos(rad) * innerR}
                  y1={Math.sin(rad) * innerR}
                  x2={Math.cos(rad) * outerR}
                  y2={Math.sin(rad) * outerR}
                  stroke="#D9A02D"
                  strokeWidth="1.5"
                  opacity={0.4}
                />
              );
            })}
            {/* Center hub */}
            <circle
              r={3}
              fill="none"
              stroke="#D9A02D"
              strokeWidth="0.5"
              opacity={0.6}
            />
            {/* Spokes */}
            {Array.from({ length: 4 }).map((_, s) => {
              const angle = (s / 4) * 360;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={s}
                  x1={Math.cos(rad) * 3}
                  y1={Math.sin(rad) * 3}
                  x2={Math.cos(rad) * (gear.size / 2 - 3)}
                  y2={Math.sin(rad) * (gear.size / 2 - 3)}
                  stroke="#D9A02D"
                  strokeWidth="0.3"
                  opacity={0.3}
                />
              );
            })}
          </g>
        ))}
        {/* Connecting pistons */}
        <line x1="30" y1="40" x2="45" y2="35" stroke="#D9A02D" strokeWidth="0.3" opacity={0.2} />
        <line x1="55" y1="35" x2="70" y2="40" stroke="#D9A02D" strokeWidth="0.3" opacity={0.2} />
        <line x1="40" y1="45" x2="50" y2="50" stroke="#D9A02D" strokeWidth="0.3" opacity={0.2} />
      </svg>
    </div>
  );
}
