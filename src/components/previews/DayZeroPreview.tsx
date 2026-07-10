import { PiggyBank, TrendingUp, Globe, HeartPulse, Shield, ArrowRightLeft, Sparkles, AlertTriangle, Minus } from "lucide-react";
import { PreviewWindow, StaggeredChild, useAutoSwipe } from "../CardSystem";

/* DayZero (reverse retirement calculator) preview — lives in Decision Tools. */
const DayZeroPreview = ({ onClose, link }: { onClose: () => void; link?: string; isInView?: boolean }) => {
  const tabs = ["The Number", "Investment Mix", "What Moves It", "Head Back Home"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PreviewWindow
      label="dayzero.abhishek221b.app"
      link={link || "https://dayzero.abhishek221b.app"}
      tabs={tabs}
      accent="indigo"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
    >
      <div key={activeTab} className="animate-fade-slide-up">
        {activeTab === 0 && <DZNumberTab />}
        {activeTab === 1 && <DZMixTab />}
        {activeTab === 2 && <DZDriftTab />}
        {activeTab === 3 && <DZAbroadTab />}
      </div>
    </PreviewWindow>
  );
};

const DZNumberTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-4 transition-all duration-300 hover:from-indigo-500/15">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank size={16} className="text-indigo-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Invest this much, every month, starting now</span>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-indigo-300">₹52,300</p>
        <p className="text-[10px] text-muted-foreground mt-1">stepping up 6% a year · builds ₹6.4 Cr by age 58</p>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-2 gap-3">
      <StaggeredChild index={1}>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Then pays you</p>
          <p className="text-lg font-bold text-white">₹2,10,000<span className="text-[10px] font-normal text-muted-foreground">/mo</span></p>
          <p className="text-[10px] text-muted-foreground">rising with inflation</p>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">For this long</p>
          <p className="text-lg font-bold text-white">32 yrs</p>
          <p className="text-[10px] text-muted-foreground">to age 90, cushion kept</p>
        </div>
      </StaggeredChild>
    </div>
    <StaggeredChild index={3}>
      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3 flex items-start gap-2">
        <Sparkles size={12} className="text-violet-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">Reverse-solved from real monthly spending — not a corpus guess — then a month-by-month simulation, not a 4%-rule shortcut.</p>
      </div>
    </StaggeredChild>
  </div>
);

const DZMixTab = () => {
  const buckets = [
    { label: "Low risk", desc: "Bonds, FDs, debt funds", pct: 20, color: "bg-slate-400" },
    { label: "Modest risk", desc: "Index & balanced funds", pct: 45, color: "bg-indigo-400" },
    { label: "High risk", desc: "Equity", pct: 35, color: "bg-cyan-400" },
  ];
  return (
    <div className="space-y-4 h-full">
      <StaggeredChild index={0}>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">Blended return</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">Balanced</span>
          </div>
          <p className="text-xl font-bold text-indigo-300">10.4%<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
        </div>
      </StaggeredChild>
      <div className="space-y-2.5">
        {buckets.map((b, i) => (
          <StaggeredChild key={b.label} index={i + 1}>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white">{b.label} <span className="text-muted-foreground">· {b.desc}</span></span>
                <span className="text-muted-foreground">{b.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color} transition-all duration-1000`} style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          </StaggeredChild>
        ))}
      </div>
      <StaggeredChild index={4}>
        <p className="text-[10px] text-muted-foreground">Year 1: ₹52,300/mo → Year 5: ₹66,000/mo → Year 10: ₹88,400/mo, stepping up with income.</p>
      </StaggeredChild>
    </div>
  );
};

const DZAbroadTab = () => (
  <div className="space-y-4 h-full">
    <StaggeredChild index={0}>
      <div className="text-xs text-muted-foreground mb-1">Same life, two addresses — both priced in ₹</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-white">India</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-muted-foreground">Stay home</span>
          </div>
          <p className="text-lg font-bold text-white">₹6.4 Cr</p>
          <p className="text-[10px] text-muted-foreground">corpus needed</p>
        </div>
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-white">Portugal</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200">Your plan</span>
          </div>
          <p className="text-lg font-bold text-indigo-300">₹3.9 Cr</p>
          <p className="text-[10px] text-emerald-400 font-medium">Retire 4 yrs earlier</p>
        </div>
      </div>
    </StaggeredChild>
    <StaggeredChild index={1}>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={14} className="text-indigo-400" />
          <span className="text-xs font-medium text-white">Other destinations worth a look</span>
        </div>
        <div className="space-y-1.5">
          {[
            { country: "Portugal", saved: "62% of the corpus", tag: "Retire 4 yrs earlier" },
            { country: "Thailand", saved: "54% of the corpus", tag: "Invest 38% less/mo" },
            { country: "Mexico", saved: "58% of the corpus", tag: "Retire 3 yrs earlier" },
          ].map((d) => (
            <div key={d.country} className="flex items-center justify-between text-[10px] py-1 border-b border-white/5 last:border-0">
              <span className="text-white font-medium">{d.country}</span>
              <span className="text-muted-foreground">{d.saved}</span>
              <span className="text-emerald-400 font-medium">{d.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const DZDriftTab = () => {
  const rows = [
    { icon: HeartPulse, tone: "risk" as const, title: "Healthcare vs. care are modelled separately", body: "Treatment cost and long-term care compound at different rates — care ramps toward 4× by your mid-90s." },
    { icon: ArrowRightLeft, tone: "neutral" as const, title: "FX drift on a cross-border plan", body: "Retiring abroad projects relative-PPP currency drift, not just today's exchange rate." },
    { icon: Shield, tone: "good" as const, title: "Other income shrinks the corpus", body: "Pensions, rental or annuity streams are netted off month-by-month, not as a flat discount." },
  ];
  const toneCls = { risk: "bg-amber-400", neutral: "bg-slate-400", good: "bg-emerald-400" };
  return (
    <div className="space-y-3 h-full">
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
        <AlertTriangle size={12} className="text-indigo-400" /> What could move this number
      </div>
      {rows.map((r, i) => (
        <StaggeredChild key={r.title} index={i}>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3 transition-all duration-300 hover:bg-white/10">
            <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${toneCls[r.tone]}`} />
            <div>
              <p className="text-xs font-medium text-white flex items-center gap-1.5"><r.icon size={12} className="text-indigo-400" /> {r.title}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{r.body}</p>
            </div>
          </div>
        </StaggeredChild>
      ))}
      <StaggeredChild index={rows.length}>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground/70 pt-1">
          <Minus size={10} /> Every assumption is editable and printed in the downloadable plan.
        </div>
      </StaggeredChild>
    </div>
  );
};

export default DayZeroPreview;
