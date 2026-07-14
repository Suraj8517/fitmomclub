import React from 'react'
import CurrentWebinar from './currentWebinar';
const img = "https://res.cloudinary.com/q1vba78b/image/upload/v1783676813/Website-FitMom-Momentum-League-1536x763_on7z30.jpg";

export default function 
() {
  return (
    <div className='min-h-[50vh]'>
        <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #3a93d6 0%, #3a93d6 20%, #6db8f0 40%, #a8d4f5 60%, #dbeeff 80%, #ffffff 96%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-400px",
            right: "-200px",
            width: "840px",
            height: "740px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 75%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "10%",
            left: "-60px",
            width: "720px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 75%)",
            filter: "blur(35px)",
            pointerEvents: "none",
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-10 sm:py-16 2xl:pb-4 flex flex-row min-h-[280px] sm:min-h-[420px]">
          <div className=" max-w-xl text-center mx-auto pt-16 sm:pt-28 lg:pt-44">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-neutral-900 leading-tight mb-3 sm:mb-4" style={{ letterSpacing: "-0.5px" }}>
              Live Webinars<br/> & Expert Sessions
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-xl ml-auto">
              Empower Your Journey with Knowledge and Support
            </p>
          </div>
        </div>
      </section>
      <CurrentWebinar/>
    </div>
  )
}
