import { useState } from "react";
import {
  ArrowRight, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Clock, Heart,
  Activity, User, Stethoscope
} from "lucide-react";

const PREVIEW_COUNT = 4;

const plans = [
  {
    icon: Heart,
    name: "Prenatal Conditions",
    subtitle: "Weight Management",
    tag: "Blossom",
    duration: "6 / 9 / 12 months",
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
    icon: Activity,
    name: "Postnatal Conditions",
    subtitle: "Weight Management",
    tag: "Queen",
    duration: "6 / 9 / 12 months",
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
    icon: User,
    name: "No Health Conditions",
    subtitle: "Weight Management",
    tag: "Pro",
    duration: "6 / 9 / 12 months",
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
    icon: Stethoscope,
    name: "With Health Conditions",
    subtitle: "Weight Management",
    tag: "Elite",
    duration: "6 / 9 / 12 months",
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

const C = {
  teal: "#0e7a6a",
  tealDark: "#085041",
  bg: "#ffffff",
  border: "#e5e5e5",
  text: "#111111",
  textMid: "#444444",
  textMuted: "#085041",
  footerGrad: "linear-gradient(to bottom, transparent 0%, #ffffff 40%)",
};

function PlanCard({ plan, animIndex }) {
  const { icon: Icon, name, subtitle, tag, duration, features } = plan;
  const [expanded, setExpanded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
  const hasMore = features.length > PREVIEW_COUNT;

  return (
    <div
      className="relative flex flex-col rounded-3xl"
      style={{
        backgroundColor: C.bg,
        border: `1.5px solid ${C.border}`,
        minHeight: 480,
        animation: `slideInRight 0.5s cubic-bezier(0.22,1,0.36,1) ${animIndex * 0.1}s both`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Tag badge */}
      <span
        className="absolute top-3.5 left-3.5 text-[11px] sm:text-xs md:text-[13px] font-medium px-2.5 py-0.5 rounded-full"
        style={{ backgroundColor: C.teal, color: "#fff", letterSpacing: "0.03em" }}
      >
        {tag}
      </span>

      {/* Icon badge */}
      <div
        className="absolute top-[-30px] left-[43%] w-14 h-14 rounded-full flex items-center justify-center border-4 border-white/80"
        style={{ backgroundColor: C.teal }}
      >
        <Icon size={20} color="#fff" />
      </div>

      <div className="overflow-hidden flex flex-col flex-1">
        {/* Card top */}
        <div className="pt-11 pb-4 px-8 border-b" style={{ borderColor: C.border }}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-semibold leading-tight" style={{ color: C.text }}>
            {name}
          </p>
          <p className="text-xs sm:text-sm md:text-[14px] mt-0.5" style={{ color: C.textMid }}>
            {subtitle}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5" style={{ color: C.textMuted }}>
            <Clock size={13} />
            <span className="text-xs sm:text-sm md:text-[13px]">{duration}</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-8 pt-3.5 pb-20 flex-1">
          <ul className="flex flex-col gap-2.5">
            {visible.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}
              >
                <span
                  className="mt-[5px] shrink-0 rounded-full"
                  style={{ width: 5, height: 5, backgroundColor: C.text }}
                />
                <span className="text-xs sm:text-sm md:text-[13px] lg:text-sm xl:text-[14px]" style={{ color: C.textMid }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-2 flex items-center gap-1 text-xs sm:text-sm transition-colors"
              style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              {expanded
                ? <><ChevronUp size={13} /> Show less</>
                : <><ChevronDown size={13} /> +{features.length - PREVIEW_COUNT} more</>}
            </button>
          )}
        </div>

        {/* Footer CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-3 rounded-b-3xl"
          style={{ background: C.footerGrad }}
        >
          <button
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            className="w-full flex items-center justify-between rounded-full py-2.5 px-5 text-xs sm:text-sm md:text-[13px] font-medium"
            style={{
              backgroundColor: btnHover ? C.tealDark : C.teal,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transform: btnActive ? "scale(0.97)" : btnHover ? "scale(1.02)" : "scale(1)",
              boxShadow: btnHover && !btnActive ? "0 4px 14px rgba(14,122,106,0.3)" : "none",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.15s",
            }}
          >
            Make Appointment
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: btnHover ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.2s",
              }}
            >
              <ArrowRight size={13} color="#fff" />
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function NavBtn({ onClick, disabled, children, ...rest }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: 36, height: 36,
        borderRadius: "50%",
        border: `1px solid ${hover ? "#111" : "#d1d1d1"}`,
        backgroundColor: hover ? "#111" : "#fff",
        color: hover ? "#fff" : "#111",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: active ? "scale(0.92)" : hover ? "scale(1.08)" : "scale(1)",
        transition: "background 0.2s, transform 0.15s, border-color 0.2s, color 0.2s",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function ProgramSection() {
  // Shared index state used by both mobile (1 card) and desktop (3 cards)
  const [startIndex, setStartIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const VISIBLE_DESKTOP = 3;
  const VISIBLE_MOBILE = 1;

  const canPrevDesktop = startIndex > 0;
  const canNextDesktop = startIndex + VISIBLE_DESKTOP < plans.length;

  const canPrevMobile = startIndex > 0;
  const canNextMobile = startIndex + VISIBLE_MOBILE < plans.length;

  const prev = (visibleCount) => {
    if (startIndex > 0) {
      setStartIndex(i => Math.max(0, i - visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const next = (visibleCount) => {
    if (startIndex + visibleCount < plans.length) {
      setStartIndex(i => Math.min(plans.length - visibleCount, i + visibleCount));
      setAnimKey(k => k + 1);
    }
  };

  const goTo = (index) => {
    setStartIndex(index);
    setAnimKey(k => k + 1);
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 py-6 sm:py-14 md:py-16" style={{ backgroundColor: "#F6F5F1" }}>
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <div className="w-full flex flex-col items-center justify-center text-center px-6 pb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3rem] 2xl:text-[4rem] font-normal text-[#2C2C2C] leading-[1.2] tracking-tight max-w-5xl 2xl:max-w-6xl mb-5">
            FitMom Club Plans
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#4A4A4A] leading-relaxed mb-6">
            Customized. Effective. Nurturing. Expert-backed<br className="hidden sm:block" /> solutions to fit your lifestyle.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-base sm:text-lg font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── MOBILE: 1 card at a time ── */}
        <div className="lg:hidden">
          <div key={`mobile-${animKey}`} className="pt-8">
            <PlanCard plan={plans[startIndex]} animIndex={0} />
          </div>

          {/* Mobile nav */}
          <div className="mt-6 flex items-center justify-between px-1">
            <NavBtn onClick={() => prev(1)} disabled={!canPrevMobile} aria-label="Previous">
              <ChevronLeft size={16} />
            </NavBtn>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to plan ${i + 1}`}
                  className="rounded-full transition-all duration-300 focus:outline-none"
                  style={{
                    width: i === startIndex ? 24 : 8,
                    height: 8,
                    backgroundColor: i === startIndex ? C.teal : "#d1d1d1",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <NavBtn onClick={() => next(1)} disabled={!canNextMobile} aria-label="Next">
              <ChevronRight size={16} />
            </NavBtn>
          </div>

          {/* Plan counter */}
          <p className="text-center text-xs text-[#888] mt-3">
            {startIndex + 1} of {plans.length}
          </p>
        </div>

        {/* ── DESKTOP: 3 cards with carousel ── */}
        <div className="hidden lg:block">
          <div key={`desktop-${animKey}`} className="grid grid-cols-3 gap-6 pt-8">
            {plans.slice(startIndex, startIndex + VISIBLE_DESKTOP).map((plan, i) => (
              <PlanCard key={startIndex + i} plan={plan} animIndex={i} />
            ))}
          </div>

          {/* Desktop nav */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              {plans.map((_, i) => {
                const active = i >= startIndex && i < startIndex + VISIBLE_DESKTOP;
                return (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: active ? 20 : 8,
                      height: 8,
                      backgroundColor: active ? C.text : "#d1d1d1",
                    }}
                  />
                );
              })}
            </div>
            <NavBtn onClick={() => prev(1)} disabled={!canPrevDesktop} aria-label="Previous">
              <ChevronLeft size={16} />
            </NavBtn>
            <NavBtn onClick={() => next(1)} disabled={!canNextDesktop} aria-label="Next">
              <ChevronRight size={16} />
            </NavBtn>
          </div>
        </div>

      </div>
    </section>
  );
}