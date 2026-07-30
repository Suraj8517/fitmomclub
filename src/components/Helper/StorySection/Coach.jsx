import React, { useEffect, useState } from 'react'

function useCountUp(target, duration = 900, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    let start
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(eased)
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])
  return value
}

function useIntCountUp(target, duration = 900, delay = 0) {
  const p = useCountUp(target, duration, delay)
  return Math.round(target * p)
}

export default function Coach() {
  const [mounted, setMounted] = useState(false)
  const [barsIn, setBarsIn] = useState(false)
  const [hovered, setHovered] = useState(null)

  const days = [
    ["M", 40, true],
    ["T", 75, true],
    ["W", 55, true],
    ["T", 90, true],
    ["F", 60, true],
    ["S", 0, false],
    ["S", 0, false],
  ]
  const doneCount = days.filter((d) => d[2]).length
  const activeIdx = 3

  const daysProgress = useIntCountUp(doneCount, 700, 300)
  const kcal = useIntCountUp(400, 900, 850)
  const session = useIntCountUp(32, 900, 950)
  const streak = useIntCountUp(5, 700, 1050)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setBarsIn(true), 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes coachCardIn {
          0% { opacity: 0; transform: translateY(24px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes coachActiveGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0); }
          50% { box-shadow: 0 0 14px 1px rgba(20,184,166,0.45); }
        }
        @keyframes coachDashPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes coachStatIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes coachStreakFlicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.12) rotate(-4deg); }
        }
        @keyframes coachBadgePop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .coach-bar-fill {
          transition: height 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s ease, transform 0.2s ease;
        }
        .coach-bar-track {
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .coach-bar-track:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div
        className="rounded-3xl p-7 shadow-2xl"
        style={{
          width: 300,
          background: "rgba(28,28,30,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          opacity: mounted ? 1 : 0,
          animation: mounted ? "coachCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold text-white">Weekly Activity</p>
          <p
            className="text-sm tabular-nums"
            style={{
              color: "#14B8A6",
              display: "inline-block",
              animation: mounted ? "coachBadgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards" : "none",
            }}
          >
            {daysProgress}/7 days
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {days.map(([d, h, done], i) => {
            const isActive = i === activeIdx
            const isHovered = hovered === i
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="coach-bar-track w-full rounded-lg relative overflow-hidden"
                  style={{
                    height: 64,
                    background: "rgba(255,255,255,0.08)",
                    border: done ? "none" : "1.5px dashed rgba(255,255,255,0.15)",
                    animation: !done && barsIn ? "coachDashPulse 2.2s ease-in-out infinite" : "none",
                    animationDelay: `${i * 100}ms`,
                    cursor: h > 0 ? "pointer" : "default",
                  }}
                  onMouseEnter={() => h > 0 && setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {h > 0 && (
                    <div
                      className="coach-bar-fill absolute bottom-0 left-0 right-0 rounded-lg"
                      style={{
                        height: barsIn ? `${h}%` : "0%",
                        background: isActive ? "#14B8A6" : "rgba(20,184,166,0.5)",
                        transitionDelay: `${i * 90}ms`,
                        filter: isHovered ? "brightness(1.25)" : "brightness(1)",
                        transform: isHovered ? "scaleY(1.02)" : "scaleY(1)",
                        transformOrigin: "bottom",
                        animation: isActive && barsIn ? "coachActiveGlow 2.4s ease-in-out 1.2s infinite" : "none",
                      }}
                    />
                  )}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{d}</p>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mt-4">
          {[
            [kcal, "kcal avg", 0],
            [`${session}m`, "avg session", 1],
            [streak, "streak days", 2],
          ].map(([v, l, idx]) => (
            <div
              key={l}
              className="flex-1 rounded-xl p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                opacity: mounted ? 1 : 0,
                animation: mounted ? `coachStatIn 0.5s ease ${0.75 + idx * 0.1}s backwards` : "none",
              }}
            >
              <p className="text-base font-bold text-white tabular-nums flex items-center justify-center gap-1">
                {l === "streak days" && (
                  <span
                    style={{
                      display: "inline-block",
                      animation: "coachStreakFlicker 1.6s ease-in-out infinite",
                      transformOrigin: "center bottom",
                    }}
                  >
                    🔥
                  </span>
                )}
                {v}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}