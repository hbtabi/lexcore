import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { MessageSquare, Trash2, Send, ChevronLeft, PanelLeftClose, PanelLeft, Sparkles, Mic, MicOff, Paperclip, X, Copy, ThumbsUp, ThumbsDown, Bookmark, RefreshCw, Download, Settings, Sliders, Gauge, Star, Zap, Plus, Scale, Home } from "lucide-react";
import AIJudgeAvatar from "../components/AIJudgeAvatar";
import ScrollUnfold from "../components/ScrollUnfold";
import ProcessingBrain from "../components/ProcessingBrain";
import DNAHelix from "../components/DNAHelix";
import PlanetSystem from "../components/PlanetSystem";
import CasePrinter from "../components/CasePrinter";
import IcebergLawModel from "../components/IcebergLawModel";
import OpticalLens from "../components/OpticalLens";
import CompassConsequences from "../components/CompassConsequences";
import ThreadWeaving from "../components/ThreadWeaving";
import BubbleDecision from "../components/BubbleDecision";

declare global { interface Window { SpeechRecognition: any; webkitSpeechRecognition: any; } }

interface Message { role: "user" | "assistant"; content: string; id: string; }
interface Chat { id: string; messages: Message[]; createdAt: number; title: string; }

const CHATS_KEY = "lexcore-chats-v3";
function loadChats(): Chat[] { try { const r = localStorage.getItem(CHATS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveChats(chats: Chat[]) { try { localStorage.setItem(CHATS_KEY, JSON.stringify(chats)); } catch {} }
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function summarize(text: string) { return text.length > 50 ? text.slice(0, 50) + "..." : text; }
function msgId() { return "m" + genId(); }

const jurisdictions = ["California, USA", "New York, USA", "Texas, USA", "Florida, USA", "London, UK", "Ontario, Canada", "New South Wales, AU", "Berlin, Germany", "Paris, France", "Tokyo, Japan"];
const suggestions = ["My landlord won't return my security deposit", "I was in a car accident and the other driver was at fault", "My employer is refusing to pay overtime", "I need to review a contract before signing"];
const followUpPool = ["What evidence should I gather?", "What are my chances in court?", "How long does this process take?", "Should I hire a lawyer?", "What are my legal rights?", "What are the next steps?", "Can I file a claim?", "What similar cases exist?"];

function pickFollowUps() {
  const s = [...followUpPool];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s.slice(0, 3);
}

function assessRisk(text: string): "low" | "medium" | "high" {
  const h = ["eviction", "lawsuit", "criminal", "fired", "terminated", "custody", "fraud", "arrest"];
  const m = ["sue", "breach", "deposit", "unpaid", "landlord", "discrimination", "damage"];
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of h) if (lower.includes(w)) score += 3;
  for (const w of m) if (lower.includes(w)) score += 1.5;
  if (score >= 4) return "high";
  if (score >= 1.5) return "medium";
  return "low";
}

function RiskMeter({ level }: { level: string }) {
  const colors: Record<string, string> = { low: "#22C55E", medium: "#EAB308", high: "#EF4444" };
  const pct: Record<string, number> = { low: 20, medium: 55, high: 85 };
  const c = colors[level] || "#64748B";
  return (
    <div className="flex items-center gap-2">
      <Gauge className="w-3.5 h-3.5" style={{ color: c }} />
      <div className="w-16 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: (pct[level] || 0) + "%", backgroundColor: c, boxShadow: "0 0 8px " + c }} />
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: c }}>{level}</span>
    </div>
  );
}

export default function DemoPage() {
  const [chats, setChats] = useState<Chat[]>(() => loadChats());
  const [activeId, setActiveId] = useState<string | null>(() => chats[chats.length - 1]?.id ?? null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [unfoldingIndex, setUnfoldingIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIceberg, setShowIceberg] = useState(false);
  const [printerActive, setPrinterActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jurisdiction, setJurisdiction] = useState(jurisdictions[0]);
  const [temperature, setTemperature] = useState(0.4);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [showCmdPalette, setShowCmdPalette] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const active = chats.find(c => c.id === activeId);
  const activeMessages = active?.messages ?? [];
  const isProcessing = streaming;
  const hasResult = activeMessages.length > 0 && !isProcessing;
  const judgeExp = isProcessing ? "processing" : hasResult ? "delivering" : activeMessages.length > 0 ? "listening" : "neutral";
  const lastAssistantIdx = activeMessages.map((m, i) => m.role === "assistant" ? i : -1).filter(i => i >= 0).pop();
  const currentRisk = activeMessages.length > 0 ? assessRisk(activeMessages.map(m => m.content).join(" ")) : "low";

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCmdPalette(p => !p); }
      if ((e.metaKey || e.ctrlKey) && e.key === "f") { e.preventDefault(); setShowSearch(p => !p); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeMessages, streaming]);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(c => c.title.toLowerCase().includes(q) || c.messages.some(m => m.content.toLowerCase().includes(q)));
  }, [chats, searchQuery]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || streaming) return;
    setInput("");
    setError("");
    setShowIceberg(false);
    setFollowUpSuggestions([]);
    let targetChatId = activeId;
    if (!targetChatId) {
      targetChatId = genId();
      const nc: Chat = { id: targetChatId, messages: [], createdAt: Date.now(), title: summarize(msg) };
      setChats(prev => { const n = [...prev, nc]; saveChats(n); return n; });
      setActiveId(targetChatId);
    }
    const mu: Message = { role: "user", content: msg, id: msgId() };
    setChats(prev => { const n = prev.map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, mu] } : c); saveChats(n); return n; });
    setStreaming(true);
    setPrinterActive(true);
    const aiIdx = activeMessages.length + 1;
    try {
      const res = await fetch("/api/legal-counsel", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (data.success) {
        const ma: Message = { role: "assistant", content: data.response, id: msgId() };
        setChats(prev => { const n = prev.map(c => c.id === targetChatId ? { ...c, messages: [...c.messages, ma], title: c.title || summarize(msg) } : c); saveChats(n); return n; });
        setUnfoldingIndex(aiIdx);
        setFollowUpSuggestions(pickFollowUps());
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch { setError("Network error. Please try again."); }
    setStreaming(false);
    setPrinterActive(false);
  }, [input, streaming, activeId, activeMessages.length]);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Voice input not supported. Use Chrome."); return; }
    const r = new SR(); r.lang = "en-US"; r.interimResults = false;
    r.onresult = (e: any) => { setInput(prev => prev + e.results[e.results.length - 1][0].transcript); };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    try { r.start(); setListening(true); } catch { setListening(false); }
  };
  const stopListening = () => { try { recognitionRef.current?.stop(); } catch {} setListening(false); };

  const copyMsg = (text: string) => navigator.clipboard.writeText(text);
  const toggleBookmark = (id: string) => setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const exportChat = () => {
    if (!active) return;
    const txt = active.messages.map(m => m.role.toUpperCase() + ": " + m.content).join("\n\n---\n\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (active.title || "chat") + ".txt"; a.click();
  };

  const newChat = () => { setActiveId(null); setInput(""); setError(""); setUnfoldingIndex(null); setShowIceberg(false); setFollowUpSuggestions([]); setFiles([]); inputRef.current?.focus(); };
  const deleteChat = (id: string) => { setChats(prev => { const n = prev.filter(c => c.id !== id); saveChats(n); return n; }); setActiveId(prev => prev === id ? null : prev); setUnfoldingIndex(null); };
  const selectChat = (id: string) => { setActiveId(id); setUnfoldingIndex(null); setShowIceberg(false); setFollowUpSuggestions([]); if (window.innerWidth < 768) setSidebarOpen(false); };
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B11] via-[#0A0F18] to-[#070B11] flex relative overflow-hidden selection:bg-[#D9A02D]/20 selection:text-[#FAFAFA]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070B11] via-[#0C1421] to-[#070B11]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#D9A02D]/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/[0.01] rounded-full blur-[100px]" />
      </div>

      {/* Cmd palette */}
      {showCmdPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setShowCmdPalette(false)}>
          <div className="bg-[#0C1421]/95 backdrop-blur-2xl border border-[#1E293B]/60 rounded-xl p-4 w-full max-w-md shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-[#1E293B]/40 pb-3 mb-3">
              <Zap className="w-4 h-4 text-[#D9A02D]" />
              <input ref={searchInputRef} autoFocus placeholder="Type a command..." className="flex-1 bg-transparent text-sm text-[#FAFAFA] placeholder-[#64748B] outline-none font-body" />
              <span className="font-mono text-[9px] text-[#64748B] bg-[#1E293B]/40 px-2 py-0.5 rounded">ESC</span>
            </div>
            {[
              { label: "New Chat", icon: Plus, action: newChat },
              { label: "Toggle Sidebar", icon: PanelLeft, action: () => setSidebarOpen(!sidebarOpen) },
              { label: "Search Chats", icon: MessageSquare, action: () => setShowSearch(true) },
              { label: "Export Chat", icon: Download, action: exportChat },
              { label: "Settings", icon: Settings, action: () => setSettingsOpen(true) },
            ].map((cmd, i) => (
              <button key={i} onClick={() => { cmd.action(); setShowCmdPalette(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#D9A02D]/10 text-[#94A3B8] hover:text-[#FAFAFA] transition-all text-left animate-fade-in font-body text-[13px]"
                style={{ animationDelay: (i * 0.05) + "s" }}
              ><cmd.icon className="w-4 h-4 text-[#D9A02D]/60" /><span className="flex-1">{cmd.label}</span></button>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSettingsOpen(false)}>
          <div className="w-80 bg-[#0C1421]/95 backdrop-blur-2xl border-l border-[#1E293B]/60 h-full overflow-y-auto p-6 animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-[#D9A02D]" /><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FAFAFA]">Settings</span></div>
              <button onClick={() => setSettingsOpen(false)} className="text-[#64748B] hover:text-[#FAFAFA] transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#64748B] block mb-2">Jurisdiction</label>
                <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
                  className="w-full bg-[#070B11] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-[#FAFAFA] font-body cursor-pointer focus:border-[#D9A02D]/30 focus:outline-none transition-colors"
                >{jurisdictions.map(j => <option key={j} className="bg-[#070B11]">{j}</option>)}</select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#64748B] block mb-2">Temperature: {temperature.toFixed(1)}</label>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} className="w-full accent-[#D9A02D]" />
                <div className="flex justify-between font-mono text-[8px] text-[#64748B] mt-1"><span>Precise</span><span>Creative</span></div>
              </div>
              <div className="pt-4 border-t border-[#1E293B]/30 space-y-2">
                <div className="flex justify-between text-[13px] font-body"><span className="text-[#94A3B8]">Model</span><span className="text-[#FAFAFA]">Llama 3.1 8B</span></div>
                <div className="flex justify-between text-[13px] font-body"><span className="text-[#94A3B8]">Version</span><span className="text-[#FAFAFA]">LexCore v2.4</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={"fixed md:relative z-20 h-full bg-[#0C1421]/90 backdrop-blur-2xl border-r border-[#1E293B]/30 transition-all duration-300 flex flex-col " + (sidebarOpen ? "w-[280px]" : "w-0 md:w-0 overflow-hidden")}>
        <div className="flex items-center gap-2 px-4 pt-5 pb-3 border-b border-[#1E293B]/20">
          <Scale className="w-4 h-4 text-[#D9A02D]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FAFAFA]">LexCore</span>
        </div>
        <div className="flex-shrink-0 p-3 space-y-2">
          <button onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-[#D9A02D] text-[#070B11] font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2.5 rounded-lg transition-all duration-300 hover:bg-[#D9A02D]/90 active:scale-[0.98]"
          ><Sparkles className="w-3.5 h-3.5" /> New Chat</button>
          <div className="flex gap-1">
            <button onClick={() => setShowSearch(!showSearch)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-[#1E293B]/40 text-[#64748B] hover:text-[#FAFAFA] hover:border-[#D9A02D]/20 transition-all font-mono text-[9px] uppercase tracking-wider"
            ><MessageSquare className="w-3.5 h-3.5" /> Search</button>
            <button onClick={exportChat} disabled={!active}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-[#1E293B]/40 text-[#64748B] hover:text-[#FAFAFA] hover:border-[#D9A02D]/20 transition-all font-mono text-[9px] uppercase tracking-wider disabled:opacity-30"
            ><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
          {showSearch && (
            <div className="relative animate-fade-in">
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="w-full bg-[#070B11] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#FAFAFA] placeholder-[#64748B] font-body outline-none focus:border-[#D9A02D]/20 transition-colors" />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#FAFAFA]"><X className="w-3 h-3" /></button>}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin">
          {filteredChats.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-body text-[12px] text-[#64748B]">No conversations yet</p>
            </div>
          ) : (
            [...filteredChats].reverse().map((chat, idx) => (
              <button key={chat.id} onClick={() => selectChat(chat.id)}
                className={"w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group animate-fade-in " + (chat.id === activeId ? "bg-[#D9A02D]/8 border border-[#D9A02D]/12" : "hover:bg-[#1E293B]/30 border border-transparent")}
                style={{ animationDelay: (idx * 0.02) + "s" }}
              >
                <MessageSquare className={"w-3.5 h-3.5 flex-shrink-0 " + (chat.id === activeId ? "text-[#D9A02D]" : "text-[#475569]")} />
                <div className="flex-1 min-w-0">
                  <span className="block font-body text-[13px] text-[#94A3B8] truncate">{chat.title || "New conversation"}</span>
                  <span className="font-mono text-[9px] text-[#475569]">{chat.messages.length} messages</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 text-[#475569] hover:text-red-400 transition-all p-1"><Trash2 className="w-3 h-3" /></button>
              </button>
            ))
          )}
        </div>
        <div className="flex-shrink-0 p-3 border-t border-[#1E293B]/20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] hover:text-[#FAFAFA] transition-colors"><Home className="w-3.5 h-3.5" />Home</Link>
            <button onClick={() => setSettingsOpen(true)} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#FAFAFA] hover:bg-[#1E293B]/30 transition-all"><Sliders className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 z-30 bg-[#0C1421]/80 backdrop-blur border border-[#1E293B]/40 rounded-lg p-2 text-[#64748B] hover:text-[#FAFAFA] transition-all hover:border-[#D9A02D]/20"
        style={{ left: sidebarOpen ? "288px" : "12px" }}
      >{sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}</button>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-[#1E293B]/20 bg-[#070B11]/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative"><AIJudgeAvatar expression={judgeExp} analyzing={isProcessing} />
              <div className={"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#070B11] " + (isProcessing ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
            </div>
            <div>
              <div className="flex items-center gap-2"><span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#D9A02D]">LexCore AI</span></div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[9px] text-[#64748B]">Llama 3.1 8B</span>
                {activeMessages.length > 0 && <><span className="text-[#1E293B]">/</span><span className="font-mono text-[9px] text-[#64748B]">{activeMessages.length} msgs</span></>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiskMeter level={currentRisk} />
            <button onClick={() => setShowCmdPalette(true)} className="hidden md:flex items-center gap-1 font-mono text-[9px] text-[#64748B] px-2.5 py-1.5 border border-[#1E293B]/40 rounded-lg hover:border-[#D9A02D]/20 transition-all"><Zap className="w-3.5 h-3.5" /><span>&#8984;K</span></button>
            <button onClick={newChat} className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#94A3B8] hover:text-[#FAFAFA] px-3 py-1.5 border border-[#1E293B] rounded-lg transition-all hover:border-[#D9A02D]/20">+ New</button>
          </div>
        </div>

        {!activeId || activeMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto py-8">
            <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9A02D]/10 to-[#D9A02D]/5 border border-[#D9A02D]/15 flex items-center justify-center mx-auto mb-5">
                <Scale className="w-7 h-7 text-[#D9A02D]/60" />
              </div>
              <h2 className="font-display italic text-4xl text-[#FAFAFA] mb-3">Legal Counsel</h2>
              <p className="font-body text-[15px] text-[#94A3B8] max-w-md mx-auto">Describe your legal situation in plain English.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-left px-4 py-3 rounded-xl border border-[#1E293B] bg-[#0A0F18]/60 text-[13px] text-[#94A3B8] hover:text-[#FAFAFA] hover:border-[#D9A02D]/20 hover:bg-[#0A0F18] transition-all duration-200 group"
                ><span className="text-[#D9A02D] mr-2 group-hover:mr-3 transition-all">&rarr;</span>{s}</button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {[
                { comp: <IcebergLawModel visible={true} />, label: "Iceberg" },
                { comp: <div className="w-10 h-10"><DNAHelix active={false} facts={[]} laws={[]} outcome="" /></div>, label: "DNA" },
                { comp: <div className="w-10 h-10 opacity-50"><PlanetSystem active={true} /></div>, label: "Planets" },
                { comp: <div className="w-10 h-10"><CasePrinter active={true} /></div>, label: "Print" },
                { comp: <div className="w-10 h-10"><OpticalLens active={true} /></div>, label: "Lens" },
                { comp: <div className="w-10 h-10"><CompassConsequences active={false} riskLevel={0} /></div>, label: "Compass" },
                { comp: <div className="w-10 h-10"><ThreadWeaving active={false} /></div>, label: "Thread" },
                { comp: <div className="w-10 h-10"><BubbleDecision active={false} facts={[]} /></div>, label: "Bubble" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0A0F18]/30 border border-[#1E293B]/15 hover:border-[#D9A02D]/10 transition-all duration-500 animate-fade-in" style={{ animationDelay: (i * 0.08 + 0.3) + "s" }}>
                  <div className="w-10 h-10">{item.comp}</div>
                  <span className="font-mono text-[8px] text-[#64748B] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 max-w-3xl mx-auto w-full scrollbar-thin">
            {/* Processing indicators */}
            {isProcessing && (
              <div className="mb-5 bg-[#0A0F18]/50 border border-[#1E293B]/30 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-center gap-5 flex-wrap">
                  <div className="w-12 h-12 floating"><ProcessingBrain active={true} /></div>
                  <div className="w-12 h-12 floating" style={{ animationDelay: "0.3s" }}><ThreadWeaving active={true} /></div>
                  <div className="w-12 h-12 floating" style={{ animationDelay: "0.6s" }}><CompassConsequences active={true} riskLevel={3} /></div>
                  <div className="w-12 h-12 floating" style={{ animationDelay: "0.9s" }}><BubbleDecision active={true} facts={[]} /></div>
                </div>
                {printerActive && <div className="mt-3 animate-slide-up"><CasePrinter active={true} /></div>}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D9A02D]/40 animate-bounce" style={{ animationDelay: (i * 0.15) + "s" }} />)}</div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D9A02D]/40 ml-2">Analyzing your case</span>
                </div>
              </div>
            )}

            {/* Deep reasoning toggle */}
            {lastAssistantIdx !== undefined && !isProcessing && (
              <button onClick={() => setShowIceberg(!showIceberg)}
                className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#64748B] hover:text-[#D9A02D]/60 transition-colors mx-auto animate-fade-in"
              >{showIceberg ? "Hide" : "Show"} Deep Reasoning <div className={"w-5 h-5 transition-transform duration-500 " + (showIceberg ? "rotate-180" : "")}><IcebergLawModel visible={showIceberg} /></div></button>
            )}

            {/* Messages */}
            {activeMessages.map((msg, i) => (
              <div key={msg.id} className={"mb-5 animate-slide-up group/message"} style={{ animationDelay: (i * 0.04) + "s" }}>
                {msg.role === "user" && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-[#0A0F18] border border-[#1E293B] rounded-xl px-4 py-3 max-w-[80%]">
                      <p className="font-body text-[14px] text-[#F1F5F9] leading-relaxed">{msg.content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#1E293B] flex items-center justify-center flex-shrink-0 mt-1"><span className="text-[11px] font-mono text-[#64748B]">U</span></div>
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A02D]/20 to-[#D9A02D]/5 border border-[#D9A02D]/20 flex items-center justify-center flex-shrink-0 mt-1"><span className="text-[9px] font-mono text-[#D9A02D]">AI</span></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#D9A02D]/60">Verdict</span>
                        {i === unfoldingIndex ? <span className="font-mono text-[9px] text-[#64748B] animate-pulse">Unfolding...</span> : <span className="font-mono text-[9px] text-[#475569]">&#9679; Delivered</span>}
                        <div className="ml-auto"><RiskMeter level={assessRisk(msg.content)} /></div>
                      </div>
                      {i === unfoldingIndex ? <ScrollUnfold content={msg.content} visible={true} /> : (
                        <div className="pl-4 border-l-2 border-[#D9A02D]/20">
                          <p className="font-body text-[14px] text-[#CBD5E1] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover/message:opacity-100 transition-all pl-4">
                        <button onClick={() => copyMsg(msg.content)} className="p-1.5 rounded-md text-[#475569] hover:text-[#FAFAFA] hover:bg-[#1E293B]/40 transition-all"><Copy className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md text-[#475569] hover:text-green-400 hover:bg-[#1E293B]/40 transition-all"><ThumbsUp className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md text-[#475569] hover:text-red-400 hover:bg-[#1E293B]/40 transition-all"><ThumbsDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggleBookmark(msg.id)} className={"p-1.5 rounded-md hover:bg-[#1E293B]/40 transition-all " + (bookmarked.has(msg.id) ? "text-[#D9A02D]" : "text-[#475569] hover:text-[#FAFAFA]")}><Bookmark className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md text-[#475569] hover:text-[#D9A02D] hover:bg-[#1E293B]/40 transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>
                      </div>
                      {showIceberg && i === lastAssistantIdx && <div className="mt-3 pl-4 animate-slide-up"><IcebergLawModel visible={true} /></div>}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Follow-up suggestions */}
            {followUpSuggestions.length > 0 && !isProcessing && (
              <div className="mb-5 pl-11 animate-fade-in">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] block mb-2">Suggested follow-ups</span>
                <div className="flex flex-wrap gap-2">
                  {followUpSuggestions.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      className="font-body text-[12px] text-[#94A3B8] px-3 py-1.5 rounded-lg border border-[#1E293B] hover:border-[#D9A02D]/20 hover:text-[#FAFAFA] hover:bg-[#D9A02D]/5 transition-all animate-fade-in"
                      style={{ animationDelay: (i * 0.1) + "s" }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Error bar */}
        {error && <div className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 text-red-400 text-sm bg-red-500/5 border-t border-red-500/10 animate-slide-up"><span>{error}</span><button onClick={() => setError("")} className="text-red-400/60 hover:text-red-400 ml-1">&times;</button></div>}

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-[#1E293B]/20 px-4 md:px-6 py-3 bg-[#070B11]/80 backdrop-blur-xl">
          {files.length > 0 && (
            <div className="max-w-3xl mx-auto flex gap-2 mb-3 animate-fade-in">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A0F18] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
                  <Paperclip className="w-3 h-3 text-[#D9A02D]" /><span className="truncate max-w-[100px]">{f.name}</span>
                  <button onClick={() => removeFile(i)} className="text-[#475569] hover:text-red-400 ml-1"><X className="w-2.5 h-2.5" /></button>
                </div>
              ))}
            </div>
          )}
          <div className="max-w-3xl mx-auto flex gap-2" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files).slice(0, 3).map(f => ({ name: f.name, size: f.size }))]); }}>
            <div className="flex-1 flex items-center gap-2 bg-[#0A0F18] border border-[#1E293B] rounded-xl px-4 focus-within:border-[#D9A02D]/20 transition-all duration-300">
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Describe your legal situation..."
                rows={1} className="flex-1 bg-transparent py-3 text-sm text-[#F1F5F9] placeholder-[#64748B] resize-none outline-none font-body"
              />
              <input ref={fileInputRef} type="file" multiple hidden onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files || []).slice(0, 3).map(f => ({ name: f.name, size: f.size }))])} />
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#475569] hover:text-[#D9A02D] transition-colors"><Paperclip className="w-4 h-4" /></button>
              <button onMouseDown={listening ? stopListening : startListening}
                className={"p-1.5 rounded-lg transition-all duration-300 " + (listening ? "text-red-400 bg-red-500/10 animate-pulse" : "text-[#475569] hover:text-[#D9A02D]")}
              >{listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
            </div>
            <button onClick={() => sendMessage()} disabled={!input.trim() || streaming}
              className="bg-[#D9A02D] hover:bg-[#D9A02D]/90 disabled:bg-[#1E293B] text-[#070B11] disabled:text-[#475569] px-5 py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,160,45,0.15)] active:scale-95 disabled:shadow-none disabled:active:scale-100"
            ><Send className="w-4 h-4" /></button>
          </div>
          <div className="max-w-3xl mx-auto flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#475569] uppercase tracking-wider">Premium</span>
              <span className="font-mono text-[9px] text-[#475569]">{jurisdiction.split(",")[0]}</span>
            </div>
            <span className="font-mono text-[9px] text-[#475569]">LexCore AI &middot; Not legal advice</span>
          </div>
        </div>
      </div>
    </div>
  );
}
