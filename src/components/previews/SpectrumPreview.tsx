import { ScanLine, Shield, Target, Sparkles, AlertTriangle } from "lucide-react";
import { PreviewWindow, StaggeredChild, useAutoSwipe } from "../CardSystem";

/* Spectrum (AI career intelligence) preview — lives in Featured Projects. */
const SpectrumPreview = ({ onClose, link }: { onClose: () => void; link?: string; isInView?: boolean }) => {
  const tabs = ["Skills", "Risk Map", "Spectrum Score", "Actions"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PreviewWindow
      label="spectrum.abhishek221b.app"
      link={link || "https://spectrum.abhishek221b.app"}
      tabs={tabs}
      accent="cyan"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
      bodyClassName="bg-[#0a0e14] text-slate-100"
    >
      <div key={activeTab} className="animate-fade-slide-up p-4 h-full">
        {activeTab === 0 && <SpSkillsTab />}
        {activeTab === 1 && <SpRiskTab />}
        {activeTab === 2 && <SpScoreTab />}
        {activeTab === 3 && <SpActionsTab />}
      </div>
    </PreviewWindow>
  );
};

const SpHeader = ({ sub }: { sub: string }) => (
  <div className="flex items-baseline justify-between mb-3">
    <p className="text-base font-bold tracking-tight flex items-center gap-1.5">
      <ScanLine size={15} className="text-cyan-400" />
      <span className="text-cyan-400">Spectrum</span>
    </p>
    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">{sub}</p>
  </div>
);

const SpSkillsTab = () => {
  const groups = [
    { cat: "Hard skills", cls: "border-sky-500/40 bg-sky-500/10 text-sky-300", items: ["Strategic Roadmapping", "Data Analysis", "Budget Forecasting", "Process Automation", "KPI Design"] },
    { cat: "Soft skills", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", items: ["Stakeholder Persuasion", "Cross-functional Leadership", "Vendor Negotiation", "Mentoring"] },
    { cat: "Hidden skills", cls: "border-violet-500/40 bg-violet-500/10 text-violet-300", items: ["Navigating Org Politics", "Managing Ambiguity", "Coalition Building"] },
  ];
  return (
    <div className="space-y-3">
      <SpHeader sub="Skill discovery" />
      <StaggeredChild index={0}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-100">Senior Product Manager</p>
          <span className="text-[9px] text-slate-500">20 skills surfaced</span>
        </div>
      </StaggeredChild>
      {groups.map((g, i) => (
        <StaggeredChild key={g.cat} index={i + 1}>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">{g.cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span key={it} className={`text-[10px] px-2 py-0.5 rounded-full border ${g.cls}`}>{it}</span>
              ))}
            </div>
          </div>
        </StaggeredChild>
      ))}
    </div>
  );
};

const RiskBar = ({ score, level }: { score: number; level: "low" | "medium" | "high" }) => {
  const color = level === "low" ? "#34d399" : level === "medium" ? "#fbbf24" : "#f87171";
  return (
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
    </div>
  );
};

const SpRiskTab = () => {
  const skills = [
    { name: "Stakeholder Persuasion", score: 18, level: "low" as const, imp: 95 },
    { name: "Navigating Org Politics", score: 24, level: "low" as const, imp: 88 },
    { name: "Strategic Roadmapping", score: 38, level: "medium" as const, imp: 90 },
    { name: "Data Analysis", score: 58, level: "medium" as const, imp: 72 },
    { name: "KPI & Metrics Design", score: 71, level: "high" as const, imp: 60 },
    { name: "Reporting & Documentation", score: 88, level: "high" as const, imp: 44 },
  ];
  return (
    <div className="space-y-2.5">
      <SpHeader sub="Risk × importance" />
      {skills.map((s, i) => (
        <StaggeredChild key={s.name} index={i + 1}>
          <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-medium text-slate-200 truncate">{s.name}</p>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                s.level === "low" ? "border-emerald-500/40 text-emerald-300" : s.level === "medium" ? "border-amber-500/40 text-amber-300" : "border-rose-500/40 text-rose-300"
              }`}>{s.score} AI risk</span>
            </div>
            <RiskBar score={s.score} level={s.level} />
            <p className="text-[8.5px] text-slate-500 mt-1">Importance to role · {s.imp}%</p>
          </div>
        </StaggeredChild>
      ))}
    </div>
  );
};

const SpScoreTab = () => {
  const score = 47; // overall AI exposure 0–100
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="space-y-3">
      <SpHeader sub="Spectrum score" />
      <div className="flex items-center gap-4">
        <StaggeredChild index={1} className="flex-shrink-0">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
              <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle cx="55" cy="55" r={r} fill="none" stroke="url(#sp-grad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
              <defs>
                <linearGradient id="sp-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-100 leading-none">{score}</span>
              <span className="text-[8px] uppercase tracking-widest text-cyan-300 mt-1">Transforming</span>
            </div>
          </div>
        </StaggeredChild>
        <div className="flex-1 min-w-0 space-y-2">
          <StaggeredChild index={2}>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your role sits in the <span className="text-cyan-300 font-medium">transformation zone</span> — AI reshapes how you work without replacing the core of it.
            </p>
          </StaggeredChild>
          <StaggeredChild index={3}>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { n: "20", l: "Skills" },
                { n: "5", l: "High-risk" },
                { n: "8", l: "Your moat" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/[0.04] border border-white/10 px-1.5 py-2 text-center">
                  <p className="text-base font-bold text-slate-100 leading-none">{s.n}</p>
                  <p className="text-[8px] uppercase tracking-wider text-slate-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </StaggeredChild>
        </div>
      </div>
      <StaggeredChild index={4}>
        <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-2.5 flex items-start gap-2">
          <Shield size={13} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-300 leading-relaxed">
            <b className="text-slate-100">Your human moat:</b> trust-building, reading the room, and decisions under ambiguity — the things AI still can't fake.
          </p>
        </div>
      </StaggeredChild>
    </div>
  );
};

const SpActionsTab = () => {
  const cols = [
    { title: "Double Down", icon: Target, cls: "border-emerald-500/40 bg-emerald-500/10", text: "text-emerald-300", items: ["Stakeholder Persuasion", "Org Politics", "Mentoring"] },
    { title: "Augment Now", icon: Sparkles, cls: "border-amber-500/40 bg-amber-500/10", text: "text-amber-300", items: ["Strategic Roadmapping", "Data Analysis"] },
    { title: "Automate Away", icon: AlertTriangle, cls: "border-rose-500/40 bg-rose-500/10", text: "text-rose-300", items: ["Reporting & Docs", "KPI Dashboards"] },
  ];
  return (
    <div className="space-y-3">
      <SpHeader sub="Recommended moves" />
      {cols.map((c, i) => (
        <StaggeredChild key={c.title} index={i + 1}>
          <div className={`rounded-xl border p-3 ${c.cls}`}>
            <div className="flex items-center gap-2 mb-2">
              <c.icon size={14} className={c.text} />
              <p className={`text-[11px] font-semibold ${c.text}`}>{c.title}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.items.map((it) => (
                <span key={it} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{it}</span>
              ))}
            </div>
          </div>
        </StaggeredChild>
      ))}
      <StaggeredChild index={4}>
        <p className="text-[9px] text-slate-500 text-center tracking-wider">Each skill maps to one move — and the AI tool that does the heavy lifting.</p>
      </StaggeredChild>
    </div>
  );
};

export default SpectrumPreview;
