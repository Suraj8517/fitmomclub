import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Search,
  Info,
  ListFilter,
} from "lucide-react";

// ---------------------------------------------------------------------------
function useInFullView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.15, 0.3] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

const TEAL = "#1FBF9F";
const TEAL_SOFT_BG = "rgba(31,191,159,0.15)";

const FILTERS = ["All", "Diabetes", "PCOS/Endocrine", "Lipids", "Thyroid"];

const CONDITIONS = [
  {
    id: "cholesterol",
    icon: "🩸",
    title: "Cholesterol",
    testsCount: 2,
    updated: "7 Feb 2025",
    defaultOpen: true,
    rows: [
      { label: "Fasting Plasma Glucose (FPG)", value: "30.5", unit: "mg", status: "Normal", valueColor: "#F0A030" },
      { label: "HbA1c (NGSP)", value: "95", unit: "mg/dL", status: "Normal", valueColor: TEAL },
    ],
  },
  {
    id: "diabetes",
    icon: "🩸",
    title: "Diabetes",
    testsCount: 2,
    updated: "7 Feb 2025",
    defaultOpen: true,
    rows: [
      { label: "Fasting Plasma Glucose (FPG)", value: null, unit: "", status: null },
      { label: "HbA1c (NGSP)", value: null, unit: "", status: null },
    ],
  },
  {
    id: "hormonal",
    icon: "🧬",
    title: "Hormonal Imbalances",
    testsCount: 6,
    updated: "7 Feb 2025",
    defaultOpen: false,
    rows: [
      { label: "LH (Luteinizing Hormone)", value: "6.2", unit: "mIU/mL", status: "Normal", valueColor: TEAL },
      { label: "FSH (Follicle Stimulating)", value: "5.4", unit: "mIU/mL", status: "Normal", valueColor: TEAL },
      { label: "Testosterone (Total)", value: "42", unit: "ng/dL", status: "Normal", valueColor: TEAL },
      { label: "Prolactin", value: "18.9", unit: "ng/mL", status: "High", valueColor: "#F5786F" },
      { label: "TSH", value: "2.1", unit: "µIU/mL", status: "Normal", valueColor: TEAL },
      { label: "AMH", value: null, unit: "", status: null },
    ],
  },
];

function StatusPill({ status }) {
  if (!status) {
    return <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>No Data</span>;
  }
  const isHigh = status === "High" || status === "Low";
  return (
    <span
      className="ht2-pill px-2.5 py-0.5 rounded-full text-[11px] font-medium"
      style={{
        background: isHigh ? "rgba(245,120,111,0.16)" : TEAL_SOFT_BG,
        color: isHigh ? "#F5786F" : TEAL,
      }}
    >
      {status}
    </span>
  );
}

function ConditionCard({ condition, index, inView }) {
  const [open, setOpen] = useState(condition.defaultOpen);

  return (
    <div
      className="rounded-2xl px-4 pt-3.5 pb-3 mb-2.5"
      style={{
        background: "#141416",
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: inView ? 1 : 0,
        animation: inView ? `ht2CardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.2 + index * 0.12}s both` : "none",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[15px] leading-none">{condition.icon}</span>
            <span className="text-[14.5px] font-semibold text-white">{condition.title}</span>
            <Info size={12} color="rgba(255,255,255,0.4)" />
          </div>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {condition.testsCount} Tests &nbsp; Updated {condition.updated}
          </p>
        </div>
        <ChevronDown
          size={15}
          color="rgba(255,255,255,0.55)"
          className="ht2-chevron flex-shrink-0 mt-1"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="ht2-collapse"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="ht2-collapse-inner">
          <div className="mt-1.5">
            {condition.rows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-1.5"
                style={{
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  opacity: open ? 1 : 0,
                  animation: open ? `ht2RowIn 0.35s ease ${0.05 + i * 0.05}s both` : "none",
                }}
              >
                <span className="text-[12.5px] pr-3" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {row.label}
                </span>
                {row.value ? (
                  <span className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[13px] font-semibold" style={{ color: row.valueColor }}>
                      {row.value} <span className="text-[11px] font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>{row.unit}</span>
                    </span>
                    <StatusPill status={row.status} />
                  </span>
                ) : (
                  <StatusPill status={null} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-0.5 pt-2 flex justify-end" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button className="ht2-link flex items-center gap-1 text-[12.5px] font-medium" style={{ color: TEAL }}>
              View Full Progress
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HealthTracker() {
  const sectionRef = useRef(null);
  const inView = useInFullView(sectionRef);
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = CONDITIONS.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    // Positioned the same way as the Cycle Calendar widget: an absolutely
    // placed floating panel, hidden below the lg breakpoint, vertically
    // centered. Placed on the left (mirrored) so it doesn't collide with
    // a Cycle Calendar panel anchored at right: 6%. Adjust `left` / `right`
    // to taste if this is the only floating panel on the page.
    <div
      className="absolute hidden lg:block z-30"
      style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}
    >
      <style>{`
        @keyframes ht2CardIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ht2RowIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ht2HeaderIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ht2PillIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        .ht2-collapse { display: grid; transition: grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1); }
        .ht2-collapse-inner { overflow: hidden; min-height: 0; }
        .ht2-chevron { transition: transform 0.3s cubic-bezier(0.65,0,0.35,1); }
        .ht2-filter-btn { transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease, border-color 0.2s ease; }
        .ht2-filter-btn:active { transform: scale(0.95); }
        .ht2-nav-btn { transition: background-color 0.15s ease, transform 0.15s ease; }
        .ht2-nav-btn:hover { background: rgba(255,255,255,0.08); }
        .ht2-nav-btn:active { transform: scale(0.9); }
        .ht2-link { transition: gap 0.2s ease, opacity 0.15s ease; }
        .ht2-link:hover { gap: 6px; opacity: 0.85; }
        .ht2-search { transition: border-color 0.2s ease, background-color 0.2s ease; }
        .ht2-search:focus-within { border-color: ${TEAL}; background: rgba(255,255,255,0.04); }
        .ht2-pill { transition: transform 0.15s ease; }
        .ht2-scroll::-webkit-scrollbar { display: none; }
        .ht2-panel-scroll::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .ht2-card, .ht2-collapse, .ht2-chevron, .ht2-filter-btn, .ht2-nav-btn, .ht2-link { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* Mobile-screen-sized frame (iPhone-ish 375×812) — the card itself
          carries the shadow/blur treatment used by the Cycle Calendar so
          the two panels read as a matched pair. */}
      <div
        className="relative"
        style={{ width: 375, height: 568 }}
      >
        <div
          ref={sectionRef}
          className="ht2-card rounded-3xl font-sans text-white h-full w-full shadow-2xl"
          style={{
            background: "rgba(20,20,22,0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            animation: inView ? "ht2CardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
            opacity: inView ? 1 : 0,
            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          }}
        >
          <div
            className="ht2-panel-scroll px-4 py-5 text-[13px] overflow-y-auto h-full"
            style={{ scrollbarWidth: "none" }}
          >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 mb-3.5 pb-2.5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            opacity: inView ? 1 : 0,
            animation: inView ? "ht2HeaderIn 0.5s ease both" : "none",
          }}
        >
          <button className="ht2-nav-btn w-6 h-6 rounded-full flex items-center justify-center">
            <ChevronLeft size={17} color="#fff" />
          </button>
          <h1 className="text-[16px] font-semibold tracking-tight">Health Tracker</h1>
        </div>

        {/* Library row */}
        <div
          className="flex items-center gap-2 mb-3"
          style={{ opacity: inView ? 1 : 0, animation: inView ? "ht2HeaderIn 0.5s ease 0.05s both" : "none" }}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: "1.5px solid rgba(255,255,255,0.5)" }}
          >
            <ListFilter size={12} color="rgba(255,255,255,0.85)" />
          </span>
          <span className="text-[13px] font-medium">Library</span>
        </div>

        {/* Search bar */}
        <div
          className="ht2-search flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            opacity: inView ? 1 : 0,
            animation: inView ? "ht2HeaderIn 0.5s ease 0.1s both" : "none",
          }}
        >
          <Search size={14} color="rgba(255,255,255,0.4)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Medical Condition"
            className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[rgba(255,255,255,0.4)]"
            style={{ color: "#fff" }}
          />
        </div>

        {/* Filter pills */}
        <div
          className="ht2-scroll flex items-center gap-1.5 mb-3.5 overflow-x-auto"
          style={{
            opacity: inView ? 1 : 0,
            animation: inView ? "ht2HeaderIn 0.5s ease 0.15s both" : "none",
            scrollbarWidth: "none",
          }}
        >
          {FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="ht2-filter-btn flex-shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-medium"
              style={{
                background: activeFilter === f ? TEAL : "transparent",
                color: activeFilter === f ? "#04120e" : "rgba(255,255,255,0.85)",
                border: activeFilter === f ? "1px solid transparent" : "1px solid rgba(255,255,255,0.18)",
                animation: inView ? `ht2PillIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.25 + i * 0.05}s both` : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Condition cards */}
        <div>
          {filtered.map((condition, i) => (
            <ConditionCard key={condition.id} condition={condition} index={i} inView={inView} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-[14px] py-8" style={{ color: "rgba(255,255,255,0.4)" }}>
              No conditions match "{query}"
            </p>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}