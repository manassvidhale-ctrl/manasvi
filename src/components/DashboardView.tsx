import React from 'react';
import { useSakhi } from '../context/SakhiContext';
import { getWeekData } from '../utils/pregnancyData';
import { MOOD_DEFINITIONS, SYMPTOM_OPTIONS } from '../data/initialData';
import {
  Calendar,
  Baby,
  Smile,
  FileBarChart,
  Sparkles,
  Droplets,
  Plus,
  ArrowRight,
  Heart,
  Clock,
  Check,
  AlertCircle,
  Shield,
  Activity
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    cyclePrediction,
    pregnancyCalc,
    periods,
    dailyLogs,
    todayStr,
    setActiveTab,
    openDailyLogForDate,
    isDiscreetMode,
    togglePregnancyMode,
    saveDailyLog,
    getDailyLogForDate
  } = useSakhi();

  const todayLog = getDailyLogForDate(todayStr);
  const currentMoodObj = MOOD_DEFINITIONS.find(m => m.id === todayLog?.mood);
  const pregnancyWeekData = pregnancyCalc ? getWeekData(pregnancyCalc.currentWeek) : null;

  // Quick increment water glasses
  const handleAddWater = () => {
    const current = todayLog?.waterGlasses ?? 0;
    saveDailyLog({
      date: todayStr,
      mood: todayLog?.mood,
      symptoms: todayLog?.symptoms ?? [],
      symptomSeverity: todayLog?.symptomSeverity ?? {},
      energyLevel: todayLog?.energyLevel ?? 3,
      waterGlasses: Math.min(12, current + 1),
      sleepHours: todayLog?.sleepHours,
      notes: todayLog?.notes,
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-50/90 via-purple-50/70 to-pink-50/60 p-6 rounded-3xl border border-rose-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Sanctuary</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Welcome, {user ? user.name.split(' ')[0] : 'Friend'} 🌸
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {' • '}Here is your holistic wellness snapshot for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openDailyLogForDate(todayStr)}
            id="dashboard-log-today-btn"
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-xs shadow-rose-200 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Log Today's Health
          </button>
        </div>
      </div>

      {/* Primary Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. Cycle Status Card */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-100">
                Menstrual Rhythm
              </span>
              <button
                onClick={() => setActiveTab('period')}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
              >
                Calendar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Circular / Phase Highlight */}
            <div className="my-3 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex flex-col items-center justify-center shadow-xs shadow-rose-200 shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Day</span>
                <span className="text-2xl font-bold leading-none">
                  {isDiscreetMode ? '••' : cyclePrediction.cycleDay}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-rose-950">
                  {isDiscreetMode ? 'Cycle Active' : cyclePrediction.phaseName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                  {cyclePrediction.phaseDescription}
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-rose-100/60 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  Next Predicted Period:
                </span>
                <span className="font-semibold text-rose-950">
                  {isDiscreetMode ? 'Scheduled' : `In ${cyclePrediction.daysUntilNextPeriod} days (${cyclePrediction.nextPeriodDate})`}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-purple-500" />
                  Fertile Window:
                </span>
                <span className="font-semibold text-purple-950">
                  {isDiscreetMode ? 'Normal' : `${cyclePrediction.fertileWindowStart} to ${cyclePrediction.fertileWindowEnd}`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3">
            <button
              onClick={() => setActiveTab('period')}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Open Period Tracker
            </button>
          </div>
        </div>

        {/* 2. Pregnancy Journey Card (Or Toggle to Enable) */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-100">
                Pregnancy Journey
              </span>
              <button
                onClick={() => setActiveTab('pregnancy')}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              >
                Tracker <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pregnancyCalc && user?.pregnancyMode ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 text-white flex flex-col items-center justify-center shadow-xs shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Week</span>
                    <span className="text-xl font-bold leading-none">
                      {isDiscreetMode ? '••' : pregnancyCalc.currentWeek}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-purple-950">
                      Trimester {pregnancyCalc.trimester}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Baby size: {pregnancyWeekData?.fruitEmoji} {pregnancyWeekData?.babySize}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[11px] text-stone-500 font-medium">
                    <span>Progress ({pregnancyCalc.progressPercent}%)</span>
                    <span>Due: {isDiscreetMode ? 'Estimated' : pregnancyCalc.dueDate}</span>
                  </div>
                  <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all"
                      style={{ width: `${pregnancyCalc.progressPercent}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 italic mt-1 line-clamp-2">
                  Tip: {pregnancyWeekData?.wellnessTip}
                </p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
                  <Baby className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-purple-950">
                    Expecting or Planning?
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Track your pregnancy week-by-week with baby size illustrations and wellness milestones.
                  </p>
                </div>
                <button
                  onClick={() => togglePregnancyMode(true)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
                >
                  Activate Pregnancy Mode
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-purple-100/60">
            <button
              onClick={() => setActiveTab('pregnancy')}
              className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Open Pregnancy Tracker
            </button>
          </div>
        </div>

        {/* 3. Today's Mood & Symptoms Card */}
        <div className="p-6 rounded-3xl bg-white border border-amber-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                Emotional & Physical Check-in
              </span>
              <button
                onClick={() => setActiveTab('mood')}
                className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
              >
                Mood Hub <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Mood section */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-100">
                <span className="text-xs font-medium text-stone-600">Today's Mood:</span>
                {currentMoodObj ? (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${currentMoodObj.bg}`}>
                    <span>{currentMoodObj.emoji}</span>
                    <span>{currentMoodObj.label}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openDailyLogForDate(todayStr)}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    + Log Mood
                  </button>
                )}
              </div>

              {/* Recent Symptoms list */}
              <div>
                <span className="text-xs font-medium text-stone-600 block mb-1.5">
                  Logged Symptoms:
                </span>
                {todayLog?.symptoms && todayLog.symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {todayLog.symptoms.map(symId => {
                      const def = SYMPTOM_OPTIONS.find(s => s.id === symId);
                      const sev = todayLog.symptomSeverity?.[symId];
                      return (
                        <span
                          key={symId}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-rose-50 text-rose-900 border border-rose-200/70"
                        >
                          <span>{def?.emoji || '•'}</span>
                          <span>{def?.label || symId}</span>
                          {sev && (
                            <span className="text-[10px] text-rose-500 font-bold uppercase">
                              ({sev})
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    No symptoms recorded for today.
                  </p>
                )}
              </div>

              {/* Water glasses fast tracker */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-600 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  Hydration:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-800">
                    {todayLog?.waterGlasses ?? 0} / 8 glasses
                  </span>
                  <button
                    onClick={handleAddWater}
                    title="Add a glass of water"
                    className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-100/60">
            <button
              onClick={() => setActiveTab('mood')}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Open Mood Tracker
            </button>
          </div>
        </div>

      </div>

      {/* Quick Access Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-rose-950">
          Quick Access & Tools
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => setActiveTab('period')}
            id="quick-period-btn"
            className="p-4 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xs text-rose-950">Period Tracker</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Logs & Calendar</div>
          </button>

          <button
            onClick={() => setActiveTab('pregnancy')}
            id="quick-pregnancy-btn"
            className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Baby className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xs text-purple-950">Pregnancy Journey</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Week 1–40 Guide</div>
          </button>

          <button
            onClick={() => setActiveTab('mood')}
            id="quick-mood-btn"
            className="p-4 rounded-2xl bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xs text-pink-950">Mood & Self-Care</div>
            <div className="text-[11px] text-stone-500 mt-0.5">4-7-8 Breathing</div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            id="quick-reports-btn"
            className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xs text-indigo-950">Health Reports</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Doctor Summaries</div>
          </button>
        </div>
      </div>

      {/* Daily Caring Note & Gentle Reminder */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 border border-rose-100 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-400 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Heart className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-rose-950">
            A Gentle Note From Sakhi
          </h4>
          <p className="text-stone-600 leading-relaxed">
            Your body changes naturally across every week and season. Celebrate small moments of pause, drink pure water, and remember that restful sleep is essential medicine.
          </p>
        </div>
      </div>
    </div>
  );
};
