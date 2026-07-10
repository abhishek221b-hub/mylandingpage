import { useEffect, useRef, useState } from "react";

const CuriosityCreativity = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading spin for 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Breathing pulse for the ×
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Scroll-based visibility and intensity
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setGlowIntensity(Math.min(entry.intersectionRatio * 1.5, 1));
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - elementCenter);
      const maxDistance = window.innerHeight / 2;
      const intensity = Math.max(0, 1 - distance / maxDistance);
      setGlowIntensity(intensity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate pulse values
  const pulseValue = (Math.sin(pulsePhase * Math.PI / 180) + 1) / 2;
  const xScale = 1 + pulseValue * 0.1 * glowIntensity;
  const xRotation = isLoading ? 0 : (glowIntensity * 180 + (isHovered ? 180 : 0));
  const glowSize = 15 + pulseValue * 10 + (isHovered ? 15 : 0);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow behind the whole text */}
      <div
        className="absolute inset-0 -m-8 rounded-full blur-2xl transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(226, 122, 60, ${0.2 * glowIntensity}) 0%, rgba(251, 146, 60, ${0.12 * glowIntensity}) 50%, transparent 70%)`,
          opacity: isVisible ? 1 : 0,
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        }}
      />

      {/* Text content */}
      <p
        className="text-2xl sm:text-3xl font-bold tracking-tight relative z-10 transition-all duration-300"
        style={{
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <span
          className="gradient-text transition-all duration-300"
          style={{
            filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
            textShadow: isHovered ? '0 0 30px rgba(226, 122, 60, 0.5)' : 'none',
          }}
        >
          Curiosity
        </span>

        {/* The × with all the glow effects */}
        <span className="relative inline-block mx-3">
          {/* Outer glow ring */}
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: 'scale(2)',
            }}
          >
            <span
              className="absolute w-8 h-8 rounded-full transition-all duration-300"
              style={{
                background: `radial-gradient(circle, rgba(251, 146, 60, ${0.3 * glowIntensity * (0.7 + pulseValue * 0.3)}) 0%, rgba(226, 122, 60, ${0.2 * glowIntensity}) 40%, transparent 70%)`,
                filter: `blur(${8 + pulseValue * 4}px)`,
                opacity: isVisible ? 1 : 0,
              }}
            />
          </span>

          {/* Inner glow */}
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="absolute w-4 h-4 rounded-full transition-all duration-200"
              style={{
                background: `radial-gradient(circle, rgba(255, 255, 255, ${0.4 * glowIntensity * pulseValue}) 0%, rgba(251, 146, 60, ${0.3 * glowIntensity}) 50%, transparent 100%)`,
                filter: 'blur(4px)',
                opacity: isHovered ? 1 : 0.7,
              }}
            />
          </span>

          {/* The × character */}
          <span
            className={`relative z-10 transition-all duration-500 ease-out inline-block ${isLoading ? 'animate-spin' : ''}`}
            style={{
              transform: isLoading ? `scale(${xScale})` : `rotate(${xRotation}deg) scale(${xScale})`,
              animation: isLoading ? 'spin 1s linear infinite' : undefined,
              textShadow: `
                0 0 ${glowSize}px rgba(251, 146, 60, ${0.8 * glowIntensity}),
                0 0 ${glowSize * 2}px rgba(226, 122, 60, ${0.5 * glowIntensity}),
                0 0 ${glowSize * 3}px rgba(251, 146, 60, ${0.3 * glowIntensity})
              `,
              color: isHovered
                ? 'rgba(251, 146, 60, 1)'
                : glowIntensity > 0.5
                  ? `rgba(251, 146, 60, ${0.5 + glowIntensity * 0.5})`
                  : undefined,
            }}
          >
            ×
          </span>
        </span>

        <span
          className="text-foreground transition-all duration-300"
          style={{
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            textShadow: isHovered ? '0 0 30px rgba(255, 255, 255, 0.3)' : 'none',
          }}
        >
          Creativity
        </span>
      </p>
    </div>
  );
};

export default CuriosityCreativity;
