import React from 'react'
import demo from "../../assets/aboutus/demo.webp"
import demo2 from "../../assets/aboutus/demo1.jpg"
import demo3 from "../../assets/aboutus/demo2.webp"


export default function AboutUsSecondSection() {
  return (
    <div>
        <section className="w-full px-2 md:px-12 lg:px-20 pb-12">
        {/* ── Hero text ── */}
        <div className="max-w-5xl lg:max-w-5xl relative z-50 w-full mx-auto flex flex-col items-center md:px-8 px-2 md:pt-10 pb-6 md:pb-28 lg:flex-row lg:items-start lg:justify-between ">
          <h2
            className="text-center md:text-left text-black font-normal leading-[0.95] tracking-[-0.04em] pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
            }}
          >
            Who We Are
          </h2>
          <div className="md:flex hidden flex-col items-center mt-6 lg:items-start lg:mt-0 lg:max-w-[36%] lg:pt-4 xl:pt-4 2xl:pl-16">
<p className="text-black font-normal leading-[1.6] tracking-[.04rem] mb-3 text-[13px] text-center md:text-left lg:text-[14px] xl:text-[1rem]"> 
FitMom Club is a women-first wellness platform offering expert-led fitness, nutrition, and holistic wellness programs tailored for every stage of a woman's journey—from pregnancy to lifelong health.            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 md:pt-20 ">
          {/* ── Row 1: Text left, two stacked images right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 md:mb-24">
            {/* Left — text */}
            <div className="flex flex-col gap-4">
                <h2
            className="text-center md:text-left text-teal-700 font-normal leading-[0.95] tracking-[-0.04em] pb-4 md:pb-1"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-2 md:pt-16">
            {/* Left — large image */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={demo3}
                alt="Team collaborating"
                className="w-full h-[320px] object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            </div>

            {/* Right — text */}
            <div className="flex flex-col gap-6">
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
              We spoke with hundreds of coaches and gym owners and heard the same thing every time: too many tools, too much admin, and not enough time to coach clients.
              </p>
              <p
                className="text-black leading-loose text-justify md:text-left"
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw, 1.2rem)",
                }}
              >
                That’s why we built <strong>SmartCoach360</strong>, an all-in-one platform for coaching businesses. Manage clients, communication, payments, scheduling, and programs in one seamless system built to help coaches grow and scale efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
