import { useState } from "react";
import { FileText, FolderClosed, FolderOpen, Clock, AlertTriangle } from "lucide-react";

interface CaseFileProps {
  title: string;
  status: "pending" | "processing" | "resolved" | "error";
  timestamp: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  onClick?: () => void;
  isActive?: boolean;
}

const riskColors = {
  low: "border-emerald-500/20 bg-emerald-500/5",
  moderate: "border-amber-500/20 bg-amber-500/5",
  high: "border-orange-500/20 bg-orange-500/5",
  critical: "border-red-500/20 bg-red-500/10",
};

const riskDotColors = {
  low: "bg-emerald-400",
  moderate: "bg-amber-400",
  high: "bg-orange-400",
  critical: "bg-red-400",
};

const statusIcons = {
  pending: Clock,
  processing: FileText,
  resolved: FolderOpen,
  error: AlertTriangle,
};

export default function CaseFileFolder({ title, status, timestamp, riskLevel, onClick, isActive }: CaseFileProps) {
  const [hovered, setHovered] = useState(false);
  const StatusIcon = statusIcons[status];
  const isOpen = isActive || hovered;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative w-full text-left transition-all duration-300 rounded-xl border overflow-hidden ${
        riskColors[riskLevel]
      } ${isActive ? "ring-1 ring-[#D9A02D]/30 shadow-[0_0_20px_rgba(217,160,45,0.06)]" : "shadow-none"} ${
        hovered ? "translate-y-[-2px]" : ""
      }`}
    >
      <div className="relative p-3.5 flex items-start gap-3">
        {/* Folder icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className={`relative w-8 h-8 rounded-lg border transition-all duration-300 flex items-center justify-center ${
            isOpen
              ? "border-[#D9A02D]/30 bg-[#D9A02D]/10"
              : "border-[#94A3B8]/10 bg-[#0F172A]/40"
          }`}>
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-[#D9A02D]" />
            ) : (
              <FolderClosed className="w-4 h-4 text-[#64748B]" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-body text-[12px] text-[#FAFAFA] truncate">{title}</span>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${riskDotColors[riskLevel]}`} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <StatusIcon className="w-3 h-3 text-[#64748B]" />
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#64748B]">
                {status}
              </span>
            </div>
            <span className="font-mono text-[8px] text-[#64748B]/60">{timestamp}</span>
          </div>
        </div>

        {/* Corner decoration */}
        <div className={`absolute top-0 right-0 w-8 h-8 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}>
          <div className="absolute top-2 right-2 w-3 h-px bg-gradient-to-r from-transparent to-[#D9A02D]/40" />
          <div className="absolute top-2 right-2 w-px h-3 bg-gradient-to-b from-transparent to-[#D9A02D]/40" />
        </div>

        {/* Tab detail */}
        <div className={`absolute -top-[1px] left-4 right-8 h-[2px] rounded-t transition-all duration-300 ${
          isOpen ? "bg-[#D9A02D]/30" : "bg-transparent"
        }`} />
      </div>
    </button>
  );
}
