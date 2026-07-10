import { useRef, useState, useEffect, useCallback } from "react";
import AnimateOnScroll from "./AnimateOnScroll";
import SectionNavigator from "./SectionNavigator";
import {
  Calendar,
  Globe,
  Shield,
  Bell,
  FileText,
  Upload,
  Plane,
  Sparkles,
  Clock,
  LayoutGrid,
  Layers,
  ArrowRightLeft,
  X,
  CheckCircle2,
  Play,
  MapPin,
  Lock,
  GitBranch,
} from "lucide-react";
import { CardSection, type CardData } from "./CardSystem";

/* ------------------------------------------------------------------ */
/* Shared helpers — same patterns as the main project carousels        */
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

/* Private-build browser window — like the project carousels, but the
   address bar carries a lock instead of a public URL (no links). */
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
}: {
  label: string;
  tabs: string[];
  tint: "amber" | "gold" | "violet";
  activeTab: number;
  progress: number;
  goToTab: (i: number) => void;
  setIsPaused: (p: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
  bodyClassName?: string;
}) => {
  const activeCls =
    tint === "amber"
      ? "bg-amber-500/20 text-amber-500"
      : tint === "violet"
        ? "bg-violet-500/20 text-violet-300"
        : "bg-amber-400/20 text-amber-300";
  const barCls = tint === "amber" ? "bg-amber-500" : tint === "violet" ? "bg-violet-400" : "bg-amber-300";
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
          <button className="w-3 h-3 rounded-full bg-green-500/40 border-0 p-0 cursor-default" aria-label="Private build — not yet public" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-muted-foreground truncate font-mono flex items-center gap-2">
            <Lock size={10} className="flex-shrink-0 opacity-70" />
            {label}
          </div>
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
/* ATLAS PREVIEW — faithful to the real app's DARK mode: deep #09090b,  */
/* violet-blue primary, glass tabs, Indian-passport visa intelligence   */
/* ================================================================== */

const AtlasPreviewCarousel = ({ onClose }: { onClose: () => void }) => {
  const tabs = ["Dashboard", "Calendar", "Visa Agent", "Documents"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PrivateWindow
      label="atlas — private build · 2026 edition"
      tabs={tabs}
      tint="violet"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
      bodyClassName="bg-[#09090b] text-zinc-100"
    >
      <div key={activeTab} className="animate-fade-slide-up p-4">
        {activeTab === 0 && <AtlasDashboardTab />}
        {activeTab === 1 && <AtlasCalendarTab />}
        {activeTab === 2 && <AtlasVisaTab />}
        {activeTab === 3 && <AtlasDocumentsTab />}
      </div>
    </PrivateWindow>
  );
};

const AtlasDashboardTab = () => (
  <div className="space-y-3">
    <StaggeredChild index={0}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-base font-semibold tracking-tight text-zinc-100">Atlas</p>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">2026 Edition</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">Dark glass UI</span>
      </div>
    </StaggeredChild>
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Next Trip", big: "12", small: "days away", note: "Tokyo · 14 Mar", icon: Calendar },
        { label: "2026 Progress", big: "7", small: "/ 14 trips", note: null, icon: Plane, bar: 50 },
        { label: "Global Footprint", big: "18", small: "countries", note: "4 continents", icon: Globe },
      ].map((s, i) => (
        <StaggeredChild key={s.label} index={i + 1}>
          <div className="relative rounded-xl bg-white/[0.04] border border-white/10 p-3 overflow-hidden">
            <s.icon size={34} className="absolute -top-1 -right-1 text-white opacity-[0.07]" />
            <p className="text-[8px] uppercase tracking-wider text-zinc-500 font-medium">{s.label}</p>
            <p className="mt-1 leading-none">
              <span className="text-xl font-bold text-zinc-100">{s.big}</span>
              <span className="text-[10px] text-zinc-400 ml-1">{s.small}</span>
            </p>
            {s.bar !== undefined ? (
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${s.bar}%` }} />
              </div>
            ) : (
              <p className="mt-1.5 text-[9px] text-violet-300 font-medium">{s.note}</p>
            )}
          </div>
        </StaggeredChild>
      ))}
    </div>
    <StaggeredChild index={4}>
      <div className="relative rounded-2xl overflow-hidden h-28 shadow-sm">
        <img src="/stock-tokyo.jpg" alt="Tokyo, Japan" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 p-3 flex flex-col justify-between h-full text-white">
          <div className="flex gap-1.5">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] border border-white/10">Up Next</span>
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] border border-white/10">Holiday</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-base font-bold leading-tight">Tokyo, Japan</p>
              <p className="text-[9px] text-white/80 flex items-center gap-1"><MapPin size={9} /> 14 – 21 March · 8 days</p>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/30 border border-emerald-300/40">eVisa approved</span>
          </div>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const AtlasCalendarTab = () => {
  // April 2026: starts Wednesday, 30 days. Good Friday 3rd, Easter Monday 6th, Madrid trip 10–14.
  const cells: Array<{ d: number | null; trip?: boolean; holiday?: boolean }> = [
    ...Array.from({ length: 2 }, () => ({ d: null })),
    ...Array.from({ length: 30 }, (_, i) => ({
      d: i + 1,
      trip: i + 1 >= 10 && i + 1 <= 14,
      holiday: i + 1 === 3 || i + 1 === 6,
    })),
  ];
  return (
    <div className="space-y-3">
      <StaggeredChild index={0}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-100">April 2026</p>
          <div className="flex items-center gap-3 text-[9px] text-zinc-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-violet-500" /> Trip</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> UK bank holiday</span>
          </div>
        </div>
      </StaggeredChild>
      <StaggeredChild index={1}>
        <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
          <div className="grid grid-cols-7 gap-1 text-center text-[8px] text-zinc-500 font-medium mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => (
              <div
                key={i}
                className={`h-7 rounded-md flex items-center justify-center text-[9px] relative ${
                  c.d === null ? "" : c.trip ? "bg-violet-500 text-white font-semibold shadow-sm shadow-violet-500/30" : "bg-white/[0.03] text-zinc-300"
                }`}
              >
                {c.d}
                {c.holiday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-teal-400" />}
              </div>
            ))}
          </div>
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
          <Plane size={12} className="text-violet-400 flex-shrink-0" />
          <p className="text-[10px] text-zinc-300 flex-1">Madrid · 5 days · Schengen multiple-entry covers this trip</p>
          <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
        </div>
      </StaggeredChild>
    </div>
  );
};

const AtlasVisaTab = () => (
  <div className="space-y-3">
    <StaggeredChild index={0}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-violet-400" />
          <p className="text-sm font-semibold text-zinc-100">Indian Passport</p>
        </div>
        <span className="text-[9px] text-zinc-400">6 visas tracked</span>
      </div>
    </StaggeredChild>
    <div className="space-y-1.5">
      {[
        { country: "United Kingdom", type: "Skilled Worker · multiple", status: "Valid until Mar 2028", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
        { country: "Schengen Area", type: "Tourist C · multiple", status: "Expiring soon", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
        { country: "Japan", type: "eVisa · single", status: "Approved", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
        { country: "Brazil", type: "Business · invitation letter", status: "Action needed", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
      ].map((v, i) => (
        <StaggeredChild key={v.country} index={i + 1}>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
            <div>
              <p className="text-[11px] font-medium text-zinc-200">{v.country}</p>
              <p className="text-[9px] text-zinc-500">{v.type}</p>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${v.cls}`}>{v.status}</span>
          </div>
        </StaggeredChild>
      ))}
    </div>
    <StaggeredChild index={5}>
      <div className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-2.5">
        <div className="flex items-start gap-2">
          <Sparkles size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-zinc-300 leading-relaxed">
              Brazil needs an invitation letter — apply 4–6 weeks before your July trip.
            </p>
            <div className="flex gap-1.5 mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">Reminder · Gmail</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">Reminder · WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </StaggeredChild>
  </div>
);

const AtlasDocumentsTab = () => (
  <div className="space-y-3">
    <StaggeredChild index={0}>
      <p className="text-sm font-semibold text-zinc-100">Document Vault</p>
    </StaggeredChild>
    <div className="space-y-1.5">
      {[
        { name: "Flight · LHR → NRT.pdf", meta: "Tokyo · 14 Mar" },
        { name: "Hotel · Shinjuku Granbell.pdf", meta: "7 nights" },
        { name: "Schengen_Visa_2026.pdf", meta: "Multiple entry" },
        { name: "Travel_Insurance.pdf", meta: "Annual · worldwide" },
      ].map((d, i) => (
        <StaggeredChild key={d.name} index={i + 1}>
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
            <FileText size={13} className="text-violet-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-zinc-200 truncate">{d.name}</p>
              <p className="text-[9px] text-zinc-500">{d.meta}</p>
            </div>
            <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
          </div>
        </StaggeredChild>
      ))}
    </div>
    <StaggeredChild index={5}>
      <div className="rounded-lg border-2 border-dashed border-white/15 bg-white/[0.02] p-3 flex items-center gap-2.5">
        <Upload size={14} className="text-zinc-500 flex-shrink-0" />
        <p className="text-[10px] text-zinc-400">Drop screenshots or bookings here — AI extracts and files them automatically</p>
      </div>
    </StaggeredChild>
  </div>
);

/* ================================================================== */
/* EARNING AN EXPERIENCE PREVIEW — faithful to the real app: premium   */
/* dark, liquid gold, serif italics, timeline rail, bento, globe       */
/* ================================================================== */

const EarningPreviewCarousel = ({ onClose }: { onClose: () => void }) => {
  const tabs = ["Timeline", "Penta Grid", "Globe", "Memoirs"];
  const { activeTab, progress, goToTab, setIsPaused } = useAutoSwipe(tabs.length, 5000);

  return (
    <PrivateWindow
      label="earning-an-experience — private archive"
      tabs={tabs}
      tint="gold"
      activeTab={activeTab}
      progress={progress}
      goToTab={goToTab}
      setIsPaused={setIsPaused}
      onClose={onClose}
      bodyClassName="bg-[#0a0a0d] text-[#f4f1e8]"
    >
      <div key={activeTab} className="animate-fade-slide-up p-4 h-full">
        {activeTab === 0 && <EarningTimelineTab />}
        {activeTab === 1 && <EarningBentoTab />}
        {activeTab === 2 && <EarningGlobeTab />}
        {activeTab === 3 && <EarningMemoirsTab />}
      </div>
    </PrivateWindow>
  );
};

const EarningHeader = ({ sub }: { sub: string }) => (
  <div className="flex items-baseline justify-between mb-3">
    <p className="font-serif italic text-base text-[#f4f1e8]">
      <span className="font-light">Earning</span>
      <span className="mx-1 text-amber-400/80">an</span>
      <span className="font-medium">Experience</span>
    </p>
    <p className="text-[9px] uppercase tracking-[0.25em] text-[#8a8576]">{sub}</p>
  </div>
);

/* Sample stock destination photos (placeholders — no personal media). */
const STOCK = {
  tokyo: "/stock-tokyo.jpg",
  paris: "/stock-paris.jpg",
  berlin: "/stock-berlin.jpg",
  madrid: "/stock-madrid.jpg",
  rio: "/stock-rio.jpg",
  stockholm: "/stock-stockholm.jpg",
  oxford: "/stock-oxford.jpg",
  taipei: "/stock-taipei.png",
  bangkok: "/stock-bangkok.png",
  kl: "/stock-kl.png",
  stuttgart: "/stock-stuttgart.jpg",
  wales: "/stock-wales.jpg",
  denmark: "/stock-denmark.jpg",
  bavaria: "/stock-bavaria.jpg",
};

const EarningTimelineTab = () => (
  <div className="flex gap-3">
    <div className="flex-1 space-y-2.5">
      <EarningHeader sub="Timeline" />
      {[
        { date: "December 2025", caption: "The year closes under snowlight and old-town lamps.", imgs: [STOCK.berlin, STOCK.stockholm] },
        { date: "September 2025", caption: "Lantern season — temples, night markets, neon rain.", imgs: [STOCK.taipei, STOCK.bangkok] },
        { date: "June 2025", caption: "A long European summer: terracotta, espresso, slow trains.", imgs: [STOCK.madrid, STOCK.paris] },
      ].map((m, i) => (
        <StaggeredChild key={m.date} index={i + 1}>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[9px] uppercase tracking-widest text-amber-400 mb-1">{m.date}</p>
            <p className="font-serif italic text-[11px] text-[#d6d1c2] leading-relaxed mb-2">{m.caption}</p>
            <div className="flex gap-1.5">
              {m.imgs.map((src, j) => (
                <div key={j} className="h-12 flex-1 rounded-md overflow-hidden">
                  <img src={src} alt={m.date} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </StaggeredChild>
      ))}
    </div>
    {/* Year rail — handwritten-style markers, gold progress line */}
    <div className="w-10 flex flex-col items-center pt-9 flex-shrink-0">
      <div className="relative flex flex-col items-center gap-5">
        <div className="absolute top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />
        <div className="absolute top-0 w-[2px] h-2/3 bg-gradient-to-b from-amber-400 to-amber-400/20 rounded-full" />
        {["2026", "2025", "2024"].map((y, i) => (
          <div key={y} className="relative flex flex-col items-center gap-1 z-10">
            <span className={`w-2.5 h-2.5 rounded-full border-2 ${i === 1 ? "bg-amber-400 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-[#0a0a0d] border-white/25"}`} />
            <span className={`font-serif italic text-[10px] ${i === 1 ? "text-amber-300" : "text-[#8a8576]"}`}>{y}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EarningBentoTab = () => {
  // Explicitly placed tiles that tile a 5-column × 4-row grid exactly, so the
  // mosaic fills the whole block — sample stock destinations, no personal media.
  const tiles = [
    { col: "1 / 3", row: "1 / 3", img: STOCK.tokyo, label: "Tokyo", play: false },
    { col: "3 / 5", row: "1 / 2", img: STOCK.paris, label: "Paris", play: false },
    { col: "5 / 6", row: "1 / 3", img: STOCK.rio, play: false },
    { col: "3 / 4", row: "2 / 3", img: STOCK.bangkok, play: true },
    { col: "4 / 5", row: "2 / 3", img: STOCK.berlin, play: false },
    { col: "1 / 3", row: "3 / 4", img: STOCK.madrid, label: "Madrid", play: false },
    { col: "3 / 4", row: "3 / 5", img: STOCK.kl, play: false },
    { col: "4 / 6", row: "3 / 4", img: STOCK.taipei, play: true },
    { col: "1 / 3", row: "4 / 5", img: STOCK.stockholm, play: false },
    { col: "4 / 6", row: "4 / 5", img: STOCK.oxford, label: "Oxford", play: false },
  ];
  return (
    <div className="flex flex-col h-full">
      <EarningHeader sub="Penta Box Grid" />
      <StaggeredChild index={1} className="flex-1 min-h-0">
        <div className="grid grid-cols-5 grid-rows-4 gap-1.5 h-full">
          {tiles.map((t, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden group/tile cursor-default border border-white/5 transition-all duration-300 hover:border-amber-400/50"
              style={{ gridColumn: t.col, gridRow: t.row }}
            >
              <img src={t.img} alt={t.label || "Travel memory"} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 group-hover/tile:opacity-100 transition-opacity duration-300" />
              {t.label && (
                <span className="absolute bottom-1.5 left-2 font-serif italic text-[11px] text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {t.label}
                </span>
              )}
              {t.play && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Play size={11} className="text-white ml-0.5" fill="white" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <p className="mt-2.5 text-[9px] text-[#8a8576] text-center tracking-wider flex-shrink-0">47 memories · every tile opens a lightbox</p>
      </StaggeredChild>
    </div>
  );
};

const EarningGlobeTab = () => {
  const stats = [
    { n: "50", l: "Countries" },
    { n: "6", l: "Continents" },
    { n: "128", l: "Cities" },
    { n: "412", l: "Flights" },
  ];
  const recent = [
    { img: STOCK.tokyo, city: "Tokyo", date: "Mar '26" },
    { img: STOCK.paris, city: "Paris", date: "Jul '25" },
    { img: STOCK.rio, city: "Rio", date: "Sep '25" },
    { img: STOCK.taipei, city: "Taipei", date: "Nov '25" },
    { img: STOCK.kl, city: "K. Lumpur", date: "Jan '25" },
  ];
  // Scattered visited markers across the sphere
  const markers = [
    { x: "30%", y: "34%", c: "#7dd3fc" },
    { x: "52%", y: "28%", c: "#fcd34d" },
    { x: "64%", y: "52%", c: "#7dd3fc" },
    { x: "42%", y: "62%", c: "#7dd3fc" },
    { x: "72%", y: "40%", c: "#fda4af" },
    { x: "24%", y: "54%", c: "#fcd34d" },
  ];
  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes ee-globe-rotate {
          from { background-position: 0 center; }
          to { background-position: -288px center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ee-globe-sphere { animation: none !important; }
        }
      `}</style>
      <EarningHeader sub="Interactive Globe" />

      <div className="flex gap-4">
        <StaggeredChild index={1} className="flex-shrink-0">
          <div className="relative w-36 h-36">
            {/* Faint orbit ring */}
            <div className="absolute -inset-2 rounded-full border border-dashed border-white/10" />
            {/* Spinning earth — the real app's night texture wrapped on a CSS sphere */}
            <div
              className="ee-globe-sphere absolute inset-0 rounded-full"
              style={{
                backgroundImage: "url(/ee-earth-night.jpg)",
                backgroundSize: "auto 100%",
                backgroundRepeat: "repeat-x",
                animation: "ee-globe-rotate 30s linear infinite",
                boxShadow:
                  "inset -26px -10px 40px rgba(0,0,0,0.85), inset 8px 5px 18px rgba(120,170,255,0.18), 0 0 30px rgba(96, 165, 250, 0.3)",
                border: "1px solid rgba(100, 180, 255, 0.25)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.14), transparent 46%)" }}
            />
            {/* Lat/long graticule overlay */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(125,211,252,0.3)" strokeWidth="0.4" />
              <ellipse cx="50" cy="50" rx="20" ry="49" fill="none" stroke="rgba(125,211,252,0.18)" strokeWidth="0.4" />
              <ellipse cx="50" cy="50" rx="37" ry="49" fill="none" stroke="rgba(125,211,252,0.12)" strokeWidth="0.4" />
              <line x1="1" y1="50" x2="99" y2="50" stroke="rgba(125,211,252,0.18)" strokeWidth="0.4" />
              <ellipse cx="50" cy="50" rx="49" ry="24" fill="none" stroke="rgba(125,211,252,0.12)" strokeWidth="0.4" />
            </svg>
            {/* Visited markers */}
            {markers.map((m, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-pulse-soft"
                style={{ left: m.x, top: m.y, background: m.c, boxShadow: `0 0 6px ${m.c}`, animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </div>
        </StaggeredChild>

        <div className="flex-1 min-w-0 space-y-2.5">
          <StaggeredChild index={2}>
            <div className="grid grid-cols-4 gap-1.5">
              {stats.map((s) => (
                <div key={s.l} className="rounded-lg bg-white/[0.04] border border-white/10 px-1.5 py-2 text-center">
                  <p className="font-serif text-lg leading-none text-[#f4f1e8]">{s.n}</p>
                  <p className="text-[8px] uppercase tracking-wider text-[#8a8576] mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </StaggeredChild>
          <StaggeredChild index={3}>
            <div className="flex flex-wrap gap-1">
              {["Japan", "Brazil", "Sweden", "Taiwan", "France", "Egypt"].map((c) => (
                <span key={c} className="text-[9px] px-2 py-0.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300">{c}</span>
              ))}
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-[#8a8576]">+44 more</span>
            </div>
          </StaggeredChild>
          <StaggeredChild index={4}>
            <p className="text-[9px] text-[#8a8576] leading-relaxed">Visited countries glow blue — click one to open every visit, memory and capture from that place.</p>
          </StaggeredChild>
        </div>
      </div>

      {/* Recent journeys strip — fills the lower half */}
      <StaggeredChild index={5} className="flex-1 min-h-0 mt-3">
        <p className="text-[9px] uppercase tracking-widest text-amber-400 mb-1.5">Recent journeys</p>
        <div className="grid grid-cols-5 gap-1.5">
          {recent.map((r) => (
            <div key={r.city} className="group/rj">
              <div className="relative rounded-md overflow-hidden h-12 border border-white/10">
                <img src={r.img} alt={r.city} className="w-full h-full object-cover transition-transform duration-500 group-hover/rj:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <p className="text-[8.5px] text-[#d6d1c2] mt-1 truncate font-medium">{r.city}</p>
              <p className="text-[7.5px] text-[#8a8576]">{r.date}</p>
            </div>
          ))}
        </div>
      </StaggeredChild>
    </div>
  );
};

/* Decorative circular passport stamp */
const PassportStamp = ({ label, color, className = "", rot = 0 }: { label: string; color: string; className?: string; rot?: number }) => (
  <div className={`absolute pointer-events-none select-none ${className}`} style={{ transform: `rotate(${rot}deg)`, color }}>
    <svg viewBox="0 0 80 80" className="w-16 h-16" style={{ opacity: 0.55 }}>
      <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
      <circle cx="40" cy="40" r="29" fill="none" stroke="currentColor" strokeWidth="1" />
      <path id="stamp-arc" d="M 16 40 A 24 24 0 0 1 64 40" fill="none" />
      <text fontSize="7" fill="currentColor" letterSpacing="1.5" fontFamily="monospace">
        <textPath href="#stamp-arc" startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
      <text x="40" y="52" fontSize="9" fill="currentColor" textAnchor="middle" fontFamily="monospace" letterSpacing="1">✦ ✦ ✦</text>
    </svg>
  </div>
);

const EarningMemoirsTab = () => {
  const cards = [
    { title: "Tokyo", date: "2026", rot: "-4deg", img: STOCK.tokyo },
    { title: "Paris", date: "2025", rot: "3deg", img: STOCK.paris },
    { title: "Rio", date: "2025", rot: "-2deg", img: STOCK.rio },
    { title: "Oxford", date: "2024", rot: "2.5deg", img: STOCK.oxford },
    { title: "Bangkok", date: "2025", rot: "-3deg", img: STOCK.bangkok },
    { title: "Stockholm", date: "2024", rot: "1.5deg", img: STOCK.stockholm },
  ];
  return (
    <div className="flex flex-col h-full relative">
      <EarningHeader sub="Memoirs" />
      {/* Scrapbook board */}
      <StaggeredChild index={1} className="flex-1 min-h-0">
        <div className="relative h-full">
          <div className="grid grid-cols-3 gap-x-3 gap-y-2 pt-1">
            {cards.map((s, i) => (
              <div
                key={s.title}
                className="rounded-md bg-[#f4f1e8] p-1.5 pb-3.5 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 relative z-10"
                style={{ transform: `rotate(${s.rot})` }}
              >
                <div className="h-12 rounded-sm overflow-hidden border border-black/10">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex items-baseline justify-between px-0.5 mt-1">
                  <p className="font-serif italic text-[10px] text-slate-700">{s.title}</p>
                  <p className="font-mono text-[7px] text-slate-400">{s.date}</p>
                </div>
                {/* Tape corner */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-amber-200/40 border border-amber-100/30 rotate-2" />
              </div>
            ))}
          </div>
          {/* Decorative passport stamps over the board */}
          <PassportStamp label="ARRIVAL · 2025" color="#fb7185" className="top-8 -right-1" rot={-12} />
          <PassportStamp label="DEPARTURE" color="#fbbf24" className="bottom-2 left-6" rot={8} />
        </div>
      </StaggeredChild>
      <StaggeredChild index={2}>
        <p className="mt-2 text-[9px] text-[#8a8576] text-center tracking-wider flex-shrink-0">
          Postcards, passport stamps &amp; keepsakes — the analogue half of the capsule
        </p>
      </StaggeredChild>
    </div>
  );
};

/* ================================================================== */
/* Section                                                             */
/* ================================================================== */

const PersonalProjectsSection = () => {
  const cards: CardData[] = [
    {
      icon: <img src="/icons/atlas-favicon.png" alt="Atlas" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "indigo",
      iconColor: "#e4e4e7",
      origin: "Travel Intelligence",
      title: "Atlas",
      description: "A calendar built for heavy travellers — with an AI agent that finds the right visas, sends reminders via Gmail and WhatsApp, and keeps every document in one place.",
      insight: "The agent proactively sends reminders on Gmail and WhatsApp — visa deadlines, flight check-ins, and document expiry alerts so you never miss a step.",
      features: ["Interactive dashboard", "Visa agent", "Smart reminders", "Document vault"],
      cta: { kind: "git", email: "abhishek221b@gmail.com", subject: "Atlas — repo access request" },
      CarouselComponent: AtlasPreviewCarousel,
    },
    {
      icon: <img src="/icons/earninganexp-favicon.png" alt="Earning an Experience" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />,
      accent: "rose",
      iconColor: "#f2914f",
      origin: "Personal Time Capsule",
      title: "Earning an Experience",
      description: "A personal blog reimagined as a visual time capsule — scroll a timeline, explore a penta-box grid of memories, or spin an interactive globe to relive every journey.",
      insight: "Click any country on the globe to see every time you visited, what you did, and the memories you captured — a deeply personal archive built for the way travellers think.",
      features: ["Timeline mode", "Penta box grid", "Interactive globe"],
      cta: { kind: "git", email: "abhishek221b@gmail.com", subject: "Earning an Experience — repo access request" },
      CarouselComponent: EarningPreviewCarousel,
    },
  ];

  return (
    <CardSection
      id="personal"
      titleLead="Personal"
      titleAccent="Builds"
      headingGradient="from-amber-300 via-orange-300 to-amber-300"
      subtitle="Tools I'm building for myself — born from the friction of living across borders and collecting memories along the way."
      glow="radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(244,63,94,0.05) 45%, transparent 70%)"
      cards={cards}
      navTargetId="footer"
      navLabel="Connect"
    />
  );
};

export default PersonalProjectsSection;
