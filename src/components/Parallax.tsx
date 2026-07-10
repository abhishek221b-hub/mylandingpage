import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-parallax engine.
 *
 * A single shared rAF loop reads window.scrollY and notifies every
 * subscriber only when it changes — subscribers write styles directly
 * (no React re-renders). Respects prefers-reduced-motion.
 */

type Cb = (y: number) => void;
const subs = new Set<Cb>();
let running = false;
let raf = 0;
let lastY = Number.NaN;

const loop = () => {
  const y = window.scrollY;
  if (y !== lastY) {
    lastY = y;
    subs.forEach((cb) => cb(y));
  }
  raf = requestAnimationFrame(loop);
};

const ensureRunning = () => {
  if (running) return;
  running = true;
  raf = requestAnimationFrame(loop);
};

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Subscribe to scroll position. `apply` runs on every change + once on mount. */
export const useScroll = (apply: (y: number) => void) => {
  const ref = useRef(apply);
  ref.current = apply;
  useEffect(() => {
    if (reducedMotion()) return;
    const cb = (y: number) => ref.current(y);
    subs.add(cb);
    ensureRunning();
    cb(window.scrollY);
    return () => {
      subs.delete(cb);
      if (subs.size === 0) {
        running = false;
        cancelAnimationFrame(raf);
        lastY = Number.NaN;
      }
    };
  }, []);
};

interface ParallaxProps {
  /** Translation factor relative to the element's distance from viewport centre. ~0.05–0.3. */
  speed?: number;
  /** Optional rotation (deg) applied across the element's travel through the viewport. */
  rotate?: number;
  /** Optional extra scale at viewport centre (e.g. 0.06 => up to +6%). */
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Viewport-relative parallax wrapper for in-flow or absolutely-positioned
 * content. translateY scales with how far the element is from the centre of
 * the viewport, so it only drifts while it's on screen.
 */
export const Parallax = ({ speed = 0.12, rotate = 0, zoom = 0, className = "", style, children }: ParallaxProps) => {
  const el = useRef<HTMLDivElement>(null);

  useScroll(() => {
    const node = el.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
    const norm = fromCentre / window.innerHeight; // ~ -1 .. 1 across the viewport
    const ty = -fromCentre * speed;
    const rot = rotate ? norm * rotate : 0;
    const scale = zoom ? 1 + (1 - Math.min(Math.abs(norm), 1)) * zoom : 1;
    node.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)${rot ? ` rotate(${rot.toFixed(2)}deg)` : ""}${scale !== 1 ? ` scale(${scale.toFixed(3)})` : ""}`;
  });

  return (
    <div ref={el} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
};

export default Parallax;
