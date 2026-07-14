import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const NAV_LINKS = [
  { label: "About Us",links:"about-us" },
  { label: "Our Community", links:"community" },
];

const WHAT_WE_OFFER = [
  { label: "Success Stories",links:"success-stories" },
  { label: "Our App",links:"our-app" },
  { label: "Programs" },
  {label:"Webinars",links:"webinar"}
];

const RESOURCES = [
  { label: "Blogs" },
  { label: "Health Calculators" },
];

const SUPPORT = [
  { label: "FAQ",links:"FAQs" },
];

const DOWNLOAD_LINKS = [
  {
    label: "Download on App Store",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    label: "Get it on Google Play",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.18 23.76c.33.18.7.23 1.05.15l12.3-7.1-2.65-2.65-10.7 9.6zm-1.8-20.2C1.14 3.9 1 4.28 1 4.7v14.6c0 .42.14.8.38 1.14l.07.06 8.18-8.18v-.2L1.45 3.5l-.07.06zM20.34 10.3l-2.3-1.33-2.97 2.97 2.97 2.97 2.32-1.34c.66-.38.66-1.89-.02-2.27zM4.23.3L16.54 7.4 13.88 10.06 3.18.46C3.53.28 3.9.22 4.23.3z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const lastScrollY = useRef(0);
  const downloadRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);
      if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false);
        setMenuOpen(false);
        setDownloadOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target)) {
        setDownloadOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          visible ? "translate-y-0" : "-translate-y-full",
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-8xl mx-auto px-5 sm:px-12">
          <div className="flex items-center justify-between h-20 sm:h-28">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
             
              <span
                className={[
                  "font-semibold text-xl sm:text-2xl tracking-tight transition-colors duration-300",
                  scrolled ? "text-gray-800" : "text-white",
                ].join(" ")}
              >
                FitMom Club
              </span>
            </a>

            {/* Right side */}
            <div className="flex items-center gap-8">

              

              {/* Hamburger / X — with floating menu panel */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => { setMenuOpen((v) => !v); setDownloadOpen(false); }}
                  className={[
                    "flex items-center justify-center w-13 h-13 rounded-xl transition-colors duration-200",
                    scrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      : "bg-white/20 hover:bg-white/30 text-white",
                  ].join(" ")}
                  aria-label="Menu"
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4  14h16" />
                    )}
                  </svg>
                </button>

                {/* Floating dropdown card — anchored to the right of the hamburger */}
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-[#f5f0eb] rounded-2xl shadow-2xl border border-black/5 py-2 animate-fadeIn">

                    {/* Main nav links */}
                    <div className="px-5 pb-2">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.links}
                          className="block py-1.5 text-[15px] font-medium text-gray-800 hover:text-gray-500 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* What We Offer */}
                    <div className="border-t border-gray-200/70 px-5 pt-2 pb-2">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                        What We Offer
                      </p>
                      {WHAT_WE_OFFER.map((link) => (
                        <Link
                          key={link.label}
                          to={link.links}
                          className="block py-1.5 text-[15px] font-medium text-gray-800 hover:text-gray-500 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Resources */}
                    <div className="border-t border-gray-200/70 px-5 pt-2 pb-2">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                        Resources
                      </p>
                      {RESOURCES.map((link) => (
                        <a
                          key={link.label}
                          href="#"
                          className="block py-1.5 text-[15px] font-medium text-gray-800 hover:text-gray-500 transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>

                    {/* Support */}
                    <div className="border-t border-gray-200/70 px-5 pt-2">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
                        Support
                      </p>
                      {SUPPORT.map((link) => (
                        <Link
                           key={link.label}
                          to={link.links}
                          className="block py-1.5 text-[15px] font-medium text-gray-800 hover:text-gray-500 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                  </div>
                )}
              </div>
{/* Download button */}
              <div className="hidden sm:block relative" ref={downloadRef}>
                <button
                  onClick={() => { setDownloadOpen((v) => !v); setMenuOpen(false); }}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-base font-medium px-5 py-4.5 rounded-full transition-colors duration-200 shadow-sm"
                >
                  Download
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {downloadOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-fadeIn">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-4 pt-1 pb-2">
                      Get the app
                    </p>
                    {DOWNLOAD_LINKS.map((dl) => (
                      <a
                        key={dl.label}
                        href="#"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-500">{dl.icon}</span>
                        {dl.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.18s ease; }
      `}</style>
    </>
  );
}