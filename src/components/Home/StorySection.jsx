import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
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
import mom from "../../assets/home/bgImg/mother.webp"
import wellness from "../../assets/home/bgImg/wellness.webp"
import online from "../../assets/home/bgImg/online.webp"
import trainer from "../../assets/home/bgImg/trainer.webp"
import support from "../../assets/home/bgImg/support.webp"
import family from "../../assets/home/bgImg/family.webp"
import goals from "../../assets/home/bgImg/goal.webp"
import nutrition from "../../assets/home/bgImg/nutrition.webp"

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
    overlay: "pregnancy",
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

// Animation variants
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.5, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 18,
      delay: 0.1,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
      delay: 0.25, // slightly after badge
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
      delay: 0.15,
    },
  },
};

const descVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      delay: 0.3,
    },
  },
};

function FloatingOverlay({ type }) {
  switch (type) {
    case "nutrition":
      return (
        <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
          <div className="rounded-3xl p-7 shadow-2xl" style={{ width: 320, background: "rgba(28,28,30,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Today's Goal</p>
                <p className="text-3xl font-bold text-white mt-1">1000 <span className="text-base font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>/ 2042 cal</span></p>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm" style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", color: "#14B8A6" }}>
                🔥 4 Streak
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
              <div className="h-full w-[49%] rounded-full" style={{ background: "#14B8A6" }} />
            </div>
            <div className="flex gap-4 mt-5">
              {[["47g","Protein","#EF4444",63],["67g","Carbs","#3B82F6",90],["60g","Fat","#F97316",81]].map(([val,label,color,pct]) => (
                <div key={label} className="flex-1">
                  <p className="text-base font-semibold" style={{ color }}>{val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {[["🥗","Lunch","480 kcal"],["🍎","Snack","120 kcal"]].map(([emoji,name,cal]) => (
                <div key={name} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background:"rgba(255,255,255,0.05)" }}>
                  <span className="text-base">{emoji}</span>
                  <p className="flex-1 ml-2 text-sm text-white">{name}</p>
                  <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>{cal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "fitness":
      return (
        <div className="absolute hidden lg:block z-30" style={{ right: "7%", top: "50%", transform: "translateY(-50%)" }}>
          <div className="rounded-3xl p-7 shadow-2xl text-center" style={{ width: 260, background: "rgba(28,28,30,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Heart Rate</p>
            <div className="relative flex items-center justify-center mx-auto" style={{ width: 150, height: 150 }}>
              <svg width="150" height="150" style={{ position:"absolute", transform:"rotate(-90deg)" }}>
                <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="10"/>
                <circle cx="75" cy="75" r="62" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="389.6" strokeDashoffset="116" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-4xl font-extrabold text-white">142</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>BPM</p>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-5">
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Resting</p>
                <p className="text-lg font-semibold text-white">62</p>
              </div>
              <div style={{ width:1, background:"rgba(255,255,255,0.1)" }}/>
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Peak</p>
                <p className="text-lg font-semibold" style={{ color:"#EF4444" }}>168</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5" style={{ color:"rgba(255,255,255,0.35)" }}>
                <span>Zone 1</span><span>Zone 5</span>
              </div>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
                {[["#3B82F6",20],["#22C55E",20],["#EAB308",20],["#F97316",20],["#EF4444",20]].map(([c,w],i) => (
                  <div key={i} style={{ flex:1, background:c, opacity: i===3?1:0.45 }}/>
                ))}
              </div>
              <p className="text-xs mt-1.5 text-left" style={{ color:"#F97316" }}>Cardio Zone</p>
            </div>
          </div>
        </div>
      );

    case "coach":
      return (
        <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
          <div className="rounded-3xl p-7 shadow-2xl" style={{ width: 300, background: "rgba(28,28,30,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-white">Weekly Activity</p>
              <p className="text-sm" style={{ color: "#14B8A6" }}>5/7 days</p>
            </div>
            <div className="flex gap-2 mt-4">
              {[["M",40,true],["T",75,true],["W",55,true],["T",90,true],["F",60,true],["S",0,false],["S",0,false]].map(([d,h,done],i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-lg relative overflow-hidden" style={{ height:64, background:"rgba(255,255,255,0.08)", border: done ? "none" : "1.5px dashed rgba(255,255,255,0.15)" }}>
                    {h > 0 && <div className="absolute bottom-0 left-0 right-0 rounded-lg" style={{ height:`${h}%`, background: i===3?"#14B8A6":"rgba(20,184,166,0.5)" }}/>}
                  </div>
                  <p className="text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              {[["400","kcal avg"],["32m","avg session"],["5","streak days"]].map(([v,l]) => (
                <div key={l} className="flex-1 rounded-xl p-3 text-center" style={{ background:"rgba(255,255,255,0.06)" }}>
                  <p className="text-base font-bold text-white">{v}</p>
                  <p className="text-[11px] mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "goals":
      return (
        <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
          <div className="rounded-3xl p-7 shadow-2xl" style={{ width: 300, background: "rgba(28,28,30,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-base font-semibold text-white">My Goals</p>
              <div className="rounded-full px-3 py-1.5 text-xs" style={{ background:"rgba(20,184,166,0.15)", border:"1px solid rgba(20,184,166,0.3)", color:"#14B8A6" }}>Oct 25</div>
            </div>
            {[
              [true,"Morning walk 30 min","100%"],
              [true,"2000 kcal intake","82%"],
              [true,"Drink 5L water","100%"],
              [false,"Evening yoga session","0%"],
            ].map(([done,text,pct]) => (
              <div key={text} className="flex items-center gap-3 py-3" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                <div className="rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ width:22, height:22, background:done?"rgba(20,184,166,0.2)":"rgba(255,255,255,0.08)", border:done?"none":"1.5px solid rgba(255,255,255,0.2)", color:done?"#14B8A6":"transparent" }}>
                  {done?"✓":""}
                </div>
                <p className="flex-1 text-sm" style={{ color:"rgba(255,255,255,0.7)" }}>{text}</p>
                <p className="text-sm font-bold" style={{ color:done?"#14B8A6":"rgba(255,255,255,0.3)" }}>{pct}</p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 rounded-xl p-3" style={{ background:"rgba(20,184,166,0.08)" }}>
              <p className="text-sm" style={{ color:"rgba(255,255,255,0.5)" }}>Today's score</p>
              <p className="text-2xl font-extrabold" style={{ color:"#14B8A6" }}>75%</p>
            </div>
          </div>
        </div>
      );

    case "nutrition2":
      return (
        <div className="absolute hidden lg:block z-30" style={{ right: "6%", top: "50%", transform: "translateY(-50%)" }}>
          <div className="rounded-3xl p-7 shadow-2xl" style={{ width: 310, background: "rgba(28,28,30,0.96)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <p className="text-base font-semibold text-white mb-1">Custom Meal Plan</p>
            <p className="text-xs mb-4" style={{ color:"rgba(255,255,255,0.35)" }}>Week 3 · Recovery Phase</p>
            <div className="space-y-3">
              {[
                ["🌅","Breakfast","Oats + banana + seeds","380 kcal","#F97316"],
                ["☀️","Lunch","Grilled tofu + quinoa bowl","520 kcal","#3B82F6"],
                ["🌙","Dinner","Lentil soup + whole roti","460 kcal","#8B5CF6"],
                ["🍎","Snack","Greek yogurt + nuts","210 kcal","#22C55E"],
              ].map(([emoji,meal,desc,cal,color]) => (
                <div key={meal} className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background:"rgba(255,255,255,0.05)" }}>
                  <span className="text-xl mt-0.5">{emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{meal}</p>
                    <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                  <p className="text-xs font-semibold mt-0.5" style={{ color }}>{cal}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 rounded-xl p-3" style={{ background:"rgba(46,125,50,0.1)" }}>
              <p className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Total daily</p>
              <p className="text-base font-extrabold" style={{ color:"#2E7D32" }}>1570 kcal</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}


function StoryScene({ story, index }) {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const isFirst = index === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  // inView triggers animations each time the sticky scene is visible
  const isInView = useInView(ref, { amount: 0.3, once: false });

  const Icon = story.icon;

  return (
    <div
      ref={ref}
      className="relative h-[100vh] md:h-[120vh]"
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

        {/* Slide-up motion wrapper */}
        <motion.div
          className="absolute inset-0"
          style={isFirst ? {} : { y }}
        >
          {/* ── Badge + Icon (pop animation) ── */}
          <div
            className="absolute left-10 top-10 md:left-10 flex items-center gap-2"
            style={{ zIndex: 2 }}
          >
            {/* Badge pill */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-full backdrop-blur-sm px-5 py-4.5 font-medium text-sm shadow-lg"
              style={{ backgroundColor: story.badgeBg, color: story.iconColor }}
            >
              {story.badge}
            </motion.div>

            {/* Icon circle — delayed pop with rotation */}
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm shadow-lg"
              style={{ backgroundColor: story.badgeBg }}
            >
              <Icon size={26} color={story.iconColor} strokeWidth={2.3} />
            </motion.div>
          </div>

          {/* ── Title + Description (pop from right) ── */}
          <div
            className="absolute bottom-20 lg:left-14 left-4 max-w-3xl"
            style={{ zIndex: 2 }}
          >
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="whitespace-pre-line font-medium text-white leading-[0.98] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px, 4vw, 64px)" }}
            >
              {story.title}
            </motion.h1>

            <motion.p
              variants={descVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-12 sm:text-[26px] text-[20px] mt:leading-10 leading-8 text-white/85 max-w-xl"
            >
              {story.description}
            </motion.p>
          </div>

          <FloatingOverlay type={story.overlay} />
        </motion.div>
      </div>
    </div>
  );
}

export default function StorySection() {
  return (
    <section className="relative bg-[#F6F5F1]">
      <div className="max-w-4xl md:px-16 md:py-30 px-2 py-10">
        <h2 className="md:text-5xl text-3xl leading-8 md:leading-12 text-black/90 text-center sm:text-left">
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