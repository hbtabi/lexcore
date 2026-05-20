import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "scale" | "gavel" | "document" | "shield";
  pulse: number;
  pulseSpeed: number;
}

export default function LegalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const types: Particle["type"][] = ["scale", "gavel", "document", "shield"];
    const particles: Particle[] = [];
    const count = Math.min(14, Math.floor(window.innerWidth / 120));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 16 + Math.random() * 28,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        opacity: 0.04 + Math.random() * 0.06,
        type: types[Math.floor(Math.random() * types.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
      });
    }
    particlesRef.current = particles;

    const drawScale = (x: number, y: number, s: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s / 40, s / 40);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#D9A02D";
      ctx.lineWidth = 1.5;

      const beamW = 24, beamH = 2;
      ctx.beginPath();
      ctx.roundRect(-beamW / 2, -beamH / 2, beamW, beamH, 1);
      ctx.stroke();

      const panW = 10, panH = 8;
      ctx.beginPath();
      ctx.moveTo(-beamW / 2, -beamH / 2);
      ctx.lineTo(-beamW / 2 - panW / 2, -beamH / 2 - panH);
      ctx.lineTo(-beamW / 2 + panW / 2, -beamH / 2 - panH);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(beamW / 2, -beamH / 2);
      ctx.lineTo(beamW / 2 + panW / 2, -beamH / 2 - panH);
      ctx.lineTo(beamW / 2 - panW / 2, -beamH / 2 - panH);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 4, 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawGavel = (x: number, y: number, s: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s / 35, s / 35);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#D9A02D";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(-8, -2, 16, 4, 1);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(-1.5, 2, 3, 16, 1);
      ctx.stroke();
      ctx.restore();
    };

    const drawDocument = (x: number, y: number, s: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s / 30, s / 30);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#D9A02D";
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-8, -10);
      ctx.lineTo(8, -10);
      ctx.lineTo(8, 10);
      ctx.lineTo(-8, 10);
      ctx.closePath();
      ctx.stroke();

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-5, -4 + i * 5);
        ctx.lineTo(5, -4 + i * 5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawShield = (x: number, y: number, s: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s / 35, s / 35);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#D9A02D";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(10, -8);
      ctx.lineTo(10, 2);
      ctx.lineTo(0, 10);
      ctx.lineTo(-10, 2);
      ctx.lineTo(-10, -8);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.pulse += p.pulseSpeed;

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        switch (p.type) {
          case "scale": drawScale(p.x, p.y, p.size, p.rotation, alpha); break;
          case "gavel": drawGavel(p.x, p.y, p.size, p.rotation, alpha); break;
          case "document": drawDocument(p.x, p.y, p.size, p.rotation, alpha); break;
          case "shield": drawShield(p.x, p.y, p.size, p.rotation, alpha); break;
        }
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
