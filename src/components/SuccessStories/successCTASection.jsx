export default function ShareYourStorySection() {
  return (
    <section
      className="relative overflow-hidden px-5 py-20 sm:px-10 md:px-16 md:py-22 lg:px-20 xl:px-24 2xl:px-32"
      style={{
        backgroundColor: "#ebeaea",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Poppins", sans-serif',
      }}
    >
     

      <div className="relative max-w-3xl mx-auto text-center">
        <p
          className="text-[#6e6e73] text-sm md:text-base font-medium tracking-[0.01em] mb-4"
        >
          Share Your Story
        </p>

        <h2
          className="text-[#1d1d1f] text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6"
        >
          Inspire others with
          <br />
          your journey.
        </h2>

        <p className="text-[#6e6e73] text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 font-normal">
          Have you had a fitness breakthrough or wellness transformation?
          Your story could be the reason another mom starts hers.
        </p>

        <a
          href="https://g.co/kgs/FMyK9MP"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#009e8a] px-7 py-3.5 text-white text-base font-medium transition-colors duration-200 hover:bg-[#008776]"
        >
          Share Your Story Now
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}