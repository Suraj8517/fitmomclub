import { useState } from "react";
import {
  Scissors, Stethoscope, Activity, Home,
  ArrowRight, ChevronDown, ChevronUp, Heart,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const PREVIEW_COUNT = 4;

const plans = [
  {
    Icon: Scissors,
    name: "Basic Care Plan",
    price: "$49",
    desc: "Enjoy a basic grooming session to keep your pet looking fresh and clean.",
    color: { bg: "#dceedd", border: "#b5d9b8", accent: "#4a9b6f" },
    features: [
      "Wellness check-up",
      "Vaccination update",
      "Routine flea & tick prevention",
      "Basic grooming (bath and brushing)",
      "Nail trimming",
      "Ear cleaning",
      "Weight check",
      "Dental hygiene advice",
    ],
  },
  {
    Icon: Stethoscope,
    name: "Standard Health Plan",
    price: "$99",
    desc: "Balanced health and grooming for everyday wellness needs.",
    color: { bg: "#fde8de", border: "#f7c4b0", accent: "#d4704a" },
    features: [
      "Comprehensive health check-up",
      "Vaccination update",
      "Flea, tick & parasite prevention",
      "Full grooming session",
      "Blood pressure screening",
      "Dental check",
      "Nutritional guidance",
      "Monthly wellness report",
      "Priority appointment booking",
    ],
  },
  {
    Icon: Activity,
    name: "Premium Health Plan",
    price: "$159",
    desc: "Offers a comprehensive health check-up, blood tests, and screenings.",
    color: { bg: "#d6eaf8", border: "#a9cfe8", accent: "#2e7db5" },
    features: [
      "Advanced health check-up",
      "Blood tests & diagnostics",
      "Vaccinations & parasite prevention",
      "Full grooming & styling",
      "Microchip scanning",
      "Skin & coat analysis",
      "Dietary & weight management plan",
      "Behavioral consultation",
      "24/7 vet helpline access",
      "Emergency care guidance",
    ],
  },
  {
    Icon: Home,
    name: "Ultimate Care Plan",
    price: "$299",
    desc: "Our Ultimate Care Plan provides all-inclusive, top-tier care for your pet's wellbeing.",
    color: { bg: "#e8e0f5", border: "#c9b8e8", accent: "#7b5ea7" },
    features: [
      "Complete wellness check-up",
      "Specialized health consultation",
      "Emergency care & minor surgeries",
      "Comprehensive grooming & styling",
      "Full diagnostics & lab work",
      "Orthopedic assessment",
      "Vision & hearing check",
      "Allergy testing",
      "Physiotherapy session",
      "Home visit option",
      "Dedicated vet assigned",
      "Monthly health reports",
    ],
  },
];

function PlanCard({ plan }) {
  const { Icon, name, price, desc, features, color } = plan;
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? features : features.slice(0, PREVIEW_COUNT);
  const hasMore = features.length > PREVIEW_COUNT;

  return (
    <div
      className="relative flex flex-col items-center rounded-3xl pt-10 pb-8 px-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.10)] cursor-default h-full"
      style={{ backgroundColor: color.bg, border: `1.5px solid ${color.border}` }}
    >
      {/* Floating icon badge */}
      <div
        className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full shadow-md border-2 border-white"
        style={{ backgroundColor: color.accent }}
      >
        <Icon size={22} color="white" />
      </div>

      {/* Plan name */}
      <h3 className="mt-2 text-[20px] font-semibold text-[#222] text-center">{name}</h3>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-5xl font-bold text-[#111] leading-none">{price}</span>
        <span className="text-sm text-[#666]">/per visit</span>
      </div>

      {/* Description */}
      <p className="mt-4 text-[13px] leading-relaxed text-[#555] text-center">{desc}</p>

      <hr className="w-full mt-5 border-black/10" />

      {/* Features */}
      <div className="w-full mt-4 flex flex-col gap-3">
        {visible.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <Heart size={15} style={{ color: color.accent }} className="shrink-0" />
            <span className="text-[13px] text-[#333]">{f}</span>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 flex items-center gap-1 text-[12px] text-[#999] transition-colors hover:text-black"
          >
            {expanded ? (
              <><ChevronUp size={13} /> Show less</>
            ) : (
              <><ChevronDown size={13} /> +{features.length - PREVIEW_COUNT} more</>
            )}
          </button>
        )}
      </div>

      {/* CTA */}
      <button
        className="mt-6 w-full flex items-center justify-between rounded-full py-3.5 px-6 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
        style={{ backgroundColor: color.accent }}
      >
        Make Appointment
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <ArrowRight size={15} color="white" />
        </span>
      </button>
    </div>
  );
}

export default function ProgramSection() {
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE = 3;
  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < plans.length;

  const prev = () => { if (canPrev) setStartIndex((i) => i - 1); };
  const next = () => { if (canNext) setStartIndex((i) => i + 1); };

  const visiblePlans = plans.slice(startIndex, startIndex + VISIBLE);

  return (
    <section className="px-4 py-16 bg-[#f6f5f1]">
      <div className="mx-auto max-w-7xl">

        {/* Mobile / tablet: show all cards */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:hidden">
          {plans.map((plan, i) => (
            <div key={i} className="pt-6">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>

        {/* Desktop: show 3 cards with prev/next */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8">
            {visiblePlans.map((plan, i) => (
              <div
                key={startIndex + i}
                className="pt-6 transition-all duration-300"
                style={{ animation: "fadeSlide 0.3s ease" }}
              >
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>

          {/* Nav buttons — bottom right */}
          <div className="mt-8 flex items-center justify-end gap-3">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mr-2">
              {plans.map((_, i) => {
                const isActive = i >= startIndex && i < startIndex + VISIBLE;
                return (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? "20px" : "8px",
                      height: "8px",
                      backgroundColor: isActive ? "#555" : "#ccc",
                    }}
                  />
                );
              })}
            </div>

            <button
              onClick={prev}
              disabled={!canPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccc] bg-white transition-all duration-200 hover:bg-black hover:text-white hover:border-black disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccc] bg-white transition-all duration-200 hover:bg-black hover:text-white hover:border-black disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}