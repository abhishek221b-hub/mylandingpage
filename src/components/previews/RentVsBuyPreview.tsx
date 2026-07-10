import { Calendar, Percent, Building, TrendingUp, TrendingDown, Lightbulb, Scale, Home } from "lucide-react";
import { PreviewWindow, StaggeredChild, useAutoSwipe } from "../CardSystem";

/* UK Rent vs Buy Calculator preview — lives in Decision Tools. */
const RentVsBuyPreview = ({ onClose, link }: { onClose: () => void; link?: string; isInView?: boolean }) => {
  const tabs = ["Verdict", "Break-Even", "Opportunity", "Insights"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PreviewWindow
      label="rentvsbuy.abhishek221b.app"
      link={link || "https://rentvsbuy.abhishek221b.app"}
      tabs={tabs}
      accent="sky"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
    >
      <div key={activeTab} className="animate-fade-slide-up">
        {activeTab === 0 && <RVBVerdictTab />}
        {activeTab === 1 && <RVBBreakEvenTab />}
        {activeTab === 2 && <RVBOpportunityCostTab />}
        {activeTab === 3 && <RVBInsightsTab />}
      </div>
    </PreviewWindow>
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
            <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: "98%" }} />
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
          <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all duration-1000" style={{ width: "73%" }} />
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

export default RentVsBuyPreview;
