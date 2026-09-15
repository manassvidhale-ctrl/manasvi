import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import {
  User,
  Settings,
  Shield,
  Download,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  Heart,
  Baby,
  Calendar,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateProfile,
    logout,
    resetToDemoData,
    clearAllData,
    exportDataJson,
    isDiscreetMode,
    toggleDiscreetMode,
    setPrivacyModalOpen,
    setDownloadModalOpen,
    setAuthModalOpen,
    setAuthModalTab
  } = useSakhi();

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [cycleLength, setCycleLength] = useState(user?.averageCycleLength || 28);
  const [periodLength, setPeriodLength] = useState(user?.averagePeriodLength || 5);
  const [pregnancyMode, setPregnancyMode] = useState(user?.pregnancyMode || false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      averageCycleLength: Number(cycleLength),
      averagePeriodLength: Number(periodLength),
      pregnancyMode
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-rose-950">
          Sign In to Your Profile
        </h2>
        <p className="text-xs text-stone-600">
          Create an account or sign in to configure your personal cycle defaults, export backups, and customize privacy preferences.
        </p>
        <button
          onClick={() => {
            setAuthModalTab('login');
            setAuthModalOpen(true);
          }}
          className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-xs"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-purple-400 text-white font-display text-2xl font-bold flex items-center justify-center shadow-md shadow-rose-200">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-rose-950">
              {user.name}
            </h1>
            <p className="text-xs text-stone-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                Sakhi Member
              </span>
              {user.pregnancyMode && (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  Pregnancy Mode Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-stone-600" />
            <h2 className="font-display text-lg font-bold text-rose-950">
              Personalized Cycle & Health Configuration
            </h2>
          </div>
          {savedNotice && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fadeIn">
              Changes Saved ✓
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Average Cycle Length (Days)
            </label>
            <input
              type="number"
              min="20"
              max="50"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Default is 28 days (standard clinical range: 21–35 days)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Average Period Duration (Days)
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={periodLength}
              onChange={e => setPeriodLength(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Typically 4–7 days of active flow
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Pregnancy Journey Mode
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPregnancyMode(!pregnancyMode)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  pregnancyMode
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {pregnancyMode ? 'Active (Tracking Pregnancy)' : 'Inactive (Cycle Tracking)'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-xs"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>

      {/* Privacy & Discreet Mode Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h2 className="font-display text-lg font-bold text-rose-950">
            Privacy Controls & Discreet Sanctuary
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-800">Public Discreet Mode</span>
              {isDiscreetMode && (
                <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                  Enabled
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5 max-w-md">
              Masks cycle day numbers and sensitive clinical wording across the dashboard when using the app on a train, office, or shared screen.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleDiscreetMode}
            className={`px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isDiscreetMode
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {isDiscreetMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isDiscreetMode ? 'Discreet Mode Active' : 'Turn On Discreet Mode'}
          </button>
        </div>

        {/* Data Security & Backup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
            <h3 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>Install & Download App</span>
            </h3>
            <p className="text-xs text-stone-500">
              Install Sakhi Care on your phone or desktop for instant offline access and standalone mode.
            </p>
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              id="profile-download-app-btn"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              Open Download Hub
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Health Backup</span>
            </h3>
            <p className="text-xs text-stone-500">
              Download your complete encrypted logs, period dates, symptoms, and moods for personal archiving.
            </p>
            <button
              type="button"
              onClick={exportDataJson}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800"
            >
              Export JSON File
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset to Demo Data</span>
            </h3>
            <p className="text-xs text-stone-500">
              Restore Priya Sharma's pre-populated 4-month sample cycles and rich mood charts for testing.
            </p>
            <button
              type="button"
              onClick={resetToDemoData}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
            >
              Restore Sample Data
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="text-xs text-stone-500 hover:text-stone-800 underline"
          >
            Review Sakhi Care Privacy Policy & Medical Disclaimer Statement
          </button>
        </div>
      </div>
    </div>
  );
};
