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
import { CardSection, type CardData } from "./CardSystem";
import SpectrumPreview from "./previews/SpectrumPreview";

// Staggered animation wrapper
const StaggeredChild = ({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) => (
  <div
    className={`animate-fade-slide-up ${className}`}
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
  >
    {children}
  </div>
);

const ProjectsSection = () => {
  const cards: CardData[] = [
    {
      icon: <img src="/icons/spectrum-favicon.png" alt="Spectrum" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "cyan",
      iconColor: "#5b95f7",
      origin: "AI Career Intelligence",
      title: "Spectrum",
      description: "Describe your role and Spectrum maps the work itself — surfacing every skill, scoring where AI threatens, transforms or supercharges it, and the human moat that keeps you irreplaceable.",
      insight: "Every task gets a risk score and a recommended move — grow it, augment it, or let AI take it.",
      features: ["Skill discovery", "AI risk scoring", "Human moat", "Spectrum score"],
      badge: "New",
      cta: { kind: "visit", link: "https://spectrum.abhishek221b.app" },
      link: "https://spectrum.abhishek221b.app",
      CarouselComponent: SpectrumPreview,
    },
    {
      icon: <img src="/icons/eurotraveller-favicon.png" alt="Europe Trip Planner" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "orange",
      iconColor: "#fb923c",
      origin: "Personalized Travel AI",
      title: "Europe Trip Planner",
      description: "I was fascinated by how densely interconnected Europe is — a short flight can take you to a completely new place, cuisine, and culture. This AI-assisted tool plans trips based on your vibe and travel mode.",
      insight: "AI creates personalized itineraries from budget backpacking to luxury escapes.",
      features: ["Budget to luxury modes", "Multi-city routing", "Vibe-based planning"],
      badge: "Beta",
      cta: { kind: "visit", link: "https://eurotravel.abhishek221b.app" },
      link: "https://eurotravel.abhishek221b.app",
      CarouselComponent: EuroTripCarousel,
    },
    {
      icon: <img src="/icons/globalmoney-favicon.png" alt="Global Money Manager" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "cyan",
      iconColor: "#a78bfa",
      origin: "Multi-Country Net Worth Tracker",
      title: "Global Money Manager",
      description: "Bank accounts in multiple countries. Investments in different currencies. Property overseas with remittances. I needed to track my assets and liabilities without endless spreadsheets.",
      insight: "Cross-border wealth insights with forecasting, real-time FX tracking and report generation.",
      features: ["Multi-currency support", "Real-time FX rates", "Cross-border insights"],
      badge: "Beta",
      cta: { kind: "visit", link: "https://globalmoney.abhishek221b.app" },
      link: "https://globalmoney.abhishek221b.app",
      CarouselComponent: GlobalMoneyCarousel,
    },
  ];

  return (
    <CardSection
      id="projects"
      titleLead="Featured"
      titleAccent="Projects"
      headingGradient="from-amber-300 via-orange-300 to-amber-300"
      subtitle="Tools built from real problems I've faced — each one started as a personal solution."
      glow="radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(56,189,248,0.05) 45%, transparent 70%)"
      cards={cards}
      navTargetId="utility"
      navLabel="Decision Tools"
    />
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

// Euro Trip Carousel
const EuroTripCarousel = ({ isInView, onClose, link }: { isInView: boolean; onClose: () => void; link: string }) => {
  const tabs = ["Travel Style", "Destinations", "Budget", "Itinerary"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
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
    <div className="rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
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
