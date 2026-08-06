import { useEffect, useRef, useState } from "react";
import hero from "../../assets/home/hero.jpg";
import RunningSVG from "../Helper/StorySection/RunningSVG";
import Heart from "../Helper/Heart"
const BG_IMAGE = hero;
const SMOOTHING = 7;

const PILLS_GAP = 28;

const pills = [
  {
    label: "Proactive and adaptive coaching",
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    icon: (
      <RunningSVG color="#1c8c77" />
    ),
  },
  {
    label: "Holistic health",
    bg: "bg-violet-50",
    text: "text-violet-900",
    icon: (
     <svg
  viewBox="0 0 24 24"
  fill="none"
  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-600 animate-heartbeat"
>
  <path
    d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinejoin="round"
  />
</svg>
    ),
  },
  {
    label: "Personalized answers",
    bg: "bg-sky-50",
    text: "text-sky-900",
    icon: (
  <svg
  viewBox="0 0 24 24"
  fill="none"
  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 overflow-visible"
>
  <path
    d="M5 3v4M3 5h4"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    className="animate-twinkle-a origin-[5px_5px]"
  />
  <path
    d="M19 13v4M17 15h4"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    className="animate-twinkle-b origin-[19px_15px]"
  />
  <path
    d="M11 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    className="animate-twinkle-main origin-[11px_11px]"
  />
</svg>
    ),
  },
];

export default function HomeHeroSection() {
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(800);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollLengthVh, setScrollLengthVh] = useState(300);

  const targetRef = useRef(0);
  const renderedRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Live-measured height of the Phase B headline, so the pills/CTA block
  // that follows it sits at a tight, correct offset on every screen size
  // (mobile's smaller type means a shorter block, so it stays compact
  // automatically instead of relying on a desktop-tuned magic number).
  const phaseBHeightRef = useRef(220);
  const phaseBObserverRef = useRef(null);
  const phaseBMeasureRef = (node) => {
    if (phaseBObserverRef.current) {
      phaseBObserverRef.current.disconnect();
      phaseBObserverRef.current = null;
    }
    if (node) {
      const ro = new ResizeObserver((entries) => {
        const h = entries[0]?.contentRect?.height;
        if (h > 0) phaseBHeightRef.current = h;
      });
      ro.observe(node);
      phaseBObserverRef.current = ro;
    }
  };

  useEffect(() => {
    const applyViewportState = () => {
      setVh(window.innerHeight);
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      // Shorter scroll runway on mobile — the sequence needs less
      // distance to feel deliberate on a smaller, narrower screen.
      setScrollLengthVh(mobile ? 220 : 300);
    };

    applyViewportState();
    // Small delay so the entrance animations play right after first paint
    // rather than racing the browser's initial layout/paint.
    const mountTimer = requestAnimationFrame(() => setMounted(true));

    const updateTarget = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      targetRef.current = scrolled / total;
    };

    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30);
      lastTimeRef.current = time;
      const t = 1 - Math.exp(-SMOOTHING * dt);
      renderedRef.current += (targetRef.current - renderedRef.current) * t;
      if (Math.abs(targetRef.current - renderedRef.current) < 0.0005) {
        renderedRef.current = targetRef.current;
      }
      setProgress(renderedRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      applyViewportState();
      updateTarget();
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", onResize);
    updateTarget();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(mountTimer);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (phaseBObserverRef.current) phaseBObserverRef.current.disconnect();
    };
  }, []);

  // ─── Background parallax ───────────────────────────────────────────────────
  const bgTranslateY = progress * -80;

  // ─── Phase A: opening headline ─────────────────────────────────────────────
  // Sits at bottom third, fades + drifts up and out between 0.10 → 0.28
  const phaseAOpacity    = 1 - easedRemap(progress, 0.10, 0.28, 0, 1);
  const phaseATranslateY = easedRemap(progress, 0.10, 0.28, 0, -80);

  // ─── Scroll cue ────────────────────────────────────────────────────────────
  const scrollCueOpacity = 1 - easedRemap(progress, 0, 0.08, 0, 1);

  // ─── Phase B: large text — enters from below, scrolls through naturally ────
  // Starts at +vh (below screen), travels to -vh (above screen) linearly
  // Entry window: 0.20 → 0.55  (text scrolls from off-bottom to top-of-screen)
  // The text moves from +100vh to -60vh over the full scroll range
  const phaseBTranslateY = easedRemap(progress, 0.20, 1.0, vh, -vh * 0.6);
  // Clip visibility: only show when on screen (between +vh and -content-height)
  const phaseBVisible = progress > 0.18;

  // ─── Pills + CTA — anchored just below Phase B, scroll together ────────────
  // Offset by the live-measured Phase B height + a small fixed gap, so this
  // tracks correctly whether the headline above it is one line or two.
  const pillsOffset = phaseBHeightRef.current + PILLS_GAP;
  const pillsTranslateY = easedRemap(progress, 0.20, 1.0, vh + pillsOffset, -vh * 0.6 + pillsOffset);
  const pillsVisible = progress > 0.18;

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${scrollLengthVh}vh` }}
      className="relative"
    >
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroKenBurns {
          0%, 100% { transform: scale(1.06); }
          50%      { transform: scale(1.14); }
        }
        @keyframes heroScrollCue {
          0%, 100% { opacity: 0.45; transform: translateY(0); }
          50%      { opacity: 1; transform: translateY(5px); }
        }
        .hero-fade-up {
          opacity: 0;
          animation: heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .hero-kenburns {
          animation: heroKenBurns 16s ease-in-out infinite;
        }
        .hero-scroll-chevron {
          animation: heroScrollCue 1.6s ease-in-out infinite;
        }
        .hero-pill,
        .hero-cta {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-pill:hover,
        .hero-cta:hover {
          transform: translateY(-2px) scale(1.03);
        }
        .hero-pill:active,
        .hero-cta:active {
          transform: scale(0.97);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up { opacity: 1; animation: none; transform: none; }
          .hero-kenburns { animation: none; }
          .hero-scroll-chevron { animation: none; }
        }
      `}</style>

      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Background ── */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute will-change-transform"
            style={{
              top: "-20%",
              bottom: "-20%",
              left: 0,
              right: 0,
              transform: `translate3d(0px, ${bgTranslateY}px, 0px)`,
            }}
          >
            <img
              src={BG_IMAGE}
              alt=""
              className="hero-kenburns absolute inset-0 w-full h-full object-cover object-top-right"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 h-full w-full px-5 sm:px-12 lg:px-16">
          <div className="relative h-full w-full max-w-5xl">

            {/* Phase A: opening headline — fixed near bottom, exits up on scroll,
                fades/rises up once on page load */}
            <div
              className="absolute left-0 will-change-[opacity,transform]"
              style={{
                bottom: "18%",
                opacity: mounted ? phaseAOpacity : 0,
                transform: `translateY(${mounted ? phaseATranslateY : 24}px)`,
                pointerEvents: phaseAOpacity > 0.05 ? "auto" : "none",
              }}
            >
              <h1 className="hero-fade-up 2xl:max-w-5xl max-w-2xl text-3xl font-medium leading-tight text-white sm:text-6xl 2xl:text-[5.25rem]">
                Join the #1 Fitness &amp; Wellness
                Community for Moms
              </h1>
            </div>

            {/* Phase B: second headline — scrolls up through screen naturally,
                pops in with a fade-up each time it re-enters view */}
            {phaseBVisible && (
              <div
                className="absolute left-0 will-change-transform"
                style={{
                  top: 0,
                  transform: `translateY(${phaseBTranslateY}px)`,
                  pointerEvents: "auto",
                }}
              >
                <p
                  ref={phaseBMeasureRef}
                  className="hero-fade-up max-w-2xl 2xl:max-w-5xl text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-[5.25rem]"
                >
                  Personalised Strength, Wellness,
                  and Support, by Mom and for Mom
                </p>
              </div>
            )}

            {/* Pills + CTA — scrolls up right below Phase B, each pill/button
                pops in with a short stagger */}
            {pillsVisible && (
              <div
                className="absolute left-0 "
                style={{
                  top: 0,
                  transform: `translateY(${pillsTranslateY}px)`,
                  pointerEvents: "auto",
                }}
              >
                {/* Pills */}
                <div className="flex flex-col items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {pills.map((pill, i) => (
                    <span
                      key={pill.label}
className={`hero-fade-up hero-pill inline-flex items-center gap-1.5 sm:gap-2 rounded-full ${pill.bg} ${
  pill.label === "Proactive and adaptive coaching"
    ? "px-3 py-1 sm:px-4 sm:py-3"
    : "px-4 py-2.5 sm:px-6 sm:py-4"
} text-xs sm:text-lg font-medium ${pill.text} shadow-sm`}                      style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                    >
                      {pill.icon}
                      {pill.label}
                    </span>
                  ))}
                </div>

                {/* Download CTA */}
                <p
                  className="hero-fade-up mb-2 sm:mb-3 text-xs sm:text-lg font-medium text-white/80"
                  style={{ animationDelay: "0.3s" }}
                >
                  Download the app
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <a
                    href="#"
                    className="hero-fade-up hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                    style={{ animationDelay: "0.38s" }}
                  >
                    <PlayStoreIcon />
                    Google Play
                  </a>
                  <a
                    href="#"
                    className="hero-fade-up hero-cta inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100"
                    style={{ animationDelay: "0.46s" }}
                  >
                    <AppleIcon />
                    App Store
                  </a>
                </div>
              </div>

            )}

          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-6 left-5 z-10 flex flex-col items-start gap-1.5 text-xs font-medium uppercase tracking-widest text-white sm:bottom-8 sm:left-12 lg:left-16"
          style={{ opacity: scrollCueOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
    <svg
            className="hero-scroll-chevron h-3 w-3 text-white/80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>          </div>
        
        </div>

      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function remap(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeSmoothstep(t) {
  return t * t * (3 - 2 * t);
}

function easedRemap(value, inMin, inMax, outMin, outMax) {
  const t = clamp(remap(value, inMin, inMax, 0, 1), 0, 1);
  return outMin + easeSmoothstep(t) * (outMax - outMin);
}

function PlayStoreIcon() {
  return (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 2.5v19l10.8-9.5L3 2.5zm12.2 10L18.5 15l2.8-1.6c1-.6 1-1.8 0-2.4L18.5 9l-3.3 3.5zm-1.2.7L4.8 21l11.5-6.6-2.3-1.2zm2.3-3.6L4.8 3l9.2 7.8 2.3-1.2z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.37 12.64c.02 2.42 2.11 3.23 2.13 3.24-.02.06-.33 1.16-1.08 2.3-.65.98-1.33 1.95-2.4 1.97-1.05.02-1.39-.62-2.59-.62-1.2 0-1.58.6-2.56.64-1 .04-1.77-1-2.43-1.98-1.36-2-2.4-5.65-1-8.1.69-1.2 1.93-1.96 3.28-1.98 1.03-.02 2 .7 2.62.7.62 0 1.79-.87 3.01-.74.51.02 1.94.21 2.86 1.56-.08.05-1.7 1-1.68 3.01zM14.9 4.06c.55-.67.92-1.6.82-2.56-.8.03-1.77.54-2.34 1.2-.52.6-.98 1.56-.86 2.47.9.07 1.82-.46 2.38-1.11z" />
    </svg>
  );
}