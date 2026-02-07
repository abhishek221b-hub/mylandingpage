import { useState, useRef, useEffect, useCallback } from "react";
import { SparklesIcon } from "./Icons";
import AnimateOnScroll from "./AnimateOnScroll";
import {
  Heart,
  Calendar,
  Activity,
  CheckCircle2,
  Sparkles,
  Utensils,
  Syringe,
  AlertTriangle,
  Send,
  Moon,
  Pill,
  Scale,
  ArrowRightLeft,
  X,
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

// Custom Component: First Woof App Icon
const FirstWoofLogo = () => (
  <div className="w-14 h-14 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.963-1.454 2.344-2.5" />
      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.963-1.454-2.344-2.5" />
      <path d="M9 14v2" />
      <path d="M15 14v2" />
      <path d="M12 17.5a2.5 2.5 0 0 0-2.5-2.5h-5" />
      <path d="M12 17.5a2.5 2.5 0 0 1 2.5-2.5h5" />
      <rect x="11" y="14" width="2" height="2" rx="1" fill="currentColor" stroke="none" />
    </svg>
  </div>
);

const LabSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleExpand = () => {
    const willClose = isExpanded;
    setIsExpanded(!isExpanded);
    
    if (willClose) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const glowColor = "rgba(139, 92, 246, 0.4)";
  const solidColor = "#8b5cf6";

  return (
    <section id="lab" className="py-20 relative overflow-hidden scroll-mt-16" ref={sectionRef}>
      {/* Animation styles */}
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
          <div className="flex items-center gap-4 mb-3">
            <p className="section-label">Lab</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
            What I'm <span className="text-violet-400">Building</span>
          </h2>
          <p className="text-muted-foreground max-w-xl">Thoughts in development.</p>
        </AnimateOnScroll>

        {/* Card + Carousel Layout */}
        <div
          ref={cardRef}
          className="transition-all duration-1000 scroll-mt-24"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          {/* Main Row - Card + Carousel */}
          <div className="flex flex-col lg:flex-row gap-6 lg:h-[500px] transition-all duration-1000 ease-out">
            {/* ----------------- SERVICE CARD ----------------- */}
            <div
              className={`service-card card-hover-glow group relative overflow-hidden flex flex-col h-full transition-all duration-1000 ease-out ${isExpanded ? "lg:w-[380px] flex-shrink-0" : "w-full lg:w-1/2 lg:mx-auto lg:max-w-[500px]"}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                '--glow-color': glowColor,
                boxShadow: isHovered && !isExpanded ? `0 0 30px ${glowColor}` : 'none',
              } as React.CSSProperties}
            >
              {/* Animated background gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)` }}
              />
              
              {/* Floating particles */}
              <FloatingParticles color={solidColor} />
              
              {/* Shimmer border on hover */}
              <ShimmerBorder color={solidColor} isActive={isHovered && !isExpanded} />

              {/* Alpha Badge - Top Left */}
              <div className="absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30 z-20 backdrop-blur-sm">
                Alpha
              </div>

              {/* Reversible Arrow - Top Right */}
              <button
                onClick={toggleExpand}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-500 text-violet-400 hover:scale-110 active:scale-95"
              >
                {isExpanded ? (
                  <X size={16} className="transition-transform duration-300 hover:rotate-90" />
                ) : (
                  <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                )}
              </button>

              {/* Content */}
              <div className="pt-8 px-1 flex flex-col h-full relative z-10">
                {/* Icon Box */}
                <div className="mb-3 flex-shrink-0">
                  <FirstWoofLogo />
                </div>

                <p className="text-xs font-medium mb-0.5 text-violet-400 flex-shrink-0">AI Puppy Companion</p>
                <h3 className="text-lg font-bold tracking-tight mb-2 text-violet-400 flex-shrink-0 transition-all duration-300 group-hover:translate-x-1">First Woof</h3>
                <p className="text-sm leading-relaxed text-muted-foreground mb-3 flex-shrink-0">
                  A puppy in my life brought so much joy but also an overwhelming amount of information to manage. What
                  started as a custom GPT is now a motivation to build something more intuitive.
                </p>

                <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-primary/5 flex-shrink-0 transition-all duration-500 group-hover:bg-primary/10 group-hover:translate-x-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs leading-relaxed text-primary/90">
                    AI tracks health, diet, and milestones personalized to your puppy's breed and age.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2 flex-shrink-0">
                  {["Health tracking", "Diet guidance", "Milestone reminders"].map((f, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Provide Feedback Link - Pushed to bottom */}
                <div className="mt-auto pt-2 border-t border-white/5 flex-shrink-0">
                  <a
                    href="https://firstwoof.abhishek221b.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline group/link text-violet-400 transition-all duration-300 hover:gap-3"
                  >
                    Provide Feedback
                    <ExternalLink
                      size={12}
                      className="transition-all duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* ----------------- CAROUSEL (Expanded View) ----------------- */}
            {isExpanded && (
              <div className="flex-1 min-w-0 h-full flex flex-col animate-scale-in">
                <FirstWoofCarousel onClose={toggleExpand} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// First Woof Carousel with auto-swipe
const FirstWoofCarousel = ({ onClose }: { onClose: () => void }) => {
  const tabs = ["Overview", "Health", "Nutrition", "AI Chat"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <div 
      className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden h-full flex flex-col min-h-[420px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Browser Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} />
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://firstwoof.abhishek221b.app", "_blank"); }} />
        </div>
        <div className="flex-1 mx-4">
          <a
            href="https://firstwoof.abhishek221b.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate block hover:text-white hover:bg-white/10 transition-colors font-mono"
          >
            firstwoof.abhishek221b.app
          </a>
        </div>
      </div>

      {/* Tabs with progress */}
      <div className="flex items-center gap-1 px-4 py-2 bg-black/10 border-b border-white/5 flex-shrink-0">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => goToTab(i)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? "bg-violet-500/20 text-violet-400" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
          >
            {tab}
            {activeTab === i && <div className="absolute bottom-0 left-0 h-0.5 bg-violet-400 transition-all duration-100" style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        <div key={activeTab} className="animate-fade-slide-up">
          {activeTab === 0 && <OverviewTab />}
          {activeTab === 1 && <HealthTab />}
          {activeTab === 2 && <NutritionTab />}
          {activeTab === 3 && <AIChatTab />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => (
  <div className="space-y-4">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-4 transition-all duration-300 hover:from-violet-500/15">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 relative">
            <img
              src="https://i.ibb.co/Xr1XFDmT/eira.jpgauto=format&fit=crop&w=150&q=80"
              alt="Eira"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-violet-400">Your Puppy</p>
            <p className="text-xl font-bold text-white">Eira</p>
            <p className="text-[10px] text-muted-foreground">Miniature Dachshund • 7 months</p>
          </div>
        </div>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={1}>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-violet-400" />
            <span className="text-[10px] text-muted-foreground">Age</span>
          </div>
          <p className="text-lg font-bold text-white">28 weeks</p>
          <p className="text-[9px] text-muted-foreground">196 days old</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Scale size={14} className="text-emerald-400" />
            <span className="text-[10px] text-muted-foreground">Weight</span>
          </div>
          <p className="text-lg font-bold text-white">5.4 kg</p>
          <p className="text-[9px] text-emerald-400">+0.3 kg this month</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={3}>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={14} className="text-red-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Health Score</span>
          </div>
          <p className="text-lg font-bold text-white">94/100</p>
          <p className="text-[9px] text-muted-foreground">Excellent</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={4}>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-orange-400" />
            <span className="text-[10px] text-muted-foreground">Activity</span>
          </div>
          <p className="text-lg font-bold text-white">52 min</p>
          <p className="text-[9px] text-muted-foreground">Goal: 60 min</p>
        </div>
      </StaggeredChild>
    </div>
    <StaggeredChild index={5}>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-white">Weight Progress</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">On Track</span>
        </div>
        <div className="h-12">
          <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="weightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,35 L40,30 L80,24 L120,18 L160,12 L200,8" fill="none" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M0,35 L40,30 L80,24 L120,18 L160,12 L200,8 L200,40 L0,40 Z" fill="url(#weightGrad)" />
            <circle cx="200" cy="8" r="3" fill="#22c55e" className="animate-pulse" />
          </svg>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>Month 1</span>
          <span>Now</span>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

// Health Tab
const HealthTab = () => (
  <div className="space-y-4">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Syringe size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-white">Vaccinations</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded ml-auto">Up to date</span>
        </div>
        <div className="space-y-2">
          {[
            { name: "DHPP", status: "Complete", date: "Oct 15", done: true },
            { name: "Rabies", status: "Due", date: "Jan 15", done: false },
            { name: "Bordetella", status: "Complete", date: "Nov 20", done: true },
            { name: "Leptospirosis", status: "Complete", date: "Nov 20", done: true },
          ].map((v, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className={v.done ? "text-emerald-400" : "text-amber-400 animate-pulse"} />
                <span className="text-xs text-white">{v.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] ${v.done ? "text-emerald-400" : "text-amber-400"}`}>{v.status}</span>
                <p className="text-[9px] text-muted-foreground">{v.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={1}>
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 transition-all duration-300 hover:bg-violet-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Pill size={14} className="text-violet-400" />
            <span className="text-[10px] text-violet-400">Deworming</span>
          </div>
          <p className="text-xs text-white">Next: Jan 5</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 transition-all duration-300 hover:bg-cyan-500/10 hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-2">
            <Moon size={14} className="text-cyan-400" />
            <span className="text-[10px] text-cyan-400">Flea/Tick</span>
          </div>
          <p className="text-xs text-white">Active until Feb 1</p>
        </div>
      </StaggeredChild>
    </div>
  </div>
);

// Nutrition Tab
const NutritionTab = () => (
  <div className="space-y-4">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 transition-all duration-300 hover:bg-amber-500/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Utensils size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-amber-400">Current Diet</p>
            <p className="text-sm font-bold text-white">Orijen Puppy</p>
            <p className="text-[10px] text-muted-foreground">320g daily • Split into 3 meals</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "Protein", value: "38%" },
            { label: "Fat", value: "20%" },
            { label: "Fiber", value: "6%" },
          ].map((item, i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10">
              <p className="text-[9px] text-muted-foreground">{item.label}</p>
              <p className="text-xs font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={1}>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 transition-all duration-300 hover:bg-emerald-500/10">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span className="text-[10px] font-medium text-white">Safe Treats</span>
          </div>
          <div className="space-y-1">
            {["Carrots", "Blueberries", "Watermelon", "Pumpkin"].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground transition-all duration-300 hover:text-white hover:translate-x-1">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 transition-all duration-300 hover:bg-red-500/10">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-[10px] font-medium text-white">Avoid</span>
          </div>
          <div className="space-y-1">
            {["Chocolate", "Grapes", "Onions", "Xylitol"].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground transition-all duration-300 hover:text-white hover:translate-x-1">
                <div className="w-1 h-1 rounded-full bg-red-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </StaggeredChild>
    </div>
  </div>
);

// AI Chat Tab
const AIChatTab = () => (
  <div className="flex flex-col h-full min-h-[280px]">
    <div className="flex-1 space-y-3 overflow-hidden">
      <StaggeredChild index={0}>
        <div className="flex justify-end">
          <div className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-3 py-2 max-w-[80%] transition-all duration-300 hover:bg-violet-500/25">
            <p className="text-xs text-white">Is it normal for my puppy to sleep 18 hours a day?</p>
          </div>
        </div>
      </StaggeredChild>

      <StaggeredChild index={1}>
        <div className="flex justify-start">
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 max-w-[85%] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={10} className="text-violet-400 animate-pulse" />
              <span className="text-[10px] text-violet-400">First Woof AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yes! At 7 months, puppies typically sleep 14-18 hours daily. This is crucial for their development. Based on
              Eira's activity data, her sleep pattern is healthy. She's getting good exercise during waking hours. 🐕
            </p>
          </div>
        </div>
      </StaggeredChild>

      <StaggeredChild index={2}>
        <div className="flex justify-end">
          <div className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-3 py-2 max-w-[80%] transition-all duration-300 hover:bg-violet-500/25">
            <p className="text-xs text-white">What commands should I focus on at this age?</p>
          </div>
        </div>
      </StaggeredChild>

      <StaggeredChild index={3}>
        <div className="flex justify-start">
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 max-w-[85%] transition-all duration-300 hover:bg-white/10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={10} className="text-violet-400 animate-pulse" />
              <span className="text-[10px] text-violet-400">First Woof AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              At 7 months, Eira can handle more complex commands. Focus on: <strong className="text-white">Stay</strong>{" "}
              (duration), <strong className="text-white">Place</strong> (go to bed), and{" "}
              <strong className="text-white">Leave it</strong>. Dachshunds are smart but independent — keep sessions under
              10 minutes!
            </p>
          </div>
        </div>
      </StaggeredChild>
    </div>

    <StaggeredChild index={4}>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 transition-all duration-300 hover:bg-white/10 hover:border-violet-500/30">
          <p className="text-xs text-muted-foreground/50">Ask about your puppy...</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center cursor-pointer hover:bg-violet-500/30 hover:scale-110 transition-all duration-300">
          <Send size={14} className="text-violet-400" />
        </div>
      </div>
    </StaggeredChild>
  </div>
);

export default LabSection;
