import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Baby,
  HeartPulse,
  PersonStanding,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";

const PREVIEW_COUNT = 4;

const plans = [
  {
    Icon: Baby,
    name: "Prenatal Conditions",
    subtitle: "Weight Management",
    tag: "Blossom",
    duration: "6 / 9 / 12 months",
    accent: "#2D9E6B",
    accentLight: "#D4F3E5",
    accentMuted: "#b6ecd4",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet plan with periodic revisions",
      "36+ live group prenatal workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
  {
    Icon: HeartPulse,
    name: "Postnatal Conditions",
    subtitle: "Weight Management",
    tag: "Queen",
    duration: "6 / 9 / 12 months",
    accent: "#C7522A",
    accentLight: "#FBDFD3",
    accentMuted: "#f7c9b5",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet plan with periodic revisions",
      "41+ live group postnatal & DR workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Meal plate review and progress follow-up on WhatsApp",
      "Monthly revisions to diet plan",
      "Access to recipe vault",
    ],
  },
  {
    Icon: PersonStanding,
    name: "No Health Conditions",
    subtitle: "Weight Management",
    tag: "Pro",
    duration: "6 / 9 / 12 months",
    accent: "#2176AE",
    accentLight: "#D0E6F5",
    accentMuted: "#b3d6f0",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Customised diet plan with periodic revisions",
      "23+ live group workout sessions",
      "Diet review calls — twice monthly",
      "Daily meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
  {
    Icon: Stethoscope,
    name: "With Health Conditions",
    subtitle: "Weight Management",
    tag: "Elite",
    duration: "6 / 9 / 12 months",
    accent: "#8865B3",
    accentLight: "#E1D8F4",
    accentMuted: "#cfc0ed",
    features: [
      "Input Call + Induction Call + 3 review calls with nutrition experts (1st month)",
      "Induction Call + Post Plan Call + 2 review calls with fitness experts (1st month)",
      "Customised diet & workout plan with periodic revisions",
      "41+ live group workout sessions",
      "Diet & fitness review calls — twice monthly",
      "Daily meal plate review and progress follow-up on WhatsApp",
      "Access to recipe vault",
    ],
  },
];

function PlanCard({ plan }) {
  const {
    Icon, name, subtitle, duration, tag,
    accent, accentLight, accentMuted, features,
  } = plan;

  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
  const hasMore = features.length > PREVIEW_COUNT;

  return (
    <div
      className="relative flex flex-col h-full rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#fff",
        boxShadow: `0 2px 0px ${accentMuted}88, 0 6px 28px rgba(0,0,0,0.06)`,
        border: `1.5px solid ${accentMuted}66`,
      }}
    >
      {/* Light colored header */}
      <div
        className="relative px-6 pt-6 pb-6 overflow-hidden"
        style={{ background: accentLight }}
      >
        {/* Blob decorations */}
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full"
          style={{ background: accentMuted, opacity: 0.4 }}
        />
        <div
          className="absolute -bottom-4 left-6 w-16 h-16 rounded-full"
          style={{ background: accentMuted, opacity: 0.28 }}
        />

        {/* Tag pill */}
        <span
          className="inline-flex items-center text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1 rounded-full mb-4 relative z-10"
          style={{ background: "#fff", color: accent }}
        >
          {tag}
        </span>

        {/* Icon + name */}
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "#fff", boxShadow: `0 2px 12px ${accentMuted}80` }}
          >
            <Icon size={26} color={accent} strokeWidth={2} />
          </div>
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: `${accent}99` }}
            >
              {subtitle}
            </p>
            <p className="text-[17px] font-bold leading-snug" style={{ color: "#1a1a1a" }}>
              {name}
            </p>
          </div>
        </div>

        {/* Duration pill */}
        <div
          className="flex items-center gap-2 mt-4 w-fit rounded-full px-4 py-2 relative z-10"
          style={{ background: "#fff", boxShadow: `0 1px 8px ${accentMuted}60` }}
        >
          <Calendar size={13} color={accent} />
          <span className="text-[12px]" style={{ color: "#999" }}>Duration:</span>
          <span className="text-[12px] font-bold" style={{ color: "#1a1a1a" }}>{duration}</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pt-5 pb-4 flex-1">
        <p
          className="text-[10.5px] font-bold uppercase tracking-widest mb-3"
          style={{ color: accent }}
        >
          What's included
        </p>

        <div className="space-y-2.5">
          {visible.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2
                size={15}
                strokeWidth={2.2}
                className="shrink-0 mt-[2px]"
                style={{ color: accent }}
              />
              <span className="text-[13px] text-[#555] leading-[1.55]">{f}</span>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 mt-3 text-[12.5px] font-medium bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: accent }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Show less" : `+${features.length - PREVIEW_COUNT} more included`}
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 mt-auto">
        <div className="h-px mb-5" style={{ background: `${accentMuted}55` }} />
        <button
          className="w-full flex items-center justify-between rounded-[14px] px-5 py-[13px] text-[13.5px] font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.99] border-none cursor-pointer"
          style={{
            background: accentLight,
            color: accent,
            border: `1.5px solid ${accentMuted}`,
          }}
        >
          Book a consultation
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: accent }}
          >
            <ArrowRight size={14} color="#fff" />
          </span>
        </button>
      </div>
    </div>
  );
}

function NavButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ borderColor: "#ddd", background: "#fff", color: "#333" }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#1a1a1a"; }}}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#333"; e.currentTarget.style.borderColor = "#ddd"; }}
    >
      {children}
    </button>
  );
}

export default function ProgramSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const VISIBLE = 3;
  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < plans.length;

  const prev = () => { if (canPrev) setStartIndex((i) => i - 1); };
  const next = () => { if (canNext) setStartIndex((i) => i + 1); };
  const mobilePrev = () => { if (mobileIndex > 0) setMobileIndex((i) => i - 1); };
  const mobileNext = () => { if (mobileIndex < plans.length - 1) setMobileIndex((i) => i + 1); };

  const visiblePlans = plans.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="px-6 py-16" style={{ background: "#f6f5f1" }}>
      <div className="max-w-[1160px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold tracking-widest uppercase mb-5"
            style={{ background: "#efefec", color: "#555" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E6B] inline-block" />
            Choose your plan
          </div>
          <h2
            className="font-semibold text-[#1a1a1a] tracking-tight leading-none mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 58px)" }}
          >
            FitMom Club Plans
          </h2>
          <p className="text-[18px] leading-relaxed max-w-[560px] mx-auto" style={{ color: "#888" }}>
            Expert-backed, customised, and built around your life — at every stage of motherhood.
          </p>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div key={mobileIndex}>
            <PlanCard plan={plans[mobileIndex]} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <NavButton onClick={mobilePrev} disabled={mobileIndex === 0}>
              <ChevronLeft size={18} />
            </NavButton>
            <div className="flex items-center gap-2">
              {plans.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  className="h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300"
                  style={{
                    width: i === mobileIndex ? "24px" : "8px",
                    background: i === mobileIndex ? plans[mobileIndex].accent : "#ccc",
                  }}
                />
              ))}
            </div>
            <NavButton onClick={mobileNext} disabled={mobileIndex === plans.length - 1}>
              <ChevronRight size={18} />
            </NavButton>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6 items-start">
            {visiblePlans.map((plan, i) => (
              <PlanCard key={startIndex + i} plan={plan} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 mr-2">
              {plans.map((p, i) => {
                const active = i >= startIndex && i < startIndex + VISIBLE;
                return (
                  <span
                    key={i}
                    className="block h-2 rounded-full transition-all duration-300"
                    style={{
                      width: active ? "24px" : "8px",
                      background: active ? p.accent : "#ccc",
                    }}
                  />
                );
              })}
            </div>
            <NavButton onClick={prev} disabled={!canPrev}><ChevronLeft size={18} /></NavButton>
            <NavButton onClick={next} disabled={!canNext}><ChevronRight size={18} /></NavButton>
          </div>
        </div>

      </div>
    </section>
  );
}