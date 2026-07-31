import React, { useState } from "react";

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" />
      </svg>
    ),
    href: "#",
  },
  {
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.521a2.994 2.994 0 0 0-2.107 2.12A31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.12c1.886.521 9.391.521 9.391.521s7.505 0 9.391-.521a2.994 2.994 0 0 0 2.107-2.12A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.6 15.568V8.432L15.818 12 9.6 15.568z" />
      </svg>
    ),
    href: "#",
  },
];

const linkGroups = [
  {
    title: "Pages",
    links: ["Home", "Community", "Our App", "Blogs", "FAQ", "Webinars"],
  },
  {
    title: "Resources",
    links: ["Health Calculator", "Links"],
  },
  {
    title: "Programs",
    links: [
      "Prenatal Fitness",
      "Postnatal Recovery",
      "Nutrition Plans",
      "Mind & Body",
    ],
  },
];

const policyLinks = ["Privacy Policy", "Terms of Service Policy"];

export default function Footer() {
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (title) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  return (
    <footer className="w-full bg-black text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
      `}</style>

      {/* Top section */}
      <div className="px-5 sm:px-10 lg:px-16 pt-12 sm:pt-20 pb-10 sm:pb-16">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 sm:gap-12">
          {/* Left: brand + socials */}
          <div className="flex flex-col justify-between max-w-xs">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                Stronger Moms,
                <br />
                Healthier Families.
              </h2>
              <p className="mt-3 sm:mt-4 text-sm text-white/50 leading-relaxed">
                Join a community built for every stage of motherhood.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 sm:mt-10">
              {SOCIAL_LINKS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-teal-400 hover:text-black transition-colors shrink-0"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: link columns */}
          <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 gap-x-6 sm:gap-x-10 lg:gap-x-20 gap-y-0 sm:gap-y-10 divide-y divide-white/10 sm:divide-y-0">
            {linkGroups.map((group) => {
              const isOpen = openGroup === group.title;
              return (
                <div key={group.title} className="py-4 sm:py-0">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between sm:pointer-events-none"
                  >
                    <h3 className="text-teal-400 text-sm font-medium">
                      {group.title}
                    </h3>
                    <svg
                      className={`w-4 h-4 text-teal-400 transition-transform sm:hidden ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <ul
                    className={`space-y-3 overflow-hidden transition-all sm:!max-h-none sm:!opacity-100 sm:mt-4 ${
                      isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 sm:opacity-100"
                    }`}
                  >
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-white/80 hover:text-teal-400 transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom wordart section */}
      <div className="relative overflow-hidden border-t border-white/10 h-[100px] sm:h-[260px] lg:h-[240px]">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none pt-12 absolute left-1/2 -translate-x-1/2 -top-3 sm:-top-8 lg:-top-14 uppercase text-white/[0.1] leading-none whitespace-nowrap text-[22vw] sm:text-[19vw] lg:text-[15vw] tracking-tight"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          FITMOMCLUB
        </span>

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-5 sm:px-10 lg:px-16 py-4 sm:py-6">
          <p className="text-[11px] sm:text-xs text-white/40 text-center sm:text-left">
            2026 FitMomClub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {policyLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] sm:text-xs text-white/50 hover:text-teal-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}