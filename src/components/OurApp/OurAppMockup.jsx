import React from "react";
import img1 from "../../assets/our app/mockup-left.png"
import img2 from "../../assets/our app/mockup-right.png"
import img3 from "../../assets/our app/mockup-mid.png"

const LEFT_SRC = img1;
const CENTER_SRC = img3;
const RIGHT_SRC = img2;

function Placeholder({ label }) {
  return (
    <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 "
      style={{ background: "linear-gradient(135deg, #e0e0e8, #4db8a5)" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#a78bfa" />
        <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[11px] text-[#888] text-center px-4 font-poppins">{label}</p>
    </div>
  );
}

export default function PhoneMockupSection() {
  return (
    <section className="w-full flex flex-col items-center bg-[#F6F5F1]">
      <div className="relative flex items-end justify-center w-full max-w-[900px]"
        style={{ height: "clamp(300px, 55vw, 540px)" ,transform:"translateY(-10%)"}}>

        {/* Left image */}
        <div
          className="absolute z-[1]"
          style={{
            bottom: "0%",
            left: "45%",
            transform: "translateX(-50%) translateX(clamp(-100px, -23vw, -210px))",
            width: "clamp(100px, 22vw, 220px)",
            height: "clamp(210px, 46vw, 500px)",
            filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.18))",
          }}
        >
          {LEFT_SRC ? (
            <img src={LEFT_SRC} alt="App screen 1" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 1" />
          )}
        </div>

        {/* Center image */}
        <div
          className="absolute z-[3]"
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(120px, 26vw, 250px)",
            height: "clamp(250px, 54vw, 510px)",
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.22))",
          }}
        >
          {CENTER_SRC ? (
            <img src={CENTER_SRC} alt="App screen 2" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 2" />
          )}
        </div>

        {/* Right image */}
        <div
          className="absolute z-[1]"
          style={{
            bottom: "0%",
            left: "45%",
            transform: "translateX(-50%) translateX(clamp(100px, 23vw, 210px)) ",
            width: "clamp(100px, 22vw, 220px)",
            height: "clamp(210px, 46vw, 500px)",
            filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.18))",
          }}
        >
          {RIGHT_SRC ? (
            <img src={RIGHT_SRC} alt="App screen 3" className="w-full h-full object-contain" />
          ) : (
            <Placeholder label="Mockup image 3" />
          )}
        </div>

      </div>
      <div className="max-w-3xl mx-auto ">
        <p className="font-semibold text-lg text-center text-black/50">
            At FitMom Club, we believe in a unique, personalized approach to fitness. We begin by assessing your fitness level, health conditions, and personal goals to design a plan just for you. With tailored workouts and expert guidance, we help you achieve sustainable results in your wellness journey.
        </p>
      </div>
    </section>
  );
}