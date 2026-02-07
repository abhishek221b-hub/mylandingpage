import { useEffect, useState } from "react";

const ParallaxGlow = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate parallax offset - glow moves slower than scroll
  const parallaxOffset = scrollY * 0.3;

  return (
    <div 
      className="bg-glow"
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        willChange: 'transform',
      }}
    />
  );
};

export default ParallaxGlow;
