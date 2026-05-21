import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    if (prevPath.current !== location.pathname) {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px) scale(0.98)";
      el.style.filter = "blur(4px)";
      requestAnimationFrame(() => {
        el.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
        el.style.filter = "blur(0px)";
      });
    } else {
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
      el.style.filter = "blur(0px)";
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <div ref={containerRef} style={{ opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" }}>
      {children}
    </div>
  );
}
