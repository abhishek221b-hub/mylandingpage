import { useEffect, useMemo, useRef } from "react";

/**
 * LayeredBackdrop — the deep graphics stack that sits between the video
 * background and the content, now with scroll-reactive depth:
 *
 *   1. Slow-rotating conic nebula        (parallax ×0.025)
 *   2. Two star fields                   (parallax ×0.05 / ×0.11)
 *      — WARP DRIVE: scroll velocity stretches the stars into streaks,
 *        like jumping to lightspeed; they settle back when you stop.
 *   3. Aurora ribbons                    (parallax ×0.06)
 *   4. Shooting stars
 *   5. Perspective grid floor pinned to the bottom of the viewport
 *
 * Each layer translates at its own rate, so scrolling feels like moving
 * through space rather than past a flat image. All updates are direct
 * style writes inside one rAF loop — no React re-renders.
 */

const makeStars = (count: number, color: string) => {
  let shadows = "";
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * 2000);
    const y = Math.round(Math.random() * 1400);
    shadows += `${x}px ${y}px ${color}${i < count - 1 ? "," : ""}`;
  }
  return shadows;
};

const LayeredBackdrop = () => {
  const starsSmall = useMemo(() => makeStars(140, "rgba(255,255,255,0.5)"), []);
  const starsBright = useMemo(() => makeStars(50, "rgba(250,211,144,0.8)"), []);

  const nebulaRef = useRef<HTMLDivElement>(null);
  const starsARef = useRef<HTMLDivElement>(null);
  const starsBRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);

  // Scroll-reactive depth: per-layer parallax + velocity warp streaks
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let vel = 0;
    let raf: number;

    const loop = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      // Smoothed velocity — rises fast on flicks, decays gently
      vel += (Math.abs(dy) - vel) * (Math.abs(dy) > vel ? 0.3 : 0.08);
      const warp = Math.min(vel / 55, 1); // 0 = idle, 1 = full lightspeed

      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate3d(0, ${-y * 0.025}px, 0)`;
      }
      if (starsARef.current) {
        starsARef.current.style.transform = `translate3d(0, ${-y * 0.05}px, 0) scaleY(${1 + warp * 1.8})`;
        starsARef.current.style.opacity = `${1 - warp * 0.25}`;
      }
      if (starsBRef.current) {
        starsBRef.current.style.transform = `translate3d(0, ${-y * 0.11}px, 0) scaleY(${1 + warp * 3.4})`;
        starsBRef.current.style.opacity = `${1 - warp * 0.15}`;
      }
      if (auroraRef.current) {
        auroraRef.current.style.transform = `translate3d(0, ${-y * 0.06}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 1 — Rotating nebula (rotation stays on the inner element) */}
      <div ref={nebulaRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <div className="backdrop-nebula" />
      </div>

      {/* 2 — Star fields with warp-drive stretch */}
      <div ref={starsARef} className="absolute inset-0" style={{ willChange: "transform", transformOrigin: "50% 50%" }}>
        <div className="star-layer">
          <div
            style={{
              width: "1px",
              height: "1px",
              borderRadius: "50%",
              background: "transparent",
              boxShadow: starsSmall,
              animation: "star-twinkle 5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <div ref={starsBRef} className="absolute inset-0" style={{ willChange: "transform", transformOrigin: "50% 50%" }}>
        <div className="star-layer star-layer--fast">
          <div
            style={{
              width: "2px",
              height: "2px",
              borderRadius: "50%",
              background: "transparent",
              boxShadow: starsBright,
              animation: "star-twinkle 7s ease-in-out 1.5s infinite",
            }}
          />
        </div>
      </div>

      {/* 3 — Aurora ribbons */}
      <div ref={auroraRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <div
          className="aurora-band"
          style={{
            top: "12%",
            background:
              "linear-gradient(90deg, transparent, rgba(226, 122, 60, 0.20), rgba(251, 191, 36, 0.12), transparent)",
          }}
        />
        <div
          className="aurora-band"
          style={{
            top: "48%",
            animationDelay: "-7s",
            animationDuration: "24s",
            background:
              "linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.12), rgba(236, 72, 153, 0.10), transparent)",
          }}
        />
      </div>

      {/* 4 — Shooting stars */}
      <div className="shooting-star" style={{ top: "14%", left: "4%" }} />
      <div className="shooting-star" style={{ top: "32%", left: "18%", animationDelay: "3.4s", animationDuration: "9s" }} />

      {/* 5 — Perspective grid floor */}
      <div className="grid-floor" />
    </div>
  );
};

export default LayeredBackdrop;
