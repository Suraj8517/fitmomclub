import heroBg from "../../assets/home/hero.webp"; 

export default function CTASection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-screen overflow-hidden font-['Poppins',sans-serif]">

      {/* Background image */}
      <img
        src={heroBg}
        alt="Woman wearing a fitness tracker"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark gradient overlay — bottom-left only */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 md:px-14 md:pb-16 lg:px-20 lg:pb-20 max-w-3xl">

        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight mb-6 drop-shadow-md">
          Start your personalized health journey
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Primary CTA */}
          <a
            href="#"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-medium transition-colors duration-200 shadow-md"
          >
            Get Started Today
          </a>

          {/* Secondary CTA */}
          <a
            href="#"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#2C2C2C] text-sm font-medium transition-colors duration-200 shadow-md"
          >
            Shop devices
          </a>
        </div>

      </div>
    </section>
  );
}