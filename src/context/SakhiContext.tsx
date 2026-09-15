import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  CyclePrediction,
  DailyLog,
  PeriodLog,
  UserProfile,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PERIODS,
  INITIAL_DAILY_LOGS,
} from '../data/initialData';
import {
  calculateCyclePredictions,
  calculatePregnancy,
  analyzeCycleHistory,
  formatDate,
  CycleStats,
} from '../utils/cycleCalculations';

interface SakhiContextType {
  user: UserProfile | null;
  periods: PeriodLog[];
  dailyLogs: Record<string, DailyLog>;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDiscreetMode: boolean;
  toggleDiscreetMode: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot') => void;
  dailyLogModalOpen: boolean;
  setDailyLogModalOpen: (open: boolean) => void;
  selectedDateForLog: string;
  setSelectedDateForLog: (dateStr: string) => void;
  openDailyLogForDate: (dateStr: string) => void;
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (open: boolean) => void;
  downloadModalOpen: boolean;
  setDownloadModalOpen: (open: boolean) => void;
  
  // Auth & Profile actions
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  forgotPassword: (email: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  togglePregnancyMode: (enabled: boolean, lmpDate?: string) => void;

  // Tracking operations
  savePeriod: (period: Omit<PeriodLog, 'id'> & { id?: string }) => void;
  deletePeriod: (id: string) => void;
  saveDailyLog: (log: DailyLog) => void;
  getDailyLogForDate: (dateStr: string) => DailyLog | undefined;

  // Data management
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportDataJson: () => void;

  // Computed state
  cyclePrediction: CyclePrediction;
  pregnancyCalc: ReturnType<typeof calculatePregnancy> | null;
  cycleStats: CycleStats;
  todayStr: string;
}

const SakhiContext = createContext<SakhiContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'sakhi_care_user_v2',
  PERIODS: 'sakhi_care_periods_v1',
  LOGS: 'sakhi_care_daily_logs_v1',
  DISCREET: 'sakhi_care_discreet_v1',
};

export const SakhiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayStr = formatDate(new Date());

  // Load state from local storage or defaults (defaults to null so first page is Login)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [periods, setPeriods] = useState<PeriodLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERIODS);
      return saved ? JSON.parse(saved) : INITIAL_PERIODS;
    } catch {
      return INITIAL_PERIODS;
    }
  });

  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
      const dict: Record<string, DailyLog> = {};
      INITIAL_DAILY_LOGS.forEach(l => {
        dict[l.date] = l;
      });
      return dict;
    } catch {
      const dict: Record<string, DailyLog> = {};
      INITIAL_DAILY_LOGS.forEach(l => {
        dict[l.date] = l;
      });
      return dict;
    }
  });

  const [isDiscreetMode, setIsDiscreetMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DISCREET) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [dailyLogModalOpen, setDailyLogModalOpen] = useState<boolean>(false);
  const [selectedDateForLog, setSelectedDateForLog] = useState<string>(todayStr);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(periods));
  }, [periods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISCREET, String(isDiscreetMode));
  }, [isDiscreetMode]);

  // Calculations
  const lastPeriod = periods.length > 0
    ? [...periods].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
    : null;

  const cyclePrediction = calculateCyclePredictions(
    lastPeriod ? lastPeriod.startDate : todayStr,
    user?.averageCycleLength ?? 28,
    user?.averagePeriodLength ?? 5,
    todayStr
  );

  const pregnancyCalc = user?.pregnancyMode && user.lmpDate
    ? calculatePregnancy(user.lmpDate, todayStr)
    : null;

  const cycleStats = analyzeCycleHistory(periods);

  // Actions
  const toggleDiscreetMode = () => {
    setIsDiscreetMode(prev => !prev);
  };

  const login = (email: string, _pass: string): boolean => {
    // Local-first authentication simulation with secure session persistence
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, c => c.toUpperCase()) || 'User',
      email,
      pregnancyMode: false,
      averageCycleLength: 28,
      averagePeriodLength: 5,
      isDiscreetMode: false,
    };
    setUser(newUser);
    setActiveTab('dashboard');
    setAuthModalOpen(false);
    return true;
  };

  const signup = (name: string, email: string, _pass: string): boolean => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      pregnancyMode: false,
      averageCycleLength: 28,
      averagePeriodLength: 5,
      isDiscreetMode: false,
    };
    setUser(newUser);
    setActiveTab('dashboard');
    setAuthModalOpen(false);
    return true;
  };

  const forgotPassword = (email: string) => {
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your inbox or continue securely.`
    };
  };

  const logout = () => {
    setUser(null);
    setActiveTab('home');
    setAuthModalOpen(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const togglePregnancyMode = (enabled: boolean, lmpDate?: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pregnancyMode: enabled,
        lmpDate: enabled ? (lmpDate || prev.lmpDate || todayStr) : undefined
      };
    });
  };

  const savePeriod = (period: Omit<PeriodLog, 'id'> & { id?: string }) => {
    setPeriods(prev => {
      if (period.id) {
        return prev.map(p => p.id === period.id ? { ...p, ...period, id: period.id } : p);
      }
      const newEntry: PeriodLog = {
        ...period,
        id: `period-${Date.now()}`
      };
      return [newEntry, ...prev].sort((a, b) => b.startDate.localeCompare(a.startDate));
    });
  };

  const deletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  };

  const saveDailyLog = (log: DailyLog) => {
    setDailyLogs(prev => ({
      ...prev,
      [log.date]: log
    }));
  };

  const getDailyLogForDate = (dateStr: string): DailyLog | undefined => {
    return dailyLogs[dateStr];
  };

  const openDailyLogForDate = (dateStr: string) => {
    setSelectedDateForLog(dateStr);
    setDailyLogModalOpen(true);
  };

  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setActiveTab('dashboard');
    setAuthModalOpen(false);
    setPeriods(INITIAL_PERIODS);
    const dict: Record<string, DailyLog> = {};
    INITIAL_DAILY_LOGS.forEach(l => {
      dict[l.date] = l;
    });
    setDailyLogs(dict);
    setIsDiscreetMode(false);
  };

  const clearAllData = () => {
    setPeriods([]);
    setDailyLogs({});
    if (user) {
      setUser({
        ...user,
        pregnancyMode: false,
        lmpDate: undefined
      });
    }
  };

  const exportDataJson = () => {
    const backup = {
      appName: 'Sakhi Care',
      exportedAt: new Date().toISOString(),
      user,
      periods,
      dailyLogs,
      disclaimer: 'Sakhi Care is an educational tracking companion, not medical advice.'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sakhi-care-health-export-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SakhiContext.Provider
      value={{
        user,
        periods,
        dailyLogs,
        activeTab,
        setActiveTab,
        isDiscreetMode,
        toggleDiscreetMode,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        dailyLogModalOpen,
        setDailyLogModalOpen,
        selectedDateForLog,
        setSelectedDateForLog,
        openDailyLogForDate,
        privacyModalOpen,
        setPrivacyModalOpen,
        downloadModalOpen,
        setDownloadModalOpen,
        login,
        signup,
        forgotPassword,
        logout,
        updateProfile,
        togglePregnancyMode,
        savePeriod,
        deletePeriod,
        saveDailyLog,
        getDailyLogForDate,
        resetToDemoData,
        clearAllData,
        exportDataJson,
        cyclePrediction,
        pregnancyCalc,
        cycleStats,
        todayStr,
      }}
    >
      {children}
    </SakhiContext.Provider>
  );
};

export function useSakhi() {
  const context = useContext(SakhiContext);
  if (!context) {
    throw new Error('useSakhi must be used within a SakhiProvider');
  }
  return context;
}
