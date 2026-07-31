import React, { useEffect, useRef, useState } from 'react'

// Fires once when the element is (almost) fully inside the viewport,
// then stops observing. Ignores the observer's very first callback,
// which just reports whatever the state already is at page load — so
// this only fires from a genuine scroll-driven entrance, never on load.
function useInFullView(ref, threshold = 0.98) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let skippedInitial = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!skippedInitial) {
          skippedInitial = true
          return
        }
        if (entry.intersectionRatio >= threshold) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, threshold, 1] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

function useCountUp(target, duration = 900, delay = 0, enabled = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let raf
    let start
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const t = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(target * eased))
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay, enabled])
  return value
}

const MEALS = [
  { emoji: "🌅", meal: "Breakfast", desc: "Oats + banana + seeds", cal: 380, color: "#F97316" },
  { emoji: "☀️", meal: "Lunch", desc: "Grilled tofu + quinoa bowl", cal: 520, color: "#3B82F6" },
  { emoji: "🌙", meal: "Dinner", desc: "Lentil soup + whole roti", cal: 460, color: "#8B5CF6" },
  { emoji: "🍎", meal: "Snack", desc: "Greek yogurt + nuts", cal: 210, color: "#22C55E" },
]

const TOTAL = MEALS.reduce((sum, m) => sum + m.cal, 0)

export default function Nutrition2() {
  const containerRef = useRef(null)
  const inView = useInFullView(containerRef)

  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!inView) return
    setLoading(true)
    const t = setTimeout(() => {
      setLoading(false)
      setRevealed(true)
    }, 650)
    return () => clearTimeout(t)
  }, [inView])

  // Total counts up only after the meal rows have finished revealing,
  // so it reads as a sum arriving once the parts are all in.
  const [totalActive, setTotalActive] = useState(false)
  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => setTotalActive(true), MEALS.length * 0.1 * 1000 + 250)
    return () => clearTimeout(t)
  }, [revealed])

  const total = useCountUp(TOTAL, 850, 0, totalActive)

  return (
    <div ref={containerRef} className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes nutCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nutRowIn {
          0% { opacity: 0; transform: translateX(14px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes nutEmojiPop {
          0% { transform: scale(0) rotate(-15deg); }
          60% { transform: scale(1.25) rotate(6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes nutBarFill {
          0% { width: 0%; }
        }
        @keyframes nutShimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes nutFooterIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes nutFooterFlash {
          0% { background: rgba(46,125,50,0.28); }
          100% { background: rgba(46,125,50,0.1); }
        }
        .nut-skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
          background-size: 400px 100%;
          animation: nutShimmer 1.3s ease-in-out infinite;
          border-radius: 8px;
        }
        @media (prefers-reduced-motion: reduce) {
          .nut-card, .nut-row, .nut-emoji, .nut-bar-fill, .nut-footer {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="nut-card rounded-3xl p-7 shadow-2xl"
        style={{
          width: 310,
          background: "rgba(28,28,30,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          opacity: inView ? 1 : 0,
          animation: inView ? "nutCardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        }}
      >
        <p className="text-base font-semibold text-white mb-1">Custom Meal Plan</p>
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Week 3 · Recovery Phase</p>

        <div className="space-y-3">
          {loading &&
            MEALS.map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="nut-skel flex-shrink-0" style={{ width: 22, height: 22, borderRadius: 8, animationDelay: `${i * 0.08}s` }} />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="nut-skel" style={{ width: "55%", height: 10, animationDelay: `${i * 0.08}s` }} />
                  <div className="nut-skel" style={{ width: "85%", height: 8, animationDelay: `${i * 0.08}s` }} />
                </div>
                <div className="nut-skel" style={{ width: 34, height: 10, marginTop: 2, animationDelay: `${i * 0.08}s` }} />
              </div>
            ))}

          {revealed &&
            MEALS.map((m, i) => (
              <div
                key={m.meal}
                className="nut-row flex items-start gap-3 rounded-xl px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  opacity: 0,
                  animation: `nutRowIn 0.45s ease ${i * 0.1}s forwards`,
                }}
              >
                <span
                  className="nut-emoji text-xl mt-0.5 inline-block"
                  style={{ animation: `nutEmojiPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1 + 0.2}s backwards` }}
                >
                  {m.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-white">{m.meal}</p>
                    <p className="text-xs font-semibold flex-shrink-0" style={{ color: m.color }}>{m.cal} kcal</p>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{m.desc}</p>
                  <div className="rounded-full mt-1.5 overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="nut-bar-fill h-full rounded-full"
                      style={{
                        background: m.color,
                        width: `${Math.round((m.cal / TOTAL) * 100)}%`,
                        animation: `nutBarFill 0.7s ease ${i * 0.1 + 0.3}s backwards`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div
          className="nut-footer flex justify-between items-center mt-4 rounded-xl p-3"
          style={{
            opacity: 0,
            animation: revealed
              ? `nutFooterIn 0.5s ease ${MEALS.length * 0.1 + 0.15}s forwards, nutFooterFlash 0.6s ease ${MEALS.length * 0.1 + 0.15 + 0.55}s backwards`
              : "none",
            background: "rgba(46,125,50,0.1)",
          }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Total daily</p>
          <p className="text-base font-extrabold tabular-nums" style={{ color: "#2E7D32" }}>{total} kcal</p>
        </div>
      </div>
    </div>
  )
}