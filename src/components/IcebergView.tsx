import { useState, useRef, useEffect } from "react";

export default function IcebergView({ content, visible }: { content: string; visible: boolean }) {
  const [revealed, setRevealed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (visible) {
      const total = content.length;
      let i = 0;
      const interval = setInterval(() => {
        i += 5;
        setRevealed(Math.min(i, total));
        if (i >= total) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    } else {
      setRevealed(0);
    }
  }, [visible, content]);

  const displayText = content.slice(0, Math.max(Math.floor(content.length * 0.25), revealed));
  const showDeeper = revealed > content.length * 0.25;

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (e.clientY - rect.top) / rect.height;
    setRevealed(Math.floor(content.length * Math.min(1, Math.max(0.25, pct))));
  };

  if (!visible && revealed === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      {/* Iceberg tip - visible portion */}
      <div className="bg-gradient-to-b from-[#0F172A]/40 to-[#0F172A]/20 rounded-t-xl border border-[#D9A02D]/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-[#D9A02D]/40 rounded-full" />
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#D9A02D]/60">Surface Level</span>
        </div>
        <div className="font-body text-[13px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatIceText(displayText) }}
        />
      </div>

      {/* Iceberg divider */}
      <div
        ref={dragRef}
        className="relative h-8 flex items-center justify-center cursor-row-resize border-x border-[#D9A02D]/10 bg-[#0F172A]/30 group"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A02D]/20 to-transparent" />
        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-70 transition-opacity">
          <div className="w-8 h-px bg-[#D9A02D]/40" />
          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#D9A02D]/60 whitespace-nowrap">
            {showDeeper ? "Drag up to hide depth" : "Drag down to reveal depth"}
          </span>
          <div className="w-8 h-px bg-[#D9A02D]/40" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D9A02D]/20 to-transparent" />
      </div>

      {/* Deeper layers */}
      {showDeeper && (
        <div className="bg-gradient-to-b from-[#0F172A]/20 to-[#0F172A]/40 rounded-b-xl border border-[#D9A02D]/10 border-t-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-[#3B82F6]/30 rounded-full" />
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#3B82F6]/50">Deep Analysis</span>
          </div>
          <div className="font-body text-[12px] text-[#94A3B8] leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: formatIceText(content.slice(Math.floor(content.length * 0.25), revealed)),
            }}
          />

          {/* Depth indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-[#0F172A]/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D9A02D]/40 to-[#3B82F6]/40 transition-all duration-300"
                style={{ width: `${(revealed / content.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[7px] text-[#64748B]/60">
              {Math.floor((revealed / content.length) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function formatIceText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#FAFAFA]'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='text-[#D9A02D]'>$1</em>")
    .trim();
}
