import React from 'react';
import { useSakhi } from '../context/SakhiContext';
import {
  Calendar,
  Baby,
  Smile,
  FileBarChart,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const HomeHero: React.FC = () => {
  const { setActiveTab, setPrivacyModalOpen } = useSakhi();

  const features = [
    {
      id: 'period',
      icon: '🌸',
      title: 'Period Tracking',
      desc: 'Accurately track start and end dates, predict upcoming cycles, identify fertile & ovulation days, and log flow intensity.',
      tag: 'Cycle Insights',
      bgGrad: 'from-rose-50 to-pink-50/70',
      borderCol: 'border-rose-200/70',
      btnLabel: 'Track Cycle'
    },
    {
      id: 'pregnancy',
      icon: '🤰',
      title: 'Pregnancy Tracking',
      desc: 'Follow your 40-week miraculous journey with gestational milestones, cute baby fruit sizes, trimester updates, and wellness tips.',
      tag: 'Week by Week',
      bgGrad: 'from-amber-50/60 to-rose-50/60',
      borderCol: 'border-amber-200/70',
      btnLabel: 'Explore Pregnancy'
    },
    {
      id: 'mood',
      icon: '💗',
      title: 'Mood Tracking',
      desc: 'Connect emotional shifts and energy levels with your hormonal cycle. Enjoy guided 4-7-8 relaxation and compassionate self-care.',
      tag: 'Mind & Body',
      bgGrad: 'from-purple-50 to-pink-50/60',
      borderCol: 'border-purple-200/70',
      btnLabel: 'Log Daily Mood'
    },
    {
      id: 'reports',
      icon: '📊',
      title: 'Health Reports',
      desc: 'Generate clear, doctor-friendly summaries of your cycle trends, symptoms, and regularity. Download or print before your appointments.',
      tag: 'Doctor-Ready',
      bgGrad: 'from-indigo-50/60 to-purple-50/60',
      borderCol: 'border-indigo-200/70',
      btnLabel: 'View Reports'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-16 rounded-3xl bg-gradient-to-b from-rose-100/50 via-purple-50/40 to-[#FCF9F9] border border-rose-100/80 shadow-xs">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-rose-200/40 to-purple-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-amber-100/50 to-rose-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
          {/* Gentle Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-rose-200/80 text-rose-800 text-xs font-semibold shadow-xs mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>A Safe, Private Women’s Health Companion</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-rose-950 leading-[1.15]">
            “Your health. Your cycle. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-600 via-purple-700 to-rose-700 bg-clip-text text-transparent">
              Your Sakhi.”
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            A caring companion for tracking periods, pregnancy, moods, and women’s wellness.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              id="hero-start-tracking-btn"
              className="px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              Start Tracking
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('sakhi-features-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-explore-features-btn"
              className="px-6 py-3.5 rounded-full text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-rose-200 shadow-xs transition-all hover:border-rose-300"
            >
              Explore Features
            </button>
          </div>

          {/* Privacy & Trust Bar */}
          <div className="mt-10 pt-6 border-t border-rose-200/50 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Private & Local-First Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
              <span>Compassionate, Non-Judgmental</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Clinically Responsible Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="sakhi-features-section" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Carefully Designed for Every Chapter of Your Life
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Intuitive tools crafted to honor your bodily rhythms with dignity, clarity, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div
              key={f.id}
              id={`feature-card-${f.id}`}
              className={`p-6 rounded-2xl bg-gradient-to-b ${f.bgGrad} border ${f.borderCol} shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 rounded-xl bg-white/80 border border-white shadow-xs">
                    {f.icon}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/80 text-stone-700 border border-stone-200/60">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-rose-950 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5">
                <button
                  onClick={() => setActiveTab(f.id as any)}
                  className="w-full text-xs font-semibold text-rose-900 group-hover:text-rose-600 flex items-center justify-between transition-colors"
                >
                  <span>{f.btnLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explanatory Core Value Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 border border-rose-100/90 p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-700">
            Our Purpose
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-rose-950 leading-snug">
            “Sakhi Care helps you understand your body and build healthier habits through simple, personalized tracking.”
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Your body speaks in subtle signals—temperature, mood shifts, cycle timing, and energy. We turn those daily clues into gentle wisdom so you feel supported every single day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-xl bg-white/80 border border-rose-100 shadow-xs">
              <div className="flex items-center gap-2 font-semibold text-xs text-rose-950 mb-1">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Zero Judgment</span>
              </div>
              <p className="text-xs text-stone-500">
                A warm sanctuary where every feeling, cramp, or craving is met with care.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-purple-100 shadow-xs">
              <div className="flex items-center gap-2 font-semibold text-xs text-purple-950 mb-1">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Doctor-Friendly</span>
              </div>
              <p className="text-xs text-stone-500">
                Summarize your cycles and symptoms into structured reports for medical checkups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-indigo-100 shadow-xs">
              <div className="flex items-center gap-2 font-semibold text-xs text-indigo-950 mb-1">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Private & Secure</span>
              </div>
              <p className="text-xs text-stone-500">
                Your sensitive personal health data belongs exclusively to you.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="text-xs text-stone-500 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors"
            >
              Read our Privacy Policy and Educational Health Care Disclaimer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
