import React, { useEffect, useRef, useState } from "react";
import {
  HeartPulse,
  Sparkles,
  Clock3,
  BadgeCheck,
  Users,
  Baby,
  Target,
  Apple,
} from "lucide-react";

// ── Content ──────────────────────────────────────────────────────────────
// One restrained palette instead of eight — every patch shares the same
// ivory fabric and ink stitching. The accent (a single dusty rose) marks
// only the tag and icon, so it reads as considered rather than decorative.
const patches = [
  {
    id: 1,
    title: "Tailored Fitness for Moms",
    tag: "personalized programs",
    icon: HeartPulse,
    description:
      "Workout programs built for prenatal, postnatal, and busy-mom bodies — regain strength, improve mobility, and stay active at every stage.",
  },
  {
    id: 2,
    title: "Holistic Wellness",
    tag: "mind & body",
    icon: Sparkles,
    description:
      "A balanced approach that weaves together fitness, nourishing food, stress management, real sleep, and emotional well-being.",
  },
  {
    id: 3,
    title: "Flexible Schedules",
    tag: "fits your life",
    icon: Clock3,
    description:
      "Flexible online sessions that slot into your actual day — nap time, early mornings, or after the kids are down.",
  },
  {
    id: 4,
    title: "Expert Trainers",
    tag: "certified coaches",
    icon: BadgeCheck,
    description:
      "Train with certified women's-health and fitness specialists who guide every phase of motherhood safely and effectively.",
  },
  {
    id: 5,
    title: "Supportive Community",
    tag: "grow together",
    icon: Users,
    description:
      "Join a community of moms who show up for each other — encouragement, honesty, and shared wins along the way.",
  },
  {
    id: 6,
    title: "Family-Friendly Approach",
    tag: "wellness for everyone",
    icon: Baby,
    description:
      "Routines that fit into family life — do them solo, or bring your little one along for the ride.",
  },
  {
    id: 7,
    title: "Realistic Goals",
    tag: "sustainable results",
    icon: Target,
    description:
      "Milestones you can actually hit, building habits that stick without overwhelming a day that's already full.",
  },
  {
    id: 8,
    title: "Custom Nutrition Plans",
    tag: "healthy eating",
    icon: Apple,
    description:
      "Nutrition built around your lifestyle and recovery — fuel that supports your body instead of another rule to follow.",
  },
];

const INK = "#2B2430";
const MUTED = "#6B6070";
const BASE = "#F6F5F1";
const CARD = "#FFFDF8";
const ACCENT = "#1c8c77";

// Reveals a patch once it's mostly in view, then stops observing — a short
// stagger by grid position so the whole quilt settles in as one moment.
function useRevealed(threshold = 0.2) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, revealed];
}

function PatchCard({ patch, index }) {
  const [ref, revealed] = useRevealed();
  const Icon = patch.icon;
  const tilt = index % 2 === 0 ? -1.6 : 1.4;

  return (
    <div
      ref={ref}
      className="patch-card group relative flex flex-col rounded-[22px] overflow-hidden focus-within:outline focus-within:outline-2 focus-within:outline-offset-2"
      style={{
        background: CARD,
        border: `1px solid ${INK}14`,
        outlineColor: ACCENT,
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0) rotate(0deg)" : "translateY(20px) rotate(-1deg)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s,
                     box-shadow 0.35s ease`,
        boxShadow: "0 1px 2px rgba(43,36,48,0.06)",
      }}
      tabIndex={0}
    >
      {/* Hand-stitched hanging tag */}
      <div className="relative pt-6 px-6 flex items-start justify-between">
        <div
          className="patch-tag inline-flex items-center rounded-full px-3 py-1"
          style={{
            background: BASE,
            color: ACCENT,
            border: `1px dashed ${ACCENT}55`,
            transform: `rotate(${tilt}deg)`,
            
          }}
        >
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "17px",
              fontWeight: 600,
              lineHeight: 1,
              
            }}
          >
            {patch.tag}
          </span>
        </div>

        {/* Appliqué icon pocket */}
        <div
          className="patch-pocket relative w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: BASE,
            border: `1.5px dashed ${INK}33`,
            background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          letterSpacing: "0.02em",
          textDecoration: "none",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)"
          }}
         
        >
          <Icon size={20} color={INK} strokeWidth={1.75} />
        </div>
      </div>

      {/* Stitched seam */}
      <div
        className="mx-6 mt-5"
        style={{ borderTop: `1.5px dashed ${INK}26` }}
      />

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 pt-4 pb-6">
        <h3
          style={{
            fontFamily: "'Fraunces', serif",
            fontOpticalSizing: "auto",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: 1.25,
            color: INK,
            marginBottom: "8px",
          }}
        >
          {patch.title}
        </h3>
        <p
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: "13.5px",
            lineHeight: 1.6,
            color: MUTED,
          }}
        >
          {patch.description}
        </p>
      </div>
    </div>
  );
}

export default function ProgramFeatures() {
  return (
    <section className="w-full" style={{ background: BASE }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&family=Caveat:wght@600&display=swap');

        .patch-card { will-change: transform; }
        .patch-card:hover,
        .patch-card:focus-within {
          box-shadow: 0 18px 32px rgba(43,36,48,0.14) !important;
        }
        .patch-card:hover .patch-pocket,
        .patch-card:focus-within .patch-pocket {
          transform: translateY(-2px) rotate(-3deg);
        }
        .patch-card:hover .patch-tag,
        .patch-card:focus-within .patch-tag {
          transform: rotate(0deg) !important;
        }
        .patch-pocket { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .patch-tag { transition: transform 0.35s ease; }

        .stitch-underline {
          stroke-dasharray: 6 5;
          stroke-linecap: round;
        }

        @media (prefers-reduced-motion: reduce) {
          .patch-card, .patch-pocket, .patch-tag {
            transition: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 lg:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-14 lg:mb-16">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 mb-5"
            style={{ background: CARD, border: `1px dashed ${ACCENT}55` }}
          >
            <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "18px",
                fontWeight: 600,
                color: ACCENT,
              }}
            >
              why FitMom
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "40px",
              lineHeight: 1.12,
              fontWeight: 600,
              color: INK,
              marginBottom: "16px",
            }}
            className="sm:text-[46px]"
          >
            Everything a mom's{" "}
            <span className="relative inline-block">
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>wellness journey</span>
              <svg
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1 w-full h-3"
                aria-hidden="true"
              >
                <path
                  d="M2 9 Q 75 2, 150 8 T 298 7"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="2.5"
                  className="stitch-underline"
                />
              </svg>
            </span>{" "}
            actually needs
          </h2>

          <p
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: "15.5px",
              lineHeight: 1.7,
              color: MUTED,
            }}
          >
            Eight pillars, stitched together around real motherhood — not a generic fitness app.
          </p>
        </div>

        {/* Grid — 4 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {patches.map((patch, i) => (
            <PatchCard key={patch.id} patch={patch} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}