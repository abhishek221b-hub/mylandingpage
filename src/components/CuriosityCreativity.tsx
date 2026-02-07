import { useEffect, useRef, useState } from "react";

const CuriosityCreativity = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Delay effects until component is mounted to avoid visual flash
  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(mountTimer);
  }, []);

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

  // Calculate pulse values - only apply effects after mount to avoid flash
  const effectiveGlowIntensity = isMounted ? glowIntensity : 0;
  const pulseValue = (Math.sin(pulsePhase * Math.PI / 180) + 1) / 2;
  const xScale = 1 + pulseValue * 0.1 * effectiveGlowIntensity;
  const xRotation = isLoading ? 0 : (effectiveGlowIntensity * 180 + (isHovered ? 180 : 0));
  const glowSize = isMounted ? (15 + pulseValue * 10 + (isHovered ? 15 : 0)) : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow behind the whole text - hidden until mounted */}
      {isMounted && (
        <div
          className="absolute inset-0 -m-8 rounded-full blur-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(168, 85, 247, ${0.2 * effectiveGlowIntensity}) 0%, rgba(251, 146, 60, ${0.12 * effectiveGlowIntensity}) 50%, transparent 70%)`,
            opacity: isVisible ? 1 : 0,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.5s ease-out',
          }}
        />
      )}

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
            textShadow: isHovered ? '0 0 30px rgba(168, 85, 247, 0.5)' : 'none',
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
              className="absolute w-8 h-8 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(251, 146, 60, ${0.3 * effectiveGlowIntensity * (0.7 + pulseValue * 0.3)}) 0%, rgba(168, 85, 247, ${0.2 * effectiveGlowIntensity}) 40%, transparent 70%)`,
                filter: `blur(${8 + pulseValue * 4}px)`,
                opacity: isMounted && isVisible ? 1 : 0,
                transition: isMounted ? 'all 0.3s ease-out' : 'none',
              }}
            />
          </span>

          {/* Inner glow */}
          <span
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255, 255, 255, ${0.4 * effectiveGlowIntensity * pulseValue}) 0%, rgba(251, 146, 60, ${0.3 * effectiveGlowIntensity}) 50%, transparent 100%)`,
                filter: 'blur(4px)',
                opacity: isMounted ? (isHovered ? 1 : 0.7) : 0,
                transition: isMounted ? 'all 0.2s ease-out' : 'none',
              }}
            />
          </span>

          {/* The × character */}
          <span 
            className={`relative z-10 inline-block ${isLoading ? 'animate-spin' : ''}`}
            style={{
              transform: isLoading ? `scale(${xScale})` : `rotate(${xRotation}deg) scale(${xScale})`,
              animation: isLoading ? 'spin 1s linear infinite' : undefined,
              textShadow: isMounted ? `
                0 0 ${glowSize}px rgba(251, 146, 60, ${0.8 * effectiveGlowIntensity}),
                0 0 ${glowSize * 2}px rgba(168, 85, 247, ${0.5 * effectiveGlowIntensity}),
                0 0 ${glowSize * 3}px rgba(251, 146, 60, ${0.3 * effectiveGlowIntensity})
              ` : 'none',
              color: isHovered 
                ? 'rgba(251, 146, 60, 1)' 
                : effectiveGlowIntensity > 0.5 
                  ? `rgba(251, 146, 60, ${0.5 + effectiveGlowIntensity * 0.5})` 
                  : undefined,
              transition: isMounted ? 'all 0.5s ease-out' : 'none',
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
