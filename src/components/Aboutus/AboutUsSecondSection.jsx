import React from 'react'
import demo from "../../assets/aboutus/demo.webp"
import demo2 from "../../assets/aboutus/demo1.jpg"
import demo3 from "../../assets/aboutus/demo2.webp"


export default function AboutUsSecondSection() {
  return (
    <div>
        <section className="w-full px-2 md:px-12 lg:px-20 pb-12">
    

        <div className="max-w-7xl mx-auto px-8 md:pt-50 ">
          {/* ── Row 1: Text left, two stacked images right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 md:mb-24">
            {/* Left — text */}
            <div className="flex flex-col gap-4 ">
                <h2
            className="text-center md:text-left text-teal-700 font-normal leading-[0.95] tracking-[-0.04em] pt-12 sm:pt-4 pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3rem)",
            }}
          >
            Our Vision
          </h2>
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
Our vision is to empower women and mothers to prioritize their health, strength, and well-being at every stage of life through accessible and sustainable holistic wellness. We aspire to transform the lives of over 1 million people and help reduce lifestyle diseases caused by obesity through education, fitness, and healthy living.              </p>
              
            </div>

            {/* Right — two images side by side */}
            <div className="hidden md:flex gap-3 items-start">
              <div className="w-1/2 rounded-2xl overflow-hidden">
                <img
                  src={demo2}
                  alt="Platform demo"
                  className="w-full h-[320px] object-cover object-center"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>
              <div className="w-3/4 rounded-2xl overflow-hidden">
                <img
                  src={demo}
                  alt="Platform demo 2"
                  className="w-full h-[320px] object-cover"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>
            </div>
          </div>

          {/* ── Row 2: Large image left, text right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-2 md:pt-16 mb-20">
            {/* Left — large image */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={demo3}
                alt="Team collaborating"
                className="w-full h-[350px] object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            </div>

            {/* Right — text */}
            <div className="flex flex-col gap-6 ">
              <h2
            className="text-center md:text-left text-teal-700 font-normal leading-[0.95] tracking-[-0.04em] pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 3rem)",
            }}
          >
            Our Mission
          </h2>
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
Our mission is to empower healthier lifestyles through personalised fitness, nutrition, and wellness guidance. We help individuals achieve their health goals with expert support and sustainable habits.
</p>
 <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
We promote the idea of food as medicine and strive to raise awareness about the importance of balanced nutrition, physical fitness, and overall well-being.
</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
