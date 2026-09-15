export type MoodType = 
  | 'happy' 
  | 'calm' 
  | 'excited' 
  | 'tired' 
  | 'anxious' 
  | 'stressed' 
  | 'sad' 
  | 'angry';

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface PeriodLog {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  flow: FlowIntensity;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mood?: MoodType;
  symptoms: string[];
  symptomSeverity: Record<string, SymptomSeverity>;
  energyLevel?: number; // 1-5
  waterGlasses?: number;
  sleepHours?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  pregnancyMode: boolean;
  lmpDate?: string; // Last menstrual period for pregnancy
  averageCycleLength: number; // e.g. 28
  averagePeriodLength: number; // e.g. 5
  isDiscreetMode: boolean;
}

export interface PregnancyWeekData {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  babyWeight: string;
  babyLength: string;
  fruit: string;
  fruitEmoji: string;
  development: string;
  momChanges: string;
  wellnessTip: string;
}

export interface CyclePrediction {
  cycleDay: number;
  phase: CyclePhase;
  phaseName: string;
  phaseDescription: string;
  nextPeriodDate: string;
  daysUntilNextPeriod: number;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  isFertileToday: boolean;
  isOvulationToday: boolean;
}

export type ActiveTab = 'home' | 'dashboard' | 'period' | 'pregnancy' | 'mood' | 'reports' | 'profile';
