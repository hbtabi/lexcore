import { useEffect, useRef } from "react";

export default function LightShadowAnalysis({ active, facts, uncertain }: { active: boolean; facts: string[]; uncertain: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const midX = canvas.width / 2;

      // Light side gradient
      const lightGrad = ctx.createLinearGradient(0, 0, midX, 0);
      lightGrad.addColorStop(0, "rgba(217,160,45,0.04)");
      lightGrad.addColorStop(1, "rgba(217,160,45,0)");
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, midX, canvas.height);

      // Shadow side gradient
      const shadowGrad = ctx.createLinearGradient(midX, 0, canvas.width, 0);
      shadowGrad.addColorStop(0, "rgba(30,40,80,0.04)");
      shadowGrad.addColorStop(1, "rgba(30,40,80,0.08)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(midX, 0, canvas.width, canvas.height);

      // Divider line (animated)
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, canvas.height);
      const dashOffset = t * 20;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -dashOffset;
      ctx.strokeStyle = "rgba(217,160,45,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Light side - clear facts
      facts.forEach((f, i) => {
        const y = 25 + i * 35;
        const x = 15;

        // Sun icon
        ctx.beginPath();
        ctx.arc(x + 5, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(217,160,45,0.3)";
        ctx.fill();

        ctx.fillStyle = "rgba(148,163,184,0.5)";
        ctx.font = "6px monospace";
        ctx.fillText(f.slice(0, 25), x + 12, y + 2);
      });

      // Shadow side - uncertain facts
      uncertain.forEach((u, i) => {
        const y = 25 + i * 35;
        const x = midX + 15;

        // Moon icon
        ctx.beginPath();
        ctx.arc(x + 5, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100,120,200,0.2)";
        ctx.fill();

        ctx.fillStyle = "rgba(148,163,184,0.25)";
        ctx.font = "6px monospace";
        ctx.fillText(u.slice(0, 25), x + 12, y + 2);
      });

      // Labels
      ctx.fillStyle = "rgba(217,160,45,0.12)";
      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CLEAR", midX * 0.4, 15);
      ctx.fillText("UNCERTAIN", midX * 1.6, 15);

      t += 0.01;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, facts, uncertain]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full max-w-[300px] h-[150px]" />
    </div>
  );
}
