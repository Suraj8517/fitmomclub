import { useEffect, useRef, useState } from "react";

const ROTATE_ANCHORS = [-100, -78, -46, -16, 0];
const SCALE_ANCHORS = [0.05, 0.3, 0.6, 0.88, 1];
const STOPS = [0, 0.25, 0.5, 0.75, 1];

function interpolate(anchors, t) {
  if (t <= 0) return anchors[0];
  if (t >= 1) return anchors[anchors.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i] && t <= STOPS[i + 1]) {
      const localT = (t - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
      return anchors[i] + (anchors[i + 1] - anchors[i]) * localT;
    }
  }
  return anchors[anchors.length - 1];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
const HEADLINE = ["healthy", "habits", "for", "all", "moms"];
const LINES = [
  "science-backed weight",
  "loss wellness & nutrition ",
  "expert coaching ",
  "for moms"
];

// each line gets its own dedicated slice of the scroll, so line 1
// finishes forming before line 2 begins — with a small overlap so the
// cascade still feels continuous rather than stepped.
const BLOCK_COUNT = 1 + LINES.length;
const REVEAL_END = 0.78;
const BLOCK_WINDOW = 0.22;

// the last stretch of scroll (from FADE_START to 1) is reserved for the
// hero content to dissolve away as the overlay rises over it.
const FADE_START = 0.82;

function getBlockWindow(index) {
  const start =
    BLOCK_COUNT > 1
      ? (REVEAL_END - BLOCK_WINDOW) * (index / (BLOCK_COUNT - 1))
      : 0;
  return { start, end: start + BLOCK_WINDOW };
}

/* One resize-driven boolean, not part of the scroll hot path — cheap,
   infrequent, safe to drive a re-render. This is the switch between a
   roomy desktop stage and a tightened-up mobile one. */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

export default function HeroReveal() {
  const isMobile = useIsMobile();

  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRefs = useRef([]);
  const lineRefs = useRef(LINES.map(() => []));
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const overlayRef = useRef(null);
  const overlayTextRef = useRef(null);
  const contentRef = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    function applyWord(el, blockProgress, wordIdx, wordCount, glowRgb) {
      if (!el) return;
      const delayFraction = wordCount > 1 ? (wordIdx / wordCount) * 0.5 : 0;
      const local = clamp(
        (blockProgress - delayFraction) / (1 - delayFraction),
        0,
        1
      );
      const rotate = interpolate(ROTATE_ANCHORS, local);
      const scale = interpolate(SCALE_ANCHORS, local);
      el.style.transform = `perspective(1000px) rotateX(${rotate}deg) scaleY(${scale}) translateZ(${20 * local}px)`;
    }

    // on mobile the floating images travel a shorter distance (in vh)
    // since the whole track is shorter — otherwise they'd still be
    // mid-exit by the time the section runs out of scroll to give them.
    function applyImage(el, progress, enterStart, enterEnd, exitVh, rotateDeg) {
      if (!el) return;
      const enterT = clamp((progress - enterStart) / (enterEnd - enterStart), 0, 1);
      const eased = easeOutBack(enterT);
      const enterOffset = (1 - eased) * 90;
      const exitT = clamp((progress - enterEnd) / (1 - enterEnd), 0, 1);
      const exitEased = exitT * exitT * (3 - 2 * exitT);
      const exitDrift = exitEased * exitVh;
      const settledScale = 0.85 + 0.15 * clamp(eased, 0, 1);
      el.style.transform = `translateY(calc(${enterOffset}% - ${exitDrift}vh)) rotate(${rotateDeg}deg) scale(${settledScale})`;
      const fadeOut = clamp((exitT - 0.65) / 0.35, 0, 1);
      el.style.opacity = String(clamp(enterT * 1.4, 0, 1) * (1 - fadeOut));
    }

    function render() {
      const p = currentRef.current;
      const textProgress = clamp(p / REVEAL_END, 0, 1) * REVEAL_END;

      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(clamp(p / 0.08, 0, 1));
        eyebrowRef.current.style.transform = `translateY(${(1 - clamp(p / 0.08, 0, 1)) * 8}px)`;
      }

      // headline = block 0
      const headWin = getBlockWindow(0);
      const headBlockProgress = clamp(
        (textProgress - headWin.start) / (headWin.end - headWin.start),
        0,
        1
      );
      headlineRefs.current.forEach((el, i) => {
        applyWord(el, headBlockProgress, i, HEADLINE.length, "26,26,26");
      });

      // each line = block 1..N
      lineRefs.current.forEach((refs, li) => {
        const win = getBlockWindow(li + 1);
        const blockProgress = clamp(
          (textProgress - win.start) / (win.end - win.start),
          0,
          1
        );
        refs.forEach((el, wi) => {
          applyWord(el, blockProgress, wi, refs.length, "255,255,255");
        });
      });

      // shorter exit travel on mobile (~half) to match the shorter track
      const exitScale = isMobile ? 0.55 : 1;
      applyImage(img1Ref.current, p, 0.24, 0.42, 95 * exitScale, -7);
      applyImage(img2Ref.current, p, 0.34, 0.52, 120 * exitScale, 5);
      applyImage(img3Ref.current, p, 0.44, 0.62, 155 * exitScale, -4);

      // last stretch of scroll: hero content dissolves while the overlay
      // rises and fades in over it, so the handoff to the next section
      // reads as a soft cross-fade rather than a hard wipe.
      const fadeT = clamp((p - FADE_START) / (1 - FADE_START), 0, 1);
      const fadeEased = fadeT * fadeT * (3 - 2 * fadeT);

      if (contentRef.current) {
        contentRef.current.style.opacity = String(1 - fadeEased);
        contentRef.current.style.transform = `translateY(${-fadeEased * 24}px)`;
      }

      if (overlayRef.current) {
        overlayRef.current.style.transform = `translateY(${(1 - fadeEased) * 100}%)`;
        overlayRef.current.style.opacity = String(clamp(fadeEased * 1.6, 0, 1));
      }

      if (overlayTextRef.current) {
        const textT = clamp((fadeEased - 0.35) / 0.65, 0, 1);
        const textEased = textT * textT * (3 - 2 * textT);
        overlayTextRef.current.style.opacity = String(textEased);
        overlayTextRef.current.style.transform = `translateY(${(1 - textEased) * 26}px)`;
        overlayTextRef.current.style.filter = `blur(${(1 - textEased) * 14}px)`;
      }
    }

    function loop() {
      currentRef.current += (targetRef.current - currentRef.current) * 0.08;
      render();
      frameRef.current = requestAnimationFrame(loop);
    }

    function onScroll() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalH = rect.height - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, totalH);
      targetRef.current = totalH > 0 ? scrolled / totalH : 0;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        ref={containerRef}
        className="relative"
        style={{
          // the mobile track is little more than half the desktop one —
          // same choreography, condensed into less physical scrolling.
          height: isMobile ? "150vh" : "240vh",
          background:
            "linear-gradient( to bottom,transparent 0%,#E3F2EF 15%,#E3F2EF 35%,#E3F2EF 60%,#f6f5f1 100%)"
        }}
      >
        <div className="sticky top-0 h-screen overflow-hidden [perspective:1000px] [perspective-origin:center_top]">
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />

          <div
            ref={contentRef}
            className="relative z-10 flex h-full flex-col items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 text-center will-change-transform"
          >
            <h1
              className="m-0 flex flex-wrap justify-center gap-x-2 sm:gap-x-4 uppercase leading-[0.85] sm:leading-[0.8] tracking-tighter"
              style={{
                fontSize: isMobile ? "clamp(2rem, 10.5vw, 2.6rem)" : "clamp(2.8rem, 5.8vw, 62.5px)",
                fontWeight: 700,
                fontFamily: '"Sora", sans-serif',
                color: "#0B3D3B"
              }}
            >
              {HEADLINE.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => (headlineRefs.current[i] = el)}
                  className="inline-block origin-top backface-hidden will-change-transform"
                  style={{ transform: "perspective(1200px) rotateX(-100deg) scaleY(0.05)" }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="mt-1.5 sm:mt-2 flex flex-col gap-1 sm:gap-2">
              {LINES.map((line, li) => (
                <p
                  key={line}
                  className="m-0 flex flex-wrap justify-center gap-x-2 sm:gap-x-4 uppercase leading-[1.05] sm:leading-[1]"
                  style={{
                    fontSize: isMobile ? "clamp(0.95rem, 4.6vw, 1.3rem)" : "clamp(1.1rem, 35.5px, 62.5px)",
                    fontWeight: 700,
                    fontFamily: '"Sora", sans-serif',
                    color: "#3C6E68"
                  }}
                >
                  {line.split(" ").map((word, wi) => (
                    <span
                      key={word + wi}
                      ref={(el) => (lineRefs.current[li][wi] = el)}
                      className="inline-block origin-top backface-hidden will-change-transform"
                      style={{ transform: "perspective(1000px) rotateX(-100deg) scaleY(0.05)" }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Floating images: on mobile these shrink substantially and pull
              in tight to the corners so they frame the text instead of
              crowding it — the previous fixed max-h/max-w (12–13rem) was
              sized for a tablet, not a phone, and would have overlapped
              the headline. Desktop sizing/position is untouched. */}
          <img
            ref={img1Ref}
            src="https://picsum.photos/seed/gummy1/220/220"
            alt=""
            className="pointer-events-none absolute z-20 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
            style={
              isMobile
                ? { top: 0, right: "6%", height: "20vw", width: "20vw", maxHeight: 96, maxWidth: 96 }
                : { top: 0, right: "16%" }
            }
          />
          <img
            ref={img2Ref}
            src="https://picsum.photos/seed/gummy2/220/220"
            alt=""
            className="pointer-events-none absolute z-20 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)] sm:h-[15vw] sm:w-[15vw] sm:max-h-52 sm:max-w-52"
            style={
              isMobile
                ? { top: "26%", left: "3%", height: "18vw", width: "18vw", maxHeight: 84, maxWidth: 84 }
                : { top: "30%", left: "6%" }
            }
          />
          <img
            ref={img3Ref}
            src="https://picsum.photos/seed/gummy3/220/220"
            alt=""
            className="pointer-events-none absolute z-20 object-cover opacity-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)] sm:h-[14vw] sm:w-[14vw] sm:max-h-44 sm:max-w-44"
            style={
              isMobile
                ? { bottom: "4%", right: "5%", height: "17vw", width: "17vw", maxHeight: 78, maxWidth: 78 }
                : { bottom: "6%", right: "10%" }
            }
          />

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 z-30 opacity-0"
            style={{
              transform: "translateY(100%)",
              background:
                "linear-gradient( to bottom,transparent 0%,#E3F2EF 15%,#E3F2EF 35%,#E3F2EF 60%,#f6f5f1 100%)"
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center" />
        </div>
      </div>

      <div className="flex h-[10vh] items-center justify-center text-[#0B3D3B]" />
    </div>
  );
}