import { useRef, useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionNavigator from "./SectionNavigator";
import {
  Globe,
  Scale,
  Layers,
  ShieldCheck,
  Wand2,
  Sparkles,
  ScanLine,
  AlertTriangle,
  ShieldAlert,
  Shield,
  Target,
  BarChart3,
  ArrowRightLeft,
  ExternalLink,
  X,
  Lock,
  TrendingDown,
  Check,
  Minus,
  Ban,
  Calculator,
} from "lucide-react";
import { CardSection, type CardData } from "./CardSystem";
import RentVsBuyPreview from "./previews/RentVsBuyPreview";
import DayZeroPreview from "./previews/DayZeroPreview";

/* ------------------------------------------------------------------ */
/* Shared helpers — same patterns as the project / personal carousels   */
/* ------------------------------------------------------------------ */

const StaggeredChild = ({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) => (
  <div
    className={`animate-fade-slide-up ${className}`}
    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
  >
    {children}
  </div>
);

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
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeTab, interval, isPaused, nextTab]);

  const goToTab = (index: number) => {
    setActiveTab(index);
    setProgress(0);
    progressRef.current = 0;
  };

  return { activeTab, progress, goToTab, setIsPaused };
};

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

/* Private-build browser window — address bar carries a lock, no public URL. */
const PrivateWindow = ({
  label,
  tabs,
  tint,
  activeTab,
  progress,
  goToTab,
  setIsPaused,
  onClose,
  children,
  bodyClassName = "",
  link,
}: {
  label: string;
  tabs: string[];
  tint: "emerald" | "cyan";
  activeTab: number;
  progress: number;
  goToTab: (i: number) => void;
  setIsPaused: (p: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  bodyClassName?: string;
  link?: string;
}) => {
  const activeCls =
    tint === "emerald"
      ? "bg-emerald-500/20 text-emerald-300"
      : "bg-cyan-500/20 text-cyan-300";
  const barCls = tint === "emerald" ? "bg-emerald-400" : "bg-cyan-400";
  return (
    <div
      className="rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col h-full min-h-[420px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} aria-label="Close preview" />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} aria-label="Close preview" />
          {link ? (
            <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all duration-300 hover:scale-110 border-0 p-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(link, "_blank", "noopener,noreferrer"); }} aria-label="Open live app" />
          ) : (
            <button className="w-3 h-3 rounded-full bg-green-500/40 border-0 p-0 cursor-default" aria-label="Private build — not yet public" />
          )}
        </div>
        <div className="flex-1 mx-4">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/5 hover:bg-white/10 rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-white truncate font-mono flex items-center gap-2 transition-colors"
            >
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
          <button
            key={tab}
            onClick={() => goToTab(i)}
            className={`px-3 py-1.5 text-xs rounded-md transition-all duration-300 whitespace-nowrap relative overflow-hidden ${activeTab === i ? activeCls : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
          >
            {tab}
            {activeTab === i && <div className={`absolute bottom-0 left-0 h-0.5 ${barCls} transition-all duration-100`} style={{ width: `${progress}%` }} />}
          </button>
        ))}
      </div>
      <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
    </div>
  );
};

/* ================================================================== */
/* RUPEEWISE (₹-bitrage) PREVIEW — faithful to the real app: light,     */
/* glassmorphic, emerald/violet accents, NRI subscription arbitrage.    */
/* ================================================================== */

const RupeeWisePreviewCarousel = ({ onClose }: { onClose: () => void }) => {
  const tabs = ["Services", "Savings", "Stack Analyzer", "Action Plan"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PrivateWindow
      label="r-bitrage.abhishek221b.app"
      link="https://r-bitrage.abhishek221b.app/"
      tabs={tabs}
      tint="emerald"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
      bodyClassName="bg-[#f6f7fb] text-slate-800"
    >
      <div key={activeTab} className="animate-fade-slide-up p-4">
        {activeTab === 0 && <RwServicesTab />}
        {activeTab === 1 && <RwSavingsTab />}
        {activeTab === 2 && <RwStackTab />}
        {activeTab === 3 && <RwPlanTab />}
      </div>
    </PrivateWindow>
  );
};

const RwWordmark = ({ sub }: { sub: string }) => (
  <div className="flex items-baseline justify-between mb-3">
    <p className="text-base font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <span
        className="bg-gradient-to-r from-[#6ee7b7] via-[#10b981] to-[#34d399] bg-clip-text text-transparent"
        style={{ textShadow: "0 0 8px rgba(52,211,153,0.2)" }}
      >
        ₹-bitrage
      </span>
    </p>
    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">{sub}</p>
  </div>
);

/* Verdict chip — switch / parity / optimal / keep-local (geo-blocked) / drop (ToS). */
const Verdict = ({ kind }: { kind: "switch" | "parity" | "optimal" | "keep" | "drop" }) => {
  const map = {
    switch: { label: "Switch", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: TrendingDown },
    parity: { label: "Parity", cls: "bg-slate-100 text-slate-500 border-slate-200", icon: Minus },
    optimal: { label: "Optimal", cls: "bg-violet-100 text-violet-700 border-violet-200", icon: Check },
    keep: { label: "Keep local", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Ban },
    drop: { label: "Drop · ToS", cls: "bg-rose-100 text-rose-700 border-rose-200", icon: ShieldAlert },
  } as const;
  const v = map[kind];
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border font-medium ${v.cls}`}>
      <v.icon size={9} />
      {v.label}
    </span>
  );
};

const ServiceDot = ({ letter, color }: { letter: string; color: string }) => (
  <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: color }}>
    {letter}
  </span>
);

const RwServicesTab = () => {
  const rows = [
    { l: "S", c: "#1db954", name: "Spotify Premium", india: "₹119", home: "£11.99", kind: "switch" as const },
    { l: "C", c: "#d97757", name: "ChatGPT Go (India-only)", india: "₹399", home: "£20", kind: "switch" as const },
    { l: "C", c: "#cc785c", name: "Claude Pro", india: "$20", home: "$20", kind: "parity" as const },
    { l: "Y", c: "#ff0000", name: "YouTube Premium", india: "₹149", home: "£12.99", kind: "switch" as const },
    { l: "N", c: "#e50914", name: "Netflix", india: "₹649", home: "£17.99", kind: "keep" as const },
    { l: "A", c: "#00a8e1", name: "Amazon Prime · old India plan", india: "₹299", home: "cancel", kind: "drop" as const },
  ];
  return (
    <div className="space-y-3">
      <RwWordmark sub="39 services · 4 markets" />
      <div className="flex items-center gap-2 text-[9px] text-slate-400 px-1">
        <span className="flex-1">Service</span>
        <span className="w-12 text-right">India</span>
        <span className="w-14 text-right">You pay</span>
        <span className="w-16 text-right">Verdict</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <StaggeredChild key={r.name} index={i + 1}>
            <div className={`flex items-center gap-2 rounded-xl bg-white border shadow-sm px-2.5 py-2 ${r.kind === "drop" ? "border-rose-200" : "border-slate-200/80"}`}>
              <ServiceDot letter={r.l} color={r.c} />
              <p className="flex-1 text-[11px] font-medium text-slate-700 truncate">{r.name}</p>
              <span className="w-12 text-right text-[10px] font-semibold text-emerald-600">{r.india}</span>
              <span className={`w-14 text-right text-[10px] ${r.kind === "drop" ? "text-rose-500 font-medium" : "text-slate-400 line-through"}`}>{r.home}</span>
              <span className="w-16 text-right"><Verdict kind={r.kind} /></span>
            </div>
          </StaggeredChild>
        ))}
      </div>
      <StaggeredChild index={rows.length + 1}>
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 flex items-start gap-2">
          <ShieldAlert size={13} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-rose-800 leading-relaxed">
            <b>ToS flag:</b> Prime &amp; Hotstar tie your plan to Indian residency. Keeping the old India
            subscription after you've moved abroad breaks their terms — cancel, don't carry it over.
          </p>
        </div>
      </StaggeredChild>
    </div>
  );
};

const RwSavingsTab = () => {
  const breakdown = [
    { name: "Spotify Premium", save: "£132 / yr", kind: "switch" as const },
    { name: "YouTube Premium", save: "£140 / yr", kind: "switch" as const },
    { name: "ChatGPT Go", save: "£196 / yr", kind: "switch" as const },
    { name: "Claude Pro", save: "globally priced", kind: "parity" as const },
    { name: "Netflix", save: "keep — geo-blocked", kind: "keep" as const },
    { name: "Amazon Prime (old India plan)", save: "cancel — breaks ToS", kind: "drop" as const },
  ];
  return (
    <div className="space-y-3">
      <RwWordmark sub="Savings analysis" />
      <StaggeredChild index={1}>
        <div className="rounded-2xl p-4 text-white relative overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)" }}>
          <div className="absolute -top-6 -right-4 w-24 h-24 rounded-full bg-white/10" />
          <p className="text-[10px] uppercase tracking-widest text-white/80">Estimated annual saving</p>
          <p className="text-3xl font-bold leading-none mt-1">£468</p>
          <p className="text-[11px] text-white/85 mt-1">≈ ₹59,700 · across 5 switchable services</p>
        </div>
      </StaggeredChild>
      <div className="space-y-1.5">
        {breakdown.map((b, i) => (
          <StaggeredChild key={b.name} index={i + 2}>
            <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200/80 px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Verdict kind={b.kind} />
                <p className="text-[11px] font-medium text-slate-700">{b.name}</p>
              </div>
              <p className={`text-[10px] font-semibold ${b.kind === "switch" ? "text-emerald-600" : b.kind === "drop" ? "text-rose-500" : "text-slate-400"}`}>{b.save}</p>
            </div>
          </StaggeredChild>
        ))}
      </div>
    </div>
  );
};

const RwStackTab = () => {
  const groups = [
    { fn: "AI Assistants", items: ["ChatGPT", "Claude", "Gemini"], keep: "Keep Claude Pro · drop 2", save: "£28 / mo" },
    { fn: "Music Streaming", items: ["Spotify", "Apple Music"], keep: "Keep Spotify · drop 1", save: "£9 / mo" },
    { fn: "Cloud Storage", items: ["iCloud+", "Google One"], keep: "Apple One already bundles iCloud", save: "£3 / mo" },
  ];
  return (
    <div className="space-y-3">
      <RwWordmark sub="Stack overlap analyzer" />
      <StaggeredChild index={1}>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-start gap-2">
          <Layers size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-emerald-800 leading-relaxed">You run <b>3 overlapping groups</b> — trimming duplicates saves <b>£40/mo</b> with zero loss of function.</p>
        </div>
      </StaggeredChild>
      <div className="space-y-2">
        {groups.map((g, i) => (
          <StaggeredChild key={g.fn} index={i + 2}>
            <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-800">{g.fn}</p>
                <span className="text-[10px] font-semibold text-emerald-600">{g.save}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {g.items.map((it, j) => (
                  <span key={it} className={`text-[9px] px-2 py-0.5 rounded-full border ${j === 0 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200 line-through"}`}>{it}</span>
                ))}
              </div>
              <p className="text-[9px] text-slate-500">{g.keep}</p>
            </div>
          </StaggeredChild>
        ))}
      </div>
    </div>
  );
};

const RwPlanTab = () => {
  const steps = [
    { t: "Switch 3 services to Indian billing", d: "Spotify, YouTube, ChatGPT Go", tag: "−£40/mo" },
    { t: "Right-size your AI tier", d: "Claude Max → Pro is plenty for your usage", tag: "−£75/mo" },
    { t: "Drop 2 duplicate AI tools", d: "Keep Claude; cancel ChatGPT Plus + Gemini", tag: "−£28/mo" },
    { t: "Cancel residency-locked Indian plans", d: "Prime & Hotstar break ToS once you've moved abroad", tag: "Compliance" },
    { t: "Move 3 services to annual", d: "Annual billing beats monthly on these", tag: "−£60/yr" },
  ];
  return (
    <div className="space-y-3">
      <RwWordmark sub="Action plan" />
      <div className="space-y-2">
        {steps.map((s, i) => (
          <StaggeredChild key={s.t} index={i + 1}>
            <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200/80 shadow-sm p-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800">{s.t}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{s.d}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">{s.tag}</span>
            </div>
          </StaggeredChild>
        ))}
      </div>
      <StaggeredChild index={5}>
        <div className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 flex items-start gap-2">
          <ShieldCheck size={12} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-500 leading-relaxed">Assumes genuine NRI ties + an Indian bank account. No VPN tricks — an Indian IP is expected at sign-up.</p>
        </div>
      </StaggeredChild>
    </div>
  );
};

/* ================================================================== */
/* Section                                                             */
/* ================================================================== */

const UtilityToolsSection = () => {
  const cards: CardData[] = [
    {
      icon: <img src="/icons/r-bitrage-favicon.png" alt="₹-bitrage" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "emerald",
      iconColor: "#34d399",
      origin: "Subscription Arbitrage · for NRIs",
      title: (
        <span
          className="bg-gradient-to-r from-[#6ee7b7] via-[#10b981] to-[#34d399] bg-clip-text text-transparent"
          style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: "0 0 8px rgba(52,211,153,0.25)" }}
        >
          ₹-bitrage
        </span>
      ),
      description: "For NRIs paying Western prices for subscriptions that cost a fraction in India. It compares 39 services across four markets and tells you exactly what to switch, keep, or cancel — with the savings to prove it.",
      insight: "A deterministic verdict engine — totals in your residence currency with INR secondary, and it never suggests a VPN; an Indian IP at sign-up is assumed.",
      features: ["39 subscriptions", "4 markets", "Verdict engine", "Stack analyzer", "ToS risk flags", "Action plan"],
      badge: "New",
      cta: { kind: "visit", link: "https://r-bitrage.abhishek221b.app/" },
      link: "https://r-bitrage.abhishek221b.app/",
      CarouselComponent: RupeeWisePreviewCarousel,
    },
    {
      icon: <img src="/icons/rentvsbuy-favicon.png" alt="UK Rent vs Buy Calculator" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "sky",
      iconColor: "#4f83f5",
      origin: "Financial Decision Tool",
      title: "UK Rent vs Buy Calculator",
      description: "Renting vs buying isn't about costs alone. It's about whether your capital can outperform property growth. This tool models opportunity costs and projects wealth outcomes over 5-25 years.",
      insight: "AI analyzes local market conditions and investment alternatives to inform your decision.",
      features: ["Opportunity cost modeling", "Break-even analysis", "5-25 year projections"],
      cta: { kind: "visit", link: "https://rentvsbuy.abhishek221b.app" },
      link: "https://rentvsbuy.abhishek221b.app",
      CarouselComponent: RentVsBuyPreview,
    },
    {
      icon: <img src="/icons/dayzero-favicon.png" alt="DayZero" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "indigo",
      iconColor: "#b39bfc",
      origin: "Reverse Retirement Calculator",
      title: "DayZero",
      description: "Most calculators stop at a corpus — a number floating free of your real spending. DayZero works backwards from your monthly expenses to what you'd actually need, and what to invest today.",
      insight: "AI stress-tests the strategy against deviations — higher inflation, FX swings, or a change in country — not just the base case.",
      features: ["Reverse-solved corpus", "Retire-abroad modeling", "Inflation & FX scenarios"],
      badge: "New",
      cta: { kind: "visit", link: "https://dayzero.abhishek221b.app" },
      link: "https://dayzero.abhishek221b.app",
      CarouselComponent: DayZeroPreview,
    },
  ];

  return (
    <CardSection
      id="utility"
      titleLead="Decision"
      titleAccent="Tools"
      headingGradient="from-emerald-300 via-cyan-300 to-emerald-300"
      subtitle="Small, sharp tools that each answer one expensive question — built to be useful from the very first click."
      glow="radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 45%, transparent 70%)"
      cards={cards}
      navTargetId="personal"
      navLabel="Personal Builds"
    />
  );
};

export default UtilityToolsSection;
