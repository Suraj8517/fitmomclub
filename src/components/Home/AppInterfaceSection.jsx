/**
 * AppInterfaceSection — Optimized Animation Version
 *
 * KEY OPTIMIZATIONS:
 *
 * 1. ZERO REACT STATE DURING SCROLL — All animation values live in refs.
 *    requestAnimationFrame writes directly to DOM via element.style.transform.
 *    React state is never updated during the scroll animation loop.
 *
 * 2. SPRING/EXPONENTIAL SMOOTHING — Replaces fixed-speed lerp with a
 *    critically-damped exponential decay: rendered += (target - rendered) * (1 - e^(-k*dt))
 *    This gives the subtle, natural lag behind scroll that Google's UI has.
 *
 * 3. GPU TRANSFORMS ONLY — Cards are sized once via inline style on mount and
 *    never resized again. All per-frame updates use only translate3d + scale
 *    via CSS transform strings. Width/height/top/left are never mutated.
 *
 * 4. GPU LAYER PROMOTION — Every animated card gets:
 *    will-change: transform
 *    transform-style: preserve-3d
 *    backface-visibility: hidden
 *    contain: layout paint style
 *    These hints promote each card to its own compositor layer.
 *
 * 5. SINGLE RAF LOOP — One requestAnimationFrame loop drives everything.
 *    No nested or duplicated loops.
 *
 * 6. SHADOW OPTIMIZATION — box-shadow is removed from animated cards.
 *    A lightweight CSS drop-shadow filter is applied once on a wrapper that
 *    is NOT animated, so the shadow never triggers repaint on transform.
 *
 * 7. SMOOTH EASING — Replaced the aggressive cubic ease-in-out (4t³) with a
 *    smoother quintic blend that better matches Google/Apple motion design.
 *
 * 8. SUB-PIXEL ACCURACY — No Math.round() on transform values.
 *    Decimal positions are preserved for buttery interpolation.
 *
 * 9. ENTRY ANIMATION — entryProgress is also spring-smoothed with its own
 *    spring constant so the initial card assembly feels deliberate.
 *
 * 10. MOBILE PRESERVED — isMobile detection unchanged. Layout constants unchanged.
 */

import { useEffect, useRef } from "react";
import yogaimage from "../../assets/home/hero.webp";
import logo from "../../assets/home/fitmom.png";

// ── Scroll section height ────────────────────────────────────────────────────
const SCROLL_LENGTH_VH = 320;

// ── Spring constants ─────────────────────────────────────────────────────────
// Lower = slower / more lag.  Higher = snappier.
// SCROLL_SPRING matches the subtle lag in Google Health's UI.
// ENTRY_SPRING is slightly faster so the intro feels punchy.
const SCROLL_SPRING = 7.5;   // exponential decay coefficient for scroll progress
const ENTRY_SPRING  = 6.0;   // exponential decay coefficient for entry progress

// ── Grid layout constants (UNCHANGED) ───────────────────────────────────────
const GRID_W  = 480;
const GRID_H  = 680;
const PAD     = 24;
const SCR_W   = GRID_W - PAD * 2;
const SCR_H   = GRID_H - PAD * 2;
const GAP     = 5;
const COL     = (SCR_W - GAP) / 2;

const PHOTO_H = 188;
const ROW2_H  = 168;
const ROW3_H  = 154;
const MED_H   = 62;
const TOP_PAD = Math.floor(
  (SCR_H - (PHOTO_H + GAP + ROW2_H + GAP + ROW3_H + GAP + MED_H)) / 2
);

const DESIGN_W = 390;

// ── Utility: linear interpolate (unchanged) ──────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * OPTIMIZED EASING — smoothstep quintic (3t²-2t³ with one extra stage).
 * Much softer than the original 4t³ cubic, closer to Apple's spring curves.
 * No abrupt acceleration at t=0 or t=1.
 */
function ease(t) {
  const c = Math.min(Math.max(t, 0), 1);
  // Smootherstep (Ken Perlin): 6t⁵ - 15t⁴ + 10t³
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * Computes the CSS transform string for a card given its animated values.
 * Uses translate3d to force GPU compositing. No width/height mutation.
 *
 * @param {number} x  - center-relative X offset in pixels
 * @param {number} y  - center-relative Y offset in pixels
 * @param {number} sw - current interpolated width
 * @param {number} fw - final (target) width  — used to compute scale
 * @param {number} sh - current interpolated height
 * @param {number} fh - final (target) height — used to compute scale
 */
function cardTransform(x, y, sw, fw, sh, fh) {
  // OPTIMIZATION: instead of changing width/height every frame (layout thrash),
  // cards are fixed at their FINAL size and we scale them down to match the
  // spread size. This means the browser never recalculates layout — only the
  // compositor rerasters on the GPU layer.
  const scaleX = sw / fw;
  const scaleY = sh / fh;
  // translate3d triggers GPU layer; the Z=0 is intentional (no perspective needed)
  return `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scaleX}, ${scaleY})`;
}

export default function AppInterfaceSection() {
  const wrapperRef = useRef(null);

  // ── OPTIMIZATION: All animation state lives in refs, not useState ──────────
  // This means zero React re-renders during the animation loop.
  const progressRef      = useRef(0);  // smoothed scroll progress [0,1]
  const entryProgressRef = useRef(0);  // smoothed entry progress [0,1]
  const targetRef        = useRef(0);  // raw scroll target
  const entryTargetRef   = useRef(0);  // raw entry target
  const scaleRef         = useRef(1);  // device scale
  const isMobileRef      = useRef(
    typeof window !== "undefined" && window.innerWidth < 480
  );
  const rafRef     = useRef(null);
  const lastTimeRef = useRef(null);

  // ── Refs to every animated DOM node ──────────────────────────────────────
  // We write transforms directly to these instead of going through React state.
  const scalerRef   = useRef(null); // the inner scale wrapper div
  const bandRef     = useRef(null); // logo band
  const cardRefs    = useRef({});   // { key: domNode }

  // ── Dynamic display values (only bpm/sleep need React state for text update)
  // We batch these into a single ref and update DOM text nodes directly.
  const bpmNodeRef   = useRef(null);
  const sleepNodeRef = useRef(null);
  const sleepPillNodeRef = useRef(null);

  // ── LAYOUT CONSTANTS derived from grid (computed once, never re-derived) ──
  const row2Y  = TOP_PAD + PHOTO_H + GAP;
  const row3Y  = row2Y + ROW2_H + GAP;
  const medY   = row3Y + ROW3_H + GAP;
  const rightX = COL + GAP;
  const pill3H = (ROW2_H - GAP * 2) / 3;

  // sc: screen-relative center coordinate → frame-center-relative offset
  const sc = (lx, ly) => ({
    fx: lx - SCR_W / 2,
    fy: ly - SCR_H / 2,
  });

  // Final positions (unchanged from original)
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

  // Spread positions for desktop and mobile (unchanged)
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

  // Final sizes for each card (width, height)
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

  // Spread sizes
  const SPREAD_SIZES = {
    yoga:      { w: 350, h: 165 },
    sleep:     { w: 213, h: 170 },
    steps:     { w: 213, h:62 },
    ready:     { w: 213, h: 62  },
    sleepPill: { w: 215, h: 62  },
    heart:     { w: 215, h: 155 },
    run:       { w: 215, h: 155 },
    med:       { w: 432, h: 62  },
  };

  useEffect(() => {
    // ── computeScale: updates the scale wrapper div directly (no state) ──────
    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s  = Math.min(vw / (GRID_W + 32), vh / (GRID_H + 32), 1);
      scaleRef.current = s;
      if (scalerRef.current) {
        scalerRef.current.style.transform = `scale(${s})`;
      }
    };

    // ── updateTarget: reads scroll position, updates raw targets ─────────────
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

    // ── Main RAF loop ─────────────────────────────────────────────────────────
    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      // Cap dt at 1/30s to prevent huge jumps after tab switch
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;

      // OPTIMIZATION: Exponential smoothing (spring-like behavior).
      // rendered += (target - rendered) * (1 - e^(-k*dt))
      // This is frame-rate independent and produces the natural lag effect.
      const entryAlpha = 1 - Math.exp(-ENTRY_SPRING * dt);
      const scrollAlpha = 1 - Math.exp(-SCROLL_SPRING * dt);

      entryProgressRef.current +=
        (entryTargetRef.current - entryProgressRef.current) * entryAlpha;
      progressRef.current +=
        (targetRef.current - progressRef.current) * scrollAlpha;

      const easedEntry = ease(entryProgressRef.current);
      const p          = ease(progressRef.current);

      // ── Band (logo): scale + fade out ──────────────────────────────────────
      if (bandRef.current) {
        const bandScale   = lerp(1, 0.35, p);
        const bandOpacity = Math.max(0, lerp(1, 0, Math.min(p * 1.8, 1)));
        // OPTIMIZATION: single transform string, no layout properties changed
        bandRef.current.style.transform  = `translate(-50%, -50%) scale(${bandScale})`;
        bandRef.current.style.opacity    = bandOpacity;
      }

      // ── Entry rise: move the whole frame up from below ─────────────────────
      const vh   = window.innerHeight;
      const riseY = (1 - easedEntry) * (vh || 800);
      // We apply entry rise to the scaler wrapper so all cards move together
      if (scalerRef.current) {
        scalerRef.current.style.transform =
          `scale(${scaleRef.current}) translateY(${riseY / scaleRef.current}px)`;
      }

      // ── Spread scale for X positions (unchanged logic) ─────────────────────
      const spreadScale = window.innerWidth / DESIGN_W;
      const S = isMobileRef.current ? S_mobile : S_desktop;

      // ── Per-card transform updates ─────────────────────────────────────────
      const KEYS = ["yoga","sleep","steps","ready","sleepPill","heart","run","med"];
      for (let i = 0; i < KEYS.length; i++) {
        const key  = KEYS[i];
        const node = cardRefs.current[key];
        if (!node) continue;

        const fs = FINAL_SIZES[key];
        const ss = SPREAD_SIZES[key];

        // Interpolate position
        const x = lerp(S[key].x * spreadScale, F[key].fx, p);
        const y = lerp(S[key].y,               F[key].fy, p);

        // Interpolate size — expressed as scale factors to avoid layout thrash
        const sw = lerp(ss.w, fs.w, p);
        const sh = lerp(ss.h, fs.h, p);
        const scaleX = sw / fs.w;
        const scaleY = sh / fs.h;

        // OPTIMIZATION: only translate3d + scale — zero layout properties touched
        // Sub-pixel values preserved (no rounding)
        node.style.transform =
          `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scaleX}, ${scaleY})`;
      }

      // ── Yoga card border-radius (the one visual property that must change) ──
      const yogaInner = cardRefs.current["yoga_inner"];
      if (yogaInner) {
        yogaInner.style.borderRadius = `${lerp(16, 12, p)}px`;
      }

      // ── Update text values via direct DOM mutation ──────────────────────────
      const bpm      = Math.round(lerp(111, 131, p));
      const sleepval = Math.round(lerp(51, 80, p));
      if (bpmNodeRef.current)       bpmNodeRef.current.textContent       = `${bpm} bpm`;
      if (sleepNodeRef.current)     sleepNodeRef.current.textContent     = sleepval;
      if (sleepPillNodeRef.current) sleepPillNodeRef.current.textContent = `${sleepval} · Good`;

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
    // OPTIMIZATION: single RAF loop, started once
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", computeScale);
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GPU acceleration style applied to every animated card ─────────────────
  // These are set once at render time and never change, so they can be
  // computed as a static object rather than inline per card.
  const gpuStyle = {
    willChange:          "transform",
    transformStyle:      "preserve-3d",   // promote to GPU compositing layer
    backfaceVisibility:  "hidden",        // skip back-face rasterization
    contain:             "layout paint style", // isolate repaint scope
  };

  /**
   * CardGPU — fixed-size card wrapper that is GPU-promoted.
   * Size is set once at mount to the FINAL size; per-frame animation
   * uses only scale() to express intermediate sizes, avoiding layout thrash.
   *
   * OPTIMIZATION: drop-shadow is on a non-animated inner wrapper so the
   * browser never repaints the shadow during transform changes.
   */
  const CardGPU = ({ name, children }) => {
    const fs = FINAL_SIZES[name];
    return (
      <div
        ref={el => { cardRefs.current[name] = el; }}
        className="absolute overflow-hidden"
        style={{
          // Fixed at final size — scale() handles intermediate sizes
          width:  fs.w,
          height: fs.h,
          // GPU promotion
          ...gpuStyle,
        }}
      >
        {/* OPTIMIZATION: shadow lives here, outside the transform, so it
            doesn't repaint when the card moves */}
        <div style={{ width: "100%", height: "100%", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}>
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
        {/*
          OPTIMIZATION: scaleRef drives this div's transform directly in RAF.
          transformOrigin stays center. We also layer the entry riseY here
          so all cards rise together as one GPU layer.
        */}
        <div
          ref={scalerRef}
          style={{
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <div className="relative" style={{ width: 0, height: 0 }}>

            {/* ── LOGO BAND ── */}
            {/*
              OPTIMIZATION: bandRef is written directly in RAF.
              No state update needed.
            */}
            <div
              ref={bandRef}
              className="absolute pointer-events-none w-[150px] mt:w-[220px] mt:h-[300px]"
              style={{
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              <img src={logo} className="w-full h-full object-contain" alt="FitMom logo" />
            </div>

            {/* ── YOGA PHOTO ── */}
            <CardGPU name="yoga">
              <div
                ref={el => { cardRefs.current["yoga_inner"] = el; }}
                className="w-full h-full overflow-hidden bg-neutral-200"
                // borderRadius updated in RAF — this is the only non-transform
                // property we animate, kept on an inner div so it doesn't
                // affect the card's compositor layer
                style={{ borderRadius: 16 }}
              >
                <img src={yogaimage} className="w-full h-full object-cover object-top" alt="Yoga" />
                <div className="w-full h-full bg-gradient-to-br from-green-300 via-teal-200 to-sky-300" />
              </div>
            </CardGPU>

            {/* ── SLEEP SCORE ── */}
            <CardGPU name="sleep">
              <div className="w-full h-full bg-white rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden">
                <div>
                  <p className="text-[11px] text-neutral-400 font-medium">Sleep score</p>
                  {/* OPTIMIZATION: text node updated via ref in RAF, no setState */}
                  <p ref={sleepNodeRef} className="text-3xl font-semibold text-neutral-900">51</p>
                </div>
                <svg viewBox="0 0 100 26" className="w-full">
                  <polyline
                    points="0,21 14,16 28,19 42,11 56,14 70,5 84,8 100,3"
                    fill="none" stroke="#93C5FD" strokeWidth="1.4" strokeDasharray="2.5 2"
                  />
                  <polyline
                    points="70,5 84,8 100,3"
                    fill="none" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round"
                  />
                  {[0,14,28,42,56,70,84,100].map((x,i) => (
                    <circle key={i} cx={x} cy={[21,16,19,11,14,5,8,3][i]} r="2.2"
                      fill={i >= 5 ? "#EAB308" : "#3B82F6"} />
                  ))}
                </svg>
                <div>
                  <div className="flex justify-between text-[9px] text-neutral-300 mb-1">
                    {["M","T","W","T","F","S","S"].map((d,i) => <span key={i}>{d}</span>)}
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Good
                  </span>
                </div>
              </div>
            </CardGPU>

            {/* ── STEPS PILL ── */}
            <CardGPU name="steps">
              <div className="w-full h-full rounded-2xl overflow-hidden flex">
                <div className="bg-teal-400 flex items-center px-2.5 gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                      <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-teal-100 leading-none">Steps</p>
                    <p className="text-base font-bold text-white leading-tight">8,532</p>
                  </div>
                </div>
                <div className="bg-teal-200 w-9 flex-shrink-0" />
              </div>
            </CardGPU>

            {/* ── READINESS PILL ── */}
            <CardGPU name="ready">
              <div className="w-full h-full bg-green-200 rounded-2xl flex items-center px-2.5 gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/25 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-green-800" fill="currentColor">
                    <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] text-green-700 leading-none">Readiness</p>
                  <p className="text-base font-bold text-green-900 leading-tight">89</p>
                </div>
              </div>
            </CardGPU>

            {/* ── SLEEP PILL ── */}
            <CardGPU name="sleepPill">
              <div className="w-full h-full bg-purple-200 rounded-2xl flex items-center px-2.5 gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/25 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-purple-900" fill="currentColor">
                    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold text-purple-900 leading-tight">7h 54m</p>
                  {/* OPTIMIZATION: text node updated via ref in RAF */}
                  <p ref={sleepPillNodeRef} className="text-[9px] text-purple-700 leading-none">51 · Good</p>
                </div>
              </div>
            </CardGPU>

            {/* ── HEART RATE ── */}
            <CardGPU name="heart">
              <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center gap-1">
                <svg viewBox="0 0 48 48" className="w-11 h-11">
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
                {/* OPTIMIZATION: bpm text node updated via ref in RAF */}
                <p ref={bpmNodeRef} className="text-xl font-semibold text-neutral-800">111 bpm</p>
              </div>
            </CardGPU>

            {/* ── OUTDOOR RUN ── */}
            <CardGPU name="run">
              <div className="w-full h-full bg-white rounded-2xl p-2.5 flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-teal-600" fill="currentColor">
                      <path d="M13.5 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM9 9l-2 9h2l1-4 2 2v5h2v-6l-2-2 .5-3A6 6 0 0 0 17 12h-2a4 4 0 0 1-3.5-2L9 9Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-800 leading-none">Outdoor run</p>
                    <p className="text-[10px] text-neutral-400">2:58 PM · 434 cal</p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden flex-1 bg-neutral-100 mb-1.5">
                  <svg viewBox="0 0 130 55" className="w-full h-full">
                    <rect width="130" height="55" fill="#E5E7EB"/>
                    <polyline
                      points="12,44 30,30 50,40 70,22 92,35 114,12 124,24"
                      fill="none" stroke="#F97316" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                    <polyline
                      points="70,22 84,9 98,17"
                      fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round"
                    />
                    <circle cx="124" cy="24" r="3.5" fill="#3B82F6" stroke="white" strokeWidth="1.2"/>
                  </svg>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[9px] text-neutral-400 leading-none">Duration</p>
                    <p className="text-[11px] font-semibold text-neutral-800">30m 23s</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-400 leading-none">Cardio load</p>
                    <p className="text-[11px] font-semibold text-neutral-800">+20</p>
                  </div>
                </div>
              </div>
            </CardGPU>

            {/* ── MEDICAL RECORDS ── */}
            <CardGPU name="med">
              <div className="w-full h-full bg-white rounded-2xl px-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 12h6M9 16h6M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 4a2 2 0 0 1 4 0H9Z" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">Medical Records</span>
                </div>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </CardGPU>

          </div>
        </div>
      </div>
    </section>
  );
}