import React from "react";

const stats = [
  {
    label: "Personalised Fitness Plans",
    value: "Tailored",
    description:
      "We understand that everyone's journey is different. That's why our programs are tailored specifically for each individual, focusing on fitness goals that fit your body's needs, whether you're navigating motherhood or looking to get stronger and healthier.",
  },
  {
    label: "Holistic Wellness Support",
    value: "Beyond",
    description:
      "Our approach goes beyond physical fitness. We address mental, emotional, and nutritional well-being to ensure you achieve balance in every aspect of your life. Whether it's mindfulness practices or dietary guidance, we have you covered.",
  },
  {
    label: "Community Engagement",
    value: "Together",
    description:
      "We believe that the power of a community can be transformative. At FitMom Club, you're never alone on your journey. Our community of like-minded individuals is here to motivate, support, and inspire you through every milestone.",
  },
];

function StatCard({ label, value, description }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* Label + divider */}
      <div>
        <p className="text-[14px] text-[#333333] font-normal mb-3 font-poppins">
          {label}
        </p>
        <div className="w-full h-px bg-gray-300" />
      </div>

      {/* Big display value */}
      <h3 className="text-[40px] md:text-[56px] font-light text-[#1a1a1a] leading-none tracking-tight font-poppins">
        {value}
      </h3>

      {/* Description */}
      <p className="text-[13.5px] text-[#444444] leading-[1.75] font-normal font-poppins">
        {description}
      </p>
    </div>
  );
}

export default function OurApproachSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-[72px] md:py-[72px] font-poppins">
      {/* Header */}
      <div className="mb-14">
        <h2 className="text-[28px] md:text-[44px] font-light text-[#1a1a1a] leading-tight tracking-tight max-w-[560px] mb-4 font-poppins">
          Our Approach
        </h2>
        <p className="text-[13.5px] text-[#666666] font-normal font-poppins">
          Chronic conditions and lifestyle factors drive preventable spending:
        </p>
      </div>

      {/* Cards row */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-12 w-full">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}