import React, { useState, useEffect, useRef } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { MoodType, DailyLog } from '../types';
import { MOOD_DEFINITIONS } from '../data/initialData';
import {
  Smile,
  Sparkles,
  Heart,
  Droplets,
  Moon,
  Wind,
  Volume2,
  VolumeX,
  Play,
  Square,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';

export const MoodTrackerView: React.FC = () => {
  const {
    dailyLogs,
    saveDailyLog,
    todayStr,
    getDailyLogForDate,
    cyclePrediction,
    periods
  } = useSakhi();

  const todayLog = getDailyLogForDate(todayStr);

  // Form states for today's entry
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>(todayLog?.mood || 'calm');
  const [energyLevel, setEnergyLevel] = useState<number>(todayLog?.energyLevel || 3);
  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours || 7.5);
  const [waterCount, setWaterCount] = useState<number>(todayLog?.waterGlasses || 6);
  const [notes, setNotes] = useState<string>(todayLog?.notes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Synchronize when todayLog changes
  useEffect(() => {
    if (todayLog) {
      if (todayLog.mood) setSelectedMood(todayLog.mood);
      if (todayLog.energyLevel) setEnergyLevel(todayLog.energyLevel);
      if (todayLog.sleepHours) setSleepHours(todayLog.sleepHours);
      if (todayLog.waterGlasses) setWaterCount(todayLog.waterGlasses);
      if (todayLog.notes) setNotes(todayLog.notes);
    }
  }, [todayLog]);

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyLog({
      date: todayStr,
      mood: selectedMood,
      energyLevel,
      sleepHours,
      waterGlasses: waterCount,
      notes,
      symptoms: todayLog?.symptoms || [],
      symptomSeverity: todayLog?.symptomSeverity || {},
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  // --- 4-7-8 Breathing Guide Engine ---
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState<number>(4);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('Ready');
      return;
    }

    let currentPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
    let count = 4;
    setBreathPhase('Inhale');
    setBreathSecondsLeft(4);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setBreathSecondsLeft(count);
      } else {
        if (currentPhase === 'Inhale') {
          currentPhase = 'Hold';
          count = 7;
        } else if (currentPhase === 'Hold') {
          currentPhase = 'Exhale';
          count = 8;
        } else {
          currentPhase = 'Inhale';
          count = 4;
        }
        setBreathPhase(currentPhase);
        setBreathSecondsLeft(count);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // --- Web Audio API Soothing Sound Generator (Zero External Assets) ---
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gainNode?: GainNode } | null>(null);

  const toggleSound = () => {
    if (isAudioPlaying) {
      if (audioNodesRef.current?.gainNode && audioCtxRef.current) {
        audioNodesRef.current.gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        audioNodesRef.current?.osc1?.stop();
        audioNodesRef.current?.osc2?.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        audioNodesRef.current = null;
        setIsAudioPlaying(false);
      }, 500);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Warm binaural relaxation chime (432Hz harmonic tone)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime); // Soft A3 harmonic

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(432, ctx.currentTime); // Relaxing harmonic

        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        audioNodesRef.current = { osc1, osc2, gainNode };
        setIsAudioPlaying(true);
      } catch (e) {
        console.error('Audio init error', e);
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Compute Mood Distribution from logged days
  const allLogs: DailyLog[] = Object.values(dailyLogs);
  const moodCounts: Record<string, number> = {};
  allLogs.forEach(l => {
    if (l.mood) {
      moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
    }
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Smile className="w-3.5 h-3.5" />
            <span>Emotional Wellbeing & Inner Balance</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-rose-950">
            Mood & Swings Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Record how you feel each day, discover hormonal mood connections, and restore peace with gentle self-care.
          </p>
        </div>

        {/* Ambient Sound Trigger */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
            isAudioPlaying
              ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-xs'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Playing Soothing Tone (432Hz)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-stone-400" />
              <span>Play Soothing Ambient Chime</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Daily Mood Logger & Cycle Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Mood Logger Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100/60">
            <div>
              <h2 className="font-display text-lg font-bold text-rose-950">
                Today's Daily Check-in
              </h2>
              <span className="text-xs text-stone-500">{todayStr}</span>
            </div>

            {isSavedNotice && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fadeIn">
                Saved with care ✓
              </span>
            )}
          </div>

          <form onSubmit={handleSaveMood} className="space-y-6">
            {/* 8 Required Mood Options */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                Select Your Dominant Mood Today
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MOOD_DEFINITIONS.map(m => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id as MoodType)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? `${m.bg} shadow-xs scale-105 ring-2 ring-rose-400`
                          : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider">
                  Energy Level ({energyLevel} / 5)
                </span>
                <span className="text-stone-500 font-medium">
                  {energyLevel === 1 ? 'Very Low / Exhausted' : energyLevel === 2 ? 'Low' : energyLevel === 3 ? 'Moderate' : energyLevel === 4 ? 'Good Energy' : 'Radiant / Peak'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={energyLevel}
                onChange={e => setEnergyLevel(Number(e.target.value))}
                className="w-full cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
                <span>1 - Depleted</span>
                <span>3 - Balanced</span>
                <span>5 - Vibrant</span>
              </div>
            </div>

            {/* Sleep & Water quick counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sleep Last Night</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="14"
                    value={sleepHours}
                    onChange={e => setSleepHours(Number(e.target.value))}
                    className="w-20 px-2.5 py-1 text-xs rounded-xl border border-stone-200 bg-white font-bold text-stone-900"
                  />
                  <span className="text-xs text-stone-500">hours of rest</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Hydration Intake</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900">
                    {waterCount} / 8 glasses
                  </span>
                  <button
                    type="button"
                    onClick={() => setWaterCount(prev => Math.min(12, prev + 1))}
                    className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs hover:bg-blue-200"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterCount(prev => Math.max(0, prev - 1))}
                    className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-300"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            {/* Gratitude / Reflections note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Private Journal / Self-Compassion Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What feels heavy today? What brought a small spark of joy?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Today's Mood & Wellness Log
            </button>
          </form>
        </div>

        {/* Cycle Correlation & Mood Charts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cycle Connection Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-50/80 to-rose-50/70 border border-purple-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Menstrual Cycle Connection</span>
            </div>

            <h3 className="font-display text-lg font-bold text-rose-950">
              How Your Mood Relates to Cycle Day {cyclePrediction.cycleDay}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              {cyclePrediction.phase === 'follicular' && (
                "During the Follicular Phase, rising estrogen typically brings higher mental clarity, social confidence, and a sunny outlook."
              )}
              {cyclePrediction.phase === 'ovulation' && (
                "During Ovulation, peak LH and estrogen can provide peak optimism, vitality, and connection with loved ones."
              )}
              {cyclePrediction.phase === 'luteal' && (
                "During the Luteal (Pre-menstrual) Phase, shifting progesterone can occasionally trigger irritability, fatigue, or sensitivity. Know that this is biological—not a personal flaw."
              )}
              {cyclePrediction.phase === 'menstrual' && (
                "During the Menstrual Phase, low hormone levels naturally call for inward reflection, restful blankets, warmth, and gentleness with yourself."
              )}
            </p>

            <div className="p-3 rounded-2xl bg-white/80 border border-purple-100 text-xs text-purple-950 font-medium">
              💡 <strong>Sakhi Wisdom:</strong> Tracking emotions side-by-side with your cycle frees you from self-blame.
            </div>
          </div>

          {/* Simple Mood Distribution Chart */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-rose-950">
              Mood Trends (Recent Logs)
            </h3>
            
            <div className="space-y-2.5">
              {MOOD_DEFINITIONS.map(m => {
                const count = moodCounts[m.id] || 0;
                const total = Math.max(1, allLogs.filter(l => l.mood).length);
                const percent = Math.round((count / total) * 100);

                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </span>
                      <span className="font-bold text-stone-800">
                        {count} days ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Gentle Self-Care Hub: 4-7-8 Breathing, Relaxation & Talking */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-8">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Gentle Self-Care Corner</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-rose-950">
            Nourish Your Body and Mind
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Simple, science-backed rituals to calm the nervous system when you feel anxious, overwhelmed, or fatigued.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. Interactive 4-7-8 Breathing Tool */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-50/70 to-pink-50/70 border border-purple-100 flex flex-col items-center justify-between text-center space-y-4">
            <div className="w-full flex items-center justify-between text-xs text-purple-900 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                4-7-8 Breathing
              </span>
            </div>

            {/* Visual Animated Breathing Circle */}
            <div className="relative my-4 flex items-center justify-center">
              <div
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-sm ${
                  breathPhase === 'Inhale'
                    ? 'bg-purple-300 scale-125 shadow-purple-200'
                    : breathPhase === 'Hold'
                    ? 'bg-rose-300 scale-125 ring-4 ring-rose-200'
                    : breathPhase === 'Exhale'
                    ? 'bg-indigo-200 scale-90'
                    : 'bg-stone-200 scale-100'
                }`}
              >
                <span className="font-display text-lg font-bold text-rose-950">
                  {breathPhase}
                </span>
                {isBreathingActive && (
                  <span className="text-xl font-extrabold text-white">
                    {breathSecondsLeft}s
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Inhale quietly through your nose for 4s, hold gently for 7s, and exhale completely through your mouth for 8s.
            </p>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                isBreathingActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  Pause Exercise
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Begin Breathing Exercise
                </>
              )}
            </button>
          </div>

          {/* 2. Hydration, Sleep & Warm Relaxation */}
          <div className="p-6 rounded-3xl bg-stone-50/80 border border-stone-200/70 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Restorative Rituals</span>
              </div>
              
              <ul className="space-y-3 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>Warm Hydration:</strong> Herbal chamomile, peppermint, or warm ginger water eases uterine contractions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  <span><strong>Digital Sunset:</strong> Turn off bright blue screens 45 minutes before sleep to stimulate natural melatonin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Gentle Movement:</strong> Light pelvic tilt, child's pose, or a quiet 10-minute walk relieves bloating.</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-500 italic">
              "Rest is not a reward for completing work; it is essential bodily nourishment."
            </div>
          </div>

          {/* 3. Talking to Someone You Trust */}
          <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
                <MessageCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Talk to Someone You Trust</span>
              </div>
              <h4 className="font-display text-base font-bold text-rose-950">
                You Never Have to Carry It Alone
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hormonal shifts can make emotions feel magnified. Sharing a five-minute call with a close friend, sister, or trusted confidante releases oxytocin and restores your peace.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-rose-200/60 text-[11px] text-stone-500">
              <p className="font-semibold text-rose-950">
                Need gentle listening or emotional support?
              </p>
              <p>
                Reach out to a trusted counselor or local mental health helpline. Sakhi Care is always cheering for you.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
