import React from 'react'
import { Link } from 'react-router-dom'
import {
  Scale,
  Flame,
  CalendarHeart,
  Droplet,
  Beef,
  PieChart,
  Sparkles,
  CalendarDays,
  Baby,
  HeartPulse,
  UtensilsCrossed,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react'

const data = [
  { calculator: "BMI Calculator", url: "bmi-calculator", description: "Body mass from height & weight", icon: Scale },
  { calculator: "BMR Calculator", url: "bmr-calculator", description: "Calories burned at rest", icon: Flame },
  { calculator: "Menstrual Calculator", url: "menstrual-calculator", description: "Track your cycle dates", icon: CalendarHeart },
  { calculator: "Water Intake Calculator", url: "water-intake-calculator", description: "Daily hydration target", icon: Droplet },
  { calculator: "Protein Intake Calculator", url: "protein-intake-calculator", description: "Daily protein needs", icon: Beef },
  { calculator: "Body Fat Calculator", url: "body-fat-calculator", description: "Estimate body fat %", icon: PieChart },
  { calculator: "Ovulation Calculator", url: "ovulation-calculator", description: "Find your fertile window", icon: Sparkles },
  { calculator: "Menstrual Cycle Calculator", url: "menstrual-cycle-calculator", description: "Predict upcoming cycles", icon: CalendarDays },
  { calculator: "Pregnancy Calculator", url: "pregnancy-calculator", description: "Due date & milestones", icon: Baby },
  { calculator: "Heart Rate Calculator", url: "heart-rate-calculator", description: "Target training zones", icon: HeartPulse },
  { calculator: "Calorie Calculator", url: "calorie-calculator", description: "Daily energy needs", icon: UtensilsCrossed },
  { calculator: "Weight Loss Calculator", url: "weight-loss-calculator", description: "Plan your goal weight", icon: TrendingDown },
]

export default function HealthCalculators() {
  return (
    <section className="min-h-screen bg-stone-50 font-body py-16 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <p className="font-mono-data text-xs tracking-widest text-stone-400 uppercase mb-1">Health tools</p>
        <h1 className="font-display text-3xl font-semibold text-stone-900 mb-8">Health Calculators</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.url}
                to={`/${item.url}`}
                className="group relative flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-teal-500 transition-colors" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">{item.calculator}</h2>
                  <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}