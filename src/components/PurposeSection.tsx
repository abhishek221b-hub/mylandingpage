import { useRef, useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionNavigator from "./SectionNavigator";
import { particleZones } from "./FloatingParticles";

const PurposeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Register card positions into the global particle zone registry
  const updateZones = useCallback(() => {
    // Clear our entries (keep only non-purpose zones if any existed)
    particleZones.length = 0;
    const colors = ["rgba(99, 102, 241, 0.6)", "rgba(251, 191, 36, 0.6)", "rgba(16, 185, 129, 0.6)"];
    cardRefs.current.forEach((el, i) => {
      if (el) {
        particleZones.push({ rect: el.getBoundingClientRect(), color: colors[i] });
      }
    });
  }, []);

  // Update zones on scroll and resize
  useEffect(() => {
    updateZones();
    window.addEventListener("scroll", updateZones, { passive: true });
    window.addEventListener("resize", updateZones);
    return () => {
      window.removeEventListener("scroll", updateZones);
      window.removeEventListener("resize", updateZones);
      particleZones.length = 0;
    };
  }, [updateZones]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredCard(index);
  };

  const pillars = [
    {
      title: "Domain Expertise",
      description: "Built on lived experiences — not algorithms.",
      color: "from-indigo-500 to-purple-600",
      glow: "rgba(99, 102, 241, 0.6)",
      borderGlow: "rgba(99, 102, 241, 0.3)",
      iconBg: "bg-indigo-500/15",
      dotColor: "bg-indigo-400",
      number: "01",
      index: 0,
    },
    {
      title: "Augmentation",
      description: "Building tools that augment your decision making.",
      color: "from-amber-400 to-orange-500",
      glow: "rgba(251, 191, 36, 0.6)",
      borderGlow: "rgba(251, 191, 36, 0.3)",
      iconBg: "bg-amber-500/15",
      dotColor: "bg-amber-400",
      number: "02",
      index: 1,
    },
    {
      title: "Personalization",
      description: "Every situation demands it's personalized inference.",
      color: "from-emerald-400 to-teal-500",
      glow: "rgba(16, 185, 129, 0.6)",
      borderGlow: "rgba(16, 185, 129, 0.3)",
      iconBg: "bg-emerald-500/15",
      dotColor: "bg-emerald-400",
      number: "03",
      index: 2,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="purpose"
      className="py-28 relative overflow-hidden"
    >
      {/* Keyframe animations */}
      <style>{`
        @keyframes card-stack-out {
          0% {
            opacity: 0;
            transform: translate3d(-60px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes number-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 0.8; }
          75% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes card-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .purpose-number-pulse {
          animation: number-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] bg-purple-900/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[25%] right-[15%] w-[350px] h-[350px] bg-amber-900/6 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] left-[30%] w-[300px] h-[300px] bg-emerald-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header — left aligned */}
        <AnimateOnScroll className="mb-16">
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built on{" "}
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-orange-300 to-purple-400">
                Purpose
              </span>
            </h2>
            <div
              className="mt-3 h-[2px] bg-gradient-to-r from-purple-400 via-orange-300 to-transparent transition-all duration-1000 ease-out"
              style={{ width: isVisible ? "120px" : "0px" }}
            />
            <p className="text-muted-foreground mt-4 max-w-lg">
              Every tool I build rests on three pillars — building to solve problems{" "}<span className="whitespace-nowrap">with AI.</span>
            </p>
          </div>
        </AnimateOnScroll>

        {/* Cards — stacking left to right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const isHovered = hoveredCard === i;
            const cardDelay = i * 300;

            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="relative group"
                style={{
                  opacity: 0,
                  willChange: "transform, opacity",
                  animation: isVisible
                    ? `card-stack-out 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${cardDelay}ms forwards`
                    : "none",
                }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card */}
                <div
                  className="relative rounded-2xl p-6 h-full transition-all duration-500 overflow-hidden cursor-default"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isHovered ? pillar.borderGlow : "rgba(255, 255, 255, 0.08)"}`,
                    transform: isHovered
                      ? "translateY(-6px) scale(1.02)"
                      : "translateY(0) scale(1)",
                    boxShadow: isHovered
                      ? `0 20px 60px -15px ${pillar.glow.replace("0.6", "0.2")}, 0 0 40px ${pillar.glow.replace("0.6", "0.08")}`
                      : "none",
                  }}
                >
                  {/* Spotlight follow cursor */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
                    style={{
                      background: isHovered
                        ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${pillar.glow.replace("0.6", "0.12")}, transparent 50%)`
                        : "none",
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Shimmer border on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.5s",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${pillar.borderGlow}, transparent)`,
                        backgroundSize: "200% 100%",
                        animation: isHovered ? "card-shimmer 2s linear infinite" : "none",
                      }}
                    />
                  </div>

                  {/* Large background number */}
                  <div
                    className="absolute top-4 right-4 text-6xl font-black select-none pointer-events-none purpose-number-pulse"
                    style={{
                      opacity: 0.08,
                      color: "white",
                      animationDelay: `${i * 1.3}s`,
                    }}
                  >
                    {pillar.number}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Dot indicator + line */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${pillar.color} transition-transform duration-300`}
                          style={{ transform: isHovered ? "scale(1.4)" : "scale(1)" }}
                        />
                        {/* Ping effect on hover */}
                        {isHovered && (
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${pillar.color}`}
                            style={{ animation: "dot-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
                          />
                        )}
                      </div>
                      <div
                        className="h-[1.5px] bg-gradient-to-r from-white/30 to-transparent transition-all duration-700 ease-out"
                        style={{
                          width: isHovered ? "60px" : "32px",
                          opacity: isHovered ? 1 : 0.5,
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-bold text-white mb-3 transition-all duration-300"
                      style={{
                        transform: isHovered ? "translateX(4px)" : "translateX(0)",
                      }}
                    >
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed text-muted-foreground transition-all duration-300"
                      style={{
                        transform: isHovered ? "translateX(2px)" : "translateX(0)",
                        opacity: isHovered ? 1 : 0.8,
                      }}
                    >
                      {pillar.description}
                    </p>

                    {/* Bottom accent line that grows on hover */}
                    <div
                      className="mt-6 h-[2px] rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: isHovered ? "100%" : "0%",
                        background: `linear-gradient(90deg, ${pillar.glow}, transparent)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <SectionNavigator targetId="projects" label="Projects" />
      </div>
    </section>
  );
};

export default PurposeSection;
