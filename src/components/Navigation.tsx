import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHome) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const links = isHome
    ? [
        { label: "Platform", target: "grid", type: "section" as const },
        { label: "Features", target: "features", type: "section" as const },
        { label: "Research", target: "terminal", type: "section" as const },
        { label: "Demo", target: "/demo", type: "route" as const },
      ]
    : [
        { label: "Home", target: "/", type: "route" as const },
        { label: "Demo", target: "/demo", type: "route" as const },
      ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#030303]/85 backdrop-blur-2xl border-b border-[#D9A02D]/8 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-3.5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="LexCore AI" className="h-9 w-auto" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#FAFAFA]/80 hidden sm:block">
            LexCore AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.label}
                to={link.target}
                className="font-body text-[13px] tracking-wide text-[#94A3B8]/70 hover:text-[#FAFAFA] transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[#D9A02D] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.target)}
                className="font-body text-[13px] tracking-wide text-[#94A3B8]/70 hover:text-[#FAFAFA] transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-[#D9A02D] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/demo"
            className="hidden md:block font-mono text-[11px] uppercase tracking-[0.15em] bg-[#D9A02D] hover:bg-[#D9A02D]/90 text-[#030303] px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(217,160,45,0.25)] hover:scale-[1.03] active:scale-[0.98]"
          >
            Try the Demo
          </Link>

          <button
            className="md:hidden text-[#FAFAFA]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#030303]/95 backdrop-blur-2xl border-t border-[#D9A02D]/10">
          <div className="flex flex-col px-6 py-6 space-y-4">
            {links.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.label}
                  to={link.target}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-[15px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors text-left py-2"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.target)}
                  className="font-body text-[15px] text-[#94A3B8] hover:text-[#FAFAFA] transition-colors text-left py-2"
                >
                  {link.label}
                </button>
              )
            )}
            <Link
              to="/demo"
              onClick={() => setMobileOpen(false)}
              className="font-mono text-[11px] uppercase tracking-[0.15em] bg-[#D9A02D] text-[#030303] px-5 py-3 rounded-lg transition-all w-full mt-2 text-center block"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
