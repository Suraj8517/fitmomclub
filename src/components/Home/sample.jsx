import { useEffect, useRef, useState } from "react";

const CIRC = 2 * Math.PI * 26;

// ── Phone dimensions ──────────────────────────────────────────────────────────
const PW = 300, PH = 590;
const PAD = 10, GAP = 8;
const CW = (PW - PAD * 2 - GAP) / 2; // ~131

const STATUS_H = 32, HEADER_H = 52, TITLE_H = 28;
const TOP = STATUS_H + HEADER_H + TITLE_H; // ~112

const CAL_H   = 120;
const ROW2_H  = 100;
const ROW3_H  = 100;
const ROW4_H  = 90;
const QUICK_H = 100;

const CAL_Y   = TOP;
const ROW2_Y  = CAL_Y + CAL_H + GAP;
const ROW3_Y  = ROW2_Y + ROW2_H + GAP;
const ROW4_Y  = ROW3_Y + ROW3_H + GAP;
const QUICK_Y = ROW4_Y + ROW4_H + GAP;

const shellLeft = -PW / 2;
const shellTop  = -PH / 2;

function phoneCoord(lx, ly, w, h) {
  return { fx: shellLeft + PAD + lx, fy: shellTop + ly, fw: w, fh: h };
}

// ── Card layout: final (phone) + spread (scattered) positions ─────────────────
const CARDS = {
  header: { ...phoneCoord(0,          STATUS_H,  PW,    HEADER_H), sx: -380, sy: -260, sw: 280, sh: 60  },
  cal:    { ...phoneCoord(0,          CAL_Y,     PW,    CAL_H),    sx:   20, sy: -320, sw: 260, sh: 130 },
  weight: { ...phoneCoord(0,          ROW2_Y,    CW,    ROW2_H),   sx: -400, sy:  -80, sw: 150, sh: 110 },
  whr:    { ...phoneCoord(CW + GAP,   ROW2_Y,    CW,    ROW2_H),   sx:  380, sy: -120, sw: 150, sh: 110 },
  sleep:  { ...phoneCoord(0,          ROW3_Y,    CW,    ROW3_H),   sx: -420, sy:   60, sw: 150, sh: 110 },
  water:  { ...phoneCoord(CW + GAP,   ROW3_Y,    CW,    ROW3_H),   sx:  400, sy:   40, sw: 150, sh: 110 },
  health: { ...phoneCoord(0,          ROW4_Y,    CW,    ROW4_H),   sx: -390, sy:  200, sw: 150, sh: 100 },
  emo:    { ...phoneCoord(CW + GAP,   ROW4_Y,    CW,    ROW4_H),   sx:  360, sy:  180, sw: 150, sh: 100 },
  quick:  { ...phoneCoord(0,          QUICK_Y,   PW,    QUICK_H),  sx:    0, sy:  320, sw: 260, sh: 110 },
};

const CARD_KEYS = Object.keys(CARDS);

// ── Easing & math helpers ─────────────────────────────────────────────────────
function ease(t) { const c = Math.min(Math.max(t, 0), 1); return c * c * (3 - 2 * c); }
function lerp(a, b, t) { return a + (b - a) * t; }
function setRing(el, pct) {
  if (!el) return;
  el.setAttribute("stroke-dasharray", `${(CIRC * Math.min(pct, 1)).toFixed(1)} ${CIRC}`);
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HealthTrackerSection() {
  const wrapRef    = useRef(null);
  const cardRefs   = useRef({});
  const shellRef   = useRef(null);
  const r1Ref      = useRef(null);
  const r2Ref      = useRef(null);
  const r3Ref      = useRef(null);
  const targetRef  = useRef(0);
  const renderedRef= useRef(0);
  const lastRef    = useRef(null);
  const rafRef     = useRef(null);
  const [hint, setHint] = useState(true);

  // Dynamic value refs (avoid re-renders)
  const domRefs = useRef({});
  const reg = (key) => (el) => { domRefs.current[key] = el; };

  useEffect(() => {
    const updateTarget = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      targetRef.current = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total) / total;
    };

    const tick = (time) => {
      if (lastRef.current == null) lastRef.current = time;
      const dt = Math.min((time - lastRef.current) / 1000, 1 / 30);
      lastRef.current = time;
      const t = 1 - Math.exp(-7 * dt);
      renderedRef.current += (targetRef.current - renderedRef.current) * t;
      if (Math.abs(targetRef.current - renderedRef.current) < 0.0005)
        renderedRef.current = targetRef.current;

      apply(ease(renderedRef.current));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(p) {
    // Phone shell
    if (shellRef.current)
      shellRef.current.style.opacity = Math.min(p * 3, 1);

    // Cards
    CARD_KEYS.forEach((k) => {
      const el = cardRefs.current[k];
      if (!el) return;
      const d  = CARDS[k];
      const cx = lerp(d.sx, d.fx + d.fw / 2, p);
      const cy = lerp(d.sy, d.fy + d.fh / 2, p);
      const w  = lerp(d.sw, d.fw, p);
      const h  = lerp(d.sh, d.fh, p);
      el.style.width     = `${w}px`;
      el.style.height    = `${h}px`;
      el.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
      el.style.borderRadius = `${lerp(18, 13, p)}px`;
      el.style.opacity   = 0.4 + p * 0.6;
    });

    // Rings
    setRing(r1Ref.current, lerp(800,  1200, p) / 1000);
    setRing(r2Ref.current, lerp(200,  500,  p) / 500);
    setRing(r3Ref.current, lerp(150,  500,  p) / 500);

    // Text values
    const D = domRefs.current;
    const set = (k, v) => { if (D[k]) D[k].textContent = v; };

    set("cal-val", `${Math.round(lerp(800,  1200, p))} Kcal`);
    set("wko-val", `${Math.round(lerp(200,  500,  p))} Kcal`);
    set("stp-val", `${Math.round(lerp(150,  500,  p))} Kcal`);

    const wgt = lerp(72, 68, p);
    set("wgt-val", wgt.toFixed(1));
    set("bmi-val", lerp(24.5, 23.14, p).toFixed(2));
    if (D["wgt-thumb"]) D["wgt-thumb"].style.left = `${Math.min(((wgt - 60) / 20) * 100, 100)}%`;

    const whr = lerp(0.72, 0.80, p);
    set("whr-val", whr.toFixed(2));
    if (D["whr-thumb"]) D["whr-thumb"].style.left = `${whr * 100}%`;

    set("slp-h", Math.floor(lerp(6, 8, p)));
    set("slp-m", String(Math.round(lerp(30, 0, p))).padStart(2, "0"));
    const sg = Math.round(lerp(75, 100, p));
    set("slp-pct", sg);
    if (D["slp-bar"]) D["slp-bar"].style.width = `${sg}%`;

    const h2o = Math.round(lerp(2000, 5000, p));
    const hg  = Math.round(lerp(40, 100, p));
    set("h2o-val", h2o.toLocaleString());
    set("h2o-pct", hg);
    if (D["h2o-bottle"]) D["h2o-bottle"].style.height = `${hg}%`;
    if (D["h2o-lbl"]) {
      D["h2o-lbl"].textContent = `${hg}%`;
      D["h2o-lbl"].style.color = hg > 55 ? "#fff" : "#333";
    }

    if (p < 0.06 !== hint) setHint(p < 0.06);
  }

  const cardRef = (k) => (el) => { cardRefs.current[k] = el; };

  return (
    <section
      ref={wrapRef}
      style={{ height: "500vh", background: "#0D0D0D", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* ── Phone Shell ── */}
        <div
          ref={shellRef}
          style={{
            position: "absolute",
            width: PW, height: PH,
            left: "50%", top: "50%",
            marginLeft: -PW / 2, marginTop: -PH / 2,
            borderRadius: 40,
            border: "7px solid #1C1C1C",
            background: "#111",
            opacity: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px 0", fontSize: 11, color: "#fff", fontWeight: 700 }}>
            <span>9:41</span>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <svg width="13" height="10" viewBox="0 0 16 12" fill="white"><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4" y="2" width="3" height="10" rx="1"/><rect x="8" y="0" width="3" height="12" rx="1"/></svg>
              <svg width="13" height="10" viewBox="0 0 18 14" fill="white"><path d="M9 2.5C6.2 2.5 3.7 3.7 2 5.6L0 3.6C2.3 1.4 5.5 0 9 0s6.7 1.4 9 3.6L16 5.6C14.3 3.7 11.8 2.5 9 2.5z"/><circle cx="9" cy="12" r="2"/></svg>
              <svg width="22" height="10" viewBox="0 0 26 12"><rect x="0" y="1" width="22" height="10" rx="3" stroke="white" strokeWidth="1.2" fill="none"/><rect x="1.5" y="2.5" width="16" height="7" rx="2" fill="white"/><rect x="23" y="4" width="2" height="4" rx="1" fill="white" opacity=".5"/></svg>
            </div>
          </div>
          {/* Bottom nav */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 58, background: "#111", borderTop: "1px solid #1E1E1E", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "0 8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke="#555" strokeWidth="2" strokeLinecap="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#555" strokeWidth="2"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="#555" strokeWidth="2"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#555" strokeWidth="2"/></svg>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#00897B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="14" cy="4" r="2" fill="#fff"/><path d="M5 9l2-2 4 2 3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M8 13l-2 5 3-1 2-4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#555" strokeWidth="2"/><path d="M10 8l6 4-6 4V8z" fill="#555"/></svg>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        {/* ── Cards container ── */}
        <div style={{ position: "relative", width: 0, height: 0 }}>

          {/* Header card */}
          <div ref={cardRef("header")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#111", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                  <svg width="26" height="26" viewBox="0 0 40 40"><circle cx="20" cy="14" r="8" fill="#F9A825"/><ellipse cx="20" cy="32" rx="12" ry="8" fill="#E91E63"/></svg>
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, background: "#FFD700", borderRadius: "50%", border: "2px solid #111", fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>👑</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#666" }}>Good Morning</div>
                  <div style={{ fontSize: 17, color: "#fff", fontWeight: 700 }}>Shalini</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <div style={{ background: "#1A1A1A", borderRadius: 20, padding: "6px 12px", display: "flex", alignItems: "center", gap: 5, border: "1px solid #2A2A2A" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#4DD0E1" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#4DD0E1" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>Sync</span>
                </div>
                <div style={{ background: "#1A1A1A", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2A2A2A" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#888" strokeWidth="2"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#888" strokeWidth="2"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Calorie rings card */}
          <div ref={cardRef("cal")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#141414", border: "1px solid #222", padding: 12 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>Track your Daily Calorie</div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {[
                  { id: "r1", color: "#26C6DA", emoji: "🥗", valKey: "cal-val" },
                  { id: "r2", color: "#F44336", emoji: "⚡", valKey: "wko-val" },
                  { id: "r3", color: "#FF9800", emoji: "👟", valKey: "stp-val" },
                ].map(({ id, color, emoji, valKey }, i) => (
                  <div key={id} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 4px" }}>
                      <svg width="56" height="56" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#1E1E1E" strokeWidth="5"/>
                        <circle ref={id === "r1" ? r1Ref : id === "r2" ? r2Ref : r3Ref}
                          cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="5"
                          strokeDasharray={`0 ${CIRC}`} strokeDashoffset="40.8" strokeLinecap="round"/>
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{emoji}</div>
                      <div style={{ position: "absolute", top: -3, right: -3, width: 12, height: 12, background: color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: id === "r2" ? "#fff" : "#000", fontWeight: 700 }}>+</div>
                    </div>
                    <div style={{ fontSize: 8, color: "#666" }}>{["Calories", "Workout", "Steps"][i]}</div>
                    <div ref={reg(valKey)} style={{ fontSize: 8, color, fontWeight: 700 }}>— Kcal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weight */}
          <div ref={cardRef("weight")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#141414", border: "1px solid #222", padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 20, height: 20, background: "#0D2B1E", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="#26C6DA" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ color: "#26C6DA", fontSize: 11, fontWeight: 700 }}>Weight</span>
                </div>
                <span style={{ color: "#444", fontSize: 9 }}>25 Oct ›</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
                <span ref={reg("wgt-val")} style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>72.0</span>
                <span style={{ color: "#555", fontSize: 10 }}>kg</span>
                <span style={{ fontSize: 13, marginLeft: 2 }}>📉</span>
              </div>
              <GradientBar thumbRef={reg("wgt-thumb")} initialLeft="50%" />
              <div style={{ fontSize: 10, color: "#555", marginTop: 5 }}>BMI <span ref={reg("bmi-val")} style={{ color: "#26C6DA", fontWeight: 700 }}>24.50</span></div>
            </div>
          </div>

          {/* WHR */}
          <div ref={cardRef("whr")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#141414", border: "1px solid #222", padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 20, height: 20, background: "#0D1E2B", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" stroke="#4FC3F7" strokeWidth="2"/><path d="M6 21v-2a4 4 0 014-4h4" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ color: "#4FC3F7", fontSize: 11, fontWeight: 700 }}>WHR</span>
                </div>
                <span style={{ color: "#444", fontSize: 9 }}>25 Oct ›</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
                <span ref={reg("whr-val")} style={{ color: "#4FC3F7", fontSize: 20, fontWeight: 700 }}>0.72</span>
                <span style={{ color: "#555", fontSize: 10 }}>Ratio</span>
              </div>
              <GradientBar thumbRef={reg("whr-thumb")} initialLeft="72%" />
              <div style={{ fontSize: 10, color: "#555", marginTop: 5 }}>Progress 📉 <span style={{ color: "#26C6DA", fontWeight: 700 }}>Good</span></div>
            </div>
          </div>

          {/* Sleep */}
          <div ref={cardRef("sleep")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#141414", border: "1px solid #222", padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 14 }}>🌙</span>
                  <span style={{ color: "#7B8CDE", fontSize: 11, fontWeight: 700 }}>Sleep</span>
                </div>
                <span style={{ color: "#444", fontSize: 9 }}>25 Oct ›</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 2 }}>
                <span ref={reg("slp-h")} style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>6</span>
                <span style={{ color: "#555", fontSize: 9 }}>hr</span>
                <span ref={reg("slp-m")} style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>30</span>
                <span style={{ color: "#555", fontSize: 9 }}>min</span>
              </div>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 5 }}><span ref={reg("slp-pct")}>75</span>% Goal</div>
              <div style={{ height: 3, background: "#1A1A1A", borderRadius: 2, overflow: "hidden" }}>
                <div ref={reg("slp-bar")} style={{ height: "100%", width: "75%", background: "linear-gradient(90deg,#4FC3F7,#7B8CDE)", borderRadius: 2 }}/>
              </div>
              <div style={{ marginTop: 5, fontSize: 8, color: "#444" }}>Deep : 4h 2m · Light : 2h 50m</div>
            </div>
          </div>

          {/* Water */}
          <div ref={cardRef("water")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#141414", border: "1px solid #222", padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 14 }}>💧</span>
                  <span style={{ color: "#29B6F6", fontSize: 11, fontWeight: 700 }}>Water</span>
                </div>
                <span style={{ color: "#444", fontSize: 9 }}>25 Oct ›</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 2 }}>
                <span ref={reg("h2o-val")} style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>2,000</span>
                <span style={{ color: "#555", fontSize: 9 }}>ml</span>
              </div>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 5 }}><span ref={reg("h2o-pct")}>40</span>% Goal</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, display: "flex", gap: 5 }}>
                  <button style={btnStyle}>−</button>
                  <button style={{ ...btnStyle, color: "#29B6F6" }}>+</button>
                </div>
                <div style={{ width: 22, height: 44, background: "#fff", borderRadius: 11, position: "relative", overflow: "hidden", border: "2px solid #ccc", flexShrink: 0 }}>
                  <div ref={reg("h2o-bottle")} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg,#7B8CDE,#29B6F6)" }}/>
                  <div ref={reg("h2o-lbl")} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, fontWeight: 700, color: "#333" }}>40%</div>
                </div>
              </div>
            </div>
          </div>

        

          {/* Quick Actions */}
          <div ref={cardRef("quick")} style={cardStyle()}>
            <div style={{ width: "100%", height: "100%", background: "#0F0F0F", border: "1px solid #1A1A1A", padding: 10 }}>
              {[
                [{ icon: "💼", label: "Packages" }, { icon: "🏋️", label: "Coaches" }, { icon: "📋", label: "My Plan" }, { icon: "🎯", label: "My Goals" }],
                [{ icon: "🎯", label: "Packages" }, { icon: "🖼️", label: "Coaches" }, { icon: "👤", label: "Profile" }, { icon: "•••", label: "Others" }],
              ].map((row, ri) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: ri === 0 ? 8 : 0 }}>
                  {row.map(({ icon, label }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ width: 38, height: 38, background: "#1A1A1A", borderRadius: "50%", margin: "0 auto 3px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: "1px solid #242424", color: label === "Others" ? "#555" : "inherit" }}>{icon}</div>
                      <div style={{ fontSize: 7, color: "#666" }}>{label}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        {hint && (
          <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "#555", fontSize: 13, letterSpacing: ".03em", pointerEvents: "none" }}>
            Scroll down to assemble ↓
          </div>
        )}
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function GradientBar({ thumbRef, initialLeft }) {
  return (
    <div style={{ height: 5, background: "#1A1A1A", borderRadius: 3, overflow: "visible", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#26C6DA,#F9A825,#F44336)", borderRadius: 3 }}/>
      <div ref={thumbRef} style={{ position: "absolute", top: "50%", left: initialLeft, width: 10, height: 10, background: "#fff", borderRadius: "50%", border: "2px solid #333", transform: "translate(-50%,-50%)" }}/>
    </div>
  );
}

function cardStyle() {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    overflow: "hidden",
    willChange: "transform, width, height",
    borderRadius: 18,
    opacity: 0.4,
  };
}

const btnStyle = {
  flex: 1,
  height: 22,
  background: "#1A1A1A",
  border: "1px solid #2A2A2A",
  borderRadius: 5,
  color: "#666",
  fontSize: 14,
  cursor: "pointer",
};