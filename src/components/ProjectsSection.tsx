import { useRef, useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionNavigator from "./SectionNavigator";
import { CalculatorIcon, PlaneIcon, GlobeIcon, SparklesIcon } from "./Icons";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Home,
  TrendingUp,
  TrendingDown,
  Calendar,
  Percent,
  Building,
  DollarSign,
  Plane,
  MapPin,
  Wallet,
  Globe,
  ArrowRightLeft,
  Sparkles,
  Sun,
  Hotel,
  Utensils,
  Camera,
  PieChart,
  BarChart3,
  Lightbulb,
  Scale,
  Clock,
  Users,
  Briefcase,
  Car,
  Coffee,
  ExternalLink,
} from "lucide-react";

// Staggered animation wrapper
const StaggeredChild = ({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) => (
  <div
    className={`animate-fade-slide-up ${className}`}
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
  >
    {children}
  </div>
);

// Shimmer effect component
const ShimmerBorder = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <div
    className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    style={{
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      backgroundSize: '200% 100%',
      animation: isActive ? 'shimmer 2s infinite' : 'none',
      maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'xor',
      padding: '1px',
    }}
  />
);

// Floating particles background
const FloatingParticles = ({ color }: { color: string }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full opacity-30 animate-float"
        style={{
          backgroundColor: color,
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + i * 0.5}s`,
        }}
      />
    ))}
  </div>
);

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleExpand = (index: number) => {
    const isClosing = expandedCard === index;
    setExpandedCard(isClosing ? null : index);
    
    if (isClosing) {
      // When closing, scroll back to the card
      setTimeout(() => {
        cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <section ref={sectionRef} id="projects" className="py-20 relative overflow-hidden scroll-mt-16">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-slide-up {
          animation: fade-slide-up 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .card-hover-glow:hover {
          transform: translateY(-4px);
        }
      `}</style>
      
      <div className="container mx-auto relative z-10">
        <AnimateOnScroll className="mb-12">
          <div className="relative inline-block">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured{" "}
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-orange-300 to-purple-400">
                Projects
              </span>
            </h2>
            <div
              className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-purple-400 via-orange-300 to-transparent transition-all duration-1000 ease-out"
              style={{ width: isVisible ? "120px" : "0px" }}
            />
          </div>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Tools built from real problems I've faced — each one started as a personal solution.
          </p>
        </AnimateOnScroll>

        <div className="space-y-6">
          <div className={`grid gap-6 transition-all duration-1000 ease-in-out ${expandedCard !== null ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}>
            <ExpandableProject
              index={0}
              isExpanded={expandedCard === 0}
              onToggle={() => toggleExpand(0)}
              isVisible={isVisible}
              isOtherExpanded={expandedCard !== null && expandedCard !== 0}
              icon={<CalculatorIcon />}
              iconClass="icon-box-blue"
              origin="Financial Decision Tool"
              originColor="text-sky-400"
              title="UK Rent vs Buy Calculator"
              titleColor="text-sky-400"
              description="Renting vs buying isn't about costs alone. It's about whether your capital can outperform property growth. This tool models opportunity costs and projects wealth outcomes over 5-25 years."
              aiDescription="AI analyzes local market conditions and investment alternatives to inform your decision."
              features={["Opportunity cost modeling", "Break-even analysis", "5-25 year projections"]}
              link="https://rentvsbuy.abhishek221b.app"
              accentColor="sky"
              CarouselComponent={RentVsBuyCarousel}
              cardRef={(el) => { cardRefs.current[0] = el; }}
            />

            <ExpandableProject
              index={1}
              isExpanded={expandedCard === 1}
              onToggle={() => toggleExpand(1)}
              isVisible={isVisible}
              isOtherExpanded={expandedCard !== null && expandedCard !== 1}
              icon={<PlaneIcon />}
              iconClass="icon-box-orange"
              origin="Personalized Travel AI"
              originColor="text-orange-400"
              title="Europe Trip Planner"
              titleColor="text-orange-400"
              description="I was fascinated by how densely interconnected Europe is - a short flight can take you to a completely new place, cuisine, and culture. This AI assisted tool plans trips based on your vibe and travel mode."
              aiDescription="AI creates personalized itineraries from budget backpacking to luxury escapes."
              features={["Budget to luxury modes", "Multi-city routing", "Vibe-based planning"]}
              link="https://eurotravel.abhishek221b.app"
              accentColor="orange"
              badge="Beta"
              CarouselComponent={EuroTripCarousel}
              cardRef={(el) => { cardRefs.current[1] = el; }}
            />

            <ExpandableProject
              index={2}
              isExpanded={expandedCard === 2}
              onToggle={() => toggleExpand(2)}
              isVisible={isVisible}
              isOtherExpanded={expandedCard !== null && expandedCard !== 2}
              icon={<GlobeIcon />}
              iconClass="icon-box-cyan"
              origin="Multi-Country Net Worth Tracker"
              originColor="text-cyan-400"
              title="Global Money Manager"
              titleColor="text-cyan-400"
              description="Bank accounts in multiple countries. Investments in different currencies. Property overseas with remittances.  I needed to track my assets and liabilities without endless spreadsheets."
              aiDescription="Cross-border wealth insights with forecasting,real time FX tracking and report generation."
              features={["Multi-currency support", "Real-time FX rates", "Cross-border insights"]}
              link="https://globalmoney.abhishek221b.app"
              accentColor="cyan"
              badge="Beta"
              CarouselComponent={GlobalMoneyCarousel}
              cardRef={(el) => { cardRefs.current[2] = el; }}
            />
          </div>
        </div>

        <SectionNavigator targetId="lab" label="Lab" />
      </div>
    </section>
  );
};

interface ExpandableProjectProps {
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  isOtherExpanded: boolean;
  icon: React.ReactNode;
  iconClass: string;
  origin: string;
  originColor: string;
  title: string;
  titleColor: string;
  description: string;
  aiDescription: string;
  features: string[];
  link: string;
  accentColor: "sky" | "orange" | "cyan";
  badge?: string;
  CarouselComponent: React.FC<{ isInView: boolean; onClose: () => void; link: string }>;
  cardRef?: (el: HTMLDivElement | null) => void;
}

const ExpandableProject = ({
  index, isExpanded, onToggle, isVisible, isOtherExpanded, icon, iconClass,
  origin, originColor, title, titleColor, description, aiDescription, features,
  link, accentColor, badge, CarouselComponent, cardRef,
}: ExpandableProjectProps) => {
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Set both internal ref and external cardRef
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (cardRef) cardRef(el);
  }, [cardRef]);

  useEffect(() => {
    if (isExpanded) {
      setIsInView(true);
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isExpanded]);

  const glowColor = accentColor === "sky" ? "rgba(56, 189, 248, 0.4)" : accentColor === "orange" ? "rgba(251, 146, 60, 0.4)" : "rgba(34, 211, 238, 0.4)";
  const solidColor = accentColor === "sky" ? "#38bdf8" : accentColor === "orange" ? "#fb923c" : "#22d3ee";
  const badgeClass = accentColor === "sky" ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : accentColor === "orange" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";

  if (isOtherExpanded) {
    return (
      <div ref={setRefs} className="transition-all duration-1000 ease-in-out" style={{ opacity: isVisible ? 0.7 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transitionDelay: `${300 + index * 150}ms` }}>
        <div className="service-card group relative overflow-hidden cursor-pointer hover:opacity-100 transition-all duration-500 hover:scale-[1.02]" onClick={onToggle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {/* Shimmer disabled on collapsed cards */}
          {badge && <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-medium z-20 border ${badgeClass}`}>{badge}</div>}
          <div className="flex items-center gap-4 p-4">
            <div className={`icon-box ${iconClass} flex-shrink-0 scale-75 transition-transform duration-500 group-hover:scale-90`}>{icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${originColor}`}>{origin}</p>
              <h3 className={`text-base font-bold tracking-tight ${titleColor} truncate`}>{title}</h3>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-500 flex-shrink-0 group-hover:rotate-180" style={{ color: solidColor }}>
              <ArrowRightLeft size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setRefs} className={`transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col scroll-mt-24 ${isExpanded ? "h-auto lg:h-[500px]" : "h-full"}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transitionDelay: `${300 + index * 150}ms` }}>
      <div className={`flex ${isExpanded ? "flex-col lg:flex-row" : "flex-col"} gap-6 flex-1 h-full`}>
        <div className={`service-card card-hover-glow group relative overflow-hidden flex flex-col transition-all duration-1000 ${isExpanded ? "lg:w-[380px] w-full h-full" : "w-full h-full"}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ '--glow-color': glowColor, boxShadow: isHovered && !isExpanded ? `0 0 30px ${glowColor}` : 'none' } as React.CSSProperties}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)` }} />
          <FloatingParticles color={solidColor} />
          {/* Shimmer disabled */}
          
          {badge && <div className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-medium z-20 border ${badgeClass}`}>{badge}</div>}
          
          <button onClick={(e) => { e.preventDefault(); onToggle(); }} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95" style={{ color: solidColor }}>
            {isExpanded ? <X size={16} className="transition-transform duration-300 hover:rotate-90" /> : <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-700" />}
          </button>

          <div className="flex flex-col flex-1 p-1 relative z-10">
            <div className={`icon-box ${iconClass} mb-4 flex-shrink-0 mt-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>{icon}</div>
            <p className={`text-xs font-medium mb-1 flex-shrink-0 ${originColor}`}>{origin}</p>
            <h3 className={`text-lg font-bold tracking-tight mb-2 flex-shrink-0 ${titleColor} transition-all duration-300 group-hover:translate-x-1`}>{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-shrink-0">{description}</p>
            
            <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-primary/5 flex-shrink-0 transition-all duration-500 group-hover:bg-primary/10 group-hover:translate-x-1">
              <SparklesIcon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-xs leading-relaxed text-primary/90">{aiDescription}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 flex-shrink-0">
              {features.map((f, i) => (
                <span key={i} className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105" style={{ transitionDelay: `${i * 50}ms` }}>{f}</span>
              ))}
            </div>

            <div className="mt-auto pt-2 border-t border-white/5">
              <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:underline group/link transition-all duration-300 hover:gap-3" style={{ color: solidColor }}>
                Visit App
                <ExternalLink size={12} className="transition-all duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
              </a>
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

// Auto-swipe hook
const useAutoSwipe = (tabCount: number, interval: number = 5000) => {
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
      
      if (progressRef.current >= 100) {
        nextTab();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [activeTab, interval, isPaused, nextTab]);

  const goToTab = (index: number) => {
    setActiveTab(index);
    setProgress(0);
    progressRef.current = 0;
  };

  return { activeTab, progress, goToTab, setIsPaused };
};

// Rent vs Buy Carousel
const RentVsBuyCarousel = ({ isInView, onClose, link }: { isInView: boolean; onClose: () => void; link: string }) => {
  const tabs = ["Verdict", "Break-Even", "Opportunity", "Insights"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(link, "_blank"); }} />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono">rentvsbuy.abhishek221b.app</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 py-2 bg-black/10 border-b border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => goToTab(i)} className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? "bg-sky-500/20 text-sky-400" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
            {tab}
            {activeTab === i && <div className="absolute bottom-0 left-0 h-0.5 bg-sky-400 transition-all duration-100" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div key={activeTab} className="animate-fade-slide-up">
          {activeTab === 0 && <RVBVerdictTab />}
          {activeTab === 1 && <RVBBreakEvenTab />}
          {activeTab === 2 && <RVBOpportunityCostTab />}
          {activeTab === 3 && <RVBInsightsTab />}
        </div>
      </div>
    </div>
  );
};

const RVBVerdictTab = () => (
  <div className="space-y-4 h-full">
    <div className="text-xs text-muted-foreground mb-2">Example: M15 Manchester, £260,000 property</div>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={0}>
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 transition-all duration-300 hover:bg-sky-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-sky-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Break-Even Point</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-sky-400">Immediate</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={1}>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 transition-all duration-300 hover:bg-amber-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-amber-400" />
            <span className="text-xs text-muted-foreground">Required Return</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400">7.8%</p>
          <p className="text-[10px] text-muted-foreground">Current: 7% (need 0.8% more)</p>
        </div>
      </StaggeredChild>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={2}>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition-all duration-300 hover:bg-emerald-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-emerald-400" />
            <span className="text-xs text-muted-foreground">Total Interest</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">£150k</p>
          <p className="text-[10px] text-muted-foreground">On £225,000 borrowed</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={3}>
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 transition-all duration-300 hover:bg-orange-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Building size={16} className="text-orange-400" />
            <span className="text-xs text-muted-foreground">Total Rent Paid</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-400">£360k</p>
          <p className="text-[10px] text-muted-foreground">Over 25 years</p>
        </div>
      </StaggeredChild>
    </div>
  </div>
);

const RVBBreakEvenTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-white">Key Metrics</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Deposit</p>
            <p className="text-xl font-bold text-white">10%</p>
            <p className="text-[10px] text-muted-foreground">£26,000</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">LTV Ratio</p>
            <p className="text-xl font-bold text-white">90%</p>
            <p className="text-[10px] text-muted-foreground">Loan to Value</p>
          </div>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Monthly Comparison</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white">Mortgage Payment</span>
            <span className="text-sm font-bold text-sky-400">£1,180</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white">Average Rent</span>
            <span className="text-sm font-bold text-orange-400">£1,200</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: '98%' }} />
          </div>
          <p className="text-[10px] text-emerald-400 text-center">Buying is 1.7% cheaper monthly</p>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const RVBOpportunityCostTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="text-xs text-muted-foreground mb-2">If you invested the deposit instead...</div>
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 transition-all duration-300 hover:bg-violet-500/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-violet-400" />
          <span className="text-sm font-medium text-white">Investment Growth Projection</span>
        </div>
        <div className="h-24 relative mb-3">
          <svg className="w-full h-full" viewBox="0 0 200 80">
            <defs>
              <linearGradient id="investGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,70 Q50,65 80,50 T160,25 T200,15" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M0,70 Q50,65 80,50 T160,25 T200,15 L200,80 L0,80 Z" fill="url(#investGrad)" />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-[10px] text-muted-foreground">5 Years</p><p className="text-sm font-bold text-violet-400">£35k</p></div>
          <div><p className="text-[10px] text-muted-foreground">15 Years</p><p className="text-sm font-bold text-violet-400">£78k</p></div>
          <div><p className="text-[10px] text-muted-foreground">25 Years</p><p className="text-sm font-bold text-violet-400">£142k</p></div>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
        <div className="flex items-start gap-2">
          <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-muted-foreground">At 7% annual returns, your deposit could grow significantly. But property appreciation may outpace this in high-growth areas.</p>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const RVBInsightsTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-white">AI Recommendation</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Home size={24} className="text-emerald-400 animate-bounce-subtle" />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-400">Buy</p>
            <p className="text-xs text-muted-foreground">Confidence: 73%</p>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all duration-1000" style={{ width: '73%' }} />
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Key Factors</p>
        {[
          { factor: "Strong rental market in M15", positive: true },
          { factor: "Below-average deposit requirement", positive: true },
          { factor: "Interest rates trending down", positive: true },
          { factor: "High stamp duty costs", positive: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10">
            {item.positive ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-red-400" />}
            <span className="text-xs text-white">{item.factor}</span>
          </div>
        ))}
      </div>
    </StaggeredChild>
  </div>
);

// Euro Trip Carousel
const EuroTripCarousel = ({ isInView, onClose, link }: { isInView: boolean; onClose: () => void; link: string }) => {
  const tabs = ["Travel Style", "Destinations", "Budget", "Itinerary"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(link, "_blank"); }} />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono">eurotravel.abhishek221b.app</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 py-2 bg-black/10 border-b border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => goToTab(i)} className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? "bg-orange-500/20 text-orange-400" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
            {tab}
            {activeTab === i && <div className="absolute bottom-0 left-0 h-0.5 bg-orange-400 transition-all duration-100" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div key={activeTab} className="animate-fade-slide-up">
          {activeTab === 0 && <ETModeTab />}
          {activeTab === 1 && <ETDestinationTab />}
          {activeTab === 2 && <ETBudgetTab />}
          {activeTab === 3 && <ETItineraryTab />}
        </div>
      </div>
    </div>
  );
};

const ETModeTab = () => (
  <div className="space-y-3 h-full">
    <div className="text-xs text-muted-foreground mb-2">Choose your travel style</div>
    {[
      { mode: "Budget", icon: Briefcase, desc: "Hostels, budget airlines, street food", price: "€40-80/day", color: "sky" },
      { mode: "Standard", icon: Users, desc: "3-star hotels, mixed transport, local", price: "€100-150/day", color: "amber" },
      { mode: "Premium", icon: Sparkles, desc: "4-5 star hotels, direct flights, fine dining", price: "€250+/day", color: "orange" },
    ].map((m, i) => (
      <StaggeredChild key={i} index={i}>
        <div className={`rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${m.color === "sky" ? "border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10" : m.color === "amber" ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10" : "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 ${m.color === "sky" ? "bg-sky-500/20" : m.color === "amber" ? "bg-amber-500/20" : "bg-orange-500/20"}`}>
                <m.icon size={18} className={m.color === "sky" ? "text-sky-400" : m.color === "amber" ? "text-amber-400" : "text-orange-400"} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{m.mode}</p>
                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${m.color === "sky" ? "text-sky-400" : m.color === "amber" ? "text-amber-400" : "text-orange-400"}`}>{m.price}</p>
          </div>
        </div>
      </StaggeredChild>
    ))}
  </div>
);

const ETDestinationTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4 transition-all duration-300 hover:from-orange-500/15">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center text-3xl animate-bounce-subtle">🇵🇹</div>
          <div>
            <p className="text-xs text-orange-400">Based on your vibe: Culture + Food</p>
            <p className="text-xl font-bold text-white">Lisbon, Portugal</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Sun size={12} className="text-amber-400" />
              <span>22°C</span>
              <span>•</span>
              <Clock size={12} />
              <span>2h 45m flight</span>
            </div>
          </div>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="grid grid-cols-3 gap-2">
        {[{ flag: "🇮🇹", city: "Rome", vibe: "History" }, { flag: "🇪🇸", city: "Barcelona", vibe: "Beach + Art" }, { flag: "🇫🇷", city: "Paris", vibe: "Romance" }].map((d, i) => (
          <div key={i} className="rounded-lg bg-white/5 p-3 text-center transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
            <p className="text-lg">{d.flag}</p>
            <p className="text-xs text-white mt-1">{d.city}</p>
            <p className="text-[9px] text-muted-foreground">{d.vibe}</p>
          </div>
        ))}
      </div>
    </StaggeredChild>
    <StaggeredChild index={2}>
      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="text-violet-400 animate-pulse" />
          <span className="text-xs text-white">AI Suggestion</span>
        </div>
        <p className="text-[10px] text-muted-foreground">Consider adding Porto for a day trip - just 3 hours by train with stunning architecture.</p>
      </div>
    </StaggeredChild>
  </div>
);

const ETBudgetTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">7-Day Estimate</span>
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">Standard Mode</span>
        </div>
        <p className="text-3xl font-bold text-orange-400 mb-2">€1,240</p>
        <p className="text-[10px] text-muted-foreground">~€177/day average</p>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="space-y-2">
        {[
          { icon: Hotel, label: "Accommodation", amount: "€490", pct: 40, color: "sky" },
          { icon: Plane, label: "Transport", amount: "€280", pct: 23, color: "violet" },
          { icon: Utensils, label: "Food & Drinks", amount: "€310", pct: 25, color: "amber" },
          { icon: Camera, label: "Activities", amount: "€160", pct: 12, color: "emerald" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 transition-all duration-300 hover:translate-x-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color === "sky" ? "bg-sky-500/20" : item.color === "violet" ? "bg-violet-500/20" : item.color === "amber" ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>
              <item.icon size={14} className={item.color === "sky" ? "text-sky-400" : item.color === "violet" ? "text-violet-400" : item.color === "amber" ? "text-amber-400" : "text-emerald-400"} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">{item.label}</span>
                <span className="text-muted-foreground">{item.amount}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${item.color === "sky" ? "bg-sky-500" : item.color === "violet" ? "bg-violet-500" : item.color === "amber" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </StaggeredChild>
  </div>
);

const ETItineraryTab = () => (
  <div className="space-y-3 h-full">
    <div className="text-xs text-muted-foreground mb-2">Your personalized 7-day adventure</div>
    {[
      { day: "Day 1-2", city: "Lisbon", activities: "Alfama, Belém Tower, Pastéis", emoji: "🇵🇹" },
      { day: "Day 3", city: "Sintra", activities: "Day trip - Pena Palace", emoji: "🏰" },
      { day: "Day 4-5", city: "Porto", activities: "Wine cellars, Ribeira", emoji: "🍷" },
      { day: "Day 6-7", city: "Barcelona", activities: "Sagrada Família, La Rambla", emoji: "🇪🇸" },
    ].map((item, i) => (
      <StaggeredChild key={i} index={i}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30 cursor-pointer group">
          <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-orange-400">{item.day}</span>
              <span className="text-xs text-white">•</span>
              <span className="text-sm font-medium text-white">{item.city}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{item.activities}</p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground group-hover:text-orange-400 transition-colors duration-300" />
        </div>
      </StaggeredChild>
    ))}
  </div>
);

// Global Money Manager Carousel
const GlobalMoneyCarousel = ({ isInView, onClose, link }: { isInView: boolean; onClose: () => void; link: string }) => {
  const tabs = ["Net Worth", "Allocation", "Insights", "FX Impact"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(link, "_blank"); }} />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono">globalmoney.abhishek221b.app</div>
        </div>
      </div>
      <div className="flex items-center gap-1 px-4 py-2 bg-black/10 border-b border-white/5 overflow-x-auto no-scrollbar flex-shrink-0">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => goToTab(i)} className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
            {tab}
            {activeTab === i && <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-100" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div key={activeTab} className="animate-fade-slide-up">
          {activeTab === 0 && <GMMNetWorthTab />}
          {activeTab === 1 && <GMMAllocationTab />}
          {activeTab === 2 && <GMMInsightsTab />}
          {activeTab === 3 && <GMMFXImpactTab />}
        </div>
      </div>
    </div>
  );
};

const GMMNetWorthTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-4 transition-all duration-300 hover:from-cyan-500/15">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-cyan-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Total Net Worth (GBP)</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">+3.8% MTD</span>
        </div>
        <p className="text-3xl font-bold text-white">£487,200</p>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={1}>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 transition-all duration-300 hover:bg-emerald-500/10">
          <p className="text-[10px] text-emerald-400 uppercase mb-1">Assets</p>
          <p className="text-lg font-bold text-emerald-400">£612k</p>
          <div className="mt-2 space-y-1 text-[9px] text-muted-foreground">
            <div className="flex justify-between"><span>Property</span><span>£245k</span></div>
            <div className="flex justify-between"><span>Investments</span><span>£198k</span></div>
          </div>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 transition-all duration-300 hover:bg-red-500/10">
          <p className="text-[10px] text-red-400 uppercase mb-1">Liabilities</p>
          <p className="text-lg font-bold text-red-400">£125k</p>
          <div className="mt-2 space-y-1 text-[9px] text-muted-foreground">
            <div className="flex justify-between"><span>Home Loan</span><span>£98k</span></div>
            <div className="flex justify-between"><span>Car Loan</span><span>£27k</span></div>
          </div>
        </div>
      </StaggeredChild>
    </div>
  </div>
);

const GMMAllocationTab = () => (
  <div className="space-y-4 h-full">
    <div className="grid grid-cols-2 gap-4">
      <StaggeredChild index={0}>
        <div>
          <p className="text-xs text-muted-foreground mb-2">By Country</p>
          <div className="space-y-2">
            {[{ flag: "🇬🇧", country: "UK", pct: "45%", color: "bg-cyan-500" }, { flag: "🇮🇳", country: "India", pct: "35%", color: "bg-orange-500" }, { flag: "🇺🇸", country: "USA", pct: "20%", color: "bg-blue-500" }].map((c, i) => (
              <div key={i} className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                <span className="text-sm">{c.flag}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-white">{c.country}</span>
                    <span className="text-muted-foreground">{c.pct}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full transition-all duration-1000`} style={{ width: c.pct }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggeredChild>
      <StaggeredChild index={1}>
        <div>
          <p className="text-xs text-muted-foreground mb-2">By Asset Class</p>
          <div className="space-y-2">
            {[{ label: "Real Estate", pct: "40%", color: "bg-emerald-500" }, { label: "Equities", pct: "32%", color: "bg-blue-500" }, { label: "Cash", pct: "18%", color: "bg-amber-500" }, { label: "Crypto", pct: "10%", color: "bg-violet-500" }].map((c, i) => (
              <div key={i} className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                <div className={`w-2 h-2 rounded-full ${c.color}`} />
                <div className="flex-1 flex justify-between text-[10px]">
                  <span className="text-white">{c.label}</span>
                  <span className="text-muted-foreground">{c.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggeredChild>
    </div>
  </div>
);

const GMMInsightsTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Net Worth Over Time</span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">Inflation adj.</span>
          <div className="w-8 h-4 bg-cyan-500/30 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 200 80">
          <defs>
            <linearGradient id="nwGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,70 L30,65 L60,55 L90,50 L120,42 L150,35 L180,25 L200,20" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <path d="M0,70 L30,65 L60,55 L90,50 L120,42 L150,35 L180,25 L200,20 L200,80 L0,80 Z" fill="url(#nwGrad)" />
          <path d="M0,30 L30,32 L60,35 L90,40 L120,48 L150,58 L180,68 L200,75" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-muted-foreground">
          <span>2020</span><span>2022</span><span>2024</span><span>Now</span>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={2}>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <div className="w-2 h-0.5 bg-cyan-500 rounded" />
          <span className="text-white">Growth</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <div className="w-2 h-0.5 bg-red-500 rounded opacity-60" style={{ background: "repeating-linear-gradient(90deg, #ef4444 0, #ef4444 2px, transparent 2px, transparent 4px)" }} />
          <span className="text-white">Debt Paydown</span>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const GMMFXImpactTab = () => (
  <div className="space-y-4 h-full">
    <div className="text-xs text-muted-foreground mb-2">Currency impact on wealth</div>
    <div className="space-y-2">
      {[
        { pair: "GBP/INR", rate: "104.82", impact: "+£3,240", up: true, note: "INR weakness boosted property value" },
        { pair: "GBP/USD", rate: "1.27", impact: "-£1,890", up: false, note: "USD strength reduced holdings" },
      ].map((fx, i) => (
        <StaggeredChild key={i} index={i}>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowRightLeft size={14} className="text-cyan-400" />
                <span className="text-sm font-medium text-white">{fx.pair}</span>
                <span className="text-xs text-muted-foreground">{fx.rate}</span>
              </div>
              <span className={`text-sm font-bold ${fx.up ? "text-emerald-400" : "text-red-400"}`}>{fx.impact}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{fx.note}</p>
          </div>
        </StaggeredChild>
      ))}
    </div>
    <StaggeredChild index={2}>
      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3 transition-all duration-300 hover:bg-violet-500/15">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="text-violet-400 animate-pulse" />
          <span className="text-xs text-white">Net FX Impact This Month</span>
        </div>
        <p className="text-lg font-bold text-violet-400">+£1,350</p>
      </div>
    </StaggeredChild>
  </div>
);

export default ProjectsSection;
