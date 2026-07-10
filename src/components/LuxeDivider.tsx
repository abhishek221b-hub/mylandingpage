import { useEffect, useRef, useState } from "react";

/**
 * Understated section hand-off — a hairline that draws itself outward from
 * the centre, a slow shaft of light that glides along it, and a small
 * gem that breathes at the midpoint. Quiet, expensive, no theatrics.
 */
const LuxeDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex items-center justify-center py-16" aria-hidden>
      {/* Hairline drawing outward from the centre */}
      <div
        className="relative h-px w-full max-w-3xl mx-8 overflow-hidden"
        style={{
          transformOrigin: "center",
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          opacity: visible ? 1 : 0,
          transition: "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 22%, rgba(226,122,60,0.5) 50%, rgba(255,255,255,0.12) 78%, transparent)",
          }}
        />
        {/* Travelling shaft of light */}
        {visible && <div className="luxe-sweep absolute top-0 h-full w-28" />}
      </div>

      {/* Centre gem — a rotated square that breathes */}
      <div
        className="absolute left-1/2"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateX(-50%) rotate(45deg) scale(${visible ? 1 : 0.3})`,
          transition: "opacity 0.9s ease 0.6s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
        }}
      >
        <span className="luxe-gem block h-2 w-2 border border-primary/80 bg-background" />
      </div>
    </div>
  );
};

export default LuxeDivider;
