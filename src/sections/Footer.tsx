import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNav = (item: { label: string; target: string }) => {
    if (item.target === "demo") {
      navigate("/demo");
    } else {
      scrollToSection(item.target);
    }
  };

  return (
    <footer
      className="relative w-full pt-24 pb-10 px-6 md:px-16"
      style={{ background: "#030303" }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D9A02D]/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <h2 className="font-display italic uppercase text-[#FAFAFA] text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
              JUSTICE,
              <br />
              LOGICALLY.
            </h2>
            <p className="font-body text-[14px] text-[#64748B] mt-4 max-w-md">
              AI-powered legal intelligence for the 98% of legal needs that go unmet.
            </p>
          </div>
          <button
            onClick={() => scrollToSection("waitlist")}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] bg-[#D9A02D] hover:bg-[#D9A02D]/90 text-[#030303] px-6 py-3.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(184,134,11,0.2)]"
          >
            Join the Waitlist
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D] mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Demo", target: "demo" },
                { label: "Platform", target: "grid" },
                { label: "Features", target: "features" },
                { label: "Research", target: "terminal" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNav(item)}
                    className="font-body text-[13px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D] mb-5">
              Capabilities
            </h4>
            <ul className="space-y-3">
              {[
                "Contextual Engine",
                "Predictive Drafting",
                "Real-time Compliance",
                "Secure Vault",
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="font-body text-[13px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D] mb-5">
              Research
            </h4>
            <ul className="space-y-3">
              {["Why Now", "The Moat", "Market Analysis", "Technical Paper"].map((item) => (
                <li key={item}>
                  <button className="font-body text-[13px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D9A02D] mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:business.pvt@yahoo.com" className="font-body text-[13px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  business.pvt@yahoo.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#64748B]" />
                <span className="font-body text-[13px] text-[#94A3B8]">
                  +44 7879399938
                </span>
              </li>
              <li className="font-body text-[13px] text-[#64748B] pt-2">
                Muhammad Hasaan Bin Tayyab
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#94A3B8]/8">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#64748B]/50">
            &copy; 2026 LexCore AI. All rights reserved.
          </span>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Legal"].map((item) => (
              <button
                key={item}
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#64748B]/50 hover:text-[#FAFAFA] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
