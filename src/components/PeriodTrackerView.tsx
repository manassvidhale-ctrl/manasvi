import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { FlowIntensity, PeriodLog } from '../types';
import { formatDate, parseDate, addDays, diffDays } from '../utils/cycleCalculations';
import { SYMPTOM_OPTIONS, MOOD_DEFINITIONS } from '../data/initialData';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Heart,
  Activity,
  AlertCircle,
  Trash2,
  Edit2,
  Droplet,
  Sparkles,
  Info
} from 'lucide-react';

export const PeriodTrackerView: React.FC = () => {
  const {
    periods,
    dailyLogs,
    user,
    cyclePrediction,
    cycleStats,
    savePeriod,
    deletePeriod,
    openDailyLogForDate,
    todayStr,
    isDiscreetMode
  } = useSakhi();

  // Calendar state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Direct Period entry form state
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState(todayStr);
  const [periodEndDate, setPeriodEndDate] = useState(addDays(todayStr, 4));
  const [periodFlow, setPeriodFlow] = useState<FlowIntensity>('medium');
  const [periodNotes, setPeriodNotes] = useState('');
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentYear = currentCalendarDate.getFullYear();
  const currentMonth = currentCalendarDate.getMonth();
  const monthName = currentCalendarDate.toLocaleString('default', { month: 'long' });

  // Generate calendar days
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleOpenAddPeriod = (existing?: PeriodLog) => {
    if (existing) {
      setEditingPeriodId(existing.id);
      setPeriodStartDate(existing.startDate);
      setPeriodEndDate(existing.endDate);
      setPeriodFlow(existing.flow);
      setPeriodNotes(existing.notes || '');
    } else {
      setEditingPeriodId(null);
      setPeriodStartDate(todayStr);
      setPeriodEndDate(addDays(todayStr, (user?.averagePeriodLength ?? 5) - 1));
      setPeriodFlow('medium');
      setPeriodNotes('');
    }
    setShowAddPeriodModal(true);
  };

  const handleSavePeriodForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodStartDate || !periodEndDate) return;

    if (periodEndDate < periodStartDate) {
      alert('End date cannot be earlier than start date');
      return;
    }

    savePeriod({
      id: editingPeriodId || undefined,
      startDate: periodStartDate,
      endDate: periodEndDate,
      flow: periodFlow,
      notes: periodNotes.trim() || undefined
    });

    setShowAddPeriodModal(false);
  };

  // Helper to check what attributes a calendar day has
  const getDayDetails = (dateStr: string) => {
    // Check if within logged periods
    const loggedPeriod = periods.find(p => dateStr >= p.startDate && dateStr <= p.endDate);
    
    // Check if predicted period (e.g. next predicted period start through + 5 days)
    const predictedStart = cyclePrediction.nextPeriodDate;
    const predictedEnd = addDays(predictedStart, (user?.averagePeriodLength ?? 5) - 1);
    const isPredictedPeriod = dateStr >= predictedStart && dateStr <= predictedEnd;

    // Check fertile window
    const isFertile = dateStr >= cyclePrediction.fertileWindowStart && dateStr <= cyclePrediction.fertileWindowEnd;
    const isOvulation = dateStr === cyclePrediction.ovulationDate;

    // Check if user has daily logs
    const log = dailyLogs[dateStr];
    const isToday = dateStr === todayStr;

    return {
      loggedPeriod,
      isPredictedPeriod,
      isFertile,
      isOvulation,
      log,
      isToday,
    };
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Cycle Intelligence</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Period & Cycle Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track your bleeding days, symptoms, and fertile windows with predictive accuracy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenAddPeriod()}
            id="log-period-modal-trigger-btn"
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm shadow-rose-200 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Log Period Dates
          </button>
        </div>
      </div>

      {/* Cycle Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block mb-1">
            Current Cycle Day
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-rose-950">
              {isDiscreetMode ? '••' : `Day ${cyclePrediction.cycleDay}`}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">
              ({cyclePrediction.phaseName})
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block mb-1">
            Next Predicted Period
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-purple-950">
              {isDiscreetMode ? 'Scheduled' : `In ${cyclePrediction.daysUntilNextPeriod} days`}
            </span>
            <span className="text-[11px] text-stone-500">
              ({cyclePrediction.nextPeriodDate})
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block mb-1">
            Fertile Window
          </span>
          <div className="text-xs font-bold text-pink-950 truncate">
            {isDiscreetMode ? 'Normal Range' : `${cyclePrediction.fertileWindowStart} → ${cyclePrediction.fertileWindowEnd}`}
          </div>
          <span className="text-[10px] text-stone-500 block mt-0.5">
            Ovulation: {cyclePrediction.ovulationDate}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block mb-1">
            Avg. Cycle Length
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-amber-950">
              {cycleStats.averageLength} Days
            </span>
            <span className="text-[11px] text-stone-500">
              (Regularity: {cycleStats.isRegular ? 'Regular' : 'Variable'})
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Calendar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
        {/* Calendar Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-rose-950">
              {monthName} {currentYear}
            </h2>
            <button
              onClick={() => setCurrentCalendarDate(new Date())}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              id="calendar-prev-month-btn"
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              id="calendar-next-month-btn"
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block shadow-2xs" />
            <span>Period Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-rose-400 bg-rose-50 inline-block" />
            <span>Predicted Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-100 border border-purple-300 inline-block" />
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-sm">✨</span>
            <span>Ovulation Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Symptoms Logged</span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {/* Day of week headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-semibold text-stone-400 py-1">
              {day}
            </div>
          ))}

          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl opacity-20" />
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const details = getDayDetails(dateStr);

            let bgClasses = 'bg-stone-50/70 hover:bg-stone-100 text-stone-700 border-stone-200/60';

            if (details.loggedPeriod) {
              bgClasses = 'bg-rose-500 text-white border-rose-600 font-semibold shadow-xs shadow-rose-200';
            } else if (details.isPredictedPeriod) {
              bgClasses = 'bg-rose-50 text-rose-800 border-2 border-dashed border-rose-300 font-medium';
            } else if (details.isOvulation) {
              bgClasses = 'bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-950 border-purple-300 font-semibold';
            } else if (details.isFertile) {
              bgClasses = 'bg-purple-50 text-purple-900 border-purple-200';
            }

            return (
              <button
                key={dateStr}
                onClick={() => openDailyLogForDate(dateStr)}
                id={`cal-day-${dateStr}`}
                className={`h-16 sm:h-20 p-1.5 rounded-2xl border transition-all flex flex-col justify-between items-center relative group ${bgClasses} ${
                  details.isToday ? 'ring-2 ring-rose-400 ring-offset-1' : ''
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-medium ${details.isToday ? 'font-bold' : ''}`}>
                    {dayNum}
                  </span>
                  {details.isOvulation && (
                    <span className="text-xs" title="Estimated Ovulation Day">
                      ✨
                    </span>
                  )}
                  {details.loggedPeriod && (
                    <Droplet className="w-3 h-3 fill-white/80 opacity-90" />
                  )}
                </div>

                {/* Badges / dots in cell */}
                <div className="w-full flex items-center justify-center gap-1">
                  {details.log?.mood && (
                    <span className="text-xs" title={`Mood: ${details.log.mood}`}>
                      {MOOD_DEFINITIONS.find(m => m.id === details.log?.mood)?.emoji}
                    </span>
                  )}
                  {details.log?.symptoms && details.log.symptoms.length > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                      title={`${details.log.symptoms.length} symptoms logged`}
                    />
                  )}
                </div>

                {/* Subtitle helper on hover */}
                <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity truncate w-full text-center">
                  Log Day
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cycle History & Regularity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cycle History List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-rose-950">
              Cycle History
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {periods.length} logged cycles
            </span>
          </div>

          {periods.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              No periods logged yet. Click "Log Period Dates" above to record your first cycle!
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {periods.map((p, idx) => {
                const duration = diffDays(p.endDate, p.startDate) + 1;
                // Calculate days since previous cycle start if available
                const nextNewer = periods[idx - 1];
                const cycleLength = nextNewer ? diffDays(nextNewer.startDate, p.startDate) : null;

                return (
                  <div key={p.id} className="py-3.5 flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
                        <Droplet className="w-4 h-4 fill-rose-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-950">
                          {p.startDate} to {p.endDate}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>Period: {duration} days</span>
                          <span>•</span>
                          <span className="capitalize">Flow: {p.flow}</span>
                          {cycleLength && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-rose-700">
                                Cycle Length: {cycleLength} days
                              </span>
                            </>
                          )}
                        </div>
                        {p.notes && (
                          <p className="text-[11px] text-stone-400 italic mt-0.5">
                            "{p.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenAddPeriod(p)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePeriod(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Visual Cycle Duration Graph & Regularity */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-rose-950 mb-1">
              Cycle Trends
            </h3>
            <p className="text-xs text-stone-500">
              Visual duration consistency across your recorded cycles.
            </p>

            {/* SVG Visual Bars */}
            <div className="mt-6 space-y-3">
              {periods.slice(0, 5).map((p, idx) => {
                const nextNewer = periods[idx - 1];
                const cycleLen = nextNewer ? diffDays(nextNewer.startDate, p.startDate) : user?.averageCycleLength ?? 28;
                const percent = Math.min(100, Math.max(20, (cycleLen / 40) * 100));

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-600">
                      <span>{p.startDate.slice(5)}</span>
                      <span className="font-semibold text-rose-950">{cycleLen} days</span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Anomaly / Doctor note if irregular */}
            {cycleStats.irregularityNote && (
              <div className="mt-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Educational Note:</span>
                  <span className="text-[11px] text-amber-800 leading-relaxed">
                    {cycleStats.irregularityNote}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Regular cycles typically range between 21 and 35 days.</span>
          </div>
        </div>

      </div>

      {/* Period Log Direct Modal */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-rose-100 shadow-xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-display text-lg font-bold text-rose-950">
                {editingPeriodId ? 'Edit Period Entry' : 'Log Period Dates'}
              </h3>
              <button
                onClick={() => setShowAddPeriodModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePeriodForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={periodStartDate}
                    onChange={e => setPeriodStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={periodEndDate}
                    onChange={e => setPeriodEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Flow Intensity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['spotting', 'light', 'medium', 'heavy'] as FlowIntensity[]).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setPeriodFlow(f)}
                      className={`py-2 text-xs rounded-xl border font-medium capitalize transition-all ${
                        periodFlow === f
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={periodNotes}
                  onChange={e => setPeriodNotes(e.target.value)}
                  placeholder="e.g. Mild cramps, started morning..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPeriodModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-full shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
