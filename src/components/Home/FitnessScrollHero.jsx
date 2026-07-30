import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Dumbbell, Zap, Trophy, Flame, HeartPulse, Timer } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  helpers                                                             */
/* ------------------------------------------------------------------ */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(t) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/* ------------------------------------------------------------------ */
/*  useScrollProgress — tracks 0→1 progress as a tall section scrolls  */
/*  through the viewport, writing straight to refs (no setState), so   */
/*  scrolling never triggers a React re-render — only compositor-only  */
/*  transform/opacity/clip-path properties get touched per frame.      */
/* ------------------------------------------------------------------ */
function useScrollProgress(onProgress) {
  const ref = useRef(null);
  const rafId = useRef(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      let progress;
      if (scrollable <= 0) {
        progress = rect.top <= 0 ? 1 : 0;
      } else {
        progress = clamp((0 - rect.top) / scrollable, 0, 1);
      }
      onProgressRef.current(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  useIsMobile — one resize-driven boolean, NOT part of the scroll    */
/*  hot path. Cheap, infrequent, safe to drive a re-render. This is    */
/*  also the switch between the two experiences: below the breakpoint  */
/*  we mount a completely different, much shorter scroll story rather  */
/*  than a scaled-down version of the desktop one.                     */
/* ------------------------------------------------------------------ */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  Color system                                                        */
/* ------------------------------------------------------------------ */
const INK = '#0A2E27';
const EMBER_A = '#BFF4EB';
const EMBER_B = '#4DB8A5';
const EMBER_C = '#136F63';
const SECOND_SECTION_BG =
  'radial-gradient(circle at 50% 50%, #dbfce6 0%, #dbfce6 10%, #F6F5F1 62%)';

const FloatingIcon = forwardRef(function FloatingIcon(
  { icon: Icon, style, size = 96, blur = 0, duration = 6, rotate = -8 },
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute pointer-events-none select-none will-change-transform"
      style={{
        ...style,
        transform: 'translate3d(0,0,0) rotate(0deg)',
        backfaceVisibility: 'hidden',
        filter: blur ? `blur(${blur}px)` : 'none',
        zIndex: 5,
      }}
    >
      <div
        className="fsl-float"
        style={{
          '--dur': `${duration}s`,
          '--rot-start': `${rotate}deg`,
          '--rot-mid': `${rotate + 14}deg`,
          '--drift-x': `${8 + (size % 20)}px`,
          '--drift-y': `${-12 - (size % 15)}px`,
        }}
      >
        <div
          className="flex items-center justify-center shadow-2xl"
          style={{
            width: size,
            height: size,
            borderRadius: '38%',
            transform: `rotate(${rotate}deg)`,
            background: `linear-gradient(135deg, ${EMBER_A} 0%, ${EMBER_B} 48%, ${EMBER_C} 100%)`,
            boxShadow: '0 20px 40px -10px rgba(255,106,61,0.5)',
          }}
        >
          <Icon
            className="text-white/95 drop-shadow-md"
            style={{ width: size * 0.46, height: size * 0.46 }}
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  );
});

/* Desktop layout — full cast, spread wide. */
const ICONS_DESKTOP = [
  { Icon: Flame, size: 130, blur: 3, duration: 7, top: '36%', left: '1%', rotate: -14, depth: 1.55, spin: 90 },
  { Icon: Zap, size: 56, blur: 0, duration: 5, top: '46%', left: '28%', rotate: 8, depth: 1.3, spin: -160 },
  { Icon: Dumbbell, size: 96, blur: 1.5, duration: 6.5, top: '30%', left: '71%', rotate: -10, depth: 0.9, spin: 130 },
  { Icon: Trophy, size: 150, blur: 4, duration: 8, top: '20%', left: '92%', rotate: 12, depth: 0.45, spin: -70 },
  { Icon: HeartPulse, size: 160, blur: 4, duration: 7.5, top: '68%', left: '13%', rotate: -18, depth: 0.8, spin: 110 },
  { Icon: Timer, size: 130, blur: 3, duration: 6, top: '65%', left: '84%', rotate: 16, depth: 0.65, spin: -140 },
];

/* Mobile layout — a leaner cast (4, not 6) since a shorter scroll
   window means less time for the eye to take in a crowded stage. */
const ICONS_MOBILE = [
  { Icon: Flame, size: 62, blur: 2, duration: 7, top: '24%', left: '6%', rotate: -14, depth: 0.6, spin: 70 },
  { Icon: Dumbbell, size: 50, blur: 1, duration: 6.5, top: '30%', left: '70%', rotate: -10, depth: 0.55, spin: 100 },
  { Icon: Trophy, size: 72, blur: 2, duration: 8, top: '18%', left: '78%', rotate: 12, depth: 0.3, spin: -60 },
  { Icon: HeartPulse, size: 78, blur: 2, duration: 7.5, top: '68%', left: '10%', rotate: -18, depth: 0.28, spin: 90 },
];

const LINES = ['Your Fitness', 'Journey,', 'Anywhere', 'Anytime'];

const TOKENS = [
  { t: 'Personalised' }, { t: 'workouts,' },
  { img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=faces', alt: 'progress tracking' }, { t: 'progress,' }, { t: 'tracking,' },
  { img: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=200&h=200&fit=crop', alt: 'Mom and baby' },
  { t: 'and' }, { t: 'expert' }, { t: 'support' }, { t: 'all' }, { t: 'in' }, { t: 'one' }, { t: 'app' }
];

const TOTAL_WORDS = TOKENS.filter((tok) => tok.t).length;
const TOTAL_IMAGES = TOKENS.filter((tok) => tok.img).length;

const IMAGE_MAX_WIDTH_EM = 2.6;
const IMAGE_MAX_MARGIN_EM = 0.05;

function RevealParagraph({ wordRefs, imageWrapRefs, imageRefs, isMobile }) {
  let wordIdx = -1;
  let imgIdx = -1;

  return (
    <p
      className="max-w-4xl text-center leading-tight px-2"
      style={{
        fontSize: isMobile ? 'clamp(1.35rem, 8.4vw, 3.9rem)' : 'clamp(1.75rem, 3.4vw, 2.75rem)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
      }}
    >
      {TOKENS.map((tok, i) => {
        if (tok.img) {
          imgIdx += 1;
          const capturedIdx = imgIdx;
          return (
            <span
              key={i}
              ref={(el) => (imageWrapRefs.current[capturedIdx] = el)}
              className="fsl-reveal-img-wrap inline-block h-[1.2em] -translate-y-1 align-middle overflow-hidden"
              style={{ width: '0px', marginLeft: '0px', marginRight: '0px' }}
            >
              <img
                ref={(el) => (imageRefs.current[capturedIdx] = el)}
                src={tok.img}
                alt={tok.alt}
                className="fsl-reveal-img h-[1.2em] w-[2.6em] rounded-2xl object-cover"
                style={{
                  opacity: 0,
                  transform: 'scale(0.8)',
                  clipPath: 'inset(0 100% 0 0)',
                }}
              />
            </span>
          );
        }

        wordIdx += 1;
        const capturedIdx = wordIdx;
        return (
          <span
            key={i}
            ref={(el) => (wordRefs.current[capturedIdx] = el)}
            className="fsl-reveal-word"
            style={{
              opacity: 0,
              filter: 'blur(6px)',
              transform: 'translateY(0.35em)',
              color: INK,
              marginRight: '0.32em',
            }}
          >
            {tok.t}
          </span>
        );
      })}
    </p>
  );
}

/* ==================================================================== */
/*  DESKTOP EXPERIENCE — unchanged. One continuous 600vh sticky story:  */
/*    0.00 → 0.30   headline flips/grows toward viewer                  */
/*    0.28 → 0.38   headline + icons crossfade into the paragraph       */
/*    0.36 → 0.86   words reveal one at a time, paced by scroll         */
/*    0.88 → 0.98   inline photos reveal sequentially                   */
/* ==================================================================== */
const D_TEXT_ZOOM_END = 0.30;
const D_FADE_START = 0.28;
const D_FADE_END = 0.38;
const D_WORDS_START = 0.36;
const D_WORDS_END = 0.86;
const D_IMAGES_START = 0.88;
const D_IMAGES_END = 0.98;

function DesktopScrollStory() {
  const headlineGroupRef = useRef(null);
  const headlineLayerRef = useRef(null);
  const paragraphBackdropRef = useRef(null);
  const iconRefs = useRef([]);
  const wordRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const imageRefs = useRef([]);

  const icons = ICONS_DESKTOP;

  const handleProgress = (progress) => {
    const textT = clamp(progress / D_TEXT_ZOOM_END, 0, 1);
    const textEase = smoothstep(textT);
    const FLIP_MAX_DEG = 72;
    const flipDeg = textEase * FLIP_MAX_DEG;
    const textScale = 1 + textEase * 0.8;

    const zoomFadeOpacity = 1 - textEase * 1;
    const iconTravel = progress * 650;

    const fadeT = clamp((progress - D_FADE_START) / (D_FADE_END - D_FADE_START), 0, 1);
    const fadeEased = smoothstep(fadeT);

    const wordPhase = clamp((progress - D_WORDS_START) / (D_WORDS_END - D_WORDS_START), 0, 1);
    const wordRevealCount = Math.round(wordPhase * TOTAL_WORDS);
    const wordsComplete = wordRevealCount >= TOTAL_WORDS;

    const contentOpacity = clamp(zoomFadeOpacity * (1 - fadeEased), 0, 1);

    if (headlineGroupRef.current) {
      headlineGroupRef.current.style.transform = `scale(${textScale}) rotateX(${flipDeg}deg)`;
    }
    if (headlineLayerRef.current) {
      headlineLayerRef.current.style.opacity = contentOpacity;
    }
    if (paragraphBackdropRef.current) {
      paragraphBackdropRef.current.style.opacity = fadeEased;
    }

    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = icons[i];
      const y = iconTravel * cfg.depth * -1;
      const spin = progress * cfg.spin;
      el.style.transform = `translate3d(0, ${y}px, 0) rotate(${spin}deg)`;
    });

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const revealed = i < wordRevealCount;
      el.style.opacity = revealed ? '1' : '0';
      el.style.filter = revealed ? 'blur(0px)' : 'blur(6px)';
      el.style.transform = revealed ? 'translateY(0)' : 'translateY(0.35em)';
    });

    if (TOTAL_IMAGES > 0) {
      const perImageSpan = (D_IMAGES_END - D_IMAGES_START) / TOTAL_IMAGES;
      for (let i = 0; i < TOTAL_IMAGES; i += 1) {
        const winStart = D_IMAGES_START + i * perImageSpan;
        const winEnd = winStart + perImageSpan;
        const raw = wordsComplete ? clamp((progress - winStart) / (winEnd - winStart), 0, 1) : 0;
        const eased = smoothstep(raw);

        const wrapEl = imageWrapRefs.current[i];
        if (wrapEl) {
          wrapEl.style.width = `${eased * IMAGE_MAX_WIDTH_EM}em`;
          wrapEl.style.marginLeft = `${eased * IMAGE_MAX_MARGIN_EM}em`;
          wrapEl.style.marginRight = `${eased * IMAGE_MAX_MARGIN_EM}em`;
        }
        const imgEl = imageRefs.current[i];
        if (imgEl) {
          imgEl.style.opacity = eased;
          imgEl.style.transform = `scale(${0.8 + 0.2 * eased})`;
          imgEl.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
        }
      }
    }
  };

  const sectionRef = useScrollProgress(handleProgress);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '600vh' }}>
      <div className="fsl-sticky sticky top-0 w-full overflow-hidden">
        <div
          ref={paragraphBackdropRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6"
          style={{ background: SECOND_SECTION_BG, opacity: 0, willChange: 'opacity' }}
        >
          <RevealParagraph wordRefs={wordRefs} imageWrapRefs={imageWrapRefs} imageRefs={imageRefs} isMobile={false} />
        </div>

        <div ref={headlineLayerRef} className="absolute inset-0 z-20" style={{ opacity: 1, willChange: 'opacity' }}>
          {icons.map((cfg, i) => (
            <FloatingIcon
              key={i}
              ref={(el) => (iconRefs.current[i] = el)}
              icon={cfg.Icon}
              size={cfg.size}
              blur={cfg.blur}
              duration={cfg.duration}
              rotate={cfg.rotate}
              style={{ top: cfg.top, left: cfg.left }}
            />
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-3" style={{ perspective: '1400px' }}>
            <div
              ref={headlineGroupRef}
              className="origin-top will-change-transform"
              style={{
                transform: 'scale(1) rotateX(0deg)',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {LINES.map((line, i) => (
                <h1
                  key={i}
                  className="whitespace-nowrap uppercase leading-[0.92] tracking-tight text-center"
                  style={{
                    fontSize: 'clamp(3.5rem, 11vw, 6rem)',
                    color: '#111111',
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                  }}
                >
                  {line}
                </h1>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================== */
/*  MOBILE EXPERIENCE — a different, much shorter story, not a scaled  */
/*  copy of the desktop one. Two changes account for nearly all of the  */
/*  saved scroll distance:                                              */
/*                                                                       */
/*  1. Section height drops from 600vh to 190vh (~3x less scrolling).   */
/*  2. The headline no longer plays a slow 3D "flip toward camera" —    */
/*     that move needs a long runway to read as deliberate, and on a   */
/*     short section it would just look like a snap. Instead the        */
/*     headline does a quick, confident scale + fade dissolve, which    */
/*     reads cleanly even compressed into ~15% of a short section.      */
/*                                                                       */
/*  Everything else keeps the same mechanism as desktop (word-by-word   */
/*  reveal, sequential inline photo reveal, ambient icon float) so the  */
/*  brand identity carries over — it's just paced for a thumb, not a    */
/*  trackpad.                                                            */
/* ==================================================================== */
const M_FADE_START = 0.10;
const M_FADE_END = 0.26;
const M_WORDS_START = 0.24;
const M_WORDS_END = 0.80;
const M_IMAGES_START = 0.82;
const M_IMAGES_END = 1.0;

function MobileScrollStory() {
  const headlineGroupRef = useRef(null);
  const headlineLayerRef = useRef(null);
  const paragraphBackdropRef = useRef(null);
  const iconRefs = useRef([]);
  const wordRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const imageRefs = useRef([]);

  const icons = ICONS_MOBILE;

  const handleProgress = (progress) => {
    // quick confident scale-up + fade, no 3D flip — reads well over a
    // short scroll distance instead of needing a long runway
    const introT = clamp(progress / M_FADE_START, 0, 1);
    const introEase = smoothstep(introT);
    const textScale = 1 + introEase * 0.18;

    const fadeT = clamp((progress - M_FADE_START) / (M_FADE_END - M_FADE_START), 0, 1);
    const fadeEased = smoothstep(fadeT);
    const contentOpacity = clamp(1 - fadeEased, 0, 1);

    const iconTravel = progress * 220;

    const wordPhase = clamp((progress - M_WORDS_START) / (M_WORDS_END - M_WORDS_START), 0, 1);
    const wordRevealCount = Math.round(wordPhase * TOTAL_WORDS);
    const wordsComplete = wordRevealCount >= TOTAL_WORDS;

    if (headlineGroupRef.current) {
      headlineGroupRef.current.style.transform = `scale(${textScale})`;
    }
    if (headlineLayerRef.current) {
      headlineLayerRef.current.style.opacity = contentOpacity;
    }
    if (paragraphBackdropRef.current) {
      paragraphBackdropRef.current.style.opacity = fadeEased;
    }

    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      const cfg = icons[i];
      const y = iconTravel * cfg.depth * -1;
      const spin = progress * cfg.spin;
      el.style.transform = `translate3d(0, ${y}px, 0) rotate(${spin}deg)`;
    });

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const revealed = i < wordRevealCount;
      el.style.opacity = revealed ? '1' : '0';
      el.style.filter = revealed ? 'blur(0px)' : 'blur(6px)';
      el.style.transform = revealed ? 'translateY(0)' : 'translateY(0.35em)';
    });

    if (TOTAL_IMAGES > 0) {
      const perImageSpan = (M_IMAGES_END - M_IMAGES_START) / TOTAL_IMAGES;
      for (let i = 0; i < TOTAL_IMAGES; i += 1) {
        const winStart = M_IMAGES_START + i * perImageSpan;
        const winEnd = winStart + perImageSpan;
        const raw = wordsComplete ? clamp((progress - winStart) / (winEnd - winStart), 0, 1) : 0;
        const eased = smoothstep(raw);

        const wrapEl = imageWrapRefs.current[i];
        if (wrapEl) {
          wrapEl.style.width = `${eased * IMAGE_MAX_WIDTH_EM}em`;
          wrapEl.style.marginLeft = `${eased * IMAGE_MAX_MARGIN_EM}em`;
          wrapEl.style.marginRight = `${eased * IMAGE_MAX_MARGIN_EM}em`;
        }
        const imgEl = imageRefs.current[i];
        if (imgEl) {
          imgEl.style.opacity = eased;
          imgEl.style.transform = `scale(${0.8 + 0.2 * eased})`;
          imgEl.style.clipPath = `inset(0 ${(1 - eased) * 100}% 0 0)`;
        }
      }
    }
  };

  const sectionRef = useScrollProgress(handleProgress);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '190vh' }}>
      <div className="fsl-sticky sticky top-0 w-full overflow-hidden">
        <div
          ref={paragraphBackdropRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ background: SECOND_SECTION_BG, opacity: 0, willChange: 'opacity' }}
        >
          <RevealParagraph wordRefs={wordRefs} imageWrapRefs={imageWrapRefs} imageRefs={imageRefs} isMobile={true} />
        </div>

        <div ref={headlineLayerRef} className="absolute inset-0 z-20" style={{ opacity: 1, willChange: 'opacity' }}>
          {icons.map((cfg, i) => (
            <FloatingIcon
              key={i}
              ref={(el) => (iconRefs.current[i] = el)}
              icon={cfg.Icon}
              size={cfg.size}
              blur={cfg.blur}
              duration={cfg.duration}
              rotate={cfg.rotate}
              style={{ top: cfg.top, left: cfg.left }}
            />
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-3">
            <div ref={headlineGroupRef} className="will-change-transform" style={{ transform: 'scale(1)' }}>
              {LINES.map((line, i) => (
                <h1
                  key={i}
                  className="whitespace-nowrap uppercase leading-[0.92] tracking-tight text-center"
                  style={{
                    fontSize: 'clamp(1.9rem, 12vw, 4rem)',
                    color: '#111111',
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                  }}
                >
                  {line}
                </h1>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component — mounts one experience or the other. They're kept  */
/*  as fully separate components (not one component with mobile-vs-    */
/*  desktop branches inside its progress handler) so each can be tuned */
/*  and read independently, and so the mobile one never carries the    */
/*  desktop timing constants it doesn't need.                          */
/* ------------------------------------------------------------------ */
export default function FitnessScrollLanding() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .fsl-sticky { height: 100vh; }
        @supports (height: 100svh) {
          .fsl-sticky { height: 100svh; }
        }

        @keyframes fslFloatDrift {
          0%   { transform: translate(0,0) rotate(var(--rot-start, 0deg)); }
          50%  { transform: translate(var(--drift-x,10px), var(--drift-y,-14px)) rotate(var(--rot-mid, 8deg)); }
          100% { transform: translate(0,0) rotate(var(--rot-start, 0deg)); }
        }
        .fsl-float { animation: fslFloatDrift var(--dur, 6s) ease-in-out infinite; will-change: transform; }
        .fsl-reveal-word { display: inline-block; transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1); will-change: opacity, transform, filter; }

        .fsl-reveal-img-wrap { will-change: width; }
        .fsl-reveal-img { will-change: opacity, transform, clip-path; }

        @media (prefers-reduced-motion: reduce) {
          .fsl-float { animation: none !important; }
          .fsl-reveal-word { transition: none !important; }
        }
      `}</style>

      {isMobile ? <MobileScrollStory /> : <DesktopScrollStory />}
    </div>
  );
}