import { useEffect, useState } from "react";

export default function OpticalLens({ active }: { active: boolean }) {
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    if (!active) { setFocus(0); return; }
    const interval = setInterval(() => {
      setFocus(f => Math.min(f + 0.05, 1));
    }, 50);
    return () => clearInterval(interval);
  }, [active]);

  const blurAmount = Math.max(0, (1 - focus) * 6);

  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="lensGlow">
            <stop offset="40%" stopColor="#D9A02D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D9A02D" stopOpacity="0" />
          </radialGradient>
          <filter id="blurFilter">
            <feGaussianBlur stdDeviation={blurAmount} />
          </filter>
        </defs>
        {/* Lens frame */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#D9A02D" strokeWidth="1.5" opacity="0.5" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#D9A02D" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 2" />
        {/* Blurred text */}
        <g filter="url(#blurFilter)" opacity={1 - focus * 0.5}>
          <text x="50" y="40" textAnchor="middle" fill="#94A3B8" fontSize="5">Blurred</text>
          <text x="50" y="48" textAnchor="middle" fill="#94A3B8" fontSize="5">Situation</text>
        </g>
        {/* Sharp text */}
        <g opacity={focus}>
          <text x="50" y="60" textAnchor="middle" fill="#FAFAFA" fontSize="5" fontWeight="bold">Legal</text>
          <text x="50" y="68" textAnchor="middle" fill="#FAFAFA" fontSize="5" fontWeight="bold">Clarity</text>
        </g>
        {/* Lens shine */}
        <circle cx="50" cy="50" r={focus * 36} fill="url(#lensGlow)" />
        {/* Crosshair */}
        <line x1="50" y1="14" x2="50" y2="20" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="80" x2="50" y2="86" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
        <line x1="14" y1="50" x2="20" y2="50" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
        <line x1="80" y1="50" x2="86" y2="50" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  );
}
