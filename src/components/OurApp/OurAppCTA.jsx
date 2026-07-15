import React from "react";

import img from '../../assets/our app/mockupcta.png'
export default function CTASection({
  eyebrow= "Get the FitMom Club App",
  imageSrc= img,
  imageAlt= "Person holding the FitMom Club app",

  left= {
    heading: "Download for Android",
    ctaLabel: "Get it on Android",
    onClick: () => {},
  },

  right= {
    heading: "Download for iPhone",
    ctaLabel: "Download on iOS",
    onClick: () => {},
  },
}) {
  return (
    <section className="w-full bg-neutral-100 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        {eyebrow && (
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-6 sm:mb-8">
            {eyebrow}
          </h2>
        )}

        {/* Card */}
        <div
          className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] min-h-[500px] sm:min-h-[520px]"
          style={{
            background:
              "linear-gradient(120deg, #e7e7ec 0%, #dcdce1 32%, #7fbcae 62%, #0f766e 100%)",
          }}
        >
          {/* Text + CTA layer */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 px-6 sm:px-10 md:px-12 pt-12 sm:pt-14 md:pt-16">
            {/* Left CTA block */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-xl sm:text-4xl font-semibold leading-snug text-neutral-900 max-w-xl">
                {left.heading}
              </h3>
              <button
                type="button"
                onClick={left.onClick}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
              >
                {left.ctaLabel}
              </button>
            </div>

            {/* Right CTA block */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <h3 className="text-xl sm:text-4xl font-semibold leading-snug text-white max-w-xl">
                {right.heading}
              </h3>
              <button
                type="button"
                onClick={right.onClick}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                {right.ctaLabel}
              </button>
            </div>
          </div>

          {/* Image layer — anchored to the bottom of the card */}
          <div className="absolute inset-x-0 bottom-0 z-0 flex justify-center pointer-events-none">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-auto w-[22rem] sm:w-[28rem] md:w-[32rem] lg:w-[36rem] xl:w-[40rem] max-w-[90%] object-contain object-bottom select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}