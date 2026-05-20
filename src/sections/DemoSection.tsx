import { useState, useRef, useEffect } from "react";
import {
  Send, AlertTriangle, Scale,
  Loader2, Sparkles, Building2, Briefcase,
  Globe, UserX, FileText,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const examples = [
  { icon: Building2, label: "My landlord won\u2019t return my deposit", text: "I moved out of my apartment two months ago. My landlord is refusing to return my $2,000 security deposit, claiming there were damages to the carpet. I have photos showing the carpet was in good condition when I moved out. This is in New York." },
  { icon: UserX, label: "I was fired without warning", text: "My employer terminated me last week with no prior notice or warning. I have worked there for three years. They said it was due to performance issues, but I never received any negative feedback or performance improvement plans. This happened in California." },
  { icon: FileText, label: "Client refused to pay invoice", text: "I completed a freelance web development project worth $5,000 under a written contract. The client accepted the work but has refused to pay for 60 days, claiming the quality is not what they expected. There was no quality clause in the contract. I am based in Texas, the client is in Delaware." },
  { icon: Globe, label: "Can I sponsor my spouse for a visa?", text: "I am a US citizen married to a Canadian citizen. We have been married for one year and live together in Chicago. I want to sponsor her for a green card. She currently has a valid tourist visa. What is the process and timeline?" },
  { icon: Scale, label: "Neighbor is suing me in small claims", text: "My neighbor is taking me to small claims court for $8,000, claiming my tree fell on their fence during a storm. The tree was healthy before the storm, and there was a severe weather warning that day. This happened in Florida." },
  { icon: Briefcase, label: "My employer violated my non-compete", text: "I signed a non-compete agreement with my previous employer that restricts me from working in my industry for two years within a 50-mile radius. My new job offer is in the same industry, 30 miles from my old office. I live in California." },
];

function formatResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/^- /gm, "&bull; ")
    .trim();
}

export default function DemoSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const runAnalysis = async (text: string) => {
    setInput("");
    setError("");

    const userMsg: Message = { id: "u-" + Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/legal-counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to get analysis.");
        setMessages(prev => prev.filter(m => m.id !== userMsg.id));
        return;
      }

      const assistantMsg: Message = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: data.response,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    runAnalysis(input.trim());
  };

  return (
    <section id="demo" className="relative w-full py-20 md:py-28 px-6 md:px-16 bg-gradient-section-2">
      <div className="noise-overlay" />

      <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.04)" }}
      />
      <div className="absolute bottom-[20%] right-[5%] w-[250px] h-[250px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A02D]/20 bg-[#D9A02D]/5 mb-5">
            <Sparkles className="w-3 h-3 text-[#D9A02D]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#D9A02D]">AI-Powered Legal Guidance</span>
          </div>
          <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-6xl leading-[0.95] mb-3">
            AI Legal Counsel
          </h2>
          <p className="font-body text-[15px] text-[#94A3B8] max-w-2xl mx-auto">
            Describe your legal situation in plain English. I'll explain your rights, what you can do, and what to watch out for.
          </p>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748B] mb-4 text-center">
              Try an example
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {examples.map((ex) => {
                const Icon = ex.icon;
                return (
                  <button
                    key={ex.label}
                    onClick={() => runAnalysis(ex.text)}
                    disabled={isLoading}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-[#94A3B8]/10 bg-[#0F172A]/40 hover:bg-[#0F172A]/80 hover:border-[#94A3B8]/25 text-left transition-all duration-200 disabled:opacity-40"
                  >
                    <Icon className="w-4 h-4 text-[#64748B] mt-0.5 flex-shrink-0" />
                    <span className="font-body text-[12px] text-[#94A3B8] leading-snug">
                      {ex.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#94A3B8]/10 bg-[#0A0A0B]/90 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#94A3B8]/8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D9A02D] to-[#D4A843] flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-[#030303]" />
              </div>
              <div>
                <span className="font-body text-[13px] text-[#FAFAFA] font-medium">AI Legal Counsel</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#64748B] ml-2">BETA</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={"w-1.5 h-1.5 rounded-full " + (isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#64748B]">
                {isLoading ? "Thinking..." : "Ready"}
              </span>
            </div>
          </div>

          <div ref={chatRef} className="max-h-[600px] overflow-y-auto p-5 space-y-5 scroll-smooth"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(148,163,184,0.2) transparent" }}
          >
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-[#0F172A]/60 border border-[#94A3B8]/10 flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-5 h-5 text-[#64748B]" />
                </div>
                <p className="font-body text-[14px] text-[#64748B] max-w-md mx-auto">
                  Type your situation above, or pick an example to get started.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === "user" ? (
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[80%] bg-[#D9A02D]/10 border border-[#D9A02D]/20 rounded-xl px-4 py-2.5">
                      <p className="font-body text-[14px] text-[#FAFAFA]">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0F172A]/30 border border-[#94A3B8]/8 rounded-xl p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#D4A843] flex items-center justify-center">
                        <Scale className="w-3 h-3 text-[#030303]" />
                      </div>
                      <span className="font-body text-[12px] text-[#94A3B8] font-medium">AI Legal Counsel</span>
                    </div>
                    <div
                      className="font-body text-[14px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap [&_strong]:text-[#FAFAFA] [&_em]:text-[#D9A02D] [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}
                    />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="bg-[#0F172A]/30 border border-[#94A3B8]/8 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-4 h-4 text-[#D9A02D] animate-spin" />
                  <span className="font-body text-[13px] text-[#94A3B8]">Analyzing your situation...</span>
                </div>
                <div className="space-y-2">
                  {["Reviewing the facts", "Checking relevant laws", "Considering your options", "Putting together guidance"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={"w-1.5 h-1.5 rounded-full " + (i < 2 ? "bg-[#D9A02D]" : i === 2 ? "bg-[#D9A02D] animate-pulse" : "bg-[#64748B]/30")} />
                      <span className={"font-body text-[11px] " + (i <= 2 ? "text-[#94A3B8]" : "text-[#64748B]/50")}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-[13px] text-red-300 font-medium">Something went wrong</p>
                  <p className="font-body text-[12px] text-red-400/70 mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#94A3B8]/8 p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your legal situation..."
                disabled={isLoading}
                className="flex-1 bg-[#0F172A]/60 border border-[#94A3B8]/15 rounded-xl px-5 py-3.5 text-[#FAFAFA] placeholder-[#64748B] font-body text-[14px] focus:outline-none focus:border-[#D9A02D]/40 focus:ring-1 focus:ring-[#D9A02D]/20 transition-all duration-300 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#D9A02D] hover:bg-[#D9A02D]/90 disabled:bg-[#D9A02D]/30 text-[#030303] p-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(184,134,11,0.2)] disabled:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
