import { useEffect, useRef, useState } from "react";
import yogaimage from "../../assets/home/hero.webp";
import logo from "../../assets/home/fitmom.png";


const SCROLL_LENGTH_VH = 350;
const SMOOTHING = 7;

// ── Grid layout constants (size of the centered card cluster) ────────────────
const GRID_W    = 300;
const GRID_H    = 460;
const PAD       = 12;
const SCR_W     = GRID_W - PAD * 2;   // 276
const SCR_H     = GRID_H - PAD * 2;   // 436
const GAP       = 4;
const COL       = (SCR_W - GAP) / 2;     // 136

// Row heights — scaled down to match the shorter screen, still sums to fit SCR_H
const PHOTO_H   = 125;
const ROW2_H    = 117;
const ROW3_H    = 106;
const MED_H     = 34;
const TOP_PAD   = Math.floor((SCR_H - (PHOTO_H + GAP + ROW2_H + GAP + ROW3_H + GAP + MED_H)) / 2); // ~21

export default function AppInterfaceSection() {
  const wrapperRef = useRef(null);
  const [progress, setProgress]   = useState(0);
  const targetRef   = useRef(0);
  const renderedRef = useRef(0);
  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const updateTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      targetRef.current = Math.min(Math.max(-rect.top, 0), total) / total;
    };
    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;
      const t = 1 - Math.exp(-SMOOTHING * dt);
      renderedRef.current += (targetRef.current - renderedRef.current) * t;
      if (Math.abs(targetRef.current - renderedRef.current) < 0.0005)
        renderedRef.current = targetRef.current;
      setProgress(renderedRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    updateTarget();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const p    = ease(progress);
  const lerp = (a, b, t) => a + (b - a) * t;
  const bpm  = Math.round(lerp(111, 131, p));

  // ── sc(): screen-local top-left (x,y) → offset from screen centre ─────────
  // Screen centre = phone centre = viewport centre
  const sc = (lx, ly) => ({
    fx: lx - SCR_W / 2,
    fy: ly - SCR_H / 2,
  });

  // ── Final positions (screen-local, from screen top-left) ──────────────────
  const row2Y       = TOP_PAD + PHOTO_H + GAP;
  const row3Y       = row2Y + ROW2_H + GAP;
  const medY        = row3Y + ROW3_H + GAP;
  const rightX      = COL + GAP;
  const pill3H      = (ROW2_H - GAP * 2) / 3;

  // per-card final offsets from screen centre
  const F = {
    yoga:      sc(130,          TOP_PAD+20),
    sleep:     sc(60,          row2Y+20),
    steps:     sc(rightX+60,     row2Y-20),
    ready:     sc(rightX+60,     row2Y-20 + pill3H + GAP),
    sleepPill: sc(rightX+60,     row2Y-20 + (pill3H + GAP) * 2),
    heart:     sc(60,          row3Y+20),
    run:       sc(rightX+60,     row3Y+20),
    med:       sc(130,          medY-15),
  };

  // ── Spread positions (viewport-px offsets from centre, p=0) ───────────────
  const S = {
    yoga:      { x: -380, y: -210 },
    sleep:     { x: -430, y:  -10 },
    steps:     { x:  340, y: -250 },
    ready:     { x:  390, y: -155 },
    sleepPill: { x:  410, y:  -60 },
    heart:     { x: -450, y:  195 },
    run:       { x:  370, y:  100 },
    med:       { x:   60, y:  215 },
  };

  // Build per-card animated values
  const c = (key, spreadW, finalW, spreadH, finalH) => ({
    x: lerp(S[key].x, F[key].fx, p),
    y: lerp(S[key].y, F[key].fy, p),
    w: lerp(spreadW, finalW, p),
    h: lerp(spreadH, finalH, p),
  });

  const yoga      = c("yoga",      210, SCR_W,  130, PHOTO_H);
  const sleep     = c("sleep",     148, COL,    120, ROW2_H);
  const steps     = c("steps",     155, COL,     42, pill3H);
  const ready     = c("ready",     148, COL,     42, pill3H);
  const sleepPill = c("sleepPill", 148, COL,     42, pill3H);
  const heart     = c("heart",     125, COL,    115, ROW3_H);
  const run       = c("run",       150, COL,    120, ROW3_H);
  const med       = c("med",       220, SCR_W,   42, MED_H);

  // yoga border-radius: large when spread, 0 at top of the grid
  const yogaBR = lerp(14, 10, p);

  const bandOpacity  = lerp(1, 0, Math.min(p * 1.6, 1));
  const bandScale    = lerp(1, 0.4, p);

  return (
    <section
      ref={wrapperRef}
      className="relative bg-[#F6F5F1]"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── CARDS ────────────────────────────────────────────────────────── */}
        <div className="relative" style={{ width: 0, height: 0 }}>

          {/* Wristband / Logo */}
          <div className="absolute pointer-events-none"
            style={{
              transform: `translate(-50%,-50%) scale(${bandScale})`,
              opacity: bandOpacity, width: 200, height: 270,
            }}>
            <img src={logo} className="w-full h-full object-contain" />
          </div>

          {/* ── YOGA PHOTO ── */}
          <Card v={yoga}>
            <div className="w-full h-full overflow-hidden bg-neutral-200"
              style={{ borderRadius: yogaBR }}>
              <img src={yogaimage} className="w-full h-full object-cover object-top" /> 
              <div className="w-full h-full bg-gradient-to-br from-green-300 via-teal-200 to-sky-300"/>
            </div>
          </Card>

          {/* ── SLEEP SCORE ── */}
          <Card v={sleep}>
            <div className="w-full h-full bg-white rounded-2xl shadow-sm p-3 flex flex-col justify-between overflow-hidden">
              <div>
                <p className="text-[10px] text-neutral-400 font-medium">Sleep score</p>
                <p className="text-2xl font-semibold text-neutral-900">80</p>
              </div>
              <svg viewBox="0 0 100 26" className="w-full">
                <polyline points="0,21 14,16 28,19 42,11 56,14 70,5 84,8 100,3"
                  fill="none" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="2.5 2"/>
                <polyline points="70,5 84,8 100,3"
                  fill="none" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round"/>
                {[0,14,28,42,56,70,84,100].map((x,i)=>(
                  <circle key={i} cx={x} cy={[21,16,19,11,14,5,8,3][i]} r="2"
                    fill={i>=5?"#EAB308":"#3B82F6"}/>
                ))}
              </svg>
              <div>
                <div className="flex justify-between text-[8px] text-neutral-300 mb-1">
                  {["M","T","W","T","F","S","S"].map((d,i)=><span key={i}>{d}</span>)}
                </div>
                <span className="bg-blue-100 text-blue-600 text-[9px] font-semibold px-2 py-0.5 rounded-full">Good</span>
              </div>
            </div>
          </Card>

          {/* ── STEPS PILL ── */}
          <Card v={steps}>
            <div className="w-full h-full rounded-2xl overflow-hidden flex shadow-sm">
              <div className="bg-teal-400 flex items-center px-2 gap-1.5 flex-1 min-w-0">
                <div className="w-5 h-5 rounded-full bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
                    <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[8px] text-teal-100 leading-none">Steps</p>
                  <p className="text-sm font-bold text-white leading-tight">8,532</p>
                </div>
              </div>
              <div className="bg-teal-200 w-8 flex-shrink-0"/>
            </div>
          </Card>

          {/* ── READINESS PILL ── */}
          <Card v={ready}>
            <div className="w-full h-full bg-green-200 rounded-2xl shadow-sm flex items-center px-2 gap-1.5">
              <div className="w-5 h-5 rounded-full bg-green-500/25 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-green-800" fill="currentColor">
                  <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[8px] text-green-700 leading-none">Readiness</p>
                <p className="text-sm font-bold text-green-900 leading-tight">89</p>
              </div>
            </div>
          </Card>

          {/* ── SLEEP PILL ── */}
          <Card v={sleepPill}>
            <div className="w-full h-full bg-purple-200 rounded-2xl shadow-sm flex items-center px-2 gap-1.5">
              <div className="w-5 h-5 rounded-full bg-purple-500/25 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-purple-900" fill="currentColor">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-purple-900 leading-tight">7h 54m</p>
                <p className="text-[8px] text-purple-700 leading-none">82 · Good</p>
              </div>
            </div>
          </Card>

          {/* ── HEART RATE ── */}
          <Card v={heart}>
            <div className="w-full h-full bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-9 h-9 mb-1">
                <defs>
                  <linearGradient id="hg3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#FBBF24"/>
                    <stop offset="30%"  stopColor="#EF4444"/>
                    <stop offset="65%"  stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
                <path d="M24 40s-16-10-16-22a10 10 0 0 1 16-8 10 10 0 0 1 16 8c0 12-16 22-16 22Z" fill="url(#hg3)"/>
              </svg>
              <p className="text-lg font-semibold text-neutral-800">{bpm} bpm</p>
            </div>
          </Card>

          {/* ── OUTDOOR RUN ── */}
          <Card v={run}>
            <div className="w-full h-full bg-white rounded-2xl shadow-sm p-2 flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-teal-600" fill="currentColor">
                    <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-neutral-800 leading-none">Outdoor run</p>
                  <p className="text-[9px] text-neutral-400">2:58 PM · 434 cal</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden flex-1 bg-neutral-100 mb-1">
                <svg viewBox="0 0 130 55" className="w-full h-full">
                  <rect width="130" height="55" fill="#E5E7EB"/>
                  <polyline points="12,44 30,30 50,40 70,22 92,35 114,12 124,24"
                    fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="70,22 84,9 98,17"
                    fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="124" cy="24" r="3.5" fill="#3B82F6" stroke="white" strokeWidth="1.2"/>
                </svg>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="text-neutral-400 leading-none" style={{fontSize:8}}>Duration</p>
                  <p className="text-[10px] font-semibold text-neutral-800">30m 23s</p>
                </div>
                <div>
                  <p className="text-neutral-400 leading-none" style={{fontSize:8}}>Cardio load</p>
                  <p className="text-[10px] font-semibold text-neutral-800">+20</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ── MEDICAL RECORDS ── */}
          <Card v={med}>
            <div className="w-full h-full bg-white rounded-2xl shadow-sm px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 12h6M9 16h6M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 4a2 2 0 0 1 4 0H9Z" strokeLinecap="round"/>
                </svg>
                <span className="text-xs font-medium text-neutral-700">Medical Records</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}

function Card({ v, children }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        transform: `translate(calc(${v.x}px - 50%), calc(${v.y}px - 50%))`,
        width:  v.w,
        height: v.h,
        willChange: "transform, width, height",
      }}
    >
      {children}
    </div>
  );
}

function ease(t) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
}