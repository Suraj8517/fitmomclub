import React, { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 900, delay = 0, decimals = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    let start
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const progress = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Number((target * eased).toFixed(decimals)))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay, decimals])
  return value
}

export default function RunningMap() {
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const [progress, setProgress] = useState(0)
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 })
  const [routeDone, setRouteDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  const cardioLoad = useCountUp(15, 900, 1400)
  const distance = useCountUp(1.5, 900, 1550, 1)

  useEffect(() => {
    setMounted(true)
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
      const p0 = pathRef.current.getPointAtLength(0)
      setDotPos({ x: p0.x, y: p0.y })
    }
  }, [])

  useEffect(() => {
    if (!pathLength) return
    let raf
    let start
    const delay = 650
    const duration = 2200
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const t = Math.min((ts - start) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        setProgress(eased)
        if (pathRef.current) {
          const pt = pathRef.current.getPointAtLength(eased * pathLength)
          setDotPos({ x: pt.x, y: pt.y })
        }
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          setRouteDone(true)
        }
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [pathLength])

  return (
    <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "42%", transform: "translateY(-50%)" }}>
      <style>{`
        @keyframes runnerBounce {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-3px) rotate(4deg); }
        }
        @keyframes runnerTrailFade {
          0% { opacity: 0.9; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.4) translateY(6px); }
        }
        @keyframes mapFadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes mapFlagIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes mapDotPulse {
          0% { transform: scale(0.6); opacity: 0.7; }
          70% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes mapBgPathBreathe {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.5; }
        }
        .map-stat {
          opacity: 0;
        }
        .map-stat.in {
          animation: mapFadeUp 0.5s ease forwards;
        }
      `}</style>

      <div style={{ width: 460, position: "relative" }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className={`map-stat${mounted ? " in" : ""}`}
            style={{ position: "relative", width: 26, height: 26, animationDelay: "0.1s" }}
          >
           
          </div>
          <div className={`map-stat${mounted ? " in" : ""}`} style={{ animationDelay: "0.18s" }}>
            <p className="text-lg font-semibold text-white leading-tight">Trail run</p>
            <p className="text-sm flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              14:40 PM &nbsp;&middot;&nbsp; 160 cal
            </p>
          </div>

          <div className={`map-stat${mounted ? " in" : ""}`} style={{ marginLeft: 32, animationDelay: "0.26s" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Cardio load</p>
            <p className="text-2xl font-semibold tabular-nums" style={{ color: "#2DD4BF" }}>{cardioLoad}</p>
          </div>

          <div className={`map-stat${mounted ? " in" : ""}`} style={{ marginLeft: 24, animationDelay: "0.34s" }}>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Distance</p>
            <p className="text-2xl font-semibold tabular-nums" style={{ color: "#2DD4BF" }}>{distance.toFixed(1)} km</p>
          </div>
        </div>

        <svg width="460" height="220" viewBox="0 0 460 220" style={{ display: "block", marginTop: 10 }}>
          <path
            d="M40,205 C90,150 70,90 130,95 C190,100 170,155 230,150 C290,145 260,100 320,95 C370,91 350,150 410,150"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.5"
            fill="none"
            style={{ animation: mounted ? "mapBgPathBreathe 3.4s ease-in-out infinite" : "none" }}
          />

          <path
            ref={pathRef}
            d="M40,205 C90,150 70,90 130,95 C190,100 170,155 230,150 C290,145 260,100 320,95 C370,91 350,150 410,150"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - progress)}
          />

          <g transform="translate(40,200)" style={{ animation: mounted ? "mapFlagIn 0.5s ease 0.5s backwards" : "none" }}>
            <circle r="13" fill="#2DD4BF" />
            <path d="M-3,-5 v10 M-3,-5 l7,2.5 l-7,2.5" stroke="#0b0b0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

         {routeDone && (
  <>
    <circle
      cx="410"
      cy="150"
      r="13"
      fill="none"
      stroke="#2DD4BF"
      strokeWidth="2"
      style={{
        animation: "mapDotPulse 1.8s ease-out infinite",
        transformOrigin: "410px 150px",
      }}
    />

    <circle
      cx="410"
      cy="150"
      r="6"
      fill="#2DD4BF"
      stroke="white"
      strokeWidth="2"
    />
  </>
)}
        </svg>
      </div>
    </div>
  )
}