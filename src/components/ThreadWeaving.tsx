import { useEffect, useRef } from "react";

export default function ThreadWeaving({ active }: { active: boolean }) {
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
    const threads = [
      { color: "#60A5FA", offset: 0, wave: 0.3 },
      { color: "#D9A02D", offset: 0.5, wave: 0.4 },
      { color: "#34D399", offset: 1.0, wave: 0.35 },
      { color: "#A78BFA", offset: 1.5, wave: 0.25 },
    ];

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      threads.forEach((thread, ti) => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.3 + ti * 30
            + Math.sin((x + t * 30) * 0.02 + thread.offset) * 15 * thread.wave
            + Math.sin((x + t * 20) * 0.04 + thread.offset * 2) * 8;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `${thread.color}40`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Weave cross-threads
      for (let x = 20; x < canvas.width; x += 30) {
        const weaveY = canvas.height * 0.3 + Math.sin((x + t * 20) * 0.05) * 15 + 45;
        ctx.beginPath();
        ctx.moveTo(x, weaveY - 10);
        ctx.lineTo(x, weaveY + 10);
        ctx.strokeStyle = `rgba(217,160,45,${0.04 + Math.sin(x + t) * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Center convergence
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.6, 0,
        canvas.width * 0.5, canvas.height * 0.6, 20,
      );
      grad.addColorStop(0, "rgba(217,160,45,0.08)");
      grad.addColorStop(1, "rgba(217,160,45,0)");
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5, canvas.height * 0.6, 20, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      t += 0.005;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[200px] h-[130px]" />
    </div>
  );
}
