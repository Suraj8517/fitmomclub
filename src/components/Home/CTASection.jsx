import heroBg from "../../assets/home/hero.webp";

export default function CTASection() {
  return (
    <section className="relative w-full h-[70vh] md:h-[75vh] lg:h-screen overflow-hidden font-['Poppins',sans-serif]">

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
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-6 pb-10 md:px-14 md:pb-16 lg:px-20 lg:pb-20 w-full max-w-3xl">

        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight mb-3 sm:mb-6 drop-shadow-md">
          Not Sure Which Program is Right for You?
        </h1>

        <p className="text-white text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 max-w-prose">
          Discover the perfect plan tailored to your wellness journey. Take our quick quiz to get personalised recommendations, or contact us for expert guidance.
        </p>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
  <a
    href="#"
    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-medium transition-colors duration-200 shadow-md"
  >
    Consult With Our Experts
  </a>

  <a
    href="#"
    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#2C2C2C] text-sm font-medium transition-colors duration-200 shadow-md"
  >
    Explore Our Latest Blog Posts
  </a>
</div>

      </div>
    </section>
  );
}