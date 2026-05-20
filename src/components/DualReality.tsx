import { useState, useEffect, useCallback } from "react";

export default function DualReality({ userText, aiText, visible }: { userText: string; aiText: string; visible: boolean }) {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  useEffect(() => {
    if (!visible) { setLeftText(""); setRightText(""); return; }

    let li = 0, ri = 0;
    const interval = setInterval(() => {
      if (li < userText.length) {
        li += 2;
        setLeftText(userText.slice(0, li));
      }
      if (ri < aiText.length) {
        ri += 3;
        setRightText(aiText.slice(0, ri));
      }
      if (li >= userText.length && ri >= aiText.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [visible, userText, aiText]);

  if (!visible) return null;

  return (
    <div className="grid grid-cols-2 gap-3 min-h-[200px]">
      {/* Left: Raw user story */}
      <div className="rounded-xl border border-[#94A3B8]/10 bg-[#0F172A]/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#60A5FA]" />
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#60A5FA]/70">Your Story</span>
        </div>
        <p className="font-body text-[12px] text-[#94A3B8] leading-relaxed whitespace-pre-wrap">
          {leftText}
          {leftText.length < userText.length && <span className="w-1.5 h-3 bg-[#60A5FA] animate-pulse inline-block ml-0.5" />}
        </p>
      </div>

      {/* Right: Legal interpretation */}
      <div className="rounded-xl border border-[#D9A02D]/15 bg-[#0F172A]/40 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#D9A02D]/[0.02] blur-2xl rounded-full" />
        <div className="flex items-center gap-2 mb-3 relative">
          <div className="w-2 h-2 rounded-full bg-[#D9A02D]" />
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#D9A02D]/70">Legal Interpretation</span>
        </div>
        <p className="font-body text-[12px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap relative"
          dangerouslySetInnerHTML={{
            __html: rightText.replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#FAFAFA]'>$1</strong>"),
          }}
        />
        {rightText.length < aiText.length && (
          <span className="w-1.5 h-3 bg-[#D9A02D] animate-pulse inline-block ml-0.5" />
        )}
      </div>
    </div>
  );
}
