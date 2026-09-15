import { CyclePhase, CyclePrediction, PeriodLog } from '../types';

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function diffDays(dateAStr: string, dateBStr: string): number {
  const a = parseDate(dateAStr);
  const b = parseDate(dateBStr);
  const diffTime = a.getTime() - b.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateCyclePredictions(
  lastPeriodStart: string,
  cycleLength: number = 28,
  periodLength: number = 5,
  todayStr: string = formatDate(new Date())
): CyclePrediction {
  const daysSinceStart = diffDays(todayStr, lastPeriodStart);
  
  // Normalized cycle day (1-indexed)
  let cycleDay = (daysSinceStart % cycleLength) + 1;
  if (cycleDay <= 0) cycleDay += cycleLength;

  const ovulationDay = Math.max(1, cycleLength - 14);
  const fertileStartDay = Math.max(1, ovulationDay - 5);
  const fertileEndDay = Math.min(cycleLength, ovulationDay + 1);

  // Calculate Next Period Date
  // If today is within the current cycle:
  let cyclesCompleted = Math.floor(daysSinceStart / cycleLength);
  if (daysSinceStart < 0) cyclesCompleted = 0;
  
  const currentCycleStart = addDays(lastPeriodStart, cyclesCompleted * cycleLength);
  const nextPeriodDate = addDays(currentCycleStart, cycleLength);
  const daysUntilNextPeriod = Math.max(0, diffDays(nextPeriodDate, todayStr));

  const ovulationDate = addDays(currentCycleStart, ovulationDay - 1);
  const fertileWindowStart = addDays(currentCycleStart, fertileStartDay - 1);
  const fertileWindowEnd = addDays(currentCycleStart, fertileEndDay - 1);

  const isFertileToday = cycleDay >= fertileStartDay && cycleDay <= fertileEndDay;
  const isOvulationToday = cycleDay === ovulationDay;

  // Determine phase
  let phase: CyclePhase = 'follicular';
  let phaseName = 'Follicular Phase';
  let phaseDescription = 'Rising estrogen promotes follicle development and a healthy uterine lining. Energy and creativity usually increase.';

  if (cycleDay <= periodLength) {
    phase = 'menstrual';
    phaseName = 'Menstrual Phase';
    phaseDescription = 'The uterine lining sheds. Hormone levels are at their baseline. Prioritize warm rest, hydration, and gentle movement.';
  } else if (cycleDay >= fertileStartDay && cycleDay <= fertileEndDay) {
    phase = 'ovulation';
    phaseName = isOvulationToday ? 'Ovulation Day' : 'Fertile Window';
    phaseDescription = 'Luteinizing Hormone (LH) surges. Peak fertility window. You may notice higher vitality, clear cervical fluid, and enhanced social energy.';
  } else if (cycleDay > fertileEndDay) {
    phase = 'luteal';
    phaseName = 'Luteal Phase (Pre-Menstrual)';
    phaseDescription = 'Progesterone dominates to nourish the body. Metabolism slightly rises. Give yourself grace, restful sleep, and wholesome balanced meals.';
  }

  return {
    cycleDay,
    phase,
    phaseName,
    phaseDescription,
    nextPeriodDate,
    daysUntilNextPeriod,
    fertileWindowStart,
    fertileWindowEnd,
    ovulationDate,
    isFertileToday,
    isOvulationToday,
  };
}

export function calculatePregnancy(
  lmpDate: string,
  todayStr: string = formatDate(new Date())
): {
  gestationalDays: number;
  currentWeek: number;
  currentDayInWeek: number;
  trimester: 1 | 2 | 3;
  dueDate: string;
  daysRemaining: number;
  progressPercent: number;
} {
  const gestationalDays = Math.max(0, diffDays(todayStr, lmpDate));
  const currentWeek = Math.floor(gestationalDays / 7) + 1;
  const currentDayInWeek = gestationalDays % 7;

  // Naegele's rule: LMP + 280 days (40 weeks)
  const dueDate = addDays(lmpDate, 280);
  const daysRemaining = Math.max(0, diffDays(dueDate, todayStr));
  const progressPercent = Math.min(100, Math.round((gestationalDays / 280) * 100));

  let trimester: 1 | 2 | 3 = 1;
  if (currentWeek >= 28) {
    trimester = 3;
  } else if (currentWeek >= 14) {
    trimester = 2;
  }

  return {
    gestationalDays,
    currentWeek: Math.min(42, Math.max(1, currentWeek)),
    currentDayInWeek,
    trimester,
    dueDate,
    daysRemaining,
    progressPercent,
  };
}

export interface CycleStats {
  averageLength: number;
  shortestLength: number;
  longestLength: number;
  cycleCount: number;
  isRegular: boolean;
  irregularityNote?: string;
}

export function analyzeCycleHistory(periods: PeriodLog[]): CycleStats {
  if (periods.length < 2) {
    return {
      averageLength: 28,
      shortestLength: 28,
      longestLength: 28,
      cycleCount: periods.length,
      isRegular: true,
      irregularityNote: 'Log at least two consecutive periods to see personalized cycle regularity trends.'
    };
  }

  // Sort periods chronologically
  const sorted = [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lengths: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const diff = diffDays(sorted[i].startDate, sorted[i - 1].startDate);
    if (diff >= 18 && diff <= 60) {
      lengths.push(diff);
    }
  }

  if (lengths.length === 0) {
    return {
      averageLength: 28,
      shortestLength: 28,
      longestLength: 28,
      cycleCount: periods.length,
      isRegular: true,
    };
  }

  const sum = lengths.reduce((acc, v) => acc + v, 0);
  const averageLength = Math.round(sum / lengths.length);
  const shortestLength = Math.min(...lengths);
  const longestLength = Math.max(...lengths);
  const variance = longestLength - shortestLength;

  // A normal cycle is typically between 21 and 35 days, with variance under 7-9 days
  const isRegular = variance <= 7 && averageLength >= 21 && averageLength <= 35;

  let irregularityNote: string | undefined;
  if (!isRegular) {
    if (averageLength < 21) {
      irregularityNote = 'Your average cycle length is shorter than 21 days (Polymenorrhea). Tracking consistently helps provide context when you consult your gynecologist.';
    } else if (averageLength > 35) {
      irregularityNote = 'Your average cycle length exceeds 35 days (Oligomenorrhea). Discussing cycle variations with a healthcare provider can help ensure optimal hormonal balance.';
    } else if (variance > 7) {
      irregularityNote = `Your cycle length varied by ${variance} days between months. While occasional variation is common due to stress, travel, or sleep, mention this pattern during your next wellness checkup.`;
    }
  }

  return {
    averageLength,
    shortestLength,
    longestLength,
    cycleCount: periods.length,
    isRegular,
    irregularityNote,
  };
}
