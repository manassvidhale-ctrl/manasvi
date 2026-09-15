import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { PREGNANCY_WEEKS, getWeekData } from '../utils/pregnancyData';
import { addDays, formatDate } from '../utils/cycleCalculations';
import {
  Baby,
  Calendar,
  Sparkles,
  Heart,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Apple,
  Clock,
  Feather
} from 'lucide-react';

export const PregnancyTrackerView: React.FC = () => {
  const {
    user,
    pregnancyCalc,
    togglePregnancyMode,
    todayStr,
    isDiscreetMode
  } = useSakhi();

  const [inputLmp, setInputLmp] = useState(user?.lmpDate || addDays(todayStr, -140));
  const [selectedWeek, setSelectedWeek] = useState<number>(pregnancyCalc?.currentWeek || 20);

  const activeWeekData = getWeekData(selectedWeek);

  const handleUpdateLmp = (e: React.FormEvent) => {
    e.preventDefault();
    togglePregnancyMode(true, inputLmp);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Baby className="w-3.5 h-3.5" />
            <span>Maternal Wellness & Journey</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Pregnancy Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Follow your baby's growth week-by-week, celebrate milestones, and nurture your body.
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-2">
          {user?.pregnancyMode ? (
            <button
              onClick={() => togglePregnancyMode(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Exit Pregnancy Mode
            </button>
          ) : (
            <button
              onClick={() => togglePregnancyMode(true, inputLmp)}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Baby className="w-4 h-4" />
              Activate Pregnancy Mode
            </button>
          )}
        </div>
      </div>

      {/* LMP Setting & Pregnancy Calculation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100/60">
          <div>
            <h2 className="font-display text-lg font-bold text-purple-950">
              Your Pregnancy Timeline
            </h2>
            <p className="text-xs text-stone-500">
              Enter your Last Menstrual Period (LMP) to calculate your gestational age and due date.
            </p>
          </div>

          <form onSubmit={handleUpdateLmp} className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-600 whitespace-nowrap">
              LMP Date:
            </label>
            <input
              type="date"
              value={inputLmp}
              onChange={e => setInputLmp(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
            >
              Update
            </button>
          </form>
        </div>

        {/* Current Gestational Status Overview */}
        {pregnancyCalc ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <span className="text-[11px] font-medium text-purple-700 block mb-1">
                Current Gestation
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-purple-950">
                  {isDiscreetMode ? '••' : `Week ${pregnancyCalc.currentWeek}`}
                </span>
                <span className="text-[11px] text-purple-600">
                  +{pregnancyCalc.currentDayInWeek} days
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100">
              <span className="text-[11px] font-medium text-pink-700 block mb-1">
                Trimester Stage
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-pink-950">
                  Trimester {pregnancyCalc.trimester}
                </span>
                <span className="text-[11px] text-stone-500">
                  ({pregnancyCalc.trimester === 1 ? 'Weeks 1–13' : pregnancyCalc.trimester === 2 ? 'Weeks 14–27' : 'Weeks 28–40+'})
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] font-medium text-amber-700 block mb-1">
                Estimated Due Date
              </span>
              <div className="font-display text-lg font-bold text-amber-950">
                {isDiscreetMode ? 'Private' : pregnancyCalc.dueDate}
              </div>
              <span className="text-[10px] text-stone-500">
                (Naegele's Rule: 280 days)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
              <span className="text-[11px] font-medium text-rose-700 block mb-1">
                Countdown
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-rose-950">
                  {isDiscreetMode ? '••' : pregnancyCalc.daysRemaining}
                </span>
                <span className="text-[11px] text-stone-600">days until baby arrives</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Enter your LMP above to begin calculating your personalized week and due date.</span>
          </div>
        )}

        {/* 40-Week Timeline Progress Bar */}
        {pregnancyCalc && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-stone-600 font-semibold">
              <span>Trimester 1 (Weeks 1–13)</span>
              <span>Trimester 2 (Weeks 14–27)</span>
              <span>Trimester 3 (Weeks 28–40)</span>
            </div>
            <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-500 rounded-full transition-all"
                style={{ width: `${pregnancyCalc.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Conception / LMP</span>
              <span className="font-bold text-purple-900">
                Week {pregnancyCalc.currentWeek} ({pregnancyCalc.progressPercent}% completed)
              </span>
              <span>Full Term (Week 40)</span>
            </div>
          </div>
        )}
      </div>

      {/* Week-by-Week Interactive Explorer */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-rose-950">
              Week-by-Week Development Guide
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select any week to explore your baby's anatomy, size comparisons, and bodily shifts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeek(prev => Math.max(4, prev - 1))}
              disabled={selectedWeek <= 4}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 disabled:opacity-30"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-purple-950 px-2">
              Week {selectedWeek}
            </span>
            <button
              onClick={() => setSelectedWeek(prev => Math.min(40, prev + 1))}
              disabled={selectedWeek >= 40}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 disabled:opacity-30"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week Selector Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PREGNANCY_WEEKS.map(w => {
            const isSelected = selectedWeek === w.week;
            const isCurrent = pregnancyCalc?.currentWeek === w.week;
            return (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs shadow-purple-200 scale-105'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{w.fruitEmoji}</span>
                  <span>W{w.week}</span>
                </div>
                {isCurrent && (
                  <span className="text-[9px] block text-purple-200 font-medium">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Week Detailed Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-6">
          {/* Baby Size Visual Highlight */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/90 border border-white shadow-xs flex items-center justify-center text-4xl shrink-0">
                {activeWeekData.fruitEmoji}
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-purple-700">
                  Week {activeWeekData.week} Milestone • Trimester {activeWeekData.trimester}
                </span>
                <h3 className="font-display text-2xl font-bold text-rose-950 mt-0.5">
                  Baby is the size of a {activeWeekData.babySize}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-600 mt-2 font-medium">
                  <span>Approx Length: <strong>{activeWeekData.babyLength}</strong></span>
                  <span>•</span>
                  <span>Approx Weight: <strong>{activeWeekData.babyWeight}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Development & Bodily Shifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baby's Development */}
            <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>What's Happening With Baby</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {activeWeekData.development}
              </p>
            </div>

            {/* Mother's Bodily Changes */}
            <div className="p-5 rounded-2xl bg-stone-50/70 border border-stone-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Changes in Your Body</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {activeWeekData.momChanges}
              </p>
            </div>
          </div>

          {/* Weekly Wellness Tip */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <Feather className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-950 block">
                Sakhi's Gentle Wellness Suggestion:
              </span>
              <p className="text-emerald-900/90 leading-relaxed mt-0.5">
                {activeWeekData.wellnessTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crucial Medical Advice Disclaimer */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-5 flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold">Educational Wellness Information Only</h4>
          <p className="text-amber-800 leading-relaxed">
            Sakhi Care provides educational and informational support for tracking your wellness. This information does not constitute clinical medical advice, prenatal diagnosis, or emergency healthcare. Always discuss any symptoms, medications, or health concerns directly with your qualified obstetrician, midwife, or certified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};
