import { useEffect, useRef } from "react";

const buildings = [
  { label: "Employment\nLaw Tower", height: "180px", width: "40px", x: "12%", color: "#D9A02D", opacity: 0.06 },
  { label: "Housing\nCourts", height: "140px", width: "35px", x: "22%", color: "#D9A02D", opacity: 0.04 },
  { label: "Contract\nDistrict", height: "160px", width: "45px", x: "35%", color: "#D9A02D", opacity: 0.05 },
  { label: "Immigration\nHub", height: "200px", width: "50px", x: "48%", color: "#D9A02D", opacity: 0.07 },
  { label: "Civil\nCourts", height: "130px", width: "30px", x: "58%", color: "#D9A02D", opacity: 0.04 },
  { label: "Supreme\nCapitol", height: "220px", width: "60px", x: "72%", color: "#D9A02D", opacity: 0.08 },
  { label: "Rights\nTower", height: "150px", width: "35px", x: "84%", color: "#D9A02D", opacity: 0.05 },
];

export default function LegalCity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height + window.innerHeight)));
      containerRef.current.style.opacity = `${1 - progress}`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* City skyline */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-1/2">
        {/* Horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D9A02D]/8 to-transparent" />

        {/* Buildings */}
        {buildings.map((b) => (
          <div
            key={b.label}
            className="absolute bottom-0 flex flex-col items-center"
            style={{ left: b.x }}
          >
            {/* Building body */}
            <div
              className="relative rounded-t-sm transition-all duration-1000"
              style={{
                width: b.width,
                height: b.height,
                background: `linear-gradient(180deg, transparent 0%, rgba(217,160,45,${b.opacity * 0.5}) 50%, rgba(217,160,45,${b.opacity}) 100%)`,
                borderLeft: `1px solid rgba(217,160,45,${b.opacity * 0.5})`,
                borderRight: `1px solid rgba(217,160,45,${b.opacity * 0.5})`,
                borderTop: `1px solid rgba(217,160,45,${b.opacity * 0.3})`,
              }}
            >
              {/* Windows */}
              {Array.from({ length: Math.floor(parseInt(b.height) / 20) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[4px] h-[4px] rounded-sm"
                  style={{
                    backgroundColor: `rgba(217,160,45,${b.opacity * 0.3})`,
                    left: `${20 + (i % 3) * 25}%`,
                    top: `${10 + i * 20}px`,
                    opacity: 0.3 + Math.random() * 0.4,
                  }}
                />
              ))}

              {/* Spire for tall buildings */}
              {parseInt(b.height) > 160 && (
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderBottom: `8px solid rgba(217,160,45,${b.opacity * 0.5})`,
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div className="mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-[6px] uppercase tracking-[0.15em] text-[#D9A02D]/30 leading-tight block">
                {b.label.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ground fog */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
    </div>
  );
}
