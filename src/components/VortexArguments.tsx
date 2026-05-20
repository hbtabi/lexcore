import { useEffect, useRef } from "react";

export default function VortexArguments({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    let t = 0;
    const particles: { dist: number; speed: number; phase: number; size: number }[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        dist: 20 + Math.random() * 120,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2,
      });
    }

    const labels = ["Facts", "Laws", "Context", "Precedent", "Rights", "Outcome"];

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Spiral arms
      for (let arm = 0; arm < 3; arm++) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.05) {
          const r = 5 + a * 8 + Math.sin(a * 2 + t) * 5;
          const x = cx + Math.cos(a + arm * 2.1 + t * 0.05) * r;
          const y = cy + Math.sin(a + arm * 2.1 + t * 0.05) * r;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(217,160,45,${0.03 + arm * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Orbiting particles
      particles.forEach((p) => {
        const angle = t * p.speed + p.phase;
        const r = p.dist + Math.sin(t * 0.3 + p.phase) * 10;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,160,45,${0.1 + Math.sin(t + p.phase) * 0.05})`;
        ctx.fill();

        // Trail to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(217,160,45,${0.015 + Math.sin(t + p.phase) * 0.01})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      });

      // Center core
      const coreR = 8 + Math.sin(t * 0.3) * 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      grad.addColorStop(0, "rgba(217,160,45,0.15)");
      grad.addColorStop(0.5, "rgba(217,160,45,0.05)");
      grad.addColorStop(1, "rgba(217,160,45,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(242,201,76,0.3)";
      ctx.fill();

      // Labels on outer ring
      labels.forEach((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2 + t * 0.02;
        const r = 120;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "rgba(217,160,45,0.2)";
        ctx.font = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, 0, 2);
        ctx.restore();
      });

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[150px] h-[150px]" />
    </div>
  );
}
