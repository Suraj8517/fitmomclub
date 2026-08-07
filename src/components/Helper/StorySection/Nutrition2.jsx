import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Bell } from "lucide-react";

// ---------------------------------------------------------------------------
// Fires once when the element is (almost) fully in view, then stops
// observing — matches the reveal pattern used by the other story overlays.
function useInFullView(ref, threshold = 0.5) {
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
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

// Eased ramp from 0 -> target, used for both the calorie count and the
// ring's fill percentage so they land in sync.
function useAnimatedValue(target, duration = 1000, delay = 0, enabled = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf;
    let start;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, enabled]);
  return value;
}

const MACROS = [
  { label: "Protein", value: 25, max: 146, unit: "g", color: "#E5484D" },
  { label: "Carbs", value: 162, max: 293, unit: "g", color: "#2F8FE8" },
  { label: "Fat", value: 22, max: 65, unit: "g", color: "#F5A524" },
  { label: "Fibre", value: 13, max: 33, unit: "g", color: "#3DBE64" },
];

const CALORIES = 986;
const GOAL = 2342;
const PCT = CALORIES / GOAL;

export default function Nutrition1() {
  const cardRef = useRef(null);
  const inView = useInFullView(cardRef);

  const [reminderOn, setReminderOn] = useState(false);
  const [range, setRange] = useState("D");

  const size = 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Ring sweeps in first, calories count up alongside it, macro bars and
  // the reminder card follow in a short stagger once the card is visible.
  const animatedPct = useAnimatedValue(PCT, 1100, 150, inView);
  const animatedCalories = useAnimatedValue(CALORIES, 1100, 150, inView);
  const dash = circumference * animatedPct;

  return (
    <div
      ref={cardRef}
      className="absolute hidden lg:block z-30 rounded-3xl overflow-hidden"
      style={{
        right: "6%",
        top: "50%",
        transform: inView ? "translateY(-50%)" : "translateY(-46%)",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        background:
          "radial-gradient(120% 90% at 50% 0%, #123328 0%, #0b1f19 45%, #060b0a 100%)",
      }}
    >
      <style>{`
        @keyframes nut1BellRing {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-14deg); }
          30% { transform: rotate(12deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(5deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes nut1RowIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nut1BarFill {
          from { width: 0%; }
        }
        @keyframes nut1PopIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .nut1-thumb {
          transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .nut1-toggle-track {
          transition: background-color 0.28s ease;
        }
        .nut1-icon-btn {
          transition: transform 0.15s ease, background-color 0.15s ease;
        }
        .nut1-icon-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        .nut1-icon-btn:active {
          transform: scale(0.88);
        }
        .nut1-pill {
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
        }
        .nut1-pill:active {
          transform: scale(0.94);
        }
        @media (prefers-reduced-motion: reduce) {
          .nut1-thumb, .nut1-toggle-track, .nut1-icon-btn, .nut1-pill {
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="w-full max-w-sm px-5 pt-6 pb-8 text-white"
        style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="nut1-icon-btn w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <div
            className="flex items-center rounded-full p-1"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {["D", "W", "M"].map((r_) => (
              <button
                key={r_}
                onClick={() => setRange(r_)}
                className="nut1-pill px-6 py-2 rounded-full text-sm font-medium"
                style={{
                  background: range === r_ ? "rgba(45,184,144,0.18)" : "transparent",
                  color: range === r_ ? "#3ECF9E" : "rgba(255,255,255,0.55)",
                  border: range === r_ ? "1px solid rgba(62,207,158,0.35)" : "1px solid transparent",
                }}
              >
                {r_}
              </button>
            ))}
          </div>

          <div
            className="nut1-icon-btn w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span style={{ fontSize: 20 }}>📋</span>
          </div>
        </div>

        {/* Ring */}
        <div className="flex items-center justify-center mb-9">
          <button className="nut1-icon-btn p-2 -ml-2 rounded-full" style={{ color: "rgba(255,255,255,0.55)" }}>
            <ChevronLeft size={26} strokeWidth={2} />
          </button>

          <div className="relative mx-2" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={stroke}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="#2FBE8F"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                style={{
                  filter: inView ? "drop-shadow(0 0 6px rgba(47,190,143,0.55))" : "none",
                  transition: "filter 0.4s ease",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p
                className="text-sm font-medium mb-1"
                style={{
                  color: "#3ECF9E",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
                }}
              >
                Aug 04
              </p>
              <p className="text-5xl font-bold tabular-nums">
                {Math.round(animatedCalories)}
              </p>
              <p
                className="text-sm mt-1"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  opacity: inView ? 1 : 0,
                  transition: "opacity 0.5s ease 0.3s",
                }}
              >
                of {GOAL} cal
              </p>
              <button
                className="nut1-icon-btn mt-3 px-4 py-1.5 rounded-lg text-xs"
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(0.9)",
                  transition: "opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s, background-color 0.15s ease",
                }}
              >
                Edit Goal
              </button>
            </div>
          </div>

          <button className="nut1-icon-btn p-2 -mr-2 rounded-full" style={{ color: "rgba(255,255,255,0.55)" }}>
            <ChevronRight size={26} strokeWidth={2} />
          </button>
        </div>

        {/* Goal card */}
        <div
          className="rounded-3xl p-6 mb-4"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.55s ease 0.5s, transform 0.55s ease 0.5s",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-lg font-semibold">Goal</p>
            <Pencil size={16} color="#3ECF9E" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {MACROS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  opacity: inView ? 1 : 0,
                  animation: inView
                    ? `nut1RowIn 0.5s ease ${0.6 + i * 0.09}s both`
                    : "none",
                }}
              >
                <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {m.label} <span className="font-bold text-white">{m.value}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    /{m.max}
                    {m.unit}
                  </span>
                </p>
                <div
                  className="h-[5px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                      background: m.color,
                      animation: inView
                        ? `nut1BarFill 0.7s ease ${0.75 + i * 0.09}s both`
                        : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal reminder */}
        <div
          className="rounded-3xl p-5 flex items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.55s ease 1.05s, transform 0.55s ease 1.05s",
          }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#2FBE8F" }}
          >
            <Bell
              size={18}
              color="#0b1f19"
              fill="#0b1f19"
              style={{
                animation: inView ? "nut1BellRing 1.8s ease 1.4s 1" : "none",
                transformOrigin: "50% 20%",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold mb-0.5">Meal Reminder</p>
            <p className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>
              Breakfast at 10:00 AM, Lunch at 02:00 PM, Dinner at 08:00 PM
            </p>
          </div>
          <button
            onClick={() => setReminderOn((v) => !v)}
            className="nut1-toggle-track w-12 h-7 rounded-full flex-shrink-0 relative"
            style={{ background: reminderOn ? "#2FBE8F" : "rgba(255,255,255,0.15)" }}
          >
            <div
              className="nut1-thumb absolute top-0.5 w-6 h-6 rounded-full bg-white"
              style={{ left: reminderOn ? 22 : 2 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}