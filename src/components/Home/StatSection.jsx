import React, { useState } from "react";

const guidelines = [
  "ICMR & NIN Nutrition Guidelines",
  "WHO Fitness Guidelines",
  "AHA Health Standards",
];

const stats = [
  { prefix: "Up to", value: "1 Lakh+", label: "Lives Transformed" },
  { prefix: "Up to", value: "98%", label: "Success Rate" },
  { prefix: "Up to", value: "70+", label: "Countries" },
  { prefix: "Up to", value: "40K+", label: "Members Community" },
  { prefix: "Up to", value: "400+", label: "Team Members" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  .cs-gradient-text {
    background: linear-gradient(90deg, #a78bfa, #6ee7b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cs-select {
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #111;
    cursor: pointer;
    max-width: 200px;
  }
`;

export default function CommunityStatsSection() {
  const [selected, setSelected] = useState(guidelines[0]);

  return (
    <>
      <style>{styles}</style>
      <div className="flex bg-[#F6F5F1] px-4 py-6 sm:px-6 sm:py-8 md:px-14 md:py-5 font-poppins min-h-[60vh] items-center">
        <div className="bg-white rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-16 w-full max-w-7xl mx-auto">

          {/* Heading */}
          <h2 className="text-[20px] sm:text-[24px] md:text-[30px] font-semibold text-[#1a1a1a] leading-snug max-w-[520px] mb-8 md:mb-10 font-poppins">
            Feel Empowered and Supported<br />
            With Our Community of Strength
          </h2>

          {/* Stats grid — 2 cols on mobile, 5 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-0">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1
                  ${i < stats.length - 1 ? "md:pr-8" : ""}
                  ${i > 0 ? "md:pl-8" : ""}
                `}
              >
                <p className="text-[11px] sm:text-[12px] text-[#888888] font-normal font-poppins">
                  {s.prefix}
                </p>
                <p className="cs-gradient-text text-[26px] sm:text-[32px] md:text-[40px] font-medium leading-none font-poppins">
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#666666] font-normal font-poppins mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}