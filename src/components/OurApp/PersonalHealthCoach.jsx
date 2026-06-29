import { Activity, Clock, Heart } from "lucide-react";
import img1 from "../../assets/our app/mockup-img.png"
const features = [
  {
    icon: Activity,
    title: "Personalized recommendations",
    description:
      "based on your FMC Band health data, adapting in real time as your progress evolves.",
  },
  {
    icon: Clock,
    title: "24/7 expert support",
    description:
      "and real-time feedback whenever you need it most, around the clock.",
  },
  {
    icon: Heart,
    title: "Pressure-free guidance",
    description:
      "that motivates and empowers you — no stress, just steady support at your own pace.",
  },
];

export default function HealthCoachSection() {
  return (
    <section className="w-full bg-[#f6f5f1] overflow-hidden py-18 md:py-16 lg:py-30">

      {/* ── Header ── */}
      <div className="px-5 sm:px-8 md:p2-14 lg:pl-38 mb-10 md:mb-14 lg:mb-16 lg:max-w-4xl">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 md:mb-3 tracking-wide">
          Your FMC Personal Health Coach.
        </p>
        <h2
  className="inline-block text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-4 md:mb-6"
  style={{
    backgroundImage: "linear-gradient(90deg, #111111, #4db8a5)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  }}
>
    Tailored Guidance<br/> at Every Step
  
</h2>
        <p className="font-semibold md:text-lg text-slate-500 leading-relaxed max-w-2xl">
          Your personal coach ensures that your plan evolves with you. Through
          regular check-ins and ongoing progress assessments, they'll adapt your
          strategy to meet your current needs, ensuring you stay on track.
        </p>
      </div>

      {/* ── Mobile & Tablet: stacked layout ── */}
      <div className="lg:hidden">
        {/* Image — full bleed with rounded right on mobile, both sides clipped on tablet */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="ml-0 rounded-r-2xl sm:rounded-2xl sm:mx-5 md:mx-8 overflow-hidden">
            <img
              src={img1}
              alt="Personal health coach session"
              className="w-full object-cover h-56 sm:h-72 md:h-96"
            />
          </div>
        </div>

        {/* Features stacked below image */}
        <div className="px-5 sm:px-8 md:px-14 flex flex-col divide-y  divide-slate-100">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="flex items-start gap-4 py-5 first:pt-0">
              <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">{title}.</span>{" "}
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: side-by-side layout ── */}
      <div className="hidden lg:flex items-start">
        {/* Image — bleeds from left edge */}
        <div
          className="flex-shrink-0 w-[58%] rounded-r-3xl overflow-hidden"
          style={{ marginLeft: "-2px" }}
        >
          <img
            src={img1}
            alt="Personal health coach session"
            className="w-full object-cover"
            style={{ height: "520px" }}
          />
        </div>

        {/* Features to the right */}
        <div className="flex-1 pl-12 xl:pl-16 pr-16 xl:pr-24 pt-2 flex flex-col gap-9 max-w-lg">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="flex flex-col items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-6 h-6 text-teal-600" strokeWidth={3} />
              </div>
              <p className="text-md text-slate-500 leading-relaxed font-semibold">
                <span className=" text-slate-900">{title}.</span>{" "}
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}