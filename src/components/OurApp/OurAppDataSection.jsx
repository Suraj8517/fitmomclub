import { Activity, RefreshCw, Sparkles } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Comprehensive health tracking.",
    description:
      "Steps, activity, sleep, calories burned, and more captured automatically throughout your day.",
    link: "Learn more about tracking",
  },
  {
    icon: RefreshCw,
    title: "Real-time syncing.",
    description:
      "Your body's data updates dynamically in the app, so your plan reflects exactly where you are right now.",
    link: "Learn more about syncing",
  },
  {
    icon: Sparkles,
    title: "Personalized insights.",
    description:
      "Recommendations tailored to your unique health profile, refined continuously as your data evolves.",
    link: "Learn more about insights",
  },
];

export default function OurAppDataSection() {
  return (
    <section className="w-full bg-[#f6f5f1] py-16 sm:py-20 lg:py-28">
      <div className="px-5 sm:px-8 md:px-14 lg:px-20 xl:px-24 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-10 md:mb-14 lg:mb-16 lg:max-w-3xl">
          <p className="text-xs sm:text-sm font-semibold text-teal-600 mb-2 md:mb-3 tracking-wide">
            FMC App
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] mb-4 md:mb-5" 
          style={{ background: "linear-gradient(90deg, #A479C8 0%, #738AC7 50%, #64994F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",}}>
            Data-Driven Personalization.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
            The FMC App, combined with your FMC Band, offers seamless tracking
            of your daily health metrics, syncing your data to deliver
            personalized insights and wellness plans.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4">
          {features.map(({ icon: Icon, title, description, link }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 md:p-10 flex flex-col gap-5 shadow-sm"
            >
              <div className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-slate-900" strokeWidth={1.75} />
              </div>

              <div className="flex flex-col gap-2.5">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}