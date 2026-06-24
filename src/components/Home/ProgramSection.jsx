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

const COLOR = {
  bg: "#e0f5f0",
  border: "#a7ddd1",
  accent: "#0e7a6a",
  accentDark: "#085041",
  text: "#085041",
  textMid: "#0f6e56",
  footerGrad: "linear-gradient(to bottom, transparent 0%, #cff0e8 35%)",
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
      className="relative flex flex-col rounded-3xl "
      style={{
        backgroundColor: COLOR.bg,
        border: `1.5px solid ${COLOR.border}`,
        minHeight: 480,
        animation: `slideInRight 0.5s cubic-bezier(0.22,1,0.36,1) ${animIndex * 0.1}s both`,
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Tag badge — top left */}
      <span
        className="absolute top-3.5 left-3.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
        style={{ backgroundColor: COLOR.accent, color: COLOR.bg, letterSpacing: "0.03em" }}
      >
        {tag}
      </span>

      {/* Icon badge — top right */}
      <div
        className="absolute top-[-30px] left-[43%]  w-15 h-15 rounded-full flex items-center justify-center border-5 border-white/80"
        style={{ backgroundColor: COLOR.accent }}
      >
        <Icon size={20} color={COLOR.bg} />
      </div>

      {/* Card top */}
      <div
        className="pt-11 pb-4 px-5 border-b"
        style={{ borderColor: COLOR.border }}
      >
        <p className="text-[15px] font-medium pr-2" style={{ color: COLOR.text }}>{name}</p>
        <p className="text-[12px] mt-0.5" style={{ color: COLOR.textMid }}>{subtitle}</p>
        <div className="flex items-center gap-1.5 mt-2.5" style={{ color: COLOR.textMid }}>
          <Clock size={13} />
          <span className="text-[12px]">{duration}</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 pt-3.5 pb-20 flex-1">
        <ul className="flex flex-col gap-2.5">
          {visible.map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-2"
              style={{
                animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
              }}
            >
              <Heart size={13} style={{ color: COLOR.accent, marginTop: 2, flexShrink: 0 }} />
              <span className="text-[12px]" style={{ color: COLOR.text }}>{f}</span>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 flex items-center gap-1 text-[11px] transition-colors"
            style={{ color: COLOR.textMid, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = COLOR.accentDark}
            onMouseLeave={e => e.currentTarget.style.color = COLOR.textMid}
          >
            {expanded
              ? <><ChevronUp size={12} /> Show less</>
              : <><ChevronDown size={12} /> +{features.length - PREVIEW_COUNT} more</>}
          </button>
        )}
      </div>

      {/* Fixed footer CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-3"
        style={{ background: COLOR.footerGrad }}
      >
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => { setBtnHover(false); setBtnActive(false); }}
          onMouseDown={() => setBtnActive(true)}
          onMouseUp={() => setBtnActive(false)}
          className="w-full flex items-center justify-between rounded-full py-2.5 px-5 text-[13px] font-medium"
          style={{
            backgroundColor: btnHover ? COLOR.accentDark : COLOR.accent,
            color: COLOR.bg,
            border: "none",
            cursor: "pointer",
            transform: btnActive ? "scale(0.97)" : btnHover ? "scale(1.02)" : "scale(1)",
            boxShadow: btnHover && !btnActive ? "0 4px 14px rgba(14,122,106,0.35)" : "none",
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
            <ArrowRight size={13} color={COLOR.bg} />
          </span>
        </button>
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

export default function ProgramSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const VISIBLE = 3;

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < plans.length;

  const prev = () => { if (canPrev) { setStartIndex(i => i - 1); setAnimKey(k => k + 1); } };
  const next = () => { if (canNext) { setStartIndex(i => i + 1); setAnimKey(k => k + 1); } };

  const visiblePlans = plans.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="px-4 py-16" style={{ backgroundColor: "#F6F5F1" }}>
      <div className="mx-auto max-w-5xl">

        {/* Mobile / tablet */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:hidden">
          {plans.map((plan, i) => (
            <div key={i} className="pt-6">
              <PlanCard plan={plan} animIndex={i} />
            </div>
          ))}
        </div>

        {/* Desktop: 3 cards with carousel */}
        <div className="hidden lg:block">
          <div key={animKey} className="grid grid-cols-3 gap-6 pt-6">
            {visiblePlans.map((plan, i) => (
              <PlanCard key={startIndex + i} plan={plan} animIndex={i} />
            ))}
          </div>

          {/* Nav */}
          <div className="mt-6 flex items-center justify-end gap-2">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mr-2">
              {plans.map((_, i) => {
                const active = i >= startIndex && i < startIndex + VISIBLE;
                return (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: active ? 20 : 8,
                      height: 8,
                      backgroundColor: active ? COLOR.accent : COLOR.border,
                    }}
                  />
                );
              })}
            </div>

            {/* Prev */}
            <NavBtn onClick={prev} disabled={!canPrev} aria-label="Previous">
              <ChevronLeft size={16} />
            </NavBtn>

            {/* Next */}
            <NavBtn onClick={next} disabled={!canNext} aria-label="Next">
              <ChevronRight size={16} />
            </NavBtn>
          </div>
        </div>
      </div>
    </section>
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
        border: `1px solid ${hover ? COLOR.accent : COLOR.border}`,
        backgroundColor: hover ? COLOR.accent : "white",
        color: hover ? "#e0f5f0" : COLOR.text,
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