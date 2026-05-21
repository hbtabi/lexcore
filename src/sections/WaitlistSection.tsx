import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WaitlistSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(46);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger === "#waitlist" || t.trigger?.id === "waitlist") t.kill();
    });
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#waitlist-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: "#waitlist", start: "top 70%", toggleActions: "play none none reverse" },
        }
      );
    });
    return () => { try { ctx?.revert(); } catch {} };
  }, []);

  useEffect(() => {
    fetch("/api/trpc/waitlist.count")
      .then(r => r.json()).then(d => d?.result?.data?.json?.count && setCount(d.result.data.json.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trpc/waitlist.join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: { fullName: name.trim(), email: email.trim() },
          meta: { values: {} },
        }),
      });
      const data = await res.json();
      if (data?.result?.data?.json?.success) {
        setSubmitted(true);
        setCount(c => c + 1);
      } else {
        setError(data?.result?.data?.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="relative w-full py-32 px-8 md:px-16 bg-gradient-section-4">
      <div className="noise-overlay" />
      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }} />
      <div className="absolute bottom-[20%] right-[8%] w-[250px] h-[250px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: "rgba(100,120,200,0.03)" }} />

      <div id="waitlist-content" className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#D9A02D]/30" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#D9A02D]">
              JOIN THE WAITLIST
            </span>
            <div className="h-px w-8 bg-[#D9A02D]/30" />
          </div>
          <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-6xl mb-4">
            Justice, Logically
          </h2>
          <p className="font-body text-[15px] text-[#94A3B8] max-w-lg mx-auto">
            Be among the first to experience AI-powered legal intelligence.
            98% of legal needs go unmet — let's change that.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#94A3B8]">
              {count} people already joined
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-[#D9A02D] mx-auto mb-6" />
            <h3 className="font-display italic text-3xl text-[#FAFAFA] mb-3">Welcome to the Future</h3>
            <p className="font-body text-[15px] text-[#94A3B8]">You've been added to the waitlist. We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto glass-panel-deep rounded-2xl p-8">
            <p className="font-body text-[14px] text-[#94A3B8] mb-6 text-center">
              Join the waitlist to get early access.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-[#0F172A]/60 border border-[#94A3B8]/10 rounded-xl px-4 py-3 text-[#FAFAFA] text-sm placeholder-[#64748B] outline-none focus:border-[#D9A02D]/30 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-[#0F172A]/60 border border-[#94A3B8]/10 rounded-xl px-4 py-3 text-[#FAFAFA] text-sm placeholder-[#64748B] outline-none focus:border-[#D9A02D]/30 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-[10px] uppercase tracking-[0.22em] bg-[#D9A02D] text-[#030303] px-8 py-3.5 rounded-xl hover:bg-[#D9A02D]/90 transition-all disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </div>
            {error && (
              <div className="flex items-center justify-center gap-2 mt-4 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
