import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import {
  ArrowLeft, Send, Scale, Loader2, Sparkles, Plus, History, Trash2,
} from "lucide-react";
import RiskMeter from "../components/RiskMeter";
import ScrollUnfold from "../components/ScrollUnfold";
import ProcessingBrain from "../components/ProcessingBrain";
import CaseFileFolder from "../components/CaseFileFolder";
import DemoCourtroom from "../components/DemoCourtroom";
import AIJudgeAvatar from "../components/AIJudgeAvatar";
import InvestigationBoard from "../components/InvestigationBoard";
import RuleOcean from "../components/RuleOcean";
import IcebergView from "../components/IcebergView";
import DNAHelix from "../components/DNAHelix";
import DualReality from "../components/DualReality";
import BubbleDecision from "../components/BubbleDecision";
import VortexArguments from "../components/VortexArguments";
import CauseEffectChain from "../components/CauseEffectChain";
import WeightScale from "../components/WeightScale";
import CompassConsequences from "../components/CompassConsequences";
import PlanetSystem from "../components/PlanetSystem";
import ThreadWeaving from "../components/ThreadWeaving";
import TimelineCollapse from "../components/TimelineCollapse";
import LightShadowAnalysis from "../components/LightShadowAnalysis";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CaseStatus = "pending" | "processing" | "resolved" | "error";

interface CaseFile {
  id: string;
  title: string;
  status: CaseStatus;
  timestamp: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  userMessage: string;
  aiResponse: string;
}

const examples = [
  {
    label: "Landlord won't return deposit",
    text: "I moved out of my apartment two months ago. My landlord is refusing to return my $2,000 security deposit, claiming there were damages to the carpet. I have photos showing the carpet was in good condition when I moved out. This is in New York.",
  },
  {
    label: "Fired without warning",
    text: "My employer terminated me last week with no prior notice or warning. I have worked there for three years. They said it was due to performance issues, but I never received any negative feedback or performance improvement plans. This happened in California.",
  },
  {
    label: "Client refused to pay",
    text: "I completed a freelance web development project worth $5,000 under a written contract. The client accepted the work but has refused to pay for 60 days, claiming the quality is not what they expected. There was no quality clause in the contract. I am based in Texas, the client is in Delaware.",
  },
  {
    label: "Visa sponsorship question",
    text: "I am a US citizen married to a Canadian citizen. We have been married for one year and live together in Chicago. I want to sponsor her for a green card. She currently has a valid tourist visa. What is the process and timeline?",
  },
  {
    label: "Neighbor small claims suit",
    text: "My neighbor is taking me to small claims court for $8,000, claiming my tree fell on their fence during a storm. The tree was healthy before the storm, and there was a severe weather warning that day. This happened in Florida.",
  },
  {
    label: "Non-compete violation",
    text: "I signed a non-compete agreement with my previous employer that restricts me from working in my industry for two years within a 50-mile radius. My new job offer is in the same industry, 30 miles from my old office. I live in California.",
  },
];

function formatResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/^- /gm, "&bull; ")
    .trim();
}

const LAWS = [
  { icon: "\u2696", name: "Employment Law" },
  { icon: "\uD83C\uDFE2", name: "Housing Court" },
  { icon: "\uD83D\uDCCB", name: "Contract Law" },
  { icon: "\uD83C\uDF0D", name: "Immigration Hub" },
  { icon: "\uD83D\uDCB0", name: "Tax & Finance" },
  { icon: "\uD83D\uDEE1\uFE0F", name: "Civil Rights" },
];

export default function DemoPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBrain, setShowBrain] = useState(false);
  const [currentRiskText, setCurrentRiskText] = useState("");
  const [judgeExpression, setJudgeExpression] = useState<"neutral" | "listening" | "processing" | "concerned">("neutral");
  const [showScrollContent, setShowScrollContent] = useState(false);
  const [statusPhase, setStatusPhase] = useState<"idle" | "analyzing" | "done">("idle");
  const [showInvestigation, setShowInvestigation] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState<string[]>([]);
  const [visMode, setVisMode] = useState<string>("iceberg");
  const [chats, setChats] = useState<{ id: string; title: string; messages: Message[]; caseFiles: CaseFile[]; timestamp: string }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const runAnalysis = async (text: string) => {
    setInput("");
    setError("");
    setShowScrollContent(false);
    setIsLoading(true);
    setShowBrain(true);
    setCurrentRiskText(text);
    setJudgeExpression("listening");
    setStatusPhase("analyzing");

    const caseId = "c-" + Date.now();
    const userMsg: Message = { id: "u-" + Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);

    const newCase: CaseFile = {
      id: caseId,
      title: text.slice(0, 45) + (text.length > 45 ? "..." : ""),
      status: "processing",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      riskLevel: "moderate",
      userMessage: text,
      aiResponse: "",
    };
    setCaseFiles(prev => [newCase, ...prev]);
    setActiveCaseId(caseId);

    setStatusPhase("analyzing");
    setJudgeExpression("processing");

    try {
      const res = await fetch("/api/legal-counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to get analysis.");
        setMessages(prev => prev.filter(m => m.id !== userMsg.id));
        setCaseFiles(prev => prev.filter(c => c.id !== caseId));
        setJudgeExpression("concerned");
        setIsLoading(false);
        setShowBrain(false);
        return;
      }

      const assistantMsg: Message = { id: "a-" + Date.now(), role: "assistant", content: data.response };
      setMessages(prev => [...prev, assistantMsg]);

      setCaseFiles(prev => prev.map(c =>
        c.id === caseId ? { ...c, status: "resolved" as CaseStatus, aiResponse: data.response } : c
      ));

      setShowScrollContent(true);
      setJudgeExpression("neutral");
      setStatusPhase("done");

    } catch {
      setError("Network error. Please check your connection and try again.");
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      setCaseFiles(prev => prev.filter(c => c.id !== caseId));
      setJudgeExpression("concerned");
    } finally {
      setIsLoading(false);
      setShowBrain(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    runAnalysis(input.trim());
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      const chatId = "chat-" + Date.now();
      setChats(prev => [{
        id: chatId,
        title: messages.find(m => m.role === "user")?.content.slice(0, 50) || "New Chat",
        messages,
        caseFiles,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }, ...prev]);
    }
    setMessages([]);
    setCaseFiles([]);
    setActiveCaseId(null);
    setActiveChatId(null);
    setShowScrollContent(false);
    setCurrentRiskText("");
    setShowChatHistory(false);
    setStatusPhase("idle");
  };

  const switchChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    setMessages(chat.messages);
    setCaseFiles(chat.caseFiles);
    setActiveChatId(chatId);
    setActiveCaseId(null);
    setShowScrollContent(true);
    setCurrentRiskText(chat.messages.find(m => m.role === "user")?.content || "");
    setShowChatHistory(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setMessages([]);
      setCaseFiles([]);
      setActiveChatId(null);
      setActiveCaseId(null);
    }
  };

  const selectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const cf = caseFiles.find(c => c.id === caseId);
    if (!cf) return;
    setMessages([]);
    setShowScrollContent(false);
    setStatusPhase("idle");

    // Rebuild messages from case
    const userMsg: Message = { id: "u-" + caseId, role: "user", content: cf.userMessage };
    const msgs: Message[] = [userMsg];
    if (cf.aiResponse) {
      const aiMsg: Message = { id: "a-" + caseId, role: "assistant", content: cf.aiResponse };
      msgs.push(aiMsg);
      // Show response when selecting resolved case
      setTimeout(() => setShowScrollContent(true), 300);
    }
    setMessages(msgs);
    if (cf.aiResponse) setCurrentRiskText(cf.userMessage);
  };

  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
  const lastAiMessage = messages.filter(m => m.role === "assistant").pop()?.content || "";

  const renderVisualization = (mode: string, responseText: string, userText: string) => {
    const words = userText.split(" ");
    const keyFacts = words.slice(0, 3);
    const uncertain = words.slice(3, 6).length > 0 ? words.slice(3, 6) : ["jurisdiction unclear", "statute of limitations?"];
    const sentences = responseText.split(". ").filter(Boolean).slice(0, 6);
    const relevantAreas = ["EMPLOYMENT", "HOUSING", "CONTRACT", "IMMIGRATION"];

    switch (mode) {
      case "iceberg":
        return <IcebergView content={formatResponse(responseText)} visible={true} />;
      case "dna":
        return <DNAHelix active={true} facts={keyFacts} laws={["case law", "statutes", "precedent"]} outcome={sentences[0] || responseText.slice(0, 60)} />;
      case "vortex":
        return <VortexArguments active={true} />;
      case "dual":
        return <DualReality userText={userText} aiText={responseText} visible={true} />;
      case "bubble":
        return <BubbleDecision active={true} facts={sentences.slice(0, 5)} />;
      case "compass":
        return <CompassConsequences active={true} riskLevel={50 + Math.sin(Date.now() * 0.001) * 30} />;
      case "chain":
        return <CauseEffectChain active={true} steps={sentences.slice(0, 5)} />;
      case "scale":
        return <WeightScale active={true} level={55} />;
      case "planets":
        return <PlanetSystem active={true} relevantAreas={relevantAreas} />;
      case "threads":
        return <ThreadWeaving active={true} />;
      case "timeline":
        return <TimelineCollapse active={true} events={sentences.slice(0, 4)} />;
      case "shadow":
        return <LightShadowAnalysis active={true} facts={keyFacts} uncertain={uncertain} />;
      default:
        return <IcebergView content={formatResponse(responseText)} visible={true} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-hidden">
      <div className="noise-overlay" />
      <DemoCourtroom isProcessing={isLoading} hasResult={!!lastAiMessage && !isLoading} />

      {/* Ambient glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.04)" }}
      />
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="group flex items-center gap-2 text-[#94A3B8] hover:text-[#FAFAFA] transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em]">Back to Home</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button onClick={() => setShowChatHistory(prev => !prev)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#94A3B8]/10 bg-[#0F172A]/40 hover:bg-[#0F172A]/70 hover:border-[#94A3B8]/25 transition-all duration-200"
            >
              <History className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#94A3B8] hidden sm:block">History</span>
              {chats.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D9A02D] text-[#030303] flex items-center justify-center font-mono text-[8px] font-bold">
                  {chats.length}
                </span>
              )}
            </button>
            <button onClick={startNewChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D9A02D]/20 bg-[#D9A02D]/10 hover:bg-[#D9A02D]/20 hover:border-[#D9A02D]/40 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5 text-[#D9A02D]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#D9A02D] hidden sm:block">New Chat</span>
            </button>
            <AIJudgeAvatar expression={judgeExpression} analyzing={isLoading} />
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#FAFAFA]/80 hidden sm:block">LexCore AI</span>
            </Link>
          </div>
        </div>

        {/* ── CHAT HISTORY DROPDOWN ── */}
        {showChatHistory && (
          <div className="mb-4 glass-panel-deep rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#94A3B8]/8">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B]">Chat History</span>
              <span className="font-mono text-[8px] text-[#64748B]/60">{chats.length} conversations</span>
            </div>
            {chats.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <span className="font-mono text-[9px] text-[#64748B]/50">No previous chats</span>
              </div>
            ) : (
              <div className="divide-y divide-[#94A3B8]/5">
                {chats.map(chat => (
                  <div key={chat.id}
                    className={`flex items-center justify-between px-4 py-3 transition-all duration-200 cursor-pointer hover:bg-[#0F172A]/40 ${
                      activeChatId === chat.id ? "bg-[#0F172A]/50 border-l-2 border-l-[#D9A02D]" : ""
                    }`}
                    onClick={() => switchChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[12px] text-[#CBD5E1] truncate">{chat.title}</p>
                      <p className="font-mono text-[8px] text-[#64748B]/60 mt-0.5">
                        {chat.messages.length} messages · {chat.timestamp}
                      </p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="ml-2 p-1.5 rounded-lg text-[#64748B]/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INVESTIGATION BOARD ── */}
        <InvestigationBoard
          active={showInvestigation}
          items={puzzlePieces.length > 0 ? puzzlePieces : ["Case submitted for review", "Analyzing legal framework", "Cross-referencing precedents", "Evaluating jurisdiction", "Synthesizing final guidance", "Verdict ready for delivery"]}
          onClose={() => setShowInvestigation(false)}
        />

        {/* ── STATUS INDICATOR ── */}
        {isLoading && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D9A02D] animate-pulse shadow-[0_0_6px_rgba(217,160,45,0.5)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#94A3B8]">Analyzing your case...</span>
          </div>
        )}

        {/* ── MAIN CONTENT: Case Files Sidebar + Chat ── */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Case Files Sidebar */}
          {caseFiles.length > 0 && (
            <div className="hidden md:flex flex-col w-56 flex-shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#64748B]">Case Files</span>
                <span className="font-mono text-[8px] text-[#64748B]/60">{caseFiles.length}</span>
              </div>

              {/* Investigation Mode toggle */}
              <button
                onClick={() => setShowInvestigation(prev => !prev)}
                className={`mb-3 flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all duration-300 ${
                  showInvestigation
                    ? "border-[#D9A02D]/30 bg-[#D9A02D]/10 text-[#D9A02D]"
                    : "border-[#94A3B8]/10 bg-[#0F172A]/40 text-[#64748B] hover:border-[#94A3B8]/25"
                }`}
              >
                <span className="text-[11px]">\uD83D\uDD0D</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.12em]">
                  {showInvestigation ? "Board Active" : "Investigation"}
                </span>
              </button>
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {caseFiles.map(cf => (
                  <CaseFileFolder
                    key={cf.id}
                    title={cf.title}
                    status={cf.status}
                    timestamp={cf.timestamp}
                    riskLevel={cf.riskLevel}
                    isActive={cf.id === activeCaseId}
                    onClick={() => selectCase(cf.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── CHAT AREA ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="mb-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A02D]/20 bg-[#D9A02D]/5 mb-3">
                  <Sparkles className="w-3 h-3 text-[#D9A02D]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#D9A02D]">AI-Powered Legal Guidance</span>
                </div>
                <h2 className="font-display italic uppercase text-[#FAFAFA] text-3xl md:text-5xl leading-[0.95] mb-2">
                  AI Legal Counsel
                </h2>
                <p className="font-body text-[13px] text-[#94A3B8] max-w-2xl mx-auto">
                  Describe your legal situation in plain English. I'll analyze your case and deliver a verdict.
                </p>
              </div>
            </div>

            {/* ── Evidence Table (glass surface) ── */}
            <div className="relative glass-table rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] flex-1 flex flex-col">
              <RuleOcean active={!!lastAiMessage || isLoading} intensity={isLoading ? 0.8 : 0.4} />
              {/* Space station ambient ring */}
              {isLoading && (
                <div className="absolute top-[20%] left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-[#D9A02D]/15 to-transparent animate-station-pulse pointer-events-none z-10" />
              )}
              {/* Signal transmission line */}
              {statusPhase === "submitting" && (
                <div className="absolute top-0 left-0 w-full h-[2px] z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9A02D]/40 to-transparent animate-signal-travel" />
                </div>
              )}

              {/* Processing Brain overlay with Puzzle Assembly */}
              {showBrain && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#030303]/60 backdrop-blur-sm transition-opacity duration-500">
                  <div className="text-center">
                    <ProcessingBrain active={true} />
                    {/* Puzzle pieces assembling */}
                    <div className="mt-4 flex items-center justify-center gap-1.5">
                      {puzzlePieces.map((_, i) => (
                        <div
                          key={i}
                          className="animate-puzzle-slot w-5 h-5 rounded-sm border transition-all duration-500 flex items-center justify-center"
                          style={{
                            animationDelay: `${i * 0.3}s`,
                            borderColor: i < 3 ? "rgba(217,160,45,0.4)" : i === 3 ? "rgba(217,160,45,0.6)" : "rgba(100,71,120,0.3)",
                            backgroundColor: i < 3 ? "rgba(217,160,45,0.1)" : i === 3 ? "rgba(217,160,45,0.15)" : "transparent",
                            opacity: i <= 3 ? 1 : 0.3,
                          }}
                        >
                          <span className="text-[6px] text-[#D9A02D]/60">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      {puzzlePieces.map((step, i) => (
                        <div key={step} className="flex items-center justify-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            i < 2 ? "bg-[#D9A02D]" : i === 2 ? "bg-[#D9A02D] animate-pulse" : "bg-[#64748B]/30"
                          }`} />
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#94A3B8]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages area */}
              <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(148,163,184,0.2) transparent" }}
              >
                {messages.length === 0 && !isLoading && (
                  <>
                    {/* Legal compass navigation */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {["Rights", "Actions", "Risks", "Outcomes"].map((item) => (
                        <div key={item} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full border border-[#D9A02D]/10 bg-[#0F172A]/40 flex items-center justify-center group hover:border-[#D9A02D]/30 hover:bg-[#D9A02D]/5 transition-all duration-300 cursor-default">
                            <span className="text-[10px] text-[#D9A02D]/40 group-hover:text-[#D9A02D]/70 transition-colors">
                              {item === "Rights" ? "\u2696" : item === "Actions" ? "\uD83D\uDEE1\uFE0F" : item === "Risks" ? "\u26A0" : "\u2B50"}
                            </span>
                          </div>
                          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#64748B]/50">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Empty state */}
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D9A02D]/10 to-[#D9A02D]/5 border border-[#D9A02D]/15 flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-6 h-6 text-[#D9A02D]/60" />
                      </div>
                      <p className="font-body text-[14px] text-[#64748B] max-w-md mx-auto">
                        Type your situation above, or pick an example to begin.
                      </p>

                      {/* Law building blocks */}
                      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                        {LAWS.map((law, i) => (
                          <div
                            key={law.name}
                            className="animate-block-stack flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#94A3B8]/8 bg-[#0F172A]/30 hover:bg-[#0F172A]/60 hover:border-[#D9A02D]/20 transition-all duration-300 cursor-default"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <span className="text-[11px]">{law.icon}</span>
                            <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#94A3B8]">{law.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end mb-3">
                        <div className="max-w-[80%] bg-[#D9A02D]/10 border border-[#D9A02D]/20 rounded-xl px-4 py-2.5">
                          <p className="font-body text-[14px] text-[#FAFAFA]">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        {/* AI response with scroll effect */}
                        {msg.id === messages.filter(m => m.role === "assistant").pop()?.id && showScrollContent ? (
                          <div className="bg-[#0F172A]/30 border border-[#94A3B8]/8 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#D4A843] flex items-center justify-center">
                                <Scale className="w-3 h-3 text-[#030303]" />
                              </div>
                              <span className="font-body text-[12px] text-[#94A3B8] font-medium">AI Legal Counsel</span>
                              <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-emerald-400 ml-auto">Verdict Delivered</span>
                            </div>
                            <ScrollUnfold content={formatResponse(msg.content)} visible={true} />

                            {/* Visualization mode bar */}
                            <div className="mt-3 pt-3 border-t border-[#94A3B8]/6">
                              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                                {[
                                  { id: "iceberg", icon: "\uD83E\uDDCA", label: "Iceberg" },
                                  { id: "dna", icon: "\uD83E\uDDEC", label: "DNA" },
                                  { id: "vortex", icon: "\U0001F300", label: "Vortex" },
                                  { id: "dual", icon: "\uD83D\uDD0D", label: "Dual" },
                                  { id: "bubble", icon: "\uD83E\uDD2B", label: "Bubbles" },
                                  { id: "compass", icon: "\uD83E\uDDED", label: "Compass" },
                                  { id: "chain", icon: "\uD83D\uDD17", label: "Chain" },
                                  { id: "scale", icon: "\u2696", label: "Scale" },
                                  { id: "planets", icon: "\uD83D\uDF08", label: "Planets" },
                                  { id: "threads", icon: "\uD83E\uDDF5", label: "Weave" },
                                  { id: "timeline", icon: "\u23F0", label: "Timeline" },
                                  { id: "shadow", icon: "\uD83C\uDF19", label: "Shadow" },
                                ].map(mode => (
                                  <button
                                    key={mode.id}
                                    onClick={() => setVisMode(mode.id)}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all duration-200 flex-shrink-0 ${
                                      visMode === mode.id
                                        ? "border-[#D9A02D]/40 bg-[#D9A02D]/10 text-[#D9A02D]"
                                        : "border-[#94A3B8]/8 bg-[#0F172A]/30 text-[#64748B] hover:border-[#94A3B8]/20"
                                    }`}
                                  >
                                    <span className="text-[9px]">{mode.icon}</span>
                                    <span className="font-mono text-[7px] uppercase tracking-[0.1em]">{mode.label}</span>
                                  </button>
                                ))}
                              </div>

                              {/* Active visualization */}
                              <div className="bg-[#0F172A]/20 rounded-lg border border-[#94A3B8]/5 p-2 min-h-[80px]">
                                {renderVisualization(visMode, msg.content, currentRiskText || lastUserMessage)}
                              </div>
                            </div>
                          </div>
                        ) : msg.id !== messages.filter(m => m.role === "assistant").pop()?.id ? (
                          <div className="bg-[#0F172A]/30 border border-[#94A3B8]/8 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D9A02D] to-[#D4A843] flex items-center justify-center">
                                <Scale className="w-3 h-3 text-[#030303]" />
                              </div>
                              <span className="font-body text-[12px] text-[#94A3B8] font-medium">AI Legal Counsel</span>
                            </div>
                            <div className="font-body text-[14px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}

                {/* Case Printer animation */}
                {/* Loading message */}
                {isLoading && !showBrain && (
                  <div className="bg-[#0F172A]/30 border border-[#94A3B8]/8 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Loader2 className="w-4 h-4 text-[#D9A02D] animate-spin" />
                      <span className="font-body text-[13px] text-[#94A3B8]">Processing your case...</span>
                    </div>
                    <div className="space-y-2">
                      {["Reviewing the facts", "Checking relevant laws", "Evaluating precedents", "Synthesizing guidance"].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            i < 2 ? "bg-[#D9A02D]" : i === 2 ? "bg-[#D9A02D] animate-pulse" : "bg-[#64748B]/30"
                          }`} />
                          <span className={`font-body text-[11px] ${i <= 2 ? "text-[#94A3B8]" : "text-[#64748B]/50"}`}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">\u26A0</span>
                    <div>
                      <p className="font-body text-[13px] text-red-300 font-medium">Something went wrong</p>
                      <p className="font-body text-[12px] text-red-400/70 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RISK METER & INPUT ── */}
              <div className="border-t border-[#94A3B8]/8">
                {/* Risk Meter */}
                {(currentRiskText || isLoading) && (
                  <div className="px-4 pt-3">
                    <RiskMeter text={currentRiskText || lastUserMessage} analyzing={isLoading} />
                  </div>
                )}

                {/* Input */}
                <div className="p-4">
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
                      className="bg-[#D9A02D] hover:bg-[#D9A02D]/90 disabled:bg-[#D9A02D]/30 text-[#030303] p-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,160,45,0.2)] disabled:shadow-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── EXAMPLE CASES (shown when no messages) ── */}
        {messages.length === 0 && !isLoading && (
          <div className="mt-6 max-w-4xl mx-auto w-full">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#64748B] mb-3 text-center">Try an example case</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => runAnalysis(ex.text)}
                  disabled={isLoading}
                  className="px-3 py-2.5 rounded-lg border border-[#94A3B8]/10 bg-[#0F172A]/40 hover:bg-[#0F172A]/80 hover:border-[#94A3B8]/25 text-left transition-all duration-200 disabled:opacity-40 text-center"
                >
                  <span className="font-body text-[11px] text-[#94A3B8] leading-snug">{ex.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER BACK LINK ── */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#FAFAFA] font-mono text-[10px] uppercase tracking-[0.2em] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
