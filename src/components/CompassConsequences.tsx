import { useEffect, useRef } from "react";

const directions = [
  { label: "Strong Case", angle: 0, color: "#34D399" },
  { label: "Settle", angle: 72, color: "#FBBF24" },
  { label: "Seek Counsel", angle: 144, color: "#60A5FA" },
  { label: "High Risk", angle: 216, color: "#EF4444" },
  { label: "Appeal", angle: 288, color: "#A78BFA" },
];

export default function CompassConsequences({ active, riskLevel }: { active: boolean; riskLevel: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 65;

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217,160,45,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Direction markers and labels
      directions.forEach((dir, i) => {
        const rad = (dir.angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r - 8);
        const y1 = cy + Math.sin(rad) * (r - 8);
        const x2 = cx + Math.cos(rad) * r;
        const y2 = cy + Math.sin(rad) * r;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `${dir.color}40`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        const lx = cx + Math.cos(rad) * (r + 14);
        const ly = cy + Math.sin(rad) * (r + 14);
        ctx.fillStyle = `${dir.color}50`;
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(dir.label, lx, ly + 2);
      });

      // Inner rings
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (r / 4) * ring, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217,160,45,${0.03 - ring * 0.005})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Needle
      const needleAngle = (riskLevel / 100) * 360 - 90;
      const needleRad = (needleAngle * Math.PI) / 180;
      const needleLen = r * 0.7;

      const nx = cx + Math.cos(needleRad) * needleLen;
      const ny = cy + Math.sin(needleRad) * needleLen;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = riskLevel > 70 ? "rgba(239,68,68,0.3)" : riskLevel > 40 ? "rgba(217,160,45,0.3)" : "rgba(52,211,153,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Needle center
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217,160,45,${0.2 + Math.sin(t) * 0.1})`;
      ctx.fill();

      // Center label
      ctx.fillStyle = "rgba(148,163,184,0.3)";
      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OUTCOMES", cx, cy + 20);

      t += 0.01;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, riskLevel]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[120px] h-[120px]" />
    </div>
  );
}
