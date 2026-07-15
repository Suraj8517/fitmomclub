import { Pin } from "lucide-react";
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
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" />
      </svg>
    ),
    href: "#",
  },
  {
    label: "YouTube",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 0 0-2.107 2.12A31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.6 15.568V8.432L15.818 12 9.6 15.568z" />
      </svg>
    ),
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 sm:px-10 lg:px-14 pt-16 pb-6 sm:pt-20 sm:pb-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Top row: headline + nav */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-6">
          {/* Left: headline + CTA */}
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold leading-[1.1] tracking-tight text-[clamp(2.2rem,7vw,4.5rem)]">
              #1 Fitness & Wellness 
              <br />
              <span className="text-teal-400">Community for Moms</span>
              <span className="text-teal-400">.</span>
            </h2>
          </div>

          {/* Right: nav links */}
          <nav className="flex flex-row flex-wrap gap-x-8 gap-y-3 lg:flex-col lg:items-end lg:gap-y-8 shrink-0">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-none hover:text-teal-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4 mt-16 sm:mt-20">
          {SOCIAL_LINKS.map(({ label, icon, href }) => (
            <Link
              key={label}
              to={href}
              aria-label={label}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-teal-400 transition-colors"
            >
              {icon}
            </Link>
          ))}
        </div>

        <hr className="border-zinc-700 mt-6 mb-5" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-400 text-center sm:text-left">
          <p className="m-0 order-1 sm:order-none">© 2026 FitMom Club. All rights reserved.</p>

         

          <p className="m-0 order-2 sm:order-none">
            <Link to="/privacy-policy" className="underline text-zinc-300 hover:text-white pr-4">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="underline text-zinc-300 hover:text-white ">
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}