import { useEffect, useRef } from "react";

export default function ProcessingBrain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

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

      // Outer glow rings
      for (let ring = 0; ring < 4; ring++) {
        const radius = 30 + ring * 15 + Math.sin(t * 0.5 + ring) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 160, 45, ${0.06 + ring * 0.015 + Math.sin(t * 0.7 + ring) * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Synapse particles orbiting
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.3;
        const dist = 40 + Math.sin(t * 0.4 + i * 2) * 8;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const size = 1.5 + Math.sin(t + i) * 0.8;

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 160, 45, ${0.15 + Math.sin(t + i) * 0.08})`;
        ctx.fill();

        // Connection lines
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(217, 160, 45, ${0.03 + Math.sin(t + i) * 0.02})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Center core
      const corePulse = 1 + Math.sin(t * 0.6) * 0.08;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(corePulse, corePulse);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      grad.addColorStop(0, "rgba(217, 160, 45, 0.15)");
      grad.addColorStop(0.5, "rgba(217, 160, 45, 0.06)");
      grad.addColorStop(1, "rgba(217, 160, 45, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      // Inner core
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 201, 76, ${0.3 + Math.sin(t * 0.8) * 0.1})`;
      ctx.fill();

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(250, 250, 250, ${0.5 + Math.sin(t * 0.5) * 0.2})`;
      ctx.fill();

      ctx.restore();

      t += 0.02;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-[100px] h-[100px]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#D9A02D]/40 animate-pulse-soft">
          PROCESSING
        </span>
      </div>
    </div>
  );
}
