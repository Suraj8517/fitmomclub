import { useRef, useEffect, useState } from "react";
import {
  HeartPulse,
  Sparkles,
  Clock3,
  BadgeCheck,
  Users,
  Baby,
  Target,
  Venus,
  Apple,
} from "lucide-react";
import Nutrition from "../Helper/StorySection/Nutrition";
import Fitness from "../Helper/StorySection/Fitness";
import Coach from "../Helper/StorySection/Coach";
import RunningMap from "../Helper/StorySection/Expert";
import Goals from "../Helper/StorySection/Goals";
import Nutrition2 from "../Helper/StorySection/Nutrition2";
import MenstrualCycle from "../Helper/StorySection/MenstrualCycle";
const mom ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204587/mother_wvlet7.webp";
const wellness="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/wellness_tykrc2.webp"
const online ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/online_agdx4b.webp"
const trainer = "https://res.cloudinary.com/q1vba78b/image/upload/v1784204590/trainer_pwlz4t.webp"
const support ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/support_xav2qs.webp"
const family = "https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/family_madgcc.webp"
const goals="https://res.cloudinary.com/q1vba78b/image/upload/v1784204588/goal_myqwro.webp"
const nutrition ="https://res.cloudinary.com/q1vba78b/image/upload/v1784204589/nutrition_zyz46h.webp"
const cycle ="https://res.cloudinary.com/q1vba78b/image/upload/v1786078998/cycle_f6p4lu.webp"

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
  title: "Menstrual Cycle Tracking",
  badge: "Hormonal Health",
  badgeBg: "#FAD7E6",      // Soft pink
  icon: Venus,
  iconColor: "#D63384",    // Deep pink
  image: cycle,
  description:
    "Your cycle changes your body's needs. FitMom Club helps you train, eat, and recover with personalized guidance.",
  overlay: "cycle",
},
  {
    id: 9,
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

function FloatingOverlay({ type }) {
  switch (type) {
    case "nutrition":
     return(<Nutrition/>);

    case "fitness":
      return (
        <Fitness/>
      );

    case "coach":
      return (
        <Coach/>
      );
case "expert":
  return(
<RunningMap/>
  );
    case "goals":
      return (
        <Goals/>
      );

    case "nutrition2":
      return (
       <Nutrition2/>
      );
 case "cycle":
      return (
       <MenstrualCycle/>
      );
    default:
      return null;
  }
}


function StoryScene({ story, index }) {
  const ref = useRef(null);
  const Icon = story.icon;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // reset so the animation replays when scrolling back up/down
          setIsVisible(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[100vh] md:h-[100vh]"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: index + 1 }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${story.image})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div className="absolute inset-0">
          {/* ── Badge + Icon ── */}
          <div
            className="absolute left-5 top-[45vh] sm:top-10 sm:left-10 flex items-center gap-2"
            style={{ zIndex: 2 }}
          >
            {/* Badge pill */}
            <div
              className="rounded-full backdrop-blur-sm px-5 py-4.5 font-medium text-sm shadow-lg transition-all duration-700 ease-out"
              style={{
                backgroundColor: story.badgeBg,
                color: story.iconColor,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) translateX(0)"
                  : "translateY(-16px) translateX(-12px)",
                transitionDelay: isVisible ? "80ms" : "0ms",
              }}
            >
              {story.badge}
            </div>

            {/* Icon circle */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm shadow-lg transition-all duration-700 ease-out"
              style={{
                backgroundColor: story.badgeBg,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) translateX(0) scale(1)"
                  : "translateY(-16px) translateX(-12px) scale(0.6)",
                transitionDelay: isVisible ? "220ms" : "0ms",
                animation: isVisible
                  ? "storyIconFloat 2.8s ease-in-out 900ms infinite"
                  : "none",
              }}
            >
              <Icon size={26} color={story.iconColor} strokeWidth={2.3} />
            </div>
          </div>

          {/* ── Title + Description ── */}
          <div
            className="absolute bottom-20 lg:left-14 left-4 max-w-3xl"
            style={{ zIndex: 2 }}
          >
            <h1
              className="whitespace-pre-line font-medium text-white leading-[0.98] tracking-[-0.02em] transition-all duration-700 ease-out"
              style={{
                fontSize: "clamp(28px, 4vw, 64px)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: isVisible ? "260ms" : "0ms",
              }}
            >
              {story.title}
            </h1>

            <p
              className="mt-12 sm:text-[26px] text-[20px] mt:leading-10 leading-8 text-white/85 max-w-xl transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: isVisible ? "420ms" : "0ms",
              }}
            >
              {story.description}
            </p>
          </div>

          <FloatingOverlay type={story.overlay} />
        </div>
      </div>
    </div>
  );
}

export default function StorySection() {
  return (
    <section className="relative bg-[#F6F5F1]">
      <style>{`
        @keyframes storyIconFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.06); }
        }
      `}</style>
      <div className="max-w-4xl md:px-16 md:py-30 px-2 py-10">
        <h2 className="md:text-5xl text-2xl leading-8 md:leading-12 text-black/90 text-center sm:text-left">
          Why FitMom Club? Wellness Designed Just for You,{" "}
          <br />
          <span className="text-teal-600">By Experts Who Care</span>
        </h2>
      </div>
      {stories.map((story, index) => (
        <StoryScene key={story.id} story={story} index={index} />
      ))}
    </section>
  );
}