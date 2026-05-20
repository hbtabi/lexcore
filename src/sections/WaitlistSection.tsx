import { useState, useEffect, useRef } from "react";
import { trpc } from "@/providers/trpc";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, User, Building2, Briefcase, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WaitlistSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    interest: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const countQuery = trpc.waitlist.count.useQuery();
  const joinMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        setError("");
        countQuery.refetch();
      } else {
        setError(data.message);
      }
    },
    onError: (err) => {
      setError(err.message || "Something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#waitlist-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#waitlist",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    joinMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company || undefined,
      role: formData.role || undefined,
      interest: formData.interest || undefined,
    });
  };

  const inputClasses =
    "w-full bg-[#1E293B]/60 border border-[#94A3B8]/15 rounded-xl px-4 py-3.5 pl-11 text-[#FAFAFA] placeholder-[#94A3B8]/50 font-body text-sm focus:outline-none focus:border-[#D9A02D]/50 focus:ring-1 focus:ring-[#D9A02D]/20 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]";

  return (
    <section
      id="waitlist"
      ref={sectionRef}
      className="relative w-full py-32 px-8 md:px-16 bg-gradient-section-4"
    >
      <div className="noise-overlay" />

      <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(217,160,45,0.03)" }}
      />
      <div className="absolute bottom-[20%] right-[8%] w-[250px] h-[250px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: "rgba(100,120,200,0.03)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,160,45,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(217,160,45,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        id="waitlist-content"
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* Header */}
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

          {/* Count */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#94A3B8]">
              {countQuery.data?.count ?? 46} people already joined
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent via-[#D9A02D]/40 to-[#D9A02D]/40" />
          </div>
        </div>

        {submitted ? (
          /* Success state */
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-[#D9A02D] mx-auto mb-6" />
            <h3 className="font-display italic text-3xl text-[#FAFAFA] mb-3">
              Welcome to the Future
            </h3>
            <p className="font-body text-[15px] text-[#94A3B8]">
              You've been added to the waitlist. We'll be in touch soon.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/50" />
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/50" />
              <input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/50" />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/50" />
                <input
                  type="text"
                  placeholder="Role (optional)"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[#94A3B8]/50" />
              <textarea
                placeholder="What are you interested in? (optional)"
                value={formData.interest}
                onChange={(e) =>
                  setFormData({ ...formData, interest: e.target.value })
                }
                rows={3}
                className={`${inputClasses} py-3 resize-none`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={joinMutation.isPending}
              className="w-full bg-[#D9A02D] hover:bg-[#D9A02D]/90 text-[#030303] font-mono text-[13px] uppercase tracking-[0.15em] py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,160,45,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {joinMutation.isPending ? "JOINING..." : "JOIN THE WAITLIST"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
