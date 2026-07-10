import { useEffect, useRef, useState } from "react";
import CuriosityCreativity from "./CuriosityCreativity";
import SectionNavigator from "./SectionNavigator";
import HeroAnnotations from "./HeroAnnotations";
const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ years: 0, countries: 0, visited: 0 });

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Magnetic effect on hero
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll depth — the hero recedes into space as you scroll past it:
  // it drifts up slower than the page, softly blurs and fades.
  // Polls scrollY in a rAF loop (scroll events are unreliable in
  // embedded viewports); writes styles only when the position changes.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf: number;
    let lastY = -1;
    const loop = () => {
      const el = contentRef.current;
      const y = window.scrollY;
      if (el && y !== lastY) {
        lastY = y;
        const t = Math.min(y / 650, 1);
        el.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(${1 - t * 0.04})`;
        el.style.opacity = `${Math.max(0, 1 - y / 650)}`;
        el.style.filter = t > 0.01 ? `blur(${t * 5}px)` : "none";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Stats counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);

          // Longer delay and much slower animation
          setTimeout(() => {
            const duration = 4000; // 4 seconds
            const steps = 80;
            const stepDuration = duration / steps;

            let step = 0;
            const interval = setInterval(() => {
              step++;
              const progress = step / steps;
              // Slower ease - more linear feel
              const eased = 1 - Math.pow(1 - progress, 2);

              setCounters({
                years: Math.round(8 * eased),
                countries: Math.round(3 * eased),
                visited: Math.round(50 * eased),
              });

              if (step >= steps) clearInterval(interval);
            }, stepDuration);
          }, 500);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  // Split text into characters for animation
  const AnimatedText = ({
    text,
    className = "",
    delay = 0,
    gradient = false,
    isLoaded = false,
  }: {
    text: string;
    className?: string;
    delay?: number;
    gradient?: boolean;
    isLoaded?: boolean;
  }) => {
    return (
      <span className={`inline-flex flex-wrap ${className}`}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block transition-all duration-700"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded
                ? 'translateY(0) rotateX(0)'
                : 'translateY(40px) rotateX(-90deg)',
              transitionDelay: `${delay + i * 25}ms`,
              transformOrigin: 'center bottom',
            }}
          >
            {/* Keep the gradient clip on a NON-transformed inner span. Applying
                -webkit-background-clip:text on the same element that carries the
                3D rotateX transform makes Safari paint the gradient over the whole
                bounding box (a "ghost" rectangle) while the char animates in. */}
            {gradient ? (
              <span className="gradient-text inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ) : (
              char === " " ? "\u00A0" : char
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section ref={heroRef} id="about" className="relative pt-28 pb-16 overflow-hidden">
      {/* Animated gradient orb that follows content */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(226, 122, 60, 0.15) 0%, rgba(251, 146, 60, 0.08) 40%, transparent 70%)',
          left: '10%',
          top: '20%',
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Parallax depth orbs */}
      <HeroAnnotations />

      <div ref={contentRef} className="container mx-auto relative z-10" style={{ willChange: "transform, opacity" }}>
        <div className="max-w-3xl">
          {/* Label with line animation */}
          <div
            className="mb-4 overflow-hidden"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease-out',
              transitionDelay: '0ms',
            }}
          >
            <p className="text-sm sm:text-base font-medium tracking-wide text-muted-foreground flex items-center gap-3">
              <span
                className="inline-block h-px bg-primary transition-all duration-1000 ease-out"
                style={{
                  width: isLoaded ? '24px' : '0px',
                  transitionDelay: '200ms',
                }}
              />
              <span
                className="inline-block transition-all duration-700"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: '300ms',
                }}
              >
                Global Product Manager · AI Builder
                </span>
              </p>
            </div>

          {/* Main headline with character animation */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl perspective-1000">
            <span className="block">
              <AnimatedText text="I build tools for the" delay={200} isLoaded={isLoaded} />
            </span>
            <span className="block mt-1">
              <AnimatedText text="decisions " delay={500} isLoaded={isLoaded} />
              <AnimatedText text="I've had to make myself" delay={600} gradient isLoaded={isLoaded} />
            </span>

            {/* "with some" text */}
            <span
              className="block mt-3 text-xs sm:text-sm font-light italic text-muted-foreground/50 tracking-wide transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '1200ms',
              }}
            >
              with some
            </span>
          </h1>

          {/* Curiosity x Creativity - left aligned */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transitionDelay: '1400ms',
            }}
          >
            <CuriosityCreativity />
          </div>
        </div>

        {/* Stats Bar with counter animation */}
        <div
          ref={statsRef}
          className="mt-16 flex items-center justify-between gap-4 sm:gap-8 sm:justify-start pt-8 relative"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Animated border glow */}
          <div
            className="absolute top-0 left-0 h-px transition-all duration-1000 ease-out"
            style={{
              width: statsVisible ? '100%' : '0%',
              background: 'linear-gradient(90deg, rgba(226, 122, 60, 0.5), rgba(251, 146, 60, 0.5), transparent)',
            }}
          />

          <div
            className="text-center flex-1 sm:flex-none sm:min-w-[100px] transition-all duration-700"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '0ms',
            }}
          >
            <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
              {counters.years}+
            </p>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Years in Product</p>
          </div>

          <div
            className="stat-divider transition-all duration-500"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'scaleY(1)' : 'scaleY(0)',
              transitionDelay: '200ms',
            }}
          />

          <div
            className="text-center flex-1 sm:flex-none sm:min-w-[100px] transition-all duration-700"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '150ms',
            }}
          >
            <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
              {counters.countries}
            </p>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Countries lived</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 tabular-nums">
              {counters.visited}+ visited
            </p>
          </div>

          <div
            className="stat-divider transition-all duration-500"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'scaleY(1)' : 'scaleY(0)',
              transitionDelay: '400ms',
            }}
          />

          <div
            className="text-center flex-1 sm:flex-none sm:min-w-[100px] transition-all duration-700"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '300ms',
            }}
          >
            <p className="text-3xl sm:text-5xl font-bold gradient-text animate-float">∞</p>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Situations overthought</p>
          </div>
        </div>

        <SectionNavigator targetId="projects" label="Projects" />
      </div>
    </section>
  );
};

export default HeroSection;
