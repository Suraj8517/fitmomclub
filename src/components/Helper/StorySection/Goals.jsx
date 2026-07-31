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

const GOALS = [
  { done: true, text: "Morning walk 30 min", pct: 100 },
  { done: true, text: "2000 kcal intake", pct: 82 },
  { done: true, text: "Drink 5L water", pct: 100 },
  { done: false, text: "Evening yoga session", pct: 0 },
]

const SCORE = 75
const RING_R = 20
const RING_C = 2 * Math.PI * RING_R

export default function Goals() {
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

  const score = useCountUp(SCORE, 1000, 550, revealed)

  // The ring only starts drawing once the number has finished counting
  // up, so the two read as one thing after another instead of both
  // happening at once.
  const [ringActive, setRingActive] = useState(false)
  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => setRingActive(true), 550 + 1000 + 150)
    return () => clearTimeout(t)
  }, [revealed])

  const ringOffset = RING_C * (1 - (ringActive ? SCORE / 100 : 0))

  return (
    <div ref={containerRef} className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes goalsCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes goalsRowIn {
          0% { opacity: 0; transform: translateX(14px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes goalsCheckPop {
          0% { transform: scale(0); }
          55% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes goalsBarFill {
          0% { width: 0%; }
        }
        @keyframes goalsShimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes goalsFooterIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes goalsBadgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.35); }
          50% { box-shadow: 0 0 0 5px rgba(20,184,166,0); }
        }
        .goals-skel {
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
          background-size: 400px 100%;
          animation: goalsShimmer 1.3s ease-in-out infinite;
          border-radius: 8px;
        }
        @media (prefers-reduced-motion: reduce) {
          .goals-card, .goals-row, .goals-check, .goals-bar-fill, .goals-footer {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="goals-card rounded-3xl p-7 shadow-2xl"
        style={{
          width: 300,
          background: "rgba(28,28,30,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          opacity: inView ? 1 : 0,
          animation: inView ? "goalsCardIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-base font-semibold text-white">My Goals</p>
          <div
            className="rounded-full px-3 py-1.5 text-xs"
            style={{
              background: "rgba(20,184,166,0.15)",
              border: "1px solid rgba(20,184,166,0.3)",
              color: "#14B8A6",
              animation: revealed ? "goalsBadgePulse 2.4s ease-in-out 1.2s infinite" : "none",
            }}
          >
            Oct 25
          </div>
        </div>

        {loading &&
          GOALS.map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="goals-skel flex-shrink-0" style={{ width: 22, height: 22, borderRadius: 9999, animationDelay: `${i * 0.08}s` }} />
              <div className="goals-skel" style={{ flex: 1, height: 12, animationDelay: `${i * 0.08}s` }} />
              <div className="goals-skel" style={{ width: 30, height: 12, animationDelay: `${i * 0.08}s` }} />
            </div>
          ))}

        {revealed &&
          GOALS.map((g, i) => (
            <div
              key={g.text}
              className="goals-row flex items-center gap-3 py-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                opacity: 0,
                animation: `goalsRowIn 0.45s ease ${i * 0.09}s forwards`,
              }}
            >
              <div
                className="goals-check rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  background: g.done ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.08)",
                  border: g.done ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  color: g.done ? "#14B8A6" : "transparent",
                  animation: g.done ? `goalsCheckPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.09 + 0.25}s backwards` : "none",
                }}
              >
                {g.done ? "✓" : ""}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "rgba(255,255,255,0.7)" }}>{g.text}</p>
                <div className="rounded-full mt-1.5 overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="goals-bar-fill h-full rounded-full"
                    style={{
                      background: g.done ? "#14B8A6" : "rgba(255,255,255,0.25)",
                      width: `${g.pct}%`,
                      animation: `goalsBarFill 0.7s ease ${i * 0.09 + 0.15}s backwards`,
                    }}
                  />
                </div>
              </div>

              <p className="text-sm font-bold flex-shrink-0" style={{ color: g.done ? "#14B8A6" : "rgba(255,255,255,0.3)" }}>{g.pct}%</p>
            </div>
          ))}

        <div
          className="goals-footer flex justify-between items-center mt-4 rounded-xl p-3"
          style={{
            background: "rgba(20,184,166,0.08)",
            opacity: 0,
            animation: revealed ? `goalsFooterIn 0.5s ease ${GOALS.length * 0.09 + 0.2}s forwards` : "none",
          }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Today's score</p>
          <div className="flex items-center gap-2.5">
            <svg
              width="46"
              height="46"
              viewBox="0 0 46 46"
              style={{
                transform: `rotate(-90deg) scale(${ringActive ? 1 : 0.7})`,
                opacity: ringActive ? 1 : 0,
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <circle cx="23" cy="23" r={RING_R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="23"
                cy="23"
                r={RING_R}
                fill="none"
                stroke="#14B8A6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={ringOffset}
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <p className="text-2xl font-extrabold tabular-nums" style={{ color: "#14B8A6" }}>{score}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}