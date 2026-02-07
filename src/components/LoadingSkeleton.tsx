import { useState, useEffect } from "react";

const LoadingSkeleton = () => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing">("loading");

  useEffect(() => {
    // Simulate resource loading with smooth progress
    let start = performance.now();
    const duration = 1400; // Total load time

    const animate = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(eased * 100);

      if (raw < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase("revealing");
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "hsl(240, 10%, 6%)",
        opacity: phase === "revealing" ? 0 : 1,
        transform: phase === "revealing" ? "scale(1.02)" : "scale(1)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        pointerEvents: phase === "revealing" ? "none" : "auto",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(251, 146, 60, 0.06) 40%, transparent 70%)",
            animation: "loader-breathe 2.5s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo text */}
        <div
          className="text-lg font-bold tracking-tight text-foreground"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: progress > 10 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          abhishek221b
        </div>

        {/* Progress bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, hsl(270, 70%, 70%), rgba(251, 146, 60, 0.8))",
              boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)",
            }}
          />
        </div>

        {/* Status text */}
        <p
          className="text-xs text-muted-foreground transition-all duration-300"
          style={{
            opacity: progress > 20 ? 0.7 : 0,
          }}
        >
          {progress < 90 ? "Loading…" : "Ready"}
        </p>
      </div>

      <style>{`
        @keyframes loader-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;
