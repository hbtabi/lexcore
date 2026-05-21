import { useEffect, useRef } from "react";

const planets = [
  { name: "EMPLOYMENT", r: 25, color: "#60A5FA", speed: 0.3 },
  { name: "HOUSING", r: 40, color: "#34D399", speed: 0.2 },
  { name: "CONTRACT", r: 55, color: "#D9A02D", speed: 0.15 },
  { name: "IMMIGRATION", r: 70, color: "#A78BFA", speed: 0.1 },
  { name: "CIVIL", r: 85, color: "#F97316", speed: 0.08 },
];

export default function PlanetSystem({ active, relevantAreas }: { active: boolean; relevantAreas: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 250;
    canvas.height = 250;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Center star
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15);
      grad.addColorStop(0, "rgba(242,201,76,0.2)");
      grad.addColorStop(0.5, "rgba(217,160,45,0.08)");
      grad.addColorStop(1, "rgba(217,160,45,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(242,201,76,0.3)";
      ctx.fill();

      // Orbit rings and planets
      planets.forEach((planet, i) => {
        const isRelevant = relevantAreas.some(a => planet.name.includes(a.slice(0, 4)));

        // Orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, planet.r, 0, Math.PI * 2);
        ctx.strokeStyle = isRelevant ? `${planet.color}15` : "rgba(217,160,45,0.03)";
        ctx.lineWidth = isRelevant ? 1 : 0.5;
        ctx.setLineDash(isRelevant ? [] : [2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Planet position
        const angle = t * planet.speed + i * 1.2;
        const px = cx + Math.cos(angle) * planet.r;
        const py = cy + Math.sin(angle) * planet.r;

        // Glow if relevant
        if (isRelevant) {
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = `${planet.color}15`;
          ctx.fill();
        }

        // Planet
        const planetR = isRelevant ? 4 : 2.5;
        ctx.beginPath();
        ctx.arc(px, py, planetR, 0, Math.PI * 2);
        ctx.fillStyle = isRelevant ? `${planet.color}60` : `${planet.color}20`;
        ctx.fill();
        ctx.strokeStyle = isRelevant ? `${planet.color}80` : `${planet.color}30`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = isRelevant ? `${planet.color}80` : "rgba(148,163,184,0.2)";
        ctx.font = "5px monospace";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, px, py + planetR + 10);
      });

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, relevantAreas]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[150px] h-[150px]" />
    </div>
  );
}
