import React from "react";

const features = [
  {
    title: "Tailored Solutions for Every Stage of Life",
    description:
      "From prenatal care to postnatal recovery and everything in between, we offer plans that fit seamlessly into your life.",
  },
  {
    title: "Expert Guidance You Can Trust",
    description:
      "Our certified trainers, clinical dietitians, and wellness experts provide personalised, research-backed advice that delivers results.",
  },
  {
    title: "Flexible Programs for Your Schedule",
    description:
      "Busy schedules are a part of life. That’s why we offer online sessions, real-time progress tracking, and personalised plans that work around you.",
  },
  {
    title: "Results That Last",
    description:
      "Our goal is to help you achieve sustainable, long-term wellness, not just quick fixes. We focus on creating habits that support your well-being for life.",
  },
];

function FeatureItem({ title, description }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h4 className="2xl:text-[18px] text-[] font-medium text-[#111111] mb-2 font-poppins">
          {title}
        </h4>
        <div className="w-full h-px bg-gray-300" />
      </div>
      <p className="2xl:text-[15.5px] text-[12.5px] text-[#555555] leading-[1.2] font-normal font-poppins">
        {description}
      </p>
    </div>
  );
}

export default function WhyFitMomSection() {
  return (
    <section className="w-full min-h-screen bg-white flex flex-col md:flex-row items-center gap-12 md:gap-16 px-6 py-16 md:px-[72px] md:py-[64px] font-poppins">
      {/* Left: Image */}
      <div className="w-full md:w-[44%] flex-shrink-0 rounded-2xl overflow-hidden h-[90vh]">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80"
          alt="Powered by innovation"
          className="w-full h-full object-cover block min-h-[320px] md:min-h-[520px]"
        />
      </div>

      {/* Right: Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-8">
        {/* Heading block */}
        <div className="flex flex-col gap-8">
          <h2 className="text-[26px] md:text-[50px] font-normal text-[#111111] leading-tight tracking-tight font-poppins">
            Why FitMom Club?
          </h2>
          <p className="2xl:text-[20px] text-[16px] text-[#555555] leading-[1.2] max-w-5xl font-normal font-poppins mb-8">
            At FitMom Club, we combine personalized fitness, expert nutrition, and holistic wellness to help women build healthier, stronger, and more confident lives—through every stage of their journey.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-9">
          {features.map((feature, i) => (
            <FeatureItem key={i} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
}