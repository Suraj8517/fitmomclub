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
    <section className="w-full bg-[#f6f5f1] overflow-hidden py-18 md:py-16 lg:py-30 mx-auto">

      {/* ── Header ── */}
      <div className="px-5 sm:px-8 md:p2-14 lg:pl-38 mb-10 md:mb-14 lg:mb-16 2xl:max-w-8xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 md:mb-3 tracking-wide">
          Your FMC Personal Health Coach.
        </p>
        <h2
  className="inline-block text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-4 md:mb-6"
  style={{
    background: "linear-gradient(90deg, #A479C8 0%, #738AC7 50%, #64994F 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
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
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="m-4 rounded-2xl sm:rounded-2xl sm:mx-5 md:mx-8 overflow-hidden">
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
      <div className="hidden lg:flex md:items-start 2xl:items-center">
        {/* Image — bleeds from left edge */}
       <div
  className=" w-[58%] rounded-r-3xl overflow-hidden md:-ml-2 2xl:ml-38 2xl:rounded-3xl 2xl:w-[50%]"
>
          <img
            src={img1}
            alt="Personal health coach session"
            className="w-full object-cover md:h-[520px] 2xl:h-[600px]"
          />
        </div>

        {/* Features to the right */}
        <div className="flex-1 pl-12 xl:pl-16 pr-16 xl:pr-24 flex flex-col gap-9 max-w-lg">
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