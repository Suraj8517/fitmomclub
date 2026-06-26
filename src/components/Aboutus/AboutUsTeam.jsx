import React from "react";
import pritika from "../../assets/aboutus/pritika-team.webp"
import sarvesh from "../../assets/aboutus/sarvesh.webp"
import vignesh from "../../assets/aboutus/vignesh.webp"

const cards = [
  {
    title: "Mr. Vignesh Prabakaran",
    description:
      "Founder & Chief Business Director",
    img: vignesh,
  },
  {
    title: "Mr. Sarvesh Prabakaran",
    description:
      "Co Founder & CEO",
    img: sarvesh,
  },
  {
    title: "Ms. Pritika Srinivasan",
    description:
      "Co-Founder and Chief Evangelist",
    img: pritika,
  },
];

function Card({ card }) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Image */}
      <div className="rounded-xl overflow-hidden xl:h-[82vh] md:h-[420px] h-[260px]">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover block"
        />
      </div>
      {/* Text */}
      <div className="pt-5">
        <h3 className="text-[18px] font-semibold text-[#111111] mb-2 leading-snug font-poppins">
          {card.title}
        </h3>
        <p className="text-[13.5px] text-[#555555] leading-relaxed font-poppins font-normal">
          {card.description}
        </p>
      </div>
    </div>
  );
}

export default function PopulationHealthSection() {
  return (
    <section className="w-full bg-white lg:px-16 lg:py-34 px-6 py-12 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
        <h2 className="text-[28px] md:text-[46px] font-normal text-[#111111] leading-tight tracking-tight max-w-[760px]">
          Meet Our
          <br />
Management Team
        </h2>
        <p className="text-lg text-[#555555] leading-relaxed max-w-[500px] pt-1 font-normal">
          Meet the visionary leaders behind our mission, each dedicated to ensuring that FitMom Club continues to uplift and support women around the world.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {cards.map((card, i) => (
          <Card key={i} card={card} />
        ))}
      </div>
    </section>
  );
}