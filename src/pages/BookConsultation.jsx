import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Target, HeartPulse, Baby, Sparkles, Dumbbell, Wind, Bone,
  Clock3, BookOpen, Utensils, Frown, BatteryLow, Bandage, Wallet, SmilePlus,
  Droplet, Activity, Flame, CircleDot, Gauge, Droplets, Leaf, CheckCircle2, Plus,
  User, Ruler, Weight, Cake, ArrowRight, ArrowLeft,
  Phone, Mail, MapPin, Globe, Gift, PartyPopper, ChevronDown, Check, Footprints,
  Salad, ShieldCheck, Languages, Briefcase, Loader2, AlertCircle, RotateCcw
} from "lucide-react";

/* ---------------------------------- data ---------------------------------- */

const GOALS = [
  { v: "lose_weight_plan", label: "Lose weight with a personalized fitness & nutrition plan", icon: Target },
  { v: "lose_weight_condition", label: "Lose weight while managing PCOS, Thyroid, Diabetes, or other conditions", icon: HeartPulse },
  { v: "pregnancy", label: "Stay healthy and active during pregnancy", icon: Baby },
  { v: "postpartum", label: "Recover fitness after childbirth", icon: Sparkles },
  { v: "tone", label: "Tone your body and build lean muscle", icon: Dumbbell },
  { v: "flexibility", label: "Improve flexibility, mobility, and reduce stress", icon: Wind },
  { v: "bones", label: "Strengthen your bones and joints", icon: Bone },
];

const PAIN_POINTS = [
  { v: "no_time_exercise", label: "No time to exercise", icon: Clock3 },
  { v: "no_knowledge", label: "Lack of knowledge about balanced nutrition", icon: BookOpen },
  { v: "no_time_meals", label: "No time to prepare healthy meals at home", icon: Utensils },
  { v: "not_tasty", label: "Healthy food is not tasty", icon: Frown },
  { v: "no_motivation", label: "No motivation", icon: BatteryLow },
  { v: "injuries", label: "Physical injuries", icon: Bandage },
  { v: "expensive", label: "Fitness is expensive and inaccessible", icon: Wallet },
  { v: "not_fun", label: "Fitness is not fun", icon: SmilePlus },
];

const HEALTH_ISSUES = [
  { v: "diabetes", label: "Diabetes", icon: Droplet },
  { v: "thyroid", label: "Thyroid", icon: Activity },
  { v: "cholesterol", label: "Cholesterol", icon: Flame },
  { v: "pcos", label: "PCOS (for women)", icon: CircleDot },
  { v: "cardio", label: "Cardiovascular", icon: HeartPulse },
  { v: "dr", label: "Diastasis recti (DR)", icon: Activity },
  { v: "bp", label: "Blood pressure", icon: Gauge },
  { v: "anemia", label: "Anemia", icon: Droplets },
  { v: "allergies", label: "Allergies", icon: Leaf },
  { v: "other", label: "Other", icon: Plus },
  { v: "none", label: "None of these", icon: CheckCircle2 },
];

const BODY_PAIN = [
  { v: "knee", label: "Knee pain" },
  { v: "shoulder", label: "Shoulder pain" },
  { v: "back", label: "Back pain" },
  { v: "neck", label: "Neck pain" },
  { v: "ankle", label: "Ankle pain" },
  { v: "joint", label: "Joint pain" },
  { v: "none", label: "None" },
];

const WHY_NOW = [
  "Healthy lifestyle", "Wedding", "Prenatal care", "Postpartum recovery",
  "Trying to conceive", "Medical advice", "Other (specify)",
];

const TIMELINE = ["Immediately", "Within 15 days", "Within 1 month", "2 months", "Just exploring"];

const TRIED_BEFORE = ["No, first time", "Yes, currently looking to switch", "Yes, but dropped"];

const PROFESSIONS = [
  "Homemaker", "IT / Software", "Healthcare professional (doctor, nurse, physio)", "Teacher / Professor",
  "Banker / Finance", "Sales & marketing", "HR / Recruiter", "Engineer", "Government employee",
  "Defence / Police", "Other working professional", "Business owner", "Other",
];

const LANGUAGES = ["English", "Tamil", "Telugu", "Hindi", "Kannada", "Malayalam", "Other"];

const HOW_HEARD = ["Instagram – FitMom Club influencers", "Referred by a friend", "Google", "Website", "Other"];

const COUNTRIES = [
  "India","Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda",
  "Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Barbados","Belarus",
  "Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
  "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala",
  "Guinea","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos",
  "Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Madagascar",
  "Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia",
  "Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia",
  "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden",
  "Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago",
  "Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const cmToFtIn = (cm) => {
  const totalIn = Math.round(cm / 2.54);
  const ft = Math.floor(totalIn / 12);
  const inch = totalIn % 12;
  return `${ft} ft ${inch} in`;
};

const EMPTY_DATA = {
  goal: "", pain: "", health: [], healthOther: "", bodypain: [],
  whyNow: "", whyNowOther: "", timeline: "", triedBefore: "", commitment: 6,
  profession: "", language: "", gender: "", age: "",
  height: 165, weight: "", firstName: "", lastName: "",
  phone: "", email: "", city: "", country: "India",
  howHeard: "", referral: "",
};


const API_ENDPOINT = "https://example.com/api/consultations";

const DRAFT_KEY = "fitmom:consultation:draft";
const hasStorage = () => typeof window !== "undefined" && !!window.storage;

async function loadDraft() {
  if (!hasStorage()) return null;
  try {
    const res = await window.storage.get(DRAFT_KEY, false);
    return res ? JSON.parse(res.value) : null;
  } catch {
    return null;
  }
}

async function saveDraft(payload) {
  if (!hasStorage()) return;
  try {
    await window.storage.set(DRAFT_KEY, JSON.stringify(payload), false);
  } catch {
    /* non-fatal */
  }
}

async function clearDraft() {
  if (!hasStorage()) return;
  try {
    await window.storage.delete(DRAFT_KEY, false);
  } catch {
    /* non-fatal */
  }
}

async function archiveSubmission(data) {
  if (!hasStorage()) return;
  try {
    const id = `fitmom:consultation:submission:${Date.now()}`;
    await window.storage.set(id, JSON.stringify(data), false);
  } catch {
    /* non-fatal */
  }
}

async function submitToApi(data) {
  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res;
}

/* ------------------------------ illustrations ------------------------------- */

const STEP_ILLUSTRATIONS = {
  goal: { icon: Target, orbit: [Dumbbell, HeartPulse, Baby] },
  pain: { icon: Clock3, orbit: [Frown, BatteryLow, Utensils] },
  health: { icon: ShieldCheck, orbit: [HeartPulse, Droplet, Activity] },
  bodypain: { icon: Bandage, orbit: [Bone, Activity] },
  timing: { icon: Clock3, orbit: [Sparkles, Wind] },
  history: { icon: Gauge, orbit: [Footprints, Dumbbell] },
  profile: { icon: Briefcase, orbit: [Languages, User] },
  stats: { icon: Ruler, orbit: [Weight, Cake] },
  name: { icon: User, orbit: [Sparkles] },
  contact: { icon: Phone, orbit: [Mail] },
  location: { icon: MapPin, orbit: [Globe] },
  source: { icon: Gift, orbit: [Salad] },
};

/* ------------------------------- UI helpers -------------------------------- */

const SelectCard = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200
      ${active
        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] scale-[1.01]"
        : "border-[#E5E7EB] bg-white text-[#0A0A0A] hover:border-[#0EA5A0] hover:shadow-sm"}`}
  >
    {Icon && (
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors
        ${active ? "bg-white/15 text-[#4CD9CE]" : "bg-[#F0FBFA] text-[#0EA5A0] group-hover:bg-[#DFF6F4]"}`}>
        <Icon size={18} strokeWidth={2} />
      </span>
    )}
    <span className="text-[14.5px] leading-snug font-medium">{label}</span>
    {active && <Check size={18} className="ml-auto shrink-0 text-[#4CD9CE]" />}
  </button>
);

const Chip = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-150
      ${active
        ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-sm"
        : "border-[#E5E7EB] bg-white text-[#3F3F46] hover:border-[#0EA5A0]"}`}
  >
    {Icon && <Icon size={14} strokeWidth={2.25} />}
    {label}
  </button>
);

const Field = ({ label, required, children, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">
      {label}{required && <span className="text-[#0EA5A0]"> *</span>}
    </span>
    {children}
    {hint && <span className="mt-1 block text-[12px] text-[#9CA3AF]">{hint}</span>}
  </label>
);

const inputCls =
  "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-all placeholder:text-[#B4B8BE] focus:border-[#0EA5A0] focus:ring-4 focus:ring-[#0EA5A0]/12";

const SelectNative = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} appearance-none pr-10`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    <ChevronDown size={17} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
  </div>
);

/* --------------------------------- steps ----------------------------------- */
/* The form now opens directly on the first question (goal) — no welcome screen. */

const STEP_META = [
  { key: "goal", title: "Your goal" },
  { key: "pain", title: "Your biggest blocker" },
  { key: "health", title: "Health check" },
  { key: "bodypain", title: "Any body pain?" },
  { key: "timing", title: "Timing" },
  { key: "history", title: "Your history & drive" },
  { key: "profile", title: "About you" },
  { key: "stats", title: "Body stats" },
  { key: "name", title: "What should we call you?" },
  { key: "contact", title: "How can we reach you?" },
  { key: "location", title: "Where are you from?" },
  { key: "source", title: "Almost there" },
  { key: "review", title: "Review your answers" },
  { key: "done", title: "" },
];

const TOTAL_PROGRESS_STEPS = STEP_META.length - 1;

export default function BookConsultationForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [shake, setShake] = useState(false);
  const [data, setData] = useState(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const saveTimer = useRef(null);

  // restore any in-progress draft on load
  useEffect(() => {
    (async () => {
      const draft = await loadDraft();
      if (draft && draft.data) {
        setData({ ...EMPTY_DATA, ...draft.data });
        if (typeof draft.step === "number" && draft.step >= 0 && draft.step < STEP_META.length - 1) {
          setStep(draft.step);
        }
      }
      setHydrated(true);
    })();
  }, []);

  // autosave draft (debounced) whenever data or step changes
  useEffect(() => {
    if (!hydrated) return;
    if (step >= STEP_META.length - 1) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveDraft({ data, step });
      setSavedPulse(true);
      setTimeout(() => setSavedPulse(false), 1400);
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [data, step, hydrated]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggleMulti = (k, v, exclusiveNone) => {
    setData((d) => {
      let arr = d[k];
      if (exclusiveNone && v === "none") arr = arr.includes("none") ? [] : ["none"];
      else {
        arr = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr.filter((x) => x !== "none"), v];
      }
      return { ...d, [k]: arr };
    });
  };

  const progressIndex = Math.max(0, Math.min(step, TOTAL_PROGRESS_STEPS));
  const progressPct = (progressIndex / TOTAL_PROGRESS_STEPS) * 100;

  const isValid = useMemo(() => {
    switch (STEP_META[step].key) {
      case "goal": return !!data.goal;
      case "pain": return !!data.pain;
      case "health": return data.health.length > 0;
      case "bodypain": return data.bodypain.length > 0;
      case "timing": return !!data.whyNow && !!data.timeline;
      case "history": return !!data.triedBefore;
      case "profile": return !!data.profession && !!data.language && !!data.gender;
      case "stats": return !!data.age && !!data.weight;
      case "name": return !!data.firstName && !!data.lastName;
      case "contact": return /^\d{7,12}$/.test(data.phone) && /\S+@\S+\.\S+/.test(data.email);
      case "location": return !!data.city && !!data.country;
      case "source": return !!data.howHeard;
      default: return true;
    }
  }, [step, data]);

  const goNext = () => {
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 420);
      return;
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, STEP_META.length - 1));
  };
  const goBack = () => { setDir(-1); setSubmitError(""); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitToApi(data);
      await archiveSubmission(data);
      await clearDraft();
      setDir(1);
      setStep((s) => s + 1);
    } catch (err) {
      setSubmitError(
        "We couldn't reach the server. Your answers are saved on this device — please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = async () => {
    await clearDraft();
    setData(EMPTY_DATA);
    setDir(-1);
    setStep(0);
  };

  const meta = STEP_META[step];
  const illo = STEP_ILLUSTRATIONS[meta.key];

  return (
    <div className="flex pt-26 mb-16 h-screen w-full flex-col overflow-hidden bg-white font-[Inter] text-[#0A0A0A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .font-display { font-family: 'Manrope', 'Inter', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        @keyframes floatSlow { 0%,100%{ transform: translateY(0) scale(1);} 50%{ transform: translateY(-6px) scale(1.03);} }
        .blob1 { animation: floatSlow 6s ease-in-out infinite; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .spin-slow { animation: spin 18s linear infinite; }
        @keyframes breathe { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.07);} }
        .breathe { animation: breathe 2.6s ease-in-out infinite; }
        @keyframes floatOrbit { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-5px);} }
        .float-orbit { animation: floatOrbit 3s ease-in-out infinite; }
        @keyframes slideInR { from { opacity:0; transform: translateX(24px);} to { opacity:1; transform: translateX(0);} }
        @keyframes slideInL { from { opacity:0; transform: translateX(-24px);} to { opacity:1; transform: translateX(0);} }
        .step-in-r { animation: slideInR .36s cubic-bezier(.22,.68,0,1.01); }
        .step-in-l { animation: slideInL .36s cubic-bezier(.22,.68,0,1.01); }
        @keyframes shakeX { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .shake { animation: shakeX .4s; }
        @keyframes pop { 0%{ transform: scale(.6); opacity:0;} 60%{ transform: scale(1.08); opacity:1;} 100%{ transform: scale(1);} }
        .pop-in { animation: pop .5s cubic-bezier(.22,.68,0,1.01); }
        @keyframes confetti { 0%{ transform: translateY(0) rotate(0deg); opacity:1;} 100%{ transform: translateY(220px) rotate(540deg); opacity:0;} }
        .confetti-piece { animation: confetti 1.6s ease-in forwards; }
        @keyframes fadeInOut { 0%{opacity:0; transform:translateY(2px);} 15%{opacity:1; transform:translateY(0);} 85%{opacity:1;} 100%{opacity:0;} }
        .saved-pulse { animation: fadeInOut 1.4s ease; }
        input[type=range] { accent-color: #0EA5A0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 3px; }
      `}</style>

      {/* header */}
      {meta.key !== "done" && (
        <div className="shrink-0 bg-white/90 px-5 pb-3 pt-5 backdrop-blur sm:px-10">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
            <div className="mb-2 flex w-full items-center gap-3">
              <span className="font-mono text-[11px] tracking-wider text-[#9CA3AF]">
                {String(progressIndex + 1).padStart(2, "0")}/{String(TOTAL_PROGRESS_STEPS).padStart(2, "0")}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0F1F2]">
                <div
                  className="h-full rounded-full bg-[#0A0A0A] transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-[#9CA3AF]">
                {savedPulse && (
                  <span className="saved-pulse flex items-center gap-1 text-[#0EA5A0]">
                    <Check size={12} /> Saved
                  </span>
                )}
                <span className="hidden sm:inline">FitMom Club</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* content */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-10">
        <div className="mx-auto w-full max-w-2xl py-8">
          <div key={step} className={`${dir === 1 ? "step-in-r" : "step-in-l"} ${shake ? "shake" : ""}`}>
            {meta.key === "goal" && (
              <StepShell title="What's your primary health & fitness goal?" sub="Pick the one that matters most right now.">
                <div className="grid gap-2.5">
                  {GOALS.map((g) => (
                    <SelectCard key={g.v} icon={g.icon} label={g.label} active={data.goal === g.v} onClick={() => set("goal", g.v)} />
                  ))}
                </div>
              </StepShell>
            )}
            {meta.key === "pain" && (
              <StepShell title="What's stopping you the most?" sub="Your single biggest pain point today.">
                <div className="grid gap-2.5">
                  {PAIN_POINTS.map((p) => (
                    <SelectCard key={p.v} icon={p.icon} label={p.label} active={data.pain === p.v} onClick={() => set("pain", p.v)} />
                  ))}
                </div>
              </StepShell>
            )}
            {meta.key === "health" && (
              <StepShell title="Do any of these apply to you?" sub="Select all that are relevant — this helps us personalize safely.">
                <div className="flex flex-wrap gap-2">
                  {HEALTH_ISSUES.map((h) => (
                    <Chip key={h.v} icon={h.icon} label={h.label} active={data.health.includes(h.v)} onClick={() => toggleMulti("health", h.v, true)} />
                  ))}
                </div>
                {data.health.includes("other") && (
                  <input className={`${inputCls} mt-4`} placeholder="Tell us more…" value={data.healthOther} onChange={(e) => set("healthOther", e.target.value)} />
                )}
              </StepShell>
            )}
            {meta.key === "bodypain" && (
              <StepShell title="Any existing body pain?" sub="We'll design around it, not around a plan that hurts.">
                <div className="flex flex-wrap gap-2">
                  {BODY_PAIN.map((b) => (
                    <Chip key={b.v} label={b.label} active={data.bodypain.includes(b.v)} onClick={() => toggleMulti("bodypain", b.v, true)} />
                  ))}
                </div>
              </StepShell>
            )}
            {meta.key === "timing" && (
              <StepShell title="Why now — and how soon?" sub="Helps us match the right pace to your moment.">
                <Field label="Why do you want to start your fitness journey now?" required>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {WHY_NOW.map((w) => (
                      <SelectCard key={w} label={w} active={data.whyNow === w} onClick={() => set("whyNow", w)} />
                    ))}
                  </div>
                </Field>
                {data.whyNow === "Other (specify)" && (
                  <input className={`${inputCls} mt-3`} placeholder="Please specify" value={data.whyNowOther} onChange={(e) => set("whyNowOther", e.target.value)} />
                )}
                <div className="mt-6">
                  <Field label="How soon are you looking to implement a solution?" required>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINE.map((t) => (
                        <Chip key={t} label={t} active={data.timeline === t} onClick={() => set("timeline", t)} />
                      ))}
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "history" && (
              <StepShell title="Your history & your drive" sub="Two quick ones about your fitness journey so far.">
                <Field label="Have you tried online fitness platforms before?" required>
                  <div className="grid gap-2.5">
                    {TRIED_BEFORE.map((t) => (
                      <SelectCard key={t} label={t} active={data.triedBefore === t} onClick={() => set("triedBefore", t)} />
                    ))}
                  </div>
                </Field>
                <div className="mt-7">
                  <Field label="On a scale of 1–10, how committed are you to achieving your fitness goals?" required>
                    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[13px] text-[#9CA3AF]">Just exploring</span>
                        <span className="font-display text-3xl font-bold text-[#0EA5A0]">{data.commitment}</span>
                        <span className="text-[13px] text-[#9CA3AF]">All in</span>
                      </div>
                      <input
                        type="range" min={1} max={10} value={data.commitment}
                        onChange={(e) => set("commitment", Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "profile" && (
              <StepShell title="A little about you" sub="This helps us match you with the right coach.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Profession" required>
                    <SelectNative value={data.profession} onChange={(v) => set("profession", v)} options={PROFESSIONS} placeholder="Select profession" />
                  </Field>
                  <Field label="Preferred language" required>
                    <SelectNative value={data.language} onChange={(v) => set("language", v)} options={LANGUAGES} placeholder="Select language" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Gender" required>
                    <div className="flex gap-2.5">
                      {["Male", "Female"].map((g) => (
                        <button key={g} type="button" onClick={() => set("gender", g)}
                          className={`flex-1 rounded-xl border py-3 text-[14.5px] font-medium transition-all
                            ${data.gender === g ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E5E7EB] bg-white hover:border-[#0EA5A0]"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "stats" && (
              <StepShell title="Body stats" sub="Used only to tailor your fitness & nutrition plan.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Age" required>
                    <div className="relative">
                      <Cake size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input type="number" min={10} max={90} value={data.age} onChange={(e) => set("age", e.target.value)} className={`${inputCls} pl-10`} placeholder="Years" />
                    </div>
                  </Field>
                  <Field label="Weight" required hint="In kilograms">
                    <div className="relative">
                      <Weight size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input type="number" min={30} max={200} value={data.weight} onChange={(e) => set("weight", e.target.value)} className={`${inputCls} pl-10`} placeholder="kg" />
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <Field label="Height" required>
                    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[13px] text-[#9CA3AF]"><Ruler size={14} />120 cm</span>
                        <span className="font-display text-2xl font-bold text-[#0EA5A0]">{data.height} cm <span className="text-[15px] font-medium text-[#6B7280]">· {cmToFtIn(data.height)}</span></span>
                        <span className="text-[13px] text-[#9CA3AF]">200 cm</span>
                      </div>
                      <input type="range" min={120} max={200} value={data.height} onChange={(e) => set("height", Number(e.target.value))} className="w-full" />
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "name" && (
              <StepShell title="What should we call you?" sub="">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" required>
                    <div className="relative">
                      <User size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input value={data.firstName} onChange={(e) => set("firstName", e.target.value)} className={`${inputCls} pl-10`} placeholder="First name" />
                    </div>
                  </Field>
                  <Field label="Last name" required>
                    <input value={data.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} placeholder="Last name" />
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "contact" && (
              <StepShell title="How can we reach you?" sub="We'll send your free report and a call to confirm your slot.">
                <div className="grid gap-4">
                  <Field label="Phone number" required>
                    <div className="flex overflow-hidden rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#0EA5A0] focus-within:ring-4 focus-within:ring-[#0EA5A0]/12">
                      <span className="flex items-center gap-1.5 border-r border-[#E5E7EB] bg-[#FAFAFA] px-3 text-[15px] font-medium text-[#3F3F46]"><Phone size={14} />+91</span>
                      <input value={data.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} className="w-full bg-transparent px-4 py-3 text-[15px] outline-none" placeholder="Your number" />
                    </div>
                  </Field>
                  <Field label="Email address" required>
                    <div className="relative">
                      <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={`${inputCls} pl-10`} placeholder="you@example.com" />
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "location" && (
              <StepShell title="Where are you from?" sub="">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" required>
                    <div className="relative">
                      <MapPin size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input value={data.city} onChange={(e) => set("city", e.target.value)} className={`${inputCls} pl-10`} placeholder="Your city" />
                    </div>
                  </Field>
                  <Field label="Country" required>
                    <SelectNative value={data.country} onChange={(v) => set("country", v)} options={COUNTRIES} placeholder="Select country" />
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "source" && (
              <StepShell title="One last thing" sub="">
                <Field label="How did you get to know about FitMom Club?" required>
                  <div className="grid gap-2.5">
                    {HOW_HEARD.map((h) => (
                      <SelectCard key={h} label={h} active={data.howHeard === h} onClick={() => set("howHeard", h)} />
                    ))}
                  </div>
                </Field>
                <div className="mt-5">
                  <Field label="Referral code" hint="Optional">
                    <div className="relative">
                      <Gift size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input value={data.referral} onChange={(e) => set("referral", e.target.value)} className={`${inputCls} pl-10`} placeholder="If available" />
                    </div>
                  </Field>
                </div>
              </StepShell>
            )}
            {meta.key === "review" && (
              <Review data={data} onEdit={(s) => { setDir(-1); setSubmitError(""); setStep(s); }} error={submitError} />
            )}
            {meta.key === "done" && <Done name={data.firstName} onReset={startOver} />}
          </div>
        </div>
      </div>

      {/* footer */}
      {meta.key !== "done" && (
        <div className="shrink-0 border-t border-[#F0F1F2] bg-white/90 px-5 py-4 backdrop-blur sm:px-10">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
            <button type="button" onClick={goBack} disabled={submitting || step === 0} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-medium text-[#6B7280] transition-colors hover:bg-[#F5F5F5] disabled:opacity-40">
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={meta.key === "review" ? handleSubmit : goNext}
              disabled={submitting}
              className="group inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {meta.key === "review" ? (
                submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Confirm & submit
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ sub components ------------------------------ */

function StepShell({ title, sub, children }) {
  return (
    <div>
      <h2 className="font-display text-center text-[24px] font-bold leading-tight text-[#0A0A0A] sm:text-[28px]">{title}</h2>
      {sub && <p className="mt-1.5 text-center text-[14.5px] text-[#6B7280]">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F0F1F2] py-3 last:border-0">
      <div>
        <div className="text-[11.5px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{label}</div>
        <div className="mt-0.5 text-[14.5px] text-[#0A0A0A]">{value}</div>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 text-[12.5px] font-semibold text-[#0EA5A0] hover:underline">Edit</button>
    </div>
  );
}

function Review({ data, onEdit, error }) {
  const goalLabel = GOALS.find((g) => g.v === data.goal)?.label;
  const painLabel = PAIN_POINTS.find((p) => p.v === data.pain)?.label;
  const healthLabels = data.health.map((v) => HEALTH_ISSUES.find((h) => h.v === v)?.label).join(", ");
  const bodyPainLabels = data.bodypain.map((v) => BODY_PAIN.find((b) => b.v === v)?.label).join(", ");

  return (
    <StepShell title="Review your answers" sub="Everything look right? You can edit any section before submitting.">
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-5">
        <ReviewRow label="Goal" value={goalLabel} onEdit={() => onEdit(0)} />
        <ReviewRow label="Biggest blocker" value={painLabel} onEdit={() => onEdit(1)} />
        <ReviewRow label="Health issues" value={healthLabels} onEdit={() => onEdit(2)} />
        <ReviewRow label="Body pain" value={bodyPainLabels} onEdit={() => onEdit(3)} />
        <ReviewRow label="Why now / timeline" value={`${data.whyNow}${data.timeline ? " · " + data.timeline : ""}`} onEdit={() => onEdit(4)} />
        <ReviewRow label="Commitment" value={`${data.commitment}/10`} onEdit={() => onEdit(5)} />
        <ReviewRow label="Profession / language / gender" value={[data.profession, data.language, data.gender].filter(Boolean).join(" · ")} onEdit={() => onEdit(6)} />
        <ReviewRow label="Age / height / weight" value={`${data.age} yrs · ${data.height} cm (${cmToFtIn(data.height)}) · ${data.weight} kg`} onEdit={() => onEdit(7)} />
        <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`} onEdit={() => onEdit(8)} />
        <ReviewRow label="Phone / email" value={`+91 ${data.phone} · ${data.email}`} onEdit={() => onEdit(9)} />
        <ReviewRow label="Location" value={`${data.city}, ${data.country}`} onEdit={() => onEdit(10)} />
        <ReviewRow label="Heard via" value={data.howHeard} onEdit={() => onEdit(11)} />
      </div>
      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-[13.5px] text-[#B91C1C]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </StepShell>
  );
}

function Done({ name, onReset }) {
  const pieces = Array.from({ length: 14 });
  const colors = ["#0A0A0A", "#0EA5A0", "#4CD9CE", "#D1D5DB"];
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden text-center">
      <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2">
        {pieces.map((_, i) => (
          <span
            key={i}
            className="confetti-piece absolute h-2.5 w-2.5 rounded-sm"
            style={{
              left: `${(i - 7) * 16}px`,
              background: colors[i % colors.length],
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <h2 className="mt-4 font-display text-[28px] font-extrabold text-[#0A0A0A]">
        {name ? `You're all set, ${name}!` : "You're all set!"}
      </h2>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#6B7280]">
        Your free health &amp; fitness report is on its way. A FitMom Club coach will reach out shortly to confirm your consultation.
      </p>
      <div className="mt-7 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-3 font-mono text-[12.5px] text-[#6B7280]">
        Expect a call within 24 hours
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-[#F5F5F5]"
      >
        <RotateCcw size={14} /> Submit another response
      </button>
    </div>
  );
}