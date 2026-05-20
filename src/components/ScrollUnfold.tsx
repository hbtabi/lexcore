import { useEffect, useRef, useState } from "react";

export default function ScrollUnfold({ content, visible }: { content: string; visible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unfolded, setUnfolded] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setUnfolded(false);
      setDisplayText("");
      setCharIndex(0);
      return;
    }

    setUnfolded(true);
    setDisplayText("");
    setCharIndex(0);
  }, [visible, content]);

  useEffect(() => {
    if (!unfolded || charIndex >= content.length) return;
    const timer = setTimeout(() => {
      setDisplayText(content.slice(0, charIndex + 1));
      setCharIndex(prev => prev + 1);
    }, 15 + Math.random() * 10);
    return () => clearTimeout(timer);
  }, [unfolded, charIndex, content]);

  if (!visible && displayText === "") return null;

  return (
    <div className="relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6">
        <svg viewBox="0 0 32 24" className="w-full h-full" fill="none">
          <rect x="1" y="1" width="30" height="22" rx="2" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
          <line x1="8" y1="6" x2="24" y2="6" stroke="#D9A02D" strokeWidth="0.3" opacity="0.2" />
          <line x1="8" y1="10" x2="24" y2="10" stroke="#D9A02D" strokeWidth="0.3" opacity="0.2" />
          <line x1="8" y1="14" x2="24" y2="14" stroke="#D9A02D" strokeWidth="0.3" opacity="0.2" />
        </svg>
      </div>

      <div ref={containerRef} className="scroll-unfold-inner relative">
        <div className="absolute -left-1 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D9A02D]/15 to-transparent" />
        <div className="absolute -right-1 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D9A02D]/15 to-transparent" />

        <div
          className="relative scroll-unfold-text font-body text-[14px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap px-4 py-2"
          dangerouslySetInnerHTML={{
            __html: formatText(displayText),
          }}
        />

        {unfolded && charIndex < content.length && (
          <div className="flex items-center gap-1.5 px-4 pb-2">
            <span className="w-1.5 h-3 bg-[#D9A02D] animate-pulse rounded-sm" />
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#64748B]">
              Decoding...
            </span>
          </div>
        )}
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-6 rotate-180">
        <svg viewBox="0 0 32 24" className="w-full h-full" fill="none">
          <rect x="1" y="1" width="30" height="22" rx="2" stroke="#D9A02D" strokeWidth="0.5" opacity="0.3" />
          <line x1="8" y1="6" x2="24" y2="6" stroke="#D9A02D" strokeWidth="0.3" opacity="0.2" />
          <line x1="8" y1="10" x2="24" y2="10" stroke="#D9A02D" strokeWidth="0.3" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

function formatText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#FAFAFA]'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='text-[#D9A02D]'>$1</em>")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/^- /gm, "<span class='text-[#D9A02D] mr-2'>&#9656;</span> ")
    .trim();
}
