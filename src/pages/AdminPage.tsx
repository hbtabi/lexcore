import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Users, ChevronUp, ChevronDown, Loader2, AlertCircle } from "lucide-react";

interface WaitlistEntry {
  id: number;
  fullName: string;
  email: string;
  company: string | null;
  role: string | null;
  interest: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"createdAt" | "fullName" | "email">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/waitlist/view")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
        else setError("Unexpected response format");
      })
      .catch(() => setError("Failed to load waitlist data"))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = entries
    .filter((e) =>
      [e.fullName, e.email, e.company, e.role, e.interest].some(
        (v) => v && v.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="min-h-screen bg-[#030303] text-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[#94A3B8] hover:text-[#FAFAFA] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display italic text-3xl">Waitlist Admin</h1>
          </div>
          <div className="flex items-center gap-2 text-[#94A3B8] font-mono text-xs">
            <Users className="w-4 h-4" />
            {entries.length} total
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D9A02D] animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 py-20 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search by name, email, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg pl-10 pr-4 py-3 text-sm text-[#FAFAFA] placeholder-[#64748B] focus:outline-none focus:border-[#D9A02D]/30 transition-colors"
              />
            </div>

            <div className="bg-[#0F172A]/50 border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1E293B]">
                      {(["fullName", "email", "createdAt"] as const).map((field) => (
                        <th
                          key={field}
                          onClick={() => toggleSort(field)}
                          className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#64748B] cursor-pointer hover:text-[#94A3B8] transition-colors select-none"
                        >
                          <div className="flex items-center gap-1.5">
                            {field === "fullName" ? "Name" : field === "email" ? "Email" : "Date"}
                            {sortField === field && (
                              sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#64748B]">Company</th>
                      <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#64748B]">Role</th>
                      <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#64748B]">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry) => (
                      <tr key={entry.id} className="border-b border-[#1E293B]/50 hover:bg-[#1E293B]/30 transition-colors">
                        <td className="px-4 py-3 text-[#FAFAFA] font-medium">{entry.fullName}</td>
                        <td className="px-4 py-3 text-[#94A3B8]">{entry.email}</td>
                        <td className="px-4 py-3 text-[#64748B] font-mono text-[11px]">
                          {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-[#94A3B8]">{entry.company || "—"}</td>
                        <td className="px-4 py-3 text-[#94A3B8]">{entry.role || "—"}</td>
                        <td className="px-4 py-3 text-[#94A3B8] max-w-[200px] truncate">{entry.interest || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#64748B]">No matching entries found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
