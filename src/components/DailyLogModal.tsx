import React, { useState, useEffect } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { FlowIntensity, MoodType, SymptomSeverity } from '../types';
import { SYMPTOM_OPTIONS, MOOD_DEFINITIONS } from '../data/initialData';
import {
  X,
  Calendar,
  Smile,
  Droplet,
  Sparkles,
  Save,
  Trash2,
  Heart,
  Moon,
  Droplets,
  AlertCircle
} from 'lucide-react';

export const DailyLogModal: React.FC = () => {
  const {
    dailyLogModalOpen,
    setDailyLogModalOpen,
    selectedDateForLog,
    setSelectedDateForLog,
    getDailyLogForDate,
    saveDailyLog,
    savePeriod,
    periods,
    user
  } = useSakhi();

  if (!dailyLogModalOpen) return null;

  const existingLog = getDailyLogForDate(selectedDateForLog);
  const existingPeriod = periods.find(
    p => selectedDateForLog >= p.startDate && selectedDateForLog <= p.endDate
  );

  // Form states
  const [mood, setMood] = useState<MoodType | undefined>(existingLog?.mood);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingLog?.symptoms || []);
  const [symptomSeverity, setSymptomSeverity] = useState<Record<string, SymptomSeverity>>(
    existingLog?.symptomSeverity || {}
  );
  const [energyLevel, setEnergyLevel] = useState<number>(existingLog?.energyLevel || 3);
  const [sleepHours, setSleepHours] = useState<number>(existingLog?.sleepHours || 7.5);
  const [waterGlasses, setWaterGlasses] = useState<number>(existingLog?.waterGlasses || 6);
  const [notes, setNotes] = useState<string>(existingLog?.notes || '');
  const [flow, setFlow] = useState<FlowIntensity | 'none'>(existingPeriod?.flow || 'none');

  const toggleSymptom = (symId: string) => {
    if (selectedSymptoms.includes(symId)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symId));
      const next = { ...symptomSeverity };
      delete next[symId];
      setSymptomSeverity(next);
    } else {
      setSelectedSymptoms(prev => [...prev, symId]);
      setSymptomSeverity(prev => ({ ...prev, [symId]: 'mild' }));
    }
  };

  const changeSeverity = (symId: string, sev: SymptomSeverity) => {
    setSymptomSeverity(prev => ({ ...prev, [symId]: sev }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Save Daily Log
    saveDailyLog({
      date: selectedDateForLog,
      mood,
      symptoms: selectedSymptoms,
      symptomSeverity,
      energyLevel,
      sleepHours,
      waterGlasses,
      notes: notes.trim() || undefined
    });

    // If flow is selected (and not 'none') and no period exists for this date, log a 1-day or update period
    if (flow !== 'none') {
      if (!existingPeriod) {
        savePeriod({
          startDate: selectedDateForLog,
          endDate: selectedDateForLog,
          flow: flow as FlowIntensity,
          notes: 'Logged from daily calendar'
        });
      }
    }

    setDailyLogModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-rose-100 shadow-2xl space-y-6 my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-rose-950">
                Daily Health & Symptom Log
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="date"
                  value={selectedDateForLog}
                  onChange={e => setSelectedDateForLog(e.target.value)}
                  className="text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setDailyLogModalOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Period Bleeding / Flow on this day */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70 space-y-2.5">
            <label className="block text-xs font-bold text-rose-950 uppercase tracking-wider">
              Menstrual Flow on this Date
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'spotting', label: 'Spotting' },
                { id: 'light', label: 'Light' },
                { id: 'medium', label: 'Medium' },
                { id: 'heavy', label: 'Heavy' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFlow(item.id as any)}
                  className={`py-2 text-xs rounded-xl border font-medium transition-all ${
                    flow === item.id
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Mood for the Day */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Daily Mood
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MOOD_DEFINITIONS.map(m => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id as MoodType)}
                    className={`py-2 px-1 text-xs rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? `${m.bg} ring-2 ring-rose-400 scale-102 font-semibold`
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[11px] truncate w-full text-center">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Physical Symptoms & Severity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Symptoms Logged
              </label>
              <span className="text-[11px] text-stone-400">
                Tap to select, then specify severity
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(s => {
                const isSelected = selectedSymptoms.includes(s.id);
                const currentSev = symptomSeverity[s.id] || 'mild';

                return (
                  <div key={s.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      className={`px-3 py-1.5 rounded-l-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white border-rose-600 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>

                    {isSelected && (
                      <select
                        value={currentSev}
                        onChange={e => changeSeverity(s.id, e.target.value as SymptomSeverity)}
                        className="text-[11px] py-1.5 px-1.5 bg-rose-50 border-y border-r border-rose-300 text-rose-900 rounded-r-xl font-medium focus:outline-none"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Mod</option>
                        <option value="severe">Sev</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Energy & Sleep */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                Energy Level ({energyLevel}/5)
              </span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyLevel}
                onChange={e => setEnergyLevel(Number(e.target.value))}
                className="w-full cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                Sleep (Hours)
              </span>
              <input
                type="number"
                step="0.5"
                min="2"
                max="14"
                value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
              />
            </div>
          </div>

          {/* 5. Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notable bodily changes, foods, or thoughts today..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setDailyLogModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-full shadow-xs shadow-rose-200 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Day Log
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
