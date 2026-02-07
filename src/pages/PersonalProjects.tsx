import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Globe,
  FileText,
  Image,
  Bell,
  Mail,
  MessageCircle,
  Plane,
  Hotel,
  Shield,
  Upload,
  MapPin,
  Camera,
  Clock,
  Layers,
  Grid3x3,
  ChevronLeft,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import ParallaxGlow from "@/components/ParallaxGlow";

// Loading screen for this page
const PageLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;

    const animate = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(eased * 100);

      if (raw < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 400);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "hsl(240, 10%, 6%)",
        opacity: progress >= 100 ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        pointerEvents: progress >= 100 ? "none" : "auto",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(251, 146, 60, 0.05) 40%, transparent 70%)",
            animation: "pp-breathe 2.5s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-5 relative z-10">
        <div className="text-base font-semibold tracking-tight text-foreground/80">
          Personal Projects
        </div>
        <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(270, 70%, 70%), rgba(251, 146, 60, 0.8))",
              boxShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
              transition: "width 0.15s ease-out",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pp-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// Staggered animation wrapper
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const PersonalProjects = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Page loader */}
      {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}

      <ParallaxGlow />
      <FloatingParticles />

      {/* Minimal top nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
          >
            <ChevronLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
          <span className="text-lg font-bold tracking-tight text-foreground">abhishek221b</span>
        </div>
      </nav>

      {/* Page content */}
      <div className="container mx-auto pt-28 pb-20 relative z-10">
        {/* Page header */}
        <FadeIn className="mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Personal{" "}
            <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-orange-300 to-purple-400">
              Projects
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Tools I'm building for myself — born from the friction of living across borders and collecting memories along the way.
          </p>
        </FadeIn>

        {/* Project cards */}
        <div className="space-y-12">
          {/* ========== ATLAS ========== */}
          <FadeIn delay={200}>
            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-500"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredProject("atlas")}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: hoveredProject === "atlas"
                  ? "1px solid rgba(99, 102, 241, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: hoveredProject === "atlas"
                  ? "0 20px 60px -15px rgba(99, 102, 241, 0.15)"
                  : "none",
              }}
            >
              {/* Spotlight */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: hoveredProject === "atlas"
                    ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 50%)`
                    : "none",
                  opacity: hoveredProject === "atlas" ? 1 : 0,
                }}
              />

              <div className="p-8 relative z-10">
                {/* Header row */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="icon-box icon-box-indigo flex-shrink-0 transition-transform duration-500"
                    style={{ transform: hoveredProject === "atlas" ? "scale(1.1) rotate(3deg)" : "scale(1)" }}
                  >
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-indigo-400">Travel Intelligence</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Coming Soon
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-400 tracking-tight transition-transform duration-300"
                      style={{ transform: hoveredProject === "atlas" ? "translateX(4px)" : "translateX(0)" }}
                    >
                      Atlas
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground mb-6 max-w-2xl">
                  A calendar built for heavy travellers — with an AI agent that finds the right visas, sends reminders via Gmail and WhatsApp, and keeps every document in one place.
                </p>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Globe, label: "Interactive Dashboard", desc: "See every upcoming trip at a glance", color: "indigo" },
                    { icon: Shield, label: "Visa Agent", desc: "AI finds the right visa for each destination", color: "violet" },
                    { icon: Bell, label: "Smart Reminders", desc: "Notifications via Gmail & WhatsApp", color: "amber" },
                    { icon: FileText, label: "Document Vault", desc: "Flights, hotels, and visas — all stored", color: "sky" },
                    { icon: Upload, label: "Screenshot Import", desc: "Accepts screenshots and file uploads", color: "emerald" },
                    { icon: Plane, label: "Trip Timeline", desc: "Visual timeline of past and future travel", color: "orange" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group/feat"
                      style={{
                        opacity: 0,
                        animation: loaded ? `pp-fade-in 0.5s ease-out ${300 + i * 80}ms forwards` : "none",
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/feat:scale-110 ${
                        feature.color === "indigo" ? "bg-indigo-500/15" :
                        feature.color === "violet" ? "bg-violet-500/15" :
                        feature.color === "amber" ? "bg-amber-500/15" :
                        feature.color === "sky" ? "bg-sky-500/15" :
                        feature.color === "emerald" ? "bg-emerald-500/15" :
                        "bg-orange-500/15"
                      }`}>
                        <feature.icon size={14} className={
                          feature.color === "indigo" ? "text-indigo-400" :
                          feature.color === "violet" ? "text-violet-400" :
                          feature.color === "amber" ? "text-amber-400" :
                          feature.color === "sky" ? "text-sky-400" :
                          feature.color === "emerald" ? "text-emerald-400" :
                          "text-orange-400"
                        } />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{feature.label}</p>
                        <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Agent highlight */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 transition-all duration-300 hover:bg-indigo-500/10">
                  <Sparkles size={16} className="text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="text-xs font-medium text-indigo-400 mb-1">AI-Powered Agent</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The agent proactively sends reminders on Gmail and WhatsApp — visa deadlines, flight check-ins, and document expiry alerts so you never miss a step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ========== EARNING AN EXPERIENCE ========== */}
          <FadeIn delay={400}>
            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-500"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredProject("earning")}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: hoveredProject === "earning"
                  ? "1px solid rgba(236, 72, 153, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: hoveredProject === "earning"
                  ? "0 20px 60px -15px rgba(236, 72, 153, 0.15)"
                  : "none",
              }}
            >
              {/* Spotlight */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: hoveredProject === "earning"
                    ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 72, 153, 0.08), transparent 50%)`
                    : "none",
                  opacity: hoveredProject === "earning" ? 1 : 0,
                }}
              />

              <div className="p-8 relative z-10">
                {/* Header row */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="icon-box icon-box-rose flex-shrink-0 transition-transform duration-500"
                    style={{ transform: hoveredProject === "earning" ? "scale(1.1) rotate(3deg)" : "scale(1)" }}
                  >
                    <Camera size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-rose-400">Personal Time Capsule</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Coming Soon
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-rose-400 tracking-tight transition-transform duration-300"
                      style={{ transform: hoveredProject === "earning" ? "translateX(4px)" : "translateX(0)" }}
                    >
                      Earning an Experience
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground mb-6 max-w-2xl">
                  A personal blog reimagined as a visual time capsule — inspired by Instagram but built for the way travellers actually remember. Scroll through a timeline, explore a penta-box grid of memories, or spin an interactive globe to relive every journey.
                </p>

                {/* Viewing modes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Timeline Mode */}
                  <div
                    className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 transition-all duration-300 hover:bg-rose-500/10 hover:scale-[1.02] group/mode"
                    style={{
                      opacity: 0,
                      animation: loaded ? "pp-fade-in 0.5s ease-out 500ms forwards" : "none",
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-rose-500/15 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/mode:scale-110">
                      <Clock size={18} className="text-rose-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Timeline Mode</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Scroll through memories chronologically — each moment stacked in the order it happened.
                    </p>
                  </div>

                  {/* Penta Box Grid */}
                  <div
                    className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 transition-all duration-300 hover:bg-violet-500/10 hover:scale-[1.02] group/mode"
                    style={{
                      opacity: 0,
                      animation: loaded ? "pp-fade-in 0.5s ease-out 600ms forwards" : "none",
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/mode:scale-110">
                      <Grid3x3 size={18} className="text-violet-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Penta Box Grid</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      A five-column mosaic — every individual memory as a tile, creating a visual tapestry of your travels.
                    </p>
                  </div>

                  {/* Interactive Globe */}
                  <div
                    className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 transition-all duration-300 hover:bg-amber-500/10 hover:scale-[1.02] group/mode"
                    style={{
                      opacity: 0,
                      animation: loaded ? "pp-fade-in 0.5s ease-out 700ms forwards" : "none",
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/mode:scale-110">
                      <Globe size={18} className="text-amber-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Interactive Globe</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Spin the world, click a country, and see every visit and memory from that place — your personal atlas of experiences.
                    </p>
                  </div>
                </div>

                {/* How it works */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 transition-all duration-300 hover:bg-rose-500/10">
                  <Layers size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-rose-400 mb-1">Your Time Capsule</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click on any country on the globe to see every time you visited, what you did, and the memories you captured — a deeply personal archive built for the way travellers think.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Back link */}
        <FadeIn delay={600} className="mt-16">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2 group"
          >
            <ChevronLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </button>
        </FadeIn>
      </div>

      <style>{`
        @keyframes pp-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default PersonalProjects;
