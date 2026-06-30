import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import bg1 from "../../assets/home/bgImg/support.webp"
import bg2 from "../../assets/home/bgImg/support.webp"
import bg3 from "../../assets/home/bgImg/support.webp"
import bg4 from "../../assets/home/bgImg/support.webp"

const cards = [
  {
    eyebrow: "Innovation",
    title: ["Beautiful and durable,", "by design."],
    image: bg1,
  },
  {
    eyebrow: "Cutting-Edge Cameras",
    title: ["Picture your best", "photos and videos."],
    image: bg2,
  },
  {
    eyebrow: "Chip and Battery Life",
    title: ["Fast that lasts."],
    image: bg3,
  },
  {
    eyebrow: "iOS and Apple Intelligence",
    title: ["New look.", "Even more magic."],
    image: bg4,
  },
  {
    eyebrow: "iOS and Apple Intelligence",
    title: ["New look.", "Even more magic."],
    image: bg4,
  },
  {
    eyebrow: "iOS and Apple Intelligence",
    title: ["New look.", "Even more magic."],
    image: bg4,
  },
];

export default function GetToKnowSection() {
  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 372;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-14 overflow-hidden">
      {/* Heading stays inside the normal constrained content width */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 px-5 sm:px-8 md:px-12 mb-6 md:mb-8">
          Get to know iPhone.
        </h2>
      </div>

      {/* Scroller breaks out of the constrained width and runs to the viewport's right edge,
          but its left edge still lines up with the heading above */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory pl-5 sm:pl-8 md:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-black"
            style={{ width: "372px", height: "660px" }}
          >
            {/* Background image */}
            <img
              src={card.image}
              alt={card.eyebrow}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top gradient for text legibility */}
            <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

            {/* Text content */}
            <div className="relative z-10 p-6 pt-7">
              <p className="text-sm font-medium text-white/90 mb-2">
                {card.eyebrow}
              </p>
              <h3 className="text-2xl font-semibold text-white leading-snug">
                {card.title.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </h3>
            </div>

            {/* Optional + button — delete this block if not needed */}
            <button
              type="button"
              aria-label="Learn more"
              className="absolute bottom-5 right-5 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
            >
              <span className="text-xl leading-none text-black">+</span>
            </button>
          </div>
        ))}
        {/* trailing spacer so the last card isn't flush against the viewport edge when fully scrolled */}
        <div className="flex-shrink-0 w-5 sm:w-8 md:w-12" aria-hidden="true" />
      </div>

      {/* Navigation buttons — back inside the constrained width to match the heading */}
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 px-5 sm:px-8 md:px-12 mt-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-700" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={18} className="text-slate-700" />
          </button>
        </div>
      </div>
    </section>
  );
}