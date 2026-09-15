import { DailyLog, PeriodLog, UserProfile } from '../types';
import { formatDate, addDays } from '../utils/cycleCalculations';

const today = new Date();
const todayStr = formatDate(today);

// Generate period logs for the last 4 cycles
export const INITIAL_USER: UserProfile = {
  id: 'user-priya',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  pregnancyMode: false,
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lmpDate: addDays(todayStr, -140), // 20 weeks ago if pregnancy enabled
  isDiscreetMode: false,
};

// Assuming today is day 14 of current cycle
const currentCycleStart = addDays(todayStr, -13);
const cycle1Start = addDays(currentCycleStart, -28);
const cycle2Start = addDays(cycle1Start, -29);
const cycle3Start = addDays(cycle2Start, -27);

export const INITIAL_PERIODS: PeriodLog[] = [
  {
    id: 'p-current',
    startDate: currentCycleStart,
    endDate: addDays(currentCycleStart, 4),
    flow: 'medium',
    notes: 'Normal flow, mild cramps on day 1 & 2'
  },
  {
    id: 'p-1',
    startDate: cycle1Start,
    endDate: addDays(cycle1Start, 4),
    flow: 'medium',
    notes: 'On-time cycle. Used hot water bottle for lower back tension.'
  },
  {
    id: 'p-2',
    startDate: cycle2Start,
    endDate: addDays(cycle2Start, 5),
    flow: 'heavy',
    notes: 'Felt tired during the first 2 days.'
  },
  {
    id: 'p-3',
    startDate: cycle3Start,
    endDate: addDays(cycle3Start, 4),
    flow: 'medium',
    notes: 'Comfortable cycle.'
  }
];

// Generate past 21 days of realistic daily logs with moods and symptoms
export const INITIAL_DAILY_LOGS: DailyLog[] = [
  {
    date: todayStr,
    mood: 'calm',
    energyLevel: 4,
    waterGlasses: 6,
    sleepHours: 8,
    symptoms: ['bloating'],
    symptomSeverity: { bloating: 'mild' },
    notes: 'Feeling balanced and clear-headed today.'
  },
  {
    date: addDays(todayStr, -1),
    mood: 'happy',
    energyLevel: 5,
    waterGlasses: 8,
    sleepHours: 7.5,
    symptoms: [],
    symptomSeverity: {},
    notes: 'Great energy for yoga session.'
  },
  {
    date: addDays(todayStr, -2),
    mood: 'excited',
    energyLevel: 4,
    waterGlasses: 7,
    sleepHours: 7,
    symptoms: ['acne'],
    symptomSeverity: { acne: 'mild' },
    notes: 'High creativity and social energy.'
  },
  {
    date: addDays(todayStr, -3),
    mood: 'happy',
    energyLevel: 4,
    waterGlasses: 8,
    sleepHours: 8,
    symptoms: [],
    symptomSeverity: {},
    notes: ''
  },
  {
    date: addDays(todayStr, -4),
    mood: 'calm',
    energyLevel: 3,
    waterGlasses: 6,
    sleepHours: 7,
    symptoms: [],
    symptomSeverity: {},
  },
  {
    date: addDays(todayStr, -7),
    mood: 'tired',
    energyLevel: 2,
    waterGlasses: 5,
    sleepHours: 6.5,
    symptoms: ['fatigue', 'headache'],
    symptomSeverity: { fatigue: 'moderate', headache: 'mild' },
    notes: 'Busy workday, took an afternoon tea break.'
  },
  {
    date: addDays(todayStr, -10),
    mood: 'calm',
    energyLevel: 3,
    waterGlasses: 7,
    sleepHours: 7.5,
    symptoms: [],
    symptomSeverity: {},
  },
  {
    date: addDays(todayStr, -12),
    mood: 'tired',
    energyLevel: 2,
    waterGlasses: 6,
    sleepHours: 7,
    symptoms: ['cramps', 'fatigue', 'bloating'],
    symptomSeverity: { cramps: 'moderate', fatigue: 'moderate', bloating: 'mild' },
    notes: 'Period flow started yesterday. Chamomile tea and heating pad helped.'
  },
  {
    date: addDays(todayStr, -13),
    mood: 'sad',
    energyLevel: 1,
    waterGlasses: 5,
    sleepHours: 8,
    symptoms: ['cramps', 'headache', 'cravings'],
    symptomSeverity: { cramps: 'severe', headache: 'moderate', cravings: 'mild' },
    notes: 'First day of period. Rested and watched a cozy movie.'
  },
  {
    date: addDays(todayStr, -14),
    mood: 'anxious',
    energyLevel: 2,
    waterGlasses: 6,
    sleepHours: 6,
    symptoms: ['bloating', 'cravings', 'breast_tenderness'],
    symptomSeverity: { bloating: 'moderate', cravings: 'moderate', breast_tenderness: 'moderate' },
    notes: 'Pre-period sensitivity and chocolate cravings.'
  },
  {
    date: addDays(todayStr, -15),
    mood: 'stressed',
    energyLevel: 2,
    waterGlasses: 5,
    sleepHours: 6.5,
    symptoms: ['headache', 'bloating'],
    symptomSeverity: { headache: 'moderate', bloating: 'mild' },
    notes: 'Felt slightly overwhelmed. Practiced 4-7-8 breathing.'
  }
];

export const SYMPTOM_OPTIONS = [
  { id: 'cramps', label: 'Abdominal Cramps', category: 'Physical', emoji: '⚡' },
  { id: 'headache', label: 'Headache / Migraine', category: 'Physical', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', category: 'Digestive', emoji: '🫧' },
  { id: 'fatigue', label: 'Fatigue & Low Energy', category: 'Energy', emoji: '🥱' },
  { id: 'acne', label: 'Acne / Breakouts', category: 'Skin', emoji: '✨' },
  { id: 'cravings', label: 'Food Cravings', category: 'Digestive', emoji: '🍫' },
  { id: 'breast_tenderness', label: 'Tender Breasts', category: 'Physical', emoji: '🌸' },
  { id: 'backache', label: 'Lower Back Pain', category: 'Physical', emoji: '💆‍♀️' },
  { id: 'nausea', label: 'Nausea / Queasiness', category: 'Digestive', emoji: '🍵' },
  { id: 'insomnia', label: 'Trouble Sleeping', category: 'Sleep', emoji: '🌙' },
  { id: 'mood_swings', label: 'Mood Sensitivity', category: 'Emotional', emoji: '🎭' },
  { id: 'hot_flashes', label: 'Hot Flashes / Chills', category: 'Physical', emoji: '🌡️' },
];

export const MOOD_DEFINITIONS = [
  { id: 'happy', label: 'Happy', emoji: '😊', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'calm', label: 'Calm', emoji: '😌', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'excited', label: 'Excited', emoji: '✨', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'tired', label: 'Tired', emoji: '🥱', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'anxious', label: 'Anxious', emoji: '😟', bg: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'stressed', label: 'Stressed', emoji: '😣', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'sad', label: 'Sad', emoji: '🥺', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'angry', label: 'Irritable / Angry', emoji: '😤', bg: 'bg-red-100 text-red-800 border-red-200' },
] as const;
