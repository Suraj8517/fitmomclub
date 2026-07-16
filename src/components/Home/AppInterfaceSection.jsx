

import { useEffect, useRef } from "react";
import yogaimage from "../../assets/home/hero.webp";
import logo from "../../assets/home/fitmom.png";
// NEW: real phone mockup image, used as an overlay instead of coded bezel chrome.
// Replace this asset with your own transparent-screen phone mockup PNG/SVG.
import phoneFrame from "../../assets/home/phone-frame.png";

// ── Scroll section height ────────────────────────────────────────────────────
const SCROLL_LENGTH_VH = 320;

// ── Spring constants ─────────────────────────────────────────────────────────
const SCROLL_SPRING = 7.5;
const ENTRY_SPRING  = 6.0;

// ── Grid layout constants ───────────────────────────────────────────────────
const GRID_W  = 380;
const GRID_H  = 600; // was 680 — matches the phone's screen cutout, not the full bezel height
const PAD     = 24;
const SCR_W   = GRID_W - PAD * 2;
const SCR_H   = GRID_H - PAD * 2;
const GAP     = 2; // was 5 — tighter spacing once cards dock into the grid
const COL     = (SCR_W - GAP) / 2;

const PHOTO_H = 180; // was 224 — trimmed to fit the shorter screen cutout
const ROW2_H  = 150; // was 168
const ROW3_H  = 138; // was 154
const MED_H   = 56;  // was 62
const TOP_PAD = Math.floor(
  (SCR_H - (PHOTO_H + GAP + ROW2_H + GAP + ROW3_H + GAP + MED_H)) / 2
);

const DESIGN_W = 390;

// NEW: how tall the phone mockup image renders relative to the viewport.
// Reduced so the mockup doesn't dominate the screen.
const PHONE_FRAME_MAX_H = 720; // px, was 900

const PHONE_FADE_START = 0.82;
const PHONE_FADE_END   = 0.98;

// NEW: fine-tune alignment against the actual phone-frame.png screen cutout.
// Positive values nudge the assembled grid DOWN, negative nudge it UP.
// Adjust this until row2/row3 sit fully inside the phone's screen area.
const PHONE_SCREEN_Y_OFFSET = 0; // px

// ── Utility: linear interpolate (unchanged) ──────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

function ease(t) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function cardTransform(x, y, sw, fw, sh, fh) {
  const scaleX = sw / fw;
  const scaleY = sh / fh;
  return `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scaleX}, ${scaleY})`;
}

// ── shared dark-theme building blocks matching the screenshot ─────────

/** Small colored icon badge used in every card header (Weight, WHR, Sleep...) */
function IconBadge({ bg, color, children, size = 28 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: bg, color }}
    >
      {children}
    </div>
  );
}

/** The blue → orange → red gradient progress bar used on Weight / WHR cards */
function GradientBar({ value }) {
  // value: 0..1 position of the marker along the bar
  return (
    <div className="relative w-full h-1.5 rounded-full  bg-neutral-800">
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: "100%",
          background:
            "linear-gradient(90deg,#38BDF8 0%,#34D399 22%,#FBBF24 55%,#FB923C 78%,#EF4444 100%)",
        }}
      />
      <div
        className="absolute top-1/2 w-2 h-4 rounded-full bg-white  -translate-y-1/2"
        style={{ left: `calc(${value * 100}% - 6px)` }}
      />
    </div>
  );
}

// Icon glyphs (inline SVG, no icon library dependency)
const Icons = {
  scale: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
    </svg>
  ),
  ratio: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <circle cx="7" cy="7" r="4" />
      <circle cx="17" cy="17" r="4" opacity="0.5" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </svg>
  ),
  drop: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
      <path d="M12 2s7 8.2 7 13a7 7 0 1 1-14 0c0-4.8 7-13 7-13Z" />
    </svg>
  ),
  heartbeat: (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h4l2-6 4 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function AppInterfaceSection() {
  const wrapperRef = useRef(null);

  const progressRef      = useRef(0);
  const entryProgressRef = useRef(0);
  const targetRef        = useRef(0);
  const entryTargetRef   = useRef(0);
  const scaleRef         = useRef(1);
  const isMobileRef      = useRef(
    typeof window !== "undefined" && window.innerWidth < 480
  );
  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);

  const scalerRef     = useRef(null);
  const bandRef       = useRef(null);
  const cardRefs      = useRef({});
  const phoneFrameRef = useRef(null); // the mockup <img>, opacity driven from RAF

  const weightNodeRef    = useRef(null); // Weight card kg value
  const sleepHoursNodeRef = useRef(null); // Sleep card "hr" value
  const emotionalNodeRef  = useRef(null); // Emotional mini pill subtext

  const row2Y  = TOP_PAD + PHOTO_H + GAP;
  const row3Y  = row2Y + ROW2_H + GAP;
  const medY   = row3Y + ROW3_H + GAP;
  const rightX = COL + GAP;
  const pill3H = (ROW2_H - GAP * 2) / 3;

  const sc = (lx, ly) => ({
    fx: lx - SCR_W / 2,
    fy: ly - SCR_H / 2,
  });

  const F = {
    yoga:      sc(SCR_W / 2,         TOP_PAD + PHOTO_H / 2),
    sleep:     sc(COL / 2,           row2Y + ROW2_H / 2),
    steps:     sc(rightX + COL / 2,  row2Y + pill3H / 2),
    ready:     sc(rightX + COL / 2,  row2Y + pill3H + GAP + pill3H / 2),
    sleepPill: sc(rightX + COL / 2,  row2Y + (pill3H + GAP) * 2 + pill3H / 2),
    heart:     sc(COL / 2,           row3Y + ROW3_H / 2),
    run:       sc(rightX + COL / 2,  row3Y + ROW3_H / 2),
    med:       sc(SCR_W / 2,         medY + MED_H / 2),
  };

  const S_desktop = {
    yoga:      { x: -120, y: -240 },
    sleep:     { x: -170, y:  -20 },
    steps:     { x:  100, y: -280 },
    ready:     { x:  120, y: -175 },
    sleepPill: { x:  140, y:  -70 },
    heart:     { x: -110, y:  220 },
    run:       { x:  100, y:  120 },
    med:       { x:   60, y:  250 },
  };

  const S_mobile = {
    yoga:      { x:  -10, y: -310 },
    sleep:     { x: -185, y:  -60 },
    steps:     { x:  155, y: -290 },
    ready:     { x:  160, y: -180 },
    sleepPill: { x:  155, y:  -75 },
    heart:     { x: -160, y:  200 },
    run:       { x:  140, y:  130 },
    med:       { x:   10, y:  310 },
  };

  const FINAL_SIZES = {
    yoga:      { w: SCR_W,  h: PHOTO_H },
    sleep:     { w: COL,    h: ROW2_H  },
    steps:     { w: COL,    h: pill3H  },
    ready:     { w: COL,    h: pill3H  },
    sleepPill: { w: COL,    h: pill3H  },
    heart:     { w: COL,    h: ROW3_H  },
    run:       { w: COL,    h: ROW3_H  },
    med:       { w: SCR_W,  h: MED_H   },
  };

  const SPREAD_SIZES = {
    yoga:      { w: 350, h: 185 },
    sleep:     { w: 193, h: 170 },
    steps:     { w: 193, h: 62  },
    ready:     { w: 193, h: 62  },
    sleepPill: { w: 215, h: 62  },
    heart:     { w: 215, h: 155 },
    run:       { w: 215, h: 155 },
    med:       { w: 432, h: 62  },
  };

  useEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s  = Math.min(vw / (GRID_W + 32), vh / (GRID_H + 32), 1);
      scaleRef.current = s;
      if (scalerRef.current) {
        scalerRef.current.style.transform = `scale(${s})`;
      }
    };

    const updateTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;

      entryTargetRef.current = Math.min(Math.max((vh - rect.top) / vh, 0), 1);

      const total = el.offsetHeight - vh;
      if (total > 0) {
        targetRef.current = Math.min(Math.max(-rect.top, 0), total) / total;
      }
    };

    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;

      const entryAlpha  = 1 - Math.exp(-ENTRY_SPRING * dt);
      const scrollAlpha = 1 - Math.exp(-SCROLL_SPRING * dt);

      entryProgressRef.current +=
        (entryTargetRef.current - entryProgressRef.current) * entryAlpha;
      progressRef.current +=
        (targetRef.current - progressRef.current) * scrollAlpha;

      const easedEntry = ease(entryProgressRef.current);
      const p          = ease(progressRef.current);

      if (bandRef.current) {
        const bandScale   = lerp(1, 0.35, p);
        const bandOpacity = Math.max(0, lerp(1, 0, Math.min(p * 1.8, 1)));
        bandRef.current.style.transform = `translate(-50%, -50%) scale(${bandScale})`;
        bandRef.current.style.opacity   = bandOpacity;
      }

      const vh    = window.innerHeight;
      const riseY = (1 - easedEntry) * (vh || 800);
      if (scalerRef.current) {
        scalerRef.current.style.transform =
          `scale(${scaleRef.current}) translateY(${(riseY / scaleRef.current) + PHONE_SCREEN_Y_OFFSET}px)`;
      }

      const spreadScale = window.innerWidth / DESIGN_W;
      const S = isMobileRef.current ? S_mobile : S_desktop;

      const KEYS = ["yoga","sleep","steps","ready","sleepPill","heart","run","med"];
      for (let i = 0; i < KEYS.length; i++) {
        const key  = KEYS[i];
        const node = cardRefs.current[key];
        if (!node) continue;

        const fs = FINAL_SIZES[key];
        const ss = SPREAD_SIZES[key];

        const x = lerp(S[key].x * spreadScale, F[key].fx, p);
        const y = lerp(S[key].y,               F[key].fy, p);

        const sw = lerp(ss.w, fs.w, p);
        const sh = lerp(ss.h, fs.h, p);
        const scaleX = sw / fs.w;
        const scaleY = sh / fs.h;

        node.style.transform =
          `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scaleX}, ${scaleY})`;
      }

      const yogaInner = cardRefs.current["yoga_inner"];
      if (yogaInner) {
        yogaInner.style.borderRadius = `${lerp(16, 12, p)}px`;
      }

      // ── phone frame fade-in, only once cards have reached center ──────
      if (phoneFrameRef.current) {
        const fadeT = Math.min(
          Math.max((p - PHONE_FADE_START) / (PHONE_FADE_END - PHONE_FADE_START), 0),
          1
        );
        phoneFrameRef.current.style.opacity = fadeT;
      }

      // ── Live-updating values (direct DOM text writes, no React state) ──────
      const weightKg   = lerp(70, 68, p).toFixed(1);   // Weight card
      const sleepHours = Math.round(lerp(6, 8, p));    // Sleep card
      const mood       = p > 0.6 ? "Calm" : p > 0.3 ? "Okay" : "Tracking";

      if (weightNodeRef.current)     weightNodeRef.current.textContent     = weightKg;
      if (sleepHoursNodeRef.current) sleepHoursNodeRef.current.textContent = sleepHours;
      if (emotionalNodeRef.current)  emotionalNodeRef.current.textContent  = mood;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", () => {
      updateTarget();
      computeScale();
      isMobileRef.current = window.innerWidth < 480;
    });

    updateTarget();
    computeScale();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", computeScale);
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gpuStyle = {
    willChange:         "transform",
    transformStyle:     "preserve-3d",
    backfaceVisibility: "hidden",
    contain:            "layout paint style",
  };

  const CardGPU = ({ name, children }) => {
    const fs = FINAL_SIZES[name];
    return (
      <div
        ref={el => { cardRefs.current[name] = el; }}
        className="absolute overflow-hidden"
        style={{
          width:  fs.w,
          height: fs.h,
          ...gpuStyle,
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <section
      ref={wrapperRef}
      className="relative bg-[#F6F5F1]"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        <img
          ref={phoneFrameRef}
          src={phoneFrame}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute z-0"
          style={{
            height: `min(${PHONE_FRAME_MAX_H}px, 92vh)`,
            width: "auto",
            opacity: 0,
            transition: "opacity 0.15s linear",
          }}
        />

        <div
          ref={scalerRef}
          className="relative z-20"
          style={{
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <div className="relative" style={{ width: 0, height: 0 }}>

            {/* ── LOGO BAND ── */}
            <div
              ref={bandRef}
              className="absolute pointer-events-none w-[150px] mt:w-[220px] mt:h-[300px]"
              style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
            >
              <img src={logo} className="w-full h-full object-contain" alt="FitMom logo" />
            </div>

            {/* ── HERO: "Track your Daily Calorie" rings card ──────────────── */}
            <CardGPU name="yoga">
              <div
                ref={el => { cardRefs.current["yoga_inner"] = el; }}
                className="w-full h-full bg-neutral-900 flex flex-col justify-center px-6 py-4"
                style={{ borderRadius: 16 }}
              >
                <p className="text-sm text-neutral-300 font-semibold mb-3">Track your Daily Calorie</p>
                <div className="flex items-center justify-between flex-1">
                  {[
                    { label: "Calories Intake", value: "1,200 / 1000", unit: "Kcal", color: "#2DD4BF", pct: 0.72, emoji: "🥗" },
                    { label: "Workout",         value: "500",          unit: "Kcal Burned", color: "#F87171", pct: 0.5,  emoji: "⚡️" },
                    { label: "Steps",           value: "500",          unit: "Kcal Burned", color: "#FB923C", pct: 0.5,  emoji: "👟" },
                  ].map((ring, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="relative w-20 h-20">
                        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                          <circle cx="20" cy="20" r="17" fill="none" stroke="#2A2A2E" strokeWidth="2" />
                          <circle
                            cx="20" cy="20" r="17" fill="none" stroke={ring.color} strokeWidth="2"
                            strokeDasharray={`${2 * Math.PI * 17}`}
                            strokeDashoffset={`${2 * Math.PI * 17 * (1 - ring.pct)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">{ring.emoji}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 text-center leading-tight font-medium">{ring.label}</p>
                      <p className="text-[10px] font-bold text-center leading-tight" style={{ color: ring.color }}>
                        {ring.value} <span className="text-neutral-500 font-medium">{ring.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardGPU>

            {/* ── SLEEP CARD ── */}
            <CardGPU name="sleep">
              <div className="w-full h-full bg-neutral-900 rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <IconBadge bg="rgba(56,189,248,0.15)" color="#38BDF8" size={32}>{Icons.moon}</IconBadge>
                    <p className="text-[13px] text-blue-400 font-semibold">Sleep</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span ref={sleepHoursNodeRef} className="text-3xl font-normal text-white">8</span>
                  <span className="text-[11px] text-neutral-400">hr</span>
                  <span className="text-3xl font-normal text-white">00</span>
                  <span className="text-[11px] text-neutral-400">min</span>
                </div>
                <p className="text-[11px] text-neutral-500">100% Goal</p>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-400" style={{ width: "100%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Deep: 5h 10m</span>
                  <span>Light: 2h 50m</span>
                </div>
              </div>
            </CardGPU>

            {/* ── WATER (compact mini stat) ── */}
            <CardGPU name="steps">
              <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5">
                <IconBadge bg="rgba(59,130,246,0.15)" color="#3B82F6" size={32}>{Icons.drop}</IconBadge>
                <div className="min-w-0">
                  <p className="text-[10px] text-blue-400 leading-none">Water</p>
                  <p className="text-base font-normal text-white leading-tight">5,000 ml</p>
                </div>
              </div>
            </CardGPU>

            {/* ── HEALTH (compact mini stat) ── */}
            <CardGPU name="ready">
              <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5">
                <IconBadge bg="rgba(45,212,191,0.15)" color="#2DD4BF" size={32}>{Icons.heartbeat}</IconBadge>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-teal-400 leading-none">Health</p>
                  <p className="text-[12px] font-normal text-white leading-tight">View all</p>
                </div>
                <span className="text-neutral-500">{Icons.chevron}</span>
              </div>
            </CardGPU>

            {/* ── EMOTIONAL (compact mini stat) ── */}
            <CardGPU name="sleepPill">
              <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center px-3 gap-2.5">
                <IconBadge bg="rgba(244,114,182,0.15)" color="#F472B6" size={32}>{Icons.moon}</IconBadge>
                <div className="min-w-0">
                  <p className="text-[10px] text-pink-400 leading-none">Emotional</p>
                  <p ref={emotionalNodeRef} className="text-[12px] font-normal text-white leading-tight">Tracking</p>
                </div>
              </div>
            </CardGPU>

            {/* ── WEIGHT CARD ── */}
            <CardGPU name="heart">
              <div className="w-full h-full bg-neutral-900 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <IconBadge bg="rgba(52,211,153,0.15)" color="#34D399" size={32}>{Icons.scale}</IconBadge>
                    <p className="text-[13px] text-emerald-400 font-semibold">Weight</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span ref={weightNodeRef} className="text-4xl font-normal text-white">68.0</span>
                  <span className="text-sm text-neutral-400">kg</span>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-400 ml-0.5" fill="currentColor">
                    <path d="M4 6l8 8 4-4 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <GradientBar value={0.42} />
                <p className="text-[11px] text-neutral-500">
                  BMI <span className="text-emerald-400 font-semibold">23.14</span>
                </p>
              </div>
            </CardGPU>

            {/* ── WHR CARD ── */}
            <CardGPU name="run">
              <div className="w-full h-full bg-neutral-900 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <IconBadge bg="rgba(45,212,191,0.15)" color="#2DD4BF" size={32}>{Icons.ratio}</IconBadge>
                    <p className="text-[13px] text-teal-400 font-semibold">WHR</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">25 Oct {Icons.chevron}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-normal text-white">0.80</span>
                  <span className="text-[11px] text-neutral-400">Ratio</span>
                </div>
                <GradientBar value={0.18} />
                <p className="text-[11px] text-neutral-500">
                  Progress <span className="text-teal-400 font-semibold">↘ Good</span>
                </p>
              </div>
            </CardGPU>

            {/* ── BOTTOM ROW (kept as a compact dark nav-style row) ── */}
            <CardGPU name="med">
              <div className="w-full h-full bg-neutral-900 rounded-2xl px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBadge bg="rgba(255,255,255,0.06)" color="#9CA3AF" size={30}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 12h6M9 16h6M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 4a2 2 0 0 1 4 0H9Z" strokeLinecap="round" />
                    </svg>
                  </IconBadge>
                  <span className="text-base font-medium text-neutral-300">Medical Records</span>
                </div>
                <span className="text-neutral-500">{Icons.chevron}</span>
              </div>
            </CardGPU>

          </div>
        </div>
      </div>
    </section>
  );
}