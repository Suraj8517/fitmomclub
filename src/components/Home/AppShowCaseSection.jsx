import { useEffect, useRef } from "react";
import screen1 from "../../assets/home/mobile/img1.png";
import screen2 from "../../assets/home/mobile/img2.png";

export default function HealthCoachSection() {
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
      );

      // Phone 1 (bottom-left): starts near-upright, tilts left/down on scroll
      if (phone1Ref.current) {
        const rotateZ = -8 - progress * 28;   // -8deg → -36deg
        const rotateX = 5 + progress * 12;    // 5deg → 17deg
        const translateY = 0 + progress * 60; // drifts down
        const translateX = 0 - progress * 30; // drifts left
        phone1Ref.current.style.transform = `perspective(1400px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
      }

      // Phone 2 (top-right): starts upright, tilts right on scroll
      if (phone2Ref.current) {
        const rotateZ = 5 + progress * 20;    // 5deg → 25deg
        const rotateX = 2 + progress * 10;    // 2deg → 12deg
        const translateY = 0 - progress * 40; // drifts up
        const translateX = 0 + progress * 20; // drifts right
        phone2Ref.current.style.transform = `perspective(1400px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateX(${translateX}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[240vh] bg-[#F6F5F1] overflow-hidden"
    >
         <div className="w-full flex flex-col items-center justify-center text-center px-6 pt-34 pb-20">
        <h1 className="text-4xl lg:text-5xl xl:text-[4rem] font-normal text-[#2C2C2C] leading-[1.2] tracking-tight max-w-6xl mb-5">
          Unlock adaptive, proactive coaching<br />
          with Google Health Premium
        </h1>
        <p className="text-lg lg:text-3xl text-[#4A4A4A] leading-relaxed mb-6">
          Meet your Google Health Coach,<br />
          built with Gemini<sup className="text-xs">1</sup>
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-lg font-medium hover:underline underline-offset-4 transition-all"
        >
          See how it works
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <div className="relative w-full max-w-8xl mx-auto px-8 lg:px-40 min-h-screen flex flex-col lg:flex-row items-center justify-between"> 
        <div className="flex-shrink-0 w-full lg:w-[42%] pt-22 lg:pt-0 z-30">
          <h2 className="text-4xl lg:text-5xl xl:text-[4rem] font-normal text-[#1C1B1F] leading-[1.15] tracking-tight mb-6">
            Have a question<br />
            about your health<br />
            and wellness?
          </h2>
          <p className="text-base lg:text-xl text-[#3C3C3C] leading-relaxed mb-8 max-w-sm">
            Users can ask Google Health Coach anything, anytime.{" "}
            Get evidence-backed answers and tailored insights based on your data.
          </p>
          <button className="bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-medium px-7 py-3 rounded-full transition-colors duration-200 shadow-sm">
            Book A Consultation
          </button>
        </div>

        {/* Right: Phones — absolutely positioned to overflow edges */}
        <div className="absolute inset-0 pointer-events-none">

          {/* Phone 2 — top-right, starts upright, partially cropped at top/right */}
          <div
            ref={phone2Ref}
            className="absolute pointer-events-auto"
            style={{
              width: "600px",
              top: "180px",
              right: "320px",
              transform: "perspective(1400px) rotateZ(5deg) rotateX(8deg)",
              transition: "transform 0.08s linear",
              willChange: "transform",
            }}
          >
            <img
              src={screen2}
              alt="Google Health Coach chat interface"
              className="w-full drop-shadow-2xl rounded-[2.8rem]"
            />
          </div>

          {/* Phone 1 — lower-center-right, tilted, partially cropped at bottom */}
          <div
            ref={phone1Ref}
            className="absolute pointer-events-auto"
            style={{
              width: "600px",
              bottom: "-630px",
              left: "330px",
              transform: "perspective(1400px) rotateZ(-8deg) rotateX(5deg)",
              transition: "transform 0.08s linear",
              willChange: "transform",
            }}
          >
            <img
              src={screen1}
              alt="Google Health app showing sleep analysis"
              className="w-full drop-shadow-2xl rounded-[2.8rem]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}