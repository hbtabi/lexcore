import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/demo") {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!containerRef.current || transitioning) return;
    const el = containerRef.current;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px) scale(0.98)";
    el.style.filter = "blur(4px)";
    requestAnimationFrame(() => {
      el.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
      el.style.filter = "blur(0px)";
    });
  }, [displayChildren, transitioning]);

  return (
    <div
      ref={containerRef}
      style={{ opacity: 0, transform: "translateY(12px) scale(0.98)", filter: "blur(4px)" }}
    >
      {displayChildren}
    </div>
  );
}
