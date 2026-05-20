import { useEffect, useRef } from "react";

export default function WeightScale({ level, active }: { level: number; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 160;

    let t = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const tilt = ((level - 50) / 50) * 0.3 + Math.sin(t) * 0.02;
      const beamY = 50;

      // Base
      ctx.beginPath();
      ctx.moveTo(cx - 30, 120);
      ctx.lineTo(cx + 30, 120);
      ctx.lineTo(cx + 15, 140);
      ctx.lineTo(cx - 15, 140);
      ctx.closePath();
      ctx.fillStyle = "rgba(217,160,45,0.06)";
      ctx.fill();
      ctx.strokeStyle = "rgba(217,160,45,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Center post
      ctx.beginPath();
      ctx.moveTo(cx, 120);
      ctx.lineTo(cx, beamY);
      ctx.strokeStyle = "rgba(217,160,45,0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Beam
      ctx.save();
      ctx.translate(cx, beamY);
      ctx.rotate(tilt);

      const beamLen = 60;
      ctx.beginPath();
      ctx.moveTo(-beamLen, 0);
      ctx.lineTo(beamLen, 0);
      ctx.strokeStyle = "rgba(217,160,45,0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center pivot point
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(217,160,45,0.2)";
      ctx.fill();

      // Left pan (user facts)
      const leftY = Math.abs(beamLen) * Math.sin(tilt);
      ctx.beginPath();
      ctx.moveTo(-beamLen, leftY);
      ctx.lineTo(-beamLen - 10, leftY + 15);
      ctx.lineTo(-beamLen + 10, leftY + 15);
      ctx.closePath();
      const leftColor = level > 50
        ? `rgba(239,68,68,${0.1 + (level - 50) * 0.003})`
        : "rgba(217,160,45,0.08)";
      ctx.fillStyle = leftColor;
      ctx.fill();
      ctx.strokeStyle = level > 50 ? "rgba(239,68,68,0.15)" : "rgba(217,160,45,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Right pan (legal weight)
      const rightY = -Math.abs(beamLen) * Math.sin(tilt);
      ctx.beginPath();
      ctx.moveTo(beamLen, rightY);
      ctx.lineTo(beamLen - 10, rightY + 15);
      ctx.lineTo(beamLen + 10, rightY + 15);
      ctx.closePath();
      const rightColor = level < 50
        ? `rgba(96,165,250,${0.1 + (50 - level) * 0.003})`
        : "rgba(217,160,45,0.08)";
      ctx.fillStyle = rightColor;
      ctx.fill();
      ctx.strokeStyle = level < 50 ? "rgba(96,165,250,0.15)" : "rgba(217,160,45,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();

      // Labels
      ctx.fillStyle = "rgba(148,163,184,0.3)";
      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.fillText("FACTS", cx - 55, 145);
      ctx.fillText("LAW", cx + 55, 145);

      // Level percentage
      ctx.fillStyle = level > 70 ? "rgba(239,68,68,0.4)" : level > 40 ? "rgba(217,160,45,0.4)" : "rgba(52,211,153,0.4)";
      ctx.font = "7px monospace";
      ctx.fillText(`${level}%`, cx, 155);

      t += 0.01;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, level]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[120px] h-[100px]" />
    </div>
  );
}
