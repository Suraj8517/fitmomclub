import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  HeartPulse,
  Sparkles,
  Clock3,
  BadgeCheck,
  Users,
  Baby,
  Target,
  Apple,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const mom ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204587/mother_wvlet7.webp";
const wellness="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/wellness_tykrc2.webp"
const online ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/online_agdx4b.webp"
const trainer = "https://res.cloudinary.com/q1vba78b/image/upload/v1784204590/trainer_pwlz4t.webp"
const support ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/support_xav2qs.webp"
const family = "https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/family_madgcc.webp"
const goals="https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/goal_myqwro.webp"
const nutrition ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/nutrition_zyz46h.webp"

const stories = [
  {
    id: 1,
    title: "Tailored Fitness for Moms",
    badge: "Personalized Programs",
    badgeBg: "#8FF4E9",
    icon: HeartPulse,
    iconColor: "#004F4A",
    image: mom,
    description:
      "Personalized workout programs designed for prenatal, postnatal, and busy moms, helping you regain strength, improve mobility, and stay active at every stage.",
    overlay: "nutrition",
  },
  {
    id: 2,
    title: "Holistic Wellness",
    badge: "Mind & Body",
    badgeBg: "#ECDBFF",
    icon: Sparkles,
    iconColor: "#8865B3",
    image: wellness,
    description:
      "Achieve complete wellness through a balanced approach that combines fitness, nutritious eating, stress management, quality sleep, and emotional well-being.",
    overlay: "fitness",
  },
  {
    id: 3,
    title: "Flexible Schedules",
    badge: "Fits Your Lifestyle",
    badgeBg: "#D3E3FD",
    icon: Clock3,
    iconColor: "#1249A4",
    image: online,
    description:
      "Exercise anytime with flexible online sessions that easily fit into your daily routine—whether during nap time, early mornings, or evenings.",
    overlay: "coach",
  },
  {
    id: 4,
    title: "Expert Trainers",
    badge: "Certified Coaches",
    badgeBg: "#FFE7C7",
    icon: BadgeCheck,
    iconColor: "#C26A00",
    image: trainer,
    description:
      "Train with certified women's health and fitness specialists who provide safe, effective guidance tailored to every phase of motherhood.",
    overlay: "expert",
  },
  {
    id: 5,
    title: "Supportive Community",
    badge: "Grow Together",
    badgeBg: "#FFD9E8",
    icon: Users,
    iconColor: "#B4235D",
    image: support,
    description:
      "Become part of a positive community where moms inspire, encourage, and celebrate each other's progress throughout their wellness journey.",
    overlay: "community",
  },
  {
    id: 6,
    title: "Family-Friendly Approach",
    badge: "Wellness for Everyone",
    badgeBg: "#D9F7D9",
    icon: Baby,
    iconColor: "#1F7A3D",
    image: family,
    description:
      "Enjoy fitness routines that fit seamlessly into family life, with activities you can do alone or together with your little ones.",
    overlay: "family",
  },
  {
    id: 7,
    title: "Realistic Goals",
    badge: "Sustainable Results",
    badgeBg: "#FFE7A8",
    icon: Target,
    iconColor: "#B56A00",
    image: goals,
    description:
      "Focus on achievable milestones that build lasting healthy habits, helping you gain confidence without overwhelming your daily routine.",
    overlay: "goals",
  },
  {
    id: 8,
    title: "Custom Nutrition Plans",
    badge: "Healthy Eating",
    badgeBg: "#D7F5D8",
    icon: Apple,
    iconColor: "#2E7D32",
    image: nutrition,
    description:
      "Receive personalized nutrition plans crafted around your lifestyle, recovery, and health goals to fuel your body with confidence.",
    overlay: "nutrition2",
  },
];

// Reveals a card once it's mostly in view, then stops observing — small
// stagger derived from grid position so the whole 4x2 grid settles in as a
// single orchestrated moment rather than each card animating alone.
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

function StoryCard({ story, index, revealed }) {
  const Icon = story.icon;

  return (
    <div
      className="group relative flex flex-col rounded-[26px] bg-white overflow-hidden"
      style={{
        border: "1px solid rgba(20,35,31,0.08)",
        boxShadow: "0 1px 2px rgba(20,35,31,0.04)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s,
                     box-shadow 0.4s ease, border-color 0.4s ease`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(20,35,31,0.12)";
        e.currentTarget.style.borderColor = "rgba(20,35,31,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(20,35,31,0.04)";
        e.currentTarget.style.borderColor = "rgba(20,35,31,0.08)";
      }}
    >
      {/* Photo */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
        <img
          src={story.image}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,35,31,0.24) 0%, rgba(20,35,31,0) 40%)",
          }}
        />
      </div>

      {/* Icon medallion — straddles the photo/content seam */}
      <div className="relative px-6">
        <div
          className="absolute -top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1"
          style={{
            background: story.badgeBg,
            boxShadow: "0 6px 16px rgba(20,35,31,0.16), 0 0 0 4px #FFFFFF",
          }}
        >
          <Icon size={20} color={story.iconColor} strokeWidth={2.1} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-6 pt-9 pb-7">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
          style={{ color: story.iconColor }}
        >
          {story.badge}
        </span>
        <h3
          className="text-[19px] leading-snug font-semibold mb-2.5"
          style={{ color: "#14231F" }}
        >
          {story.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "#5B655F" }}>
          {story.description}
        </p>
      </div>
    </div>
  );
}

// Mobile carousel — one card visible at a time. Purely user-driven:
// swipe/drag, prev/next buttons, and dot indicators. No autoplay —
// the slide only changes when the person interacts with it.
function MobileCarousel({ revealed }) {
  const [index, setIndex] = useState(0);
  const total = stories.length;
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((next) => {
    setIndex(((next % total) + total) % total);
  }, [total]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) goTo(index + 1);
      else goTo(index - 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="sm:hidden"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(22px)",
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {stories.map((story) => (
            <div key={story.id} className="w-full flex-shrink-0 px-0.5">
              <StoryCard story={story} index={0} revealed={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(index - 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(20,35,31,0.12)",
            boxShadow: "0 1px 2px rgba(20,35,31,0.06)",
          }}
        >
          <ChevronLeft size={18} color="#14231F" strokeWidth={2.2} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {stories.map((story, i) => (
            <button
              key={story.id}
              type="button"
              aria-label={`Go to ${story.title}`}
              onClick={() => goTo(i)}
              className="rounded-full"
              style={{
                width: i === index ? 20 : 7,
                height: 7,
                background: i === index ? "#2E7D32" : "rgba(20,35,31,0.18)",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(index + 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(20,35,31,0.12)",
            boxShadow: "0 1px 2px rgba(20,35,31,0.06)",
          }}
        >
          <ChevronRight size={18} color="#14231F" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

export default function ProgramFeatures() {
  const [sectionRef, sectionRevealed] = useRevealed(0.12);

  return (
    <section ref={sectionRef} className="w-full" style={{ background: "#F5F4F0" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20 lg:py-28">
        {/* Header */}
        <div
          className="max-w-2xl mb-14 lg:mb-16"
          style={{
            opacity: sectionRevealed ? 1 : 0,
            transform: sectionRevealed ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span
            className="block text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#2E7D32" }}
          >
            Why FitMom
          </span>
          <h2
            className="text-[34px] sm:text-[42px] leading-[1.1] font-semibold mb-4"
            style={{ color: "#14231F"}}
          >
            Everything a mom's wellness journey actually needs
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "#5B655F" }}>
            Eight pillars, built around real motherhood, not a generic fitness app.
          </p>
        </div>

        {/* Mobile — single card carousel, swipe-driven, no autoplay */}
        <MobileCarousel revealed={sectionRevealed} />

        {/* Tablet/Desktop — 4 columns / 2 columns grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i % 4} revealed={sectionRevealed} />
          ))}
        </div>
      </div>
    </section>
  );
}