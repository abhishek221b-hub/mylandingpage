import { useEffect, useRef, useState } from "react";

/**
 * SpaceLoader — a minimal space-themed boot screen: a soft particle ring
 * gently accelerating over a starfield. Completion is driven entirely by
 * wall-clock timers (never requestAnimationFrame, which browsers pause on
 * backgrounded tabs — that previously made the loader hang), so it always
 * fades out and hands off to the page.
 */
const SpaceLoader = ({ onDone }: { onDone: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const [started, setStarted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const DURATION = reduced ? 500 : 1500;

  // Completion via timers only — guaranteed to fire regardless of rAF state.
  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 30); // kicks off the CSS fill
    const t2 = setTimeout(() => setExiting(true), DURATION);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [DURATION]);

  // Fallback unmount in case the opacity transitionend doesn't fire.
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  // Ambient particle ring (purely cosmetic).
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let stars: { x: number; y: number; r: number; tw: number; tws: number }[] = [];
    let parts: { angle: number; rr: number; size: number; a: number }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(110, Math.round((w * h) / 12000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
        tws: 0.4 + Math.random(),
      }));
      parts = Array.from({ length: 42 }, () => ({
        angle: Math.random() * Math.PI * 2,
        rr: (Math.random() - 0.5) * 6,
        size: Math.random() * 1.1 + 0.6,
        a: 0.35 + Math.random() * 0.45,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const loop = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.16;
      const p = Math.min(1, (now - start) / DURATION);

      ctx.clearRect(0, 0, w, h);

      // Twinkling stars
      for (const s of stars) {
        s.tw += s.tws * 0.02;
        const a = 0.22 + Math.sin(s.tw) * 0.22;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }

      // Soft warm core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.95);
      core.addColorStop(0, `rgba(255,238,214,${0.1 + p * 0.12})`);
      core.addColorStop(1, "transparent");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Guide ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Particles — single soft warm-white tone, gently accelerating
      const omega = 0.008 + p * 0.028;
      for (const pt of parts) {
        pt.angle += omega;
        const rr = R + pt.rr;
        const x = cx + Math.cos(pt.angle) * rr;
        const y = cy + Math.sin(pt.angle) * rr;
        const g = ctx.createRadialGradient(x, y, 0, x, y, pt.size * 4);
        g.addColorStop(0, `rgba(255,240,222,${pt.a})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, pt.size * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${pt.a})`;
        ctx.beginPath();
        ctx.arc(x, y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [DURATION, reduced]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[hsl(240_10%_6%)]"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: exiting ? "none" : "auto",
      }}
      onTransitionEnd={() => exiting && onDone()}
      aria-busy="true"
      aria-label="Loading"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 mt-[32vh] flex flex-col items-center gap-3 px-6 text-center">
        <p className="text-base font-bold tracking-tight text-foreground/90">abhishek221b</p>
        <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-amber-400/70"
            style={{
              width: started ? "100%" : "0%",
              transition: `width ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          Initializing
        </p>
      </div>
    </div>
  );
};

export default SpaceLoader;
