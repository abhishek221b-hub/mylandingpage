import { useEffect, useRef } from "react";

const ParallaxGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  // Direct, rAF-throttled style writes — no React re-render per scroll event.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="bg-glow" style={{ willChange: "transform" }} />;
};

export default ParallaxGlow;
