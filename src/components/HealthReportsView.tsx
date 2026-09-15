import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { diffDays } from '../utils/cycleCalculations';
import { DailyLog } from '../types';
import { SYMPTOM_OPTIONS, MOOD_DEFINITIONS } from '../data/initialData';
import {
  FileBarChart,
  Printer,
  Download,
  AlertTriangle,
  Calendar,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';

export const HealthReportsView: React.FC = () => {
  const {
    user,
    periods,
    dailyLogs,
    cycleStats,
    todayStr,
    isDiscreetMode
  } = useSakhi();

  const [timeframe, setTimeframe] = useState<'3m' | '6m' | 'all'>('3m');

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // Symptom frequencies
  const allLogs: DailyLog[] = Object.values(dailyLogs);
  const symptomFrequencies: Record<string, number> = {};
  allLogs.forEach(l => {
    if (l.symptoms) {
      l.symptoms.forEach(s => {
        symptomFrequencies[s] = (symptomFrequencies[s] || 0) + 1;
      });
    }
  });

  const sortedSymptoms = Object.entries(symptomFrequencies).sort((a, b) => b[1] - a[1]);

  // Mood counts
  const moodCounts: Record<string, number> = {};
  allLogs.forEach(l => {
    if (l.mood) {
      moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
    }
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Health Intelligence</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Health Reports & Summaries
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Synthesized insights of your cycles, symptom patterns, and mood trends ready for doctor consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe selector */}
          <div className="flex items-center bg-stone-100 p-1 rounded-full text-xs font-medium">
            <button
              onClick={() => setTimeframe('3m')}
              className={`px-3 py-1 rounded-full transition-all ${
                timeframe === '3m' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setTimeframe('6m')}
              className={`px-3 py-1 rounded-full transition-all ${
                timeframe === '6m' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1 rounded-full transition-all ${
                timeframe === 'all' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              All Records
            </button>
          </div>

          <button
            onClick={handlePrint}
            id="print-health-report-btn"
            className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF Report
          </button>
        </div>
      </div>

      {/* Doctor-Ready Printable Report Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Printable Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-rose-950">
                Sakhi Care
              </span>
              <span className="text-xs bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-md border border-rose-200">
                Women's Health Summary
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Generated on {todayStr} • Patient: <strong>{user?.name || 'User'}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-stone-500">
            <div>Scope: {timeframe === '3m' ? 'Last 90 Days' : timeframe === '6m' ? 'Last 180 Days' : 'Full Tracked History'}</div>
            <div className="text-emerald-700 font-medium">Confidential Health Record</div>
          </div>
        </div>

        {/* Anomaly & Pattern Notice Box (Crucial for clinical context without diagnosing) */}
        {cycleStats.irregularityNote ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-950">
              <h4 className="font-bold">Clinical Pattern Observation for Consultation</h4>
              <p className="text-amber-900 leading-relaxed">
                {cycleStats.irregularityNote}
              </p>
              <p className="text-[11px] text-amber-800/90 mt-1 italic">
                *Reminder: Sakhi Care provides educational insights and does not diagnose conditions. Please bring this summary to your gynecologist or healthcare provider.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cycle rhythms show consistent regularity within standard clinical ranges (21–35 days).</span>
          </div>
        )}

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-medium text-stone-500 block">Total Cycles</span>
            <div className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              {periods.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-medium text-stone-500 block">Average Cycle Length</span>
            <div className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              {cycleStats.averageLength} Days
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-medium text-stone-500 block">Shortest / Longest</span>
            <div className="font-display text-xl font-bold text-stone-900 mt-0.5">
              {cycleStats.shortestLength}d / {cycleStats.longestLength}d
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-medium text-stone-500 block">Average Bleeding Days</span>
            <div className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              {user?.averagePeriodLength ?? 5} Days
            </div>
          </div>
        </div>

        {/* Section 1: Cycle History Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-display text-base font-bold text-rose-950 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>Menstrual Cycle History</span>
          </h3>

          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4">Start Date</th>
                  <th className="py-2.5 px-4">End Date</th>
                  <th className="py-2.5 px-4">Bleeding Duration</th>
                  <th className="py-2.5 px-4">Flow Intensity</th>
                  <th className="py-2.5 px-4">Cycle Length</th>
                  <th className="py-2.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {periods.map((p, idx) => {
                  const duration = diffDays(p.endDate, p.startDate) + 1;
                  const nextNewer = periods[idx - 1];
                  const cycleLen = nextNewer ? diffDays(nextNewer.startDate, p.startDate) : null;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-4 font-semibold text-rose-950">{p.startDate}</td>
                      <td className="py-2.5 px-4">{p.endDate}</td>
                      <td className="py-2.5 px-4">{duration} days</td>
                      <td className="py-2.5 px-4 capitalize font-medium">{p.flow}</td>
                      <td className="py-2.5 px-4">
                        {cycleLen ? (
                          <span className="font-semibold text-purple-900">{cycleLen} days</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-stone-500 italic max-w-xs truncate">
                        {p.notes || 'None logged'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Symptoms Pattern & Frequency Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="font-display text-base font-bold text-rose-950 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Reported Symptoms Frequency</span>
            </h3>

            {sortedSymptoms.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-4">No symptoms logged in selected period.</p>
            ) : (
              <div className="space-y-2.5 pt-1">
                {sortedSymptoms.slice(0, 6).map(([symId, count]) => {
                  const def = SYMPTOM_OPTIONS.find(s => s.id === symId);
                  const percent = Math.min(100, Math.round((count / Math.max(1, allLogs.length)) * 100));

                  return (
                    <div key={symId} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-stone-800 flex items-center gap-1.5">
                          <span>{def?.emoji || '•'}</span>
                          <span>{def?.label || symId}</span>
                        </span>
                        <span className="font-semibold text-stone-600">
                          {count} times ({percent}% of days)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Mood Trends Chart */}
          <div className="p-5 rounded-2xl border border-stone-200 space-y-3">
            <h3 className="font-display text-base font-bold text-purple-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Emotional Wellbeing Overview</span>
            </h3>

            <div className="space-y-2.5 pt-1">
              {MOOD_DEFINITIONS.slice(0, 6).map(m => {
                const count = moodCounts[m.id] || 0;
                const percent = Math.round((count / Math.max(1, allLogs.length)) * 100);

                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800 flex items-center gap-1.5">
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </span>
                      <span className="font-semibold text-stone-600">
                        {count} days ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Sign-off */}
        <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 space-y-2">
          <p className="font-semibold text-stone-700">
            Physician Consultation Note:
          </p>
          <p className="leading-relaxed">
            This health summary was recorded by the user using the Sakhi Care mobile/web platform. Sakhi Care is a personal tracking companion and does not provide clinical diagnoses, clinical triage, or replace medical assessments. Healthcare providers should interpret this recorded pattern in conjunction with standard clinical examination and diagnostic criteria.
          </p>
          <p className="text-[11px] text-stone-400 pt-1">
            Generated with Sakhi Care • Safe, Private & Empowering Women's Wellness
          </p>
        </div>

      </div>
    </div>
  );
};
