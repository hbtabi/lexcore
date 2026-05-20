import { useEffect, useRef } from "react";

export default function CauseEffectChain({ active, steps }: { active: boolean; steps: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 200;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodeCount = Math.min(steps.length, 6);
      const spacing = canvas.width / (nodeCount + 1);
      const cy = canvas.height / 2;

      steps.slice(0, nodeCount).forEach((step, i) => {
        const x = spacing * (i + 1);
        const pulse = Math.sin(t * 0.5 + i) * 3;

        // Connection line to next
        if (i < nodeCount - 1) {
          const nextX = spacing * (i + 2);
          ctx.beginPath();
          ctx.moveTo(x + 12, cy);
          ctx.lineTo(nextX - 12, cy);

          // Arrow
          const midX = (x + nextX) / 2;
          ctx.strokeStyle = `rgba(217,160,45,${0.08 + Math.sin(t + i) * 0.04})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Small arrowhead
          ctx.beginPath();
          ctx.moveTo(nextX - 12, cy - 4);
          ctx.lineTo(nextX - 6, cy);
          ctx.lineTo(nextX - 12, cy + 4);
          ctx.strokeStyle = "rgba(217,160,45,0.1)";
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Pulse traveling along line
          const pulseX = x + ((nextX - x) * ((t * 30 + i * 20) % 100)) / 100;
          ctx.beginPath();
          ctx.arc(pulseX, cy, 2 + Math.sin(t + i) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(217,160,45,0.15)";
          ctx.fill();
        }

        // Node circle
        const r = 10 + pulse;
        const grad = ctx.createRadialGradient(x, cy, 0, x, cy, r);
        const colors = [
          "rgba(217,160,45,0.12)",
          "rgba(100,180,255,0.08)",
          "rgba(52,211,153,0.1)",
          "rgba(167,139,250,0.08)",
          "rgba(251,191,36,0.1)",
          "rgba(239,68,68,0.08)",
        ];
        grad.addColorStop(0, colors[i % colors.length]);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217,160,45,0.08)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = "rgba(148,163,184,0.6)";
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText(step.slice(0, 20), x, cy + r + 12);
      });

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, steps]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full max-w-[500px] h-[150px]" />
    </div>
  );
}
