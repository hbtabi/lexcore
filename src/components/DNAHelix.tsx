import { useEffect, useRef } from "react";

export default function DNAHelix({ active, facts, laws, outcome }: {
  active: boolean;
  facts: string[];
  laws: string[];
  outcome: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    let t = 0;
    const strands = [
      ...facts.map(f => ({ text: f.slice(0, 30), type: "fact" as const })),
      ...laws.map(l => ({ text: l.slice(0, 30), type: "law" as const })),
      { text: outcome.slice(0, 40), type: "outcome" as const },
    ];

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const spacing = canvas.height / (strands.length + 1);

      strands.forEach((strand, i) => {
        const y = spacing * (i + 1);
        const amplitude = 40 + Math.sin(t * 0.5 + i * 0.8) * 10;
        const x1 = cx + Math.cos(t + i * 0.5) * amplitude;
        const x2 = cx + Math.cos(t + i * 0.5 + Math.PI) * amplitude;

        const color = strand.type === "fact" ? "#60A5FA" : strand.type === "law" ? "#D9A02D" : "#34D399";

        // Helix backbone
        ctx.beginPath();
        ctx.moveTo(x1, y - spacing * 0.4);
        ctx.lineTo(x1, y + spacing * 0.4);
        ctx.strokeStyle = `${color}20`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y - spacing * 0.4);
        ctx.lineTo(x2, y + spacing * 0.4);
        ctx.stroke();

        // Cross connection
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `${color}10`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Nodes
        [x1, x2].forEach((x, j) => {
          ctx.beginPath();
          ctx.arc(x, y, 3 + Math.sin(t + i + j) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `${color}${j === 0 ? "40" : "20"}`;
          ctx.fill();
          ctx.strokeStyle = `${color}60`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Label
          if (j === 0) {
            ctx.save();
            ctx.translate(x + 8, y);
            ctx.rotate(Math.sin(t * 0.3 + i) * 0.05);
            ctx.fillStyle = `${color}80`;
            ctx.font = "8px monospace";
            ctx.fillText(strand.text, 0, 3);
            ctx.restore();
          }
        });

        // Type indicator
        ctx.save();
        ctx.translate(cx, y - spacing * 0.45);
        ctx.fillStyle = `${color}40`;
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.fillText(strand.type.toUpperCase(), 0, 0);
        ctx.restore();
      });

      // Center axis
      ctx.beginPath();
      ctx.moveTo(cx, spacing);
      ctx.lineTo(cx, canvas.height - spacing);
      ctx.strokeStyle = "rgba(217,160,45,0.03)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      t += 0.02;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, facts, laws, outcome]);

  if (!active) return null;

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="w-[200px] h-[250px]" />
    </div>
  );
}
