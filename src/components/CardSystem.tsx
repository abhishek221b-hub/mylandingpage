import { useRef, useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionNavigator from "./SectionNavigator";
import Parallax from "./Parallax";
import { ArrowRightLeft, X, ExternalLink, GitBranch, Lock, Sparkles } from "lucide-react";

/* ================================================================== */
/* Shared building blocks for every project/tool card across sections. */
/* ================================================================== */

export type Accent = "sky" | "orange" | "cyan" | "emerald" | "indigo" | "rose";

export const ACCENTS: Record<
  Accent,
  { text: string; grad: string; glow: string; solid: string; tabActive: string; bar: string; badge: string }
> = {
  sky: { text: "text-sky-400", grad: "from-sky-400 to-cyan-500", glow: "rgba(56,189,248,0.4)", solid: "#38bdf8", tabActive: "bg-sky-500/20 text-sky-400", bar: "bg-sky-400", badge: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  orange: { text: "text-orange-400", grad: "from-orange-400 to-amber-500", glow: "rgba(251,146,60,0.4)", solid: "#fb923c", tabActive: "bg-orange-500/20 text-orange-400", bar: "bg-orange-400", badge: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  cyan: { text: "text-cyan-400", grad: "from-cyan-400 to-sky-500", glow: "rgba(34,211,238,0.4)", solid: "#22d3ee", tabActive: "bg-cyan-500/20 text-cyan-400", bar: "bg-cyan-400", badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  emerald: { text: "text-emerald-400", grad: "from-emerald-400 to-teal-500", glow: "rgba(16,185,129,0.4)", solid: "#10b981", tabActive: "bg-emerald-500/20 text-emerald-300", bar: "bg-emerald-400", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  indigo: { text: "text-indigo-400", grad: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.4)", solid: "#6366f1", tabActive: "bg-indigo-500/20 text-indigo-300", bar: "bg-indigo-400", badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  rose: { text: "text-rose-400", grad: "from-rose-500 to-pink-500", glow: "rgba(244,63,94,0.4)", solid: "#f43f5e", tabActive: "bg-rose-500/20 text-rose-300", bar: "bg-rose-400", badge: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
};

/** #rrggbb → rgba() so an icon's color can drive a translucent hover glow. */
const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const StaggeredChild = ({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) => (
  <div className={`animate-fade-slide-up ${className}`} style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
    {children}
  </div>
);

export const FloatingParticles = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full opacity-30 animate-float"
        style={{ backgroundColor: color, left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i * 0.5}s` }}
      />
    ))}
  </div>
);

export const useAutoSwipe = (tabCount: number, interval = 5000) => {
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(0);
  const animationRef = useRef<number>();

  const nextTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % tabCount);
    setProgress(0);
    progressRef.current = 0;
  }, [tabCount]);

  useEffect(() => {
    if (isPaused) return;
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      progressRef.current += (delta / interval) * 100;
      setProgress(progressRef.current);
      if (progressRef.current >= 100) nextTab();
      else animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [activeTab, interval, isPaused, nextTab]);

  const goToTab = (index: number) => { setActiveTab(index); setProgress(0); progressRef.current = 0; };
  return { activeTab, progress, goToTab, setIsPaused };
};

/* Shared browser-window shell. Live mode: address bar links to the app and
   the green dot opens it. Private mode (no link): lock + label, dim dot. */
export const PreviewWindow = ({
  label, link, tabs, accent, activeTab, progress, goToTab, setIsPaused, onClose, children, bodyClassName = "p-4",
}: {
  label: string;
  link?: string;
  tabs: string[];
  accent: Accent;
  activeTab: number;
  progress: number;
  goToTab: (i: number) => void;
  setIsPaused: (p: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  bodyClassName?: string;
}) => {
  const a = ACCENTS[accent];
  return (
    <div className="rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} aria-label="Close preview" />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} aria-label="Close preview" />
          {link ? (
            <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(link, "_blank", "noopener,noreferrer"); }} aria-label="Open live app" />
          ) : (
            <button className="w-3 h-3 rounded-full bg-green-500/40 border-0 p-0 cursor-default" aria-label="Private build" />
          )}
        </div>
        <div className="flex-1 mx-4">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="bg-white/5 hover:bg-white/10 rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-white truncate font-mono flex items-center gap-2 transition-colors">
              {label}
              <ExternalLink size={10} className="flex-shrink-0 opacity-70" />
            </a>
          ) : (
            <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono flex items-center gap-2">
              <Lock size={10} className="flex-shrink-0 opacity-70" />
              {label}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 py-2 bg-black/10 border-b border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => goToTab(i)} className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? a.tabActive : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
            {tab}
            {activeTab === i && <div className={`absolute bottom-0 left-0 h-0.5 ${a.bar} transition-all duration-100`} style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
    </div>
  );
};

/* ================================================================== */
/* The unified card.                                                   */
/* ================================================================== */

export type CardCta = { kind: "visit"; link: string } | { kind: "git"; email: string; subject: string };

export interface CardData {
  icon: React.ReactNode;
  accent: Accent;
  /** Optional exact color (hex) pulled from the project's icon. When set, the
      card's origin (subtext) and title (header) use it instead of the accent. */
  iconColor?: string;
  origin: string;
  title: React.ReactNode;
  description: string;
  insight: string;
  features: string[];
  badge?: "New" | "Beta";
  cta: CardCta;
  link?: string; // passed to the carousel (live URL), if any
  CarouselComponent: React.FC<{ onClose: () => void; link?: string; isInView?: boolean }>;
}

interface ProjectCardProps extends CardData {
  index: number;
  isExpanded: boolean;
  isOtherExpanded: boolean;
  isVisible: boolean;
  onToggle: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}

const Cta = ({ cta, accent }: { cta: CardCta; accent: Accent }) => {
  const a = ACCENTS[accent];
  if (cta.kind === "visit") {
    return (
      <a href={cta.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`inline-flex items-center gap-2 text-sm font-medium hover:underline group/link transition-all duration-300 hover:gap-3 ${a.text}`}>
        Visit App
        <ExternalLink size={12} className="transition-all duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
      </a>
    );
  }
  return (
    <a href={`mailto:${cta.email}?subject=${encodeURIComponent(cta.subject)}`} onClick={(e) => e.stopPropagation()} className={`inline-flex items-center gap-2 text-sm font-medium hover:underline group/link transition-all duration-300 hover:gap-3 ${a.text}`}>
      Request Git
      <GitBranch size={14} className="transition-transform duration-300 group-hover/link:rotate-12" />
    </a>
  );
};

export const ProjectCard = ({
  index, isExpanded, isOtherExpanded, isVisible, onToggle, cardRef,
  icon, accent, iconColor, origin, title, description, insight, features, badge, cta, link, CarouselComponent,
}: ProjectCardProps) => {
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const a = ACCENTS[accent];
  // Inline color override so the header/subtext match the project's icon.
  const iconColorStyle = iconColor ? { color: iconColor } : undefined;
  // Glow tint for the icon-tile hover "pop", derived from the icon's own color.
  const tileGlow = iconColor ? hexToRgba(iconColor, 0.5) : a.glow;

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (cardRef) cardRef(el);
  }, [cardRef]);

  useEffect(() => {
    if (isExpanded) {
      setIsInView(true);
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [isExpanded]);

  // Collapsed mini-row when another card is expanded
  if (isOtherExpanded) {
    return (
      <div ref={setRefs} className="transition-all duration-1000 ease-in-out" style={{ opacity: isVisible ? 0.7 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transitionDelay: `${300 + index * 150}ms` }}>
        <div className="service-card conic-border group relative overflow-hidden cursor-pointer hover:opacity-100 transition-all duration-500 hover:scale-[1.02]" onClick={onToggle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ "--conic-a": a.glow, "--conic-b": a.glow } as React.CSSProperties}>
          {badge && <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-medium z-20 border ${a.badge}`}>{badge}</div>}
          <div className="flex items-center gap-4 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${a.grad} transition-transform duration-500 group-hover:scale-110`}>{icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${a.text}`} style={iconColorStyle}>{origin}</p>
              <h3 className={`text-base font-bold tracking-tight truncate ${a.text}`} style={iconColorStyle}>{title}</h3>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-500 flex-shrink-0 group-hover:rotate-180" style={{ color: a.solid }}>
              <ArrowRightLeft size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setRefs} className={`transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col scroll-mt-24 ${isExpanded ? "h-auto lg:h-[520px]" : "h-full"}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transitionDelay: `${300 + index * 150}ms` }}>
      <div className={`flex ${isExpanded ? "flex-col lg:flex-row" : "flex-col"} gap-6 flex-1 h-full`}>
        <div
          className={`service-card card-hover-glow conic-border group relative overflow-hidden flex flex-col transition-all duration-1000 ${isExpanded ? "lg:w-[380px] w-full h-full" : "w-full h-full"}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
          }}
          style={{ "--conic-a": a.glow, "--conic-b": a.glow, boxShadow: isHovered && !isExpanded ? `0 0 30px ${a.glow}` : "none" } as React.CSSProperties}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${a.glow}, transparent 60%)` }} />
          {/* Cursor-tracked spotlight + one-shot specular sheen */}
          <div className="card-spotlight transition-opacity duration-500" style={{ opacity: isHovered ? 1 : 0 }} />
          <div className="card-sheen" />
          <FloatingParticles color={a.solid} />

          {badge && <div className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-medium z-20 border ${a.badge}`}>{badge}</div>}

          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95" style={{ color: a.solid }} aria-label={isExpanded ? "Close preview" : "Open preview"}>
            {isExpanded ? <X size={16} className="transition-transform duration-300 hover:rotate-90" /> : <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-700" />}
          </button>

          <div className="flex flex-col flex-1 p-1 relative z-10">
            <div className={`icon-tile w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mb-4 flex-shrink-0 mt-2 bg-gradient-to-br ${a.grad}`} style={{ "--tile-glow": tileGlow } as React.CSSProperties}>{icon}</div>
            <p className={`text-xs font-medium mb-1 flex-shrink-0 ${a.text}`} style={iconColorStyle}>{origin}</p>
            <h3 className={`text-lg font-bold tracking-tight mb-2 flex-shrink-0 ${a.text} transition-all duration-300 group-hover:translate-x-1`} style={iconColorStyle}>{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-shrink-0">{description}</p>

            <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-primary/5 flex-shrink-0 transition-all duration-500 group-hover:bg-primary/10 group-hover:translate-x-1">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-xs leading-relaxed text-primary/90">{insight}</p>
            </div>

            {!isExpanded && (
              <div className="flex flex-wrap gap-1.5 mb-6 flex-shrink-0">
                {features.map((f, i) => (
                  <span key={i} className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105" style={{ transitionDelay: `${i * 50}ms` }}>{f}</span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-2 border-t border-white/5">
              <Cta cta={cta} accent={accent} />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="flex-1 min-w-0 h-full flex flex-col animate-scale-in">
            <CarouselComponent isInView={isInView} onClose={onToggle} link={link} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================================== */
/* Section wrapper — heading, glow, grid, shared expand behaviour.     */
/* ================================================================== */

export interface CardSectionProps {
  id: string;
  titleLead: string;
  titleAccent: string;
  headingGradient: string; // tailwind gradient classes, e.g. "from-amber-300 via-orange-300 to-amber-300"
  subtitle: string;
  glow: string; // CSS background for the section glow
  cards: CardData[];
  navTargetId: string;
  navLabel: string;
}

const KEYFRAMES = `
  @keyframes fade-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  .animate-fade-slide-up { animation: fade-slide-up 0.6s ease-out forwards; }
  .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
  .card-hover-glow:hover { transform: translateY(-4px); }

  /* Icon hover: a springy "app icon" pop — lift + magnify + soft colored glow,
     instead of the old tilt. Overshoot easing gives it a lively bounce. */
  .icon-tile { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); will-change: transform; }
  .icon-tile > * { transition: filter 0.5s ease; }
  .group:hover .icon-tile { transform: translateY(-6px) scale(1.12); }
  .group:hover .icon-tile > * { filter: drop-shadow(0 10px 18px var(--tile-glow, rgba(0,0,0,0.45))) brightness(1.06); }
`;

export const CardSection = ({ id, titleLead, titleAccent, headingGradient, subtitle, glow, cards, navTargetId, navLabel }: CardSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleExpand = (i: number) => {
    const closing = expanded === i;
    setExpanded(closing ? null : i);
    setTimeout(() => cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const cols = expanded !== null ? "grid-cols-1" : cards.length >= 3 ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2";

  return (
    <section ref={sectionRef} id={id} className="py-20 relative overflow-hidden scroll-mt-16">
      <style>{KEYFRAMES}</style>
      <Parallax speed={0.18} className="absolute pointer-events-none" style={{ top: "5%", left: "50%", marginLeft: "-300px" }}>
        <div className="w-[600px] h-[600px] rounded-full animate-glow-breathe" style={{ background: glow, filter: "blur(50px)" }} />
      </Parallax>

      <div className="container mx-auto relative z-10">
        <Parallax speed={0.06}>
        <AnimateOnScroll className="mb-12">
          <div className="relative inline-block">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {titleLead}{" "}
              <span className={`gradient-text bg-clip-text text-transparent bg-gradient-to-r ${headingGradient}`}>{titleAccent}</span>
            </h2>
            <div className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r ${headingGradient} transition-all duration-1000 ease-out`} style={{ width: isVisible ? "120px" : "0px" }} />
          </div>
          <p className="text-muted-foreground mt-4 max-w-xl">{subtitle}</p>
        </AnimateOnScroll>
        </Parallax>

        <div className={`grid gap-6 transition-all duration-1000 ease-in-out ${cols}`}>
          {cards.map((card, i) => (
            <ProjectCard
              key={i}
              {...card}
              index={i}
              isExpanded={expanded === i}
              isOtherExpanded={expanded !== null && expanded !== i}
              isVisible={isVisible}
              onToggle={() => toggleExpand(i)}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>

        <SectionNavigator targetId={navTargetId} label={navLabel} />
      </div>
    </section>
  );
};
