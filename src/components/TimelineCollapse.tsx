import { useEffect, useRef } from "react";

export default function TimelineCollapse({ active, events }: { active: boolean; events: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 160;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const count = Math.min(events.length, 5);
      const spacing = canvas.width / (count + 1);

      // Timeline base
      ctx.beginPath();
      ctx.moveTo(spacing * 0.5, canvas.height * 0.7);
      ctx.lineTo(spacing * (count + 0.5), canvas.height * 0.7);
      ctx.strokeStyle = "rgba(217,160,45,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      events.slice(0, count).forEach((ev, i) => {
        const x = spacing * (i + 1);
        const collapse = Math.min(1, t * 0.5 + i * 0.1);
        const targetY = canvas.height * 0.7;
        const startY = 20 + i * 25;
        const y = startY + (targetY - startY) * collapse;

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, targetY);
        ctx.strokeStyle = `rgba(217,160,45,${0.04 + collapse * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Event node
        const r = 3 + collapse * 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const colors = ["#60A5FA", "#D9A02D", "#34D399", "#A78BFA", "#F97316"];
        ctx.fillStyle = `${colors[i % colors.length]}${Math.floor(20 + collapse * 30).toString(16)}`;
        ctx.fill();

        // Label
        ctx.fillStyle = `rgba(148,163,184,${0.2 + collapse * 0.3})`;
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(ev.slice(0, 22), x, y - r - 5);

        // Collapse point
        if (collapse > 0.8 && i === count - 1) {
          ctx.beginPath();
          ctx.arc(x, targetY, 5 + Math.sin(t * 2) * 1, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(217,160,45,0.1)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Decision point label
      ctx.fillStyle = "rgba(217,160,45,0.15)";
      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.fillText("DECISION POINT", canvas.width * 0.5, canvas.height - 5);

      t += 0.02;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, events]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full max-w-[400px] h-[120px]" />
    </div>
  );
}
