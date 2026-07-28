import React from "react";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Our App", href: "/our-app" },
  { label: "Success Stories", href: "/success-stories" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
    href: "#",
  },
  {
    label: "Facebook",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" />
      </svg>
    ),
    href: "#",
  },
  {
    label: "YouTube",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 0 0-2.107 2.12A31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.6 15.568V8.432L15.818 12 9.6 15.568z" />
      </svg>
    ),
    href: "#",
  },
];

const tags = ["Strength Training", "Prenatal Care", "Postnatal Recovery", "Nutrition", "Community"];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[linear-gradient(180deg,#F6F4F0_0%,#EAF6F4_25%,#D9EFEC_50%,#C6E5E1_75%,#B3DAD4_100%)] text-[#1F3D3A]">
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-16 sm:px-10 lg:px-12">
        {/* top row: social — headline — nav links */}
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-3">
          {/* Left: social */}
          <div className="order-2 flex justify-center gap-2.5 md:order-1 md:justify-start">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <Link
                key={label}
                to={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-700/30 text-[#1F3D3A] transition-colors hover:border-teal-700 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                {icon}
              </Link>
            ))}
          </div>

          {/* Center: headline (in place of logo) */}
          <div className="order-1 flex justify-center md:order-2">
            <h2 className="text-center font-bold leading-[1.1] tracking-tight text-[clamp(1.5rem,3.2vw,2.2rem)]">
              #1 Fitness &amp; Wellness
              <br />
              <span className="text-teal-700">Community for Moms</span>
              <span className="text-teal-700">.</span>
            </h2>
          </div>

          {/* Right: nav links */}
          <div className="order-3 flex flex-col items-center gap-2 md:items-end">
            <span className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800/70">
              Quick Links
            </span>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-[#1F3D3A] transition-colors hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 rounded-sm"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* credit row */}
        <div className="mt-16 border-t border-teal-800/15 pt-6 text-center">
          <p className="text-xs text-[#4E645F]">
            © {new Date().getFullYear()} FitMom Club. All rights reserved.
          </p>
        </div>

        {/* tagline + tags + legal links */}
        <div className="mt-6 flex flex-col items-center text-center">
          <p className="text-sm italic text-[#3A5B56]" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            Built by moms, for moms — every step of the way.
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs uppercase tracking-wide text-teal-800/70">
            {tags.map((tag, i) => (
              <li key={tag} className="flex items-center gap-3">
                {i !== 0 && <span className="h-1 w-1 rounded-full bg-teal-800/30" aria-hidden="true" />}
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-4 text-xs">
            <Link to="/privacy-policy" className="underline text-[#4E645F] hover:text-teal-700">
              Privacy Policy
            </Link>
            <span className="h-1 w-1 rounded-full bg-teal-800/30" aria-hidden="true" />
            <Link to="/terms-and-conditions" className="underline text-[#4E645F] hover:text-teal-700">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="absolute bottom-8 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-white shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 sm:right-10 lg:right-12"
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2} />
      </button>
    </footer>
  );
}