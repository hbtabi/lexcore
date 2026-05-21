import { useEffect, useState } from "react";

export default function IcebergLawModel({ visible, depth = 0 }: { visible: boolean; depth?: number }) {
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    if (!visible) { setReveal(0); return; }
    const interval = setInterval(() => {
      setReveal(r => Math.min(r + 1, 4));
    }, 600);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const layers = [
    { label: "Surface Answer", pct: 15, color: "#D9A02D" },
    { label: "Legal Reasoning", pct: 30, color: "#B8860B" },
    { label: "Precedent & Statute", pct: 55, color: "#8B6914" },
    { label: "Jurisdictional Nuance", pct: 75, color: "#5C4510" },
    { label: "Full Legal Context", pct: 90, color: "#3A2D0A" },
  ];

  const visibleLayers = layers.slice(0, reveal + 1);

  return (
    <div className="relative w-40 h-56 mx-auto">
      <svg viewBox="0 0 120 170" className="w-full h-full">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Water surface */}
        <path d="M0 40 Q30 35 60 42 Q90 48 120 40 L120 50 Q90 56 60 50 Q30 44 0 50Z" fill="url(#waterGrad)" opacity="0.6" />
        {/* Iceberg tip (above water) */}
        {reveal >= 0 && (
          <polygon points="60,10 80,50 40,50" fill="#D9A02D" opacity="0.9" style={{ animation: "fade-in 0.5s ease-out both" }} />
        )}
        {/* Iceberg below water */}
        {visibleLayers.slice(1).map((layer, i) => {
          const yOff = 50 + i * 25;
          return (
            <polygon key={i}
              points={`${60 - (i + 1) * 12},${yOff} ${60 + (i + 1) * 12},${yOff} ${60 + i * 5},${yOff + 25} ${60 - i * 5},${yOff + 25}`}
              fill={layer.color} opacity={0.15 + (i + 1) * 0.15}
              style={{ animation: "fade-in 0.5s ease-out both" }}
            />
          );
        })}
        {/* Depth marks */}
        {visibleLayers.map((layer, i) => (
          <text key={i} x="105" y={50 + i * 25} fill="#64748B" fontSize="4" opacity="0.5">
            {layer.label}
          </text>
        ))}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[7px] text-[#D9A02D]/40 uppercase tracking-wider whitespace-nowrap">
        Drag to reveal depth
      </div>
    </div>
  );
}
