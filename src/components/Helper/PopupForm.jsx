/**
 * PopupForm.jsx
 * ------------------------------------------------------------------
 * React + Tailwind conversion of the "Custom Popup Form" WP plugin.
 *
 * USAGE
 * -----
 * 1. Mount it ONCE near the root of your app (e.g. in App.jsx or your
 *    root layout), so it lives on every page:
 *
 *      import PopupForm from "./PopupForm";
 *      <PopupForm scriptURL="https://script.google.com/macros/s/XXXX/exec" />
 *
 * 2. It auto-opens 3 seconds after the page/app mounts.
 *
 * 3. To open it from ANY button on ANY page, just add the attribute
 *    `data-cpf-trigger` to that button — no extra wiring needed:
 *
 *      <button data-cpf-trigger>Get a free consultation</button>
 *
 *    Clicking it waits 3 seconds (same delay as page load), then opens
 *    the popup. Change the delay via the `buttonDelay` prop.
 *
 * 4. It also re-opens automatically on every react-router-dom navigation
 *    (Link clicks, navigate(), back/forward) via useLocation() — no extra
 *    wiring needed. Because of that hook, PopupForm MUST be rendered
 *    inside your <BrowserRouter> (or <HashRouter>/<MemoryRouter>), e.g.:
 *
 *      <BrowserRouter>
 *        <PopupForm scriptURL="..." />
 *        <Routes>...</Routes>
 *      </BrowserRouter>
 *
 *    The very first render is skipped automatically (the page-load
 *    trigger already covers it) — it only fires again on subsequent
 *    route changes, after `routeChangeDelay` ms (default 3000). Set
 *    `enableRouteChangeTrigger={false}` to turn this off.
 *
 * 5. Requires Tailwind CSS to be configured in the host project.
 *    Only extra dependency is react-router-dom (icons are inline SVG).
 * ------------------------------------------------------------------
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

const COUNTRY_CODES = [
  { code: "+91", label: "India" },
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+61", label: "Australia" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+65", label: "Singapore" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+39", label: "Italy" },
  { code: "+81", label: "Japan" },
  { code: "+60", label: "Malaysia" },
  { code: "+66", label: "Thailand" },
  { code: "+62", label: "Indonesia" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+92", label: "Pakistan" },
  { code: "+880", label: "Bangladesh" },
  { code: "+27", label: "South Africa" },
  { code: "+254", label: "Kenya" },
  { code: "+34", label: "Spain" },
  { code: "+46", label: "Sweden" },
  { code: "+31", label: "Netherlands" },
  { code: "+41", label: "Switzerland" },
  { code: "+52", label: "Mexico" },
  { code: "+55", label: "Brazil" },
  { code: "+63", label: "Philippines" },
  { code: "+84", label: "Vietnam" },
  { code: "+90", label: "Turkey" },
  { code: "+20", label: "Egypt" },
  { code: "+974", label: "Qatar" },
  { code: "+968", label: "Oman" },
  { code: "+973", label: "Bahrain" },
];

const GOALS = [
  "Weight Management",
  "Health Issue Management",
  "Natural Conception/Fertility",
  "Currently Pregnant",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  countryCode: "",
  customCode: "",
  phone: "",
  gender: "",
  goal: "",
};

function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconChevron(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconPulse(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export default function PopupForm({
  scriptURL = "",
  title = "Get a plan built around you",
  subtitle = "Share a few details and our health consultant will reach out personally.",
  enablePageLoadTrigger = true,
  pageLoadDelay = 3000,
  buttonTriggerSelector = "[data-cpf-trigger]",
  buttonDelay = 3000,
  enableRouteChangeTrigger = true,
  routeChangeDelay = 3000,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const dialogRef = useRef(null);
  const pendingTimers = useRef([]);
  const isFirstRoute = useRef(true);
  const location = useLocation();
  const routeKey = location.pathname + location.search;

  const openPopup = useCallback(() => setIsOpen(true), []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    // reset after the close animation finishes
    window.setTimeout(() => {
      setForm(EMPTY_FORM);
      setStatus("idle");
      setTouched(false);
    }, 250);
  }, []);

  // ---- Triggers: page load (once) + any element with data-cpf-trigger ----
  useEffect(() => {
    if (enablePageLoadTrigger) {
      const t = window.setTimeout(openPopup, pageLoadDelay);
      pendingTimers.current.push(t);
    }

    const handleClick = (e) => {
      const trigger = e.target.closest(buttonTriggerSelector);
      if (!trigger) return;
      const t = window.setTimeout(openPopup, buttonDelay);
      pendingTimers.current.push(t);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      pendingTimers.current.forEach(window.clearTimeout);
      pendingTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Trigger: react-router-dom navigation change ----
  // Skips the very first render (that's already covered by the page-load
  // trigger above) and fires again every time the route changes after that.
  useEffect(() => {
    if (!enableRouteChangeTrigger) return;

    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    const t = window.setTimeout(openPopup, routeChangeDelay);
    pendingTimers.current.push(t);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  // ---- Escape to close + body scroll lock ----
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closePopup();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closePopup]);

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = () => {
    const codeOk =
      form.countryCode === "other" ? form.customCode.trim().length > 0 : !!form.countryCode;
    return (
      form.name.trim().length > 0 &&
      /^\S+@\S+\.\S+$/.test(form.email) &&
      codeOk &&
      /^[0-9]{7,12}$/.test(form.phone) &&
      !!form.gender &&
      !!form.goal
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid()) return;

    setStatus("submitting");
    const code = form.countryCode === "other" ? form.customCode : form.countryCode;

    try {
      if (scriptURL) {
        const body = new FormData();
        body.append("your-name", form.name);
        body.append("your-email", form.email);
        body.append("your-number", `${code}${form.phone}`);
        body.append("your-gender", form.gender);
        body.append("goal", form.goal);

        // Apps Script web apps don't return readable CORS responses,
        // so we fire-and-confirm rather than parse the response.
        await fetch(scriptURL, { method: "POST", mode: "no-cors", body });
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cpf-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#0B3B36]/60 backdrop-blur-sm animate-cpf-fade"
        onClick={closePopup}
      />

      {/* Card */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-[#FEFDFB] shadow-[0_30px_60px_-15px_rgba(11,59,54,0.35)] animate-cpf-scale overflow-hidden"
      >
        {/* top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0E7C74] via-[#3FA79A] to-[#E8A33D]" />

        <button
          onClick={closePopup}
          aria-label="Close popup"
          className="absolute right-3 top-5 rounded-full p-1.5 text-[#5B6B68] hover:bg-[#F1F8F6] hover:text-[#0B3B36] transition-colors"
        >
          <IconX className="h-5 w-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0E7C74]/10 text-[#0E7C74]">
                <IconCheck className="h-7 w-7" />
              </div>
              <h3 className="font-[var(--cpf-display)] text-xl text-[#0B3B36]">
                Thank you — you're all set
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6B68]">
                Our health consultant will reach out to you shortly. Please keep an
                eye on your phone and inbox.
              </p>
              <button
                onClick={closePopup}
                className="mt-6 rounded-full bg-[#0B3B36] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0E7C74] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start gap-3">
                <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E7C74]/10 text-[#0E7C74]">
                  <span className="absolute inset-0 animate-cpf-pulse rounded-full bg-[#0E7C74]/20" />
                  <IconPulse className="relative h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="cpf-title"
                    className="font-[var(--cpf-display)] text-xl leading-snug text-[#0B3B36] sm:text-2xl"
                  >
                    {title}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#5B6B68]">
                    {subtitle}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Field label="Full name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Enter your full name"
                    className={inputClass(touched && !form.name.trim())}
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="Enter your email"
                    className={inputClass(touched && !/^\S+@\S+\.\S+$/.test(form.email))}
                  />
                </Field>

                <Field label="Phone number" required>
                  <div className="flex gap-2">
                    <div className="relative w-[42%] shrink-0">
                      <select
                        value={form.countryCode}
                        onChange={setField("countryCode")}
                        className={selectClass(touched && !form.countryCode)}
                      >
                        <option value="" disabled>
                          Code
                        </option>
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.label})
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      <IconChevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B68]" />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength={7}
                      maxLength={12}
                      value={form.phone}
                      onChange={setField("phone")}
                      placeholder="Phone number"
                      className={inputClass(touched && !/^[0-9]{7,12}$/.test(form.phone))}
                    />
                  </div>
                  {form.countryCode === "other" && (
                    <input
                      type="text"
                      maxLength={5}
                      value={form.customCode}
                      onChange={setField("customCode")}
                      placeholder="Enter your country code"
                      className={inputClass(touched && !form.customCode.trim()) + " mt-2"}
                    />
                  )}
                </Field>

                <Field label="Gender" required>
                  <div className="flex gap-5 pt-1">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="flex cursor-pointer items-center gap-2 text-sm text-[#33413E]"
                      >
                        <input
                          type="radio"
                          name="cpf-gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={setField("gender")}
                          className="h-4 w-4 accent-[#0E7C74]"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="What is your primary goal?" required>
                  <div className="relative">
                    <select
                      value={form.goal}
                      onChange={setField("goal")}
                      className={selectClass(touched && !form.goal)}
                    >
                      <option value="" disabled>
                        Select primary goal
                      </option>
                      {GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <IconChevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B68]" />
                  </div>
                </Field>

                {touched && !isValid() && (
                  <p className="text-sm font-medium text-[#C4453B]">
                    Please fill all required fields correctly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm font-medium text-[#C4453B]">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#0B3B36] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0E7C74] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        :root { --cpf-display: 'Fraunces', ui-serif, Georgia, serif; }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        @keyframes cpf-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpf-scale { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes cpf-pulse { 0% { transform: scale(1); opacity: .55 } 70% { transform: scale(1.8); opacity: 0 } 100% { opacity: 0 } }

        .animate-cpf-fade { animation: cpf-fade .25s ease-out both; }
        .animate-cpf-scale { animation: cpf-scale .28s cubic-bezier(.16,1,.3,1) both; }
        .animate-cpf-pulse { animation: cpf-pulse 2.2s ease-out infinite; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#33413E]">
        {label} {required && <span className="text-[#C4453B]">*</span>}
      </span>
      {children}
    </label>
  );
}

function inputClass(invalid) {
  return [
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A2624] placeholder:text-[#9AA8A5]",
    "outline-none transition-colors focus:border-[#0E7C74] focus:ring-2 focus:ring-[#0E7C74]/20",
    invalid ? "border-[#E29892]" : "border-[#DCE6E3]",
  ].join(" ");
}

function selectClass(invalid) {
  return [
    "w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A2624]",
    "outline-none transition-colors focus:border-[#0E7C74] focus:ring-2 focus:ring-[#0E7C74]/20",
    invalid ? "border-[#E29892]" : "border-[#DCE6E3]",
  ].join(" ");
}