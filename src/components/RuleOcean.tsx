import { useEffect, useRef } from "react";

export default function RuleOcean({ active, intensity = 0.5 }: { active: boolean; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    let t = 0;
    const particles: { x: number; y: number; vx: number; vy: number; phase: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ocean gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "rgba(217,160,45,0)");
      grad.addColorStop(0.3, `rgba(217,160,45,${0.02 * intensity})`);
      grad.addColorStop(0.7, `rgba(100,180,255,${0.015 * intensity})`);
      grad.addColorStop(1, "rgba(217,160,45,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wave lines
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.5 + Math.sin((x + t * 20) * 0.01 + wave) * 20 * intensity
            + Math.sin((x + t * 10) * 0.02 + wave * 2) * 10 * intensity;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(217,160,45,${0.04 + wave * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Ripples
      const rippleX = canvas.width / 2 + Math.sin(t * 0.1) * 100;
      const rippleY = canvas.height * 0.4 + Math.sin(t * 0.15) * 50;
      for (let r = 0; r < 3; r++) {
        const radius = 30 + r * 25 + Math.sin(t * 0.3 + r) * 5;
        ctx.beginPath();
        ctx.arc(rippleX, rippleY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217,160,45,${0.03 - r * 0.008})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Current particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t * 0.2 + p.phase) * 0.3;
        p.y += p.vy + Math.cos(t * 0.15 + p.phase) * 0.2;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,160,45,${0.06 + Math.sin(t + p.phase) * 0.03})`;
        ctx.fill();
      });

      t += 0.005;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
