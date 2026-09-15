import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import {
  Heart,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  Baby,
  Smile,
  FileBarChart,
  ArrowRight,
  Download
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    signup,
    forgotPassword,
    resetToDemoData,
    setPrivacyModalOpen,
    setDownloadModalOpen
  } = useSakhi();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both your email and password.');
        return;
      }
      login(email.trim(), password);
    } else if (activeTab === 'signup') {
      if (!name.trim() || !email.trim() || !password) {
        setErrorMsg('Please complete all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }
      signup(name.trim(), email.trim(), password);
    } else if (activeTab === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address to receive a reset link.');
        return;
      }
      const res = forgotPassword(email.trim());
      setSuccessMsg(res.message);
    }
  };

  const handleDemoSignIn = () => {
    resetToDemoData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] via-[#FCF9F9] to-[#FBF8F6] text-rose-950 flex flex-col justify-between selection:bg-rose-200 selection:text-rose-900">
      
      {/* Top Simple Brand Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-rose-100/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-purple-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Heart className="w-5 h-5 fill-white/80" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-rose-950 flex items-center gap-1.5">
              Sakhi Care
              <Sparkles className="w-4 h-4 text-rose-400" />
            </span>
            <p className="text-[11px] text-rose-700/80 font-medium">
              Women's Wellness & Menstrual Health Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-white/80 px-3 py-1.5 rounded-full border border-rose-100 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private & Encrypted</span>
          </div>

          <button
            onClick={() => setDownloadModalOpen(true)}
            id="login-download-app-btn"
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download or install the Sakhi Care app"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span>Download App</span>
          </button>

          <button
            onClick={handleDemoSignIn}
            id="login-quick-demo-top-btn"
            className="px-4 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Demo Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Product Value & Sanctuary Story */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-900 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Your Confidential Wellness Sanctuary</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-950 leading-[1.18]">
                Your Health. Your Cycle. <span className="text-rose-600 italic">Your Sakhi.</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                A gentle, compassionate tracker designed for your body’s unique rhythm. Sign in to track menstrual cycles, understand hormonal shifts, follow pregnancy week-by-week, and generate doctor-ready consultation reports.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-rose-950">Cycle & Flow Intelligence</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Predict upcoming periods, ovulation windows, and track bleeding intensity with ease.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Baby className="w-4 h-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-purple-950">Pregnancy Journey (W1–40)</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Weekly developmental milestones with fruit size comparisons and prenatal tips.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Smile className="w-4 h-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-amber-950">Mood & 4-7-8 Breathing</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Gentle emotional self-care room, audio chimes, and phase-correlated insights.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileBarChart className="w-4 h-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-indigo-950">Doctor-Ready Reports</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Synthesized summaries and irregularity flags ready for your gynecologist visit.
                </p>
              </div>
            </div>

            {/* Instant Demo Test Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-rose-950 block">
                  Exploring the application?
                </span>
                <p className="text-xs text-stone-600 mt-0.5">
                  Launch with Priya Sharma's sample profile with 4 months of realistic cycle and mood history.
                </p>
              </div>
              <button
                onClick={handleDemoSignIn}
                id="login-priya-demo-callout-btn"
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-sm shrink-0 flex items-center gap-1.5 justify-center transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Demo Account</span>
              </button>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl shadow-rose-100/50 space-y-6">
              
              {/* Card Header & Tabs */}
              <div>
                <div className="text-center mb-5">
                  <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                    Welcome to Sakhi Care
                  </span>
                  <h2 className="font-display text-2xl font-bold text-rose-950 mt-1">
                    {activeTab === 'login'
                      ? 'Sign In to Your Account'
                      : activeTab === 'signup'
                      ? 'Create Your Health Account'
                      : 'Reset Your Password'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {activeTab === 'login'
                      ? 'Access your saved cycles, symptoms, and health records.'
                      : activeTab === 'signup'
                      ? 'Begin your private wellness journey in just 30 seconds.'
                      : 'We will send secure reset instructions to your email.'}
                  </p>
                </div>

                {/* Tab selector */}
                <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    id="login-tab-signin-btn"
                    className={`flex-1 py-2 rounded-xl transition-all ${
                      activeTab === 'login'
                        ? 'bg-white text-rose-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    id="login-tab-signup-btn"
                    className={`flex-1 py-2 rounded-xl transition-all ${
                      activeTab === 'signup'
                        ? 'bg-white text-rose-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    id="login-tab-forgot-btn"
                    className={`flex-1 py-2 rounded-xl transition-all ${
                      activeTab === 'forgot'
                        ? 'bg-white text-rose-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Active Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name (Signup only) */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        id="signup-name-input"
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>
                )}

                {/* Email (All tabs) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      id="auth-email-input"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                {/* Password (Login and Signup) */}
                {activeTab !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Password
                      </label>
                      {activeTab === 'login' && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('forgot')}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        id="auth-password-input"
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional Preferences (Signup only) */}
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Average Cycle Duration (Days)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="number"
                        min="20"
                        max="50"
                        value={cycleLength}
                        onChange={e => setCycleLength(Number(e.target.value))}
                        id="signup-cycle-length-input"
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Default is 28 days. You can adjust this anytime in your profile.
                    </span>
                  </div>
                )}

                {/* Remember Me / Terms */}
                {activeTab === 'login' && (
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 text-rose-500 rounded border-stone-300 focus:ring-rose-400"
                      />
                      <span>Keep me signed in</span>
                    </label>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  className="w-full py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {activeTab === 'login' ? (
                    <>
                      <span>Sign In to Sakhi Care</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : activeTab === 'signup' ? (
                    <>
                      <span>Create My Health Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                    </>
                  )}
                </button>
              </form>

              {/* Instant Demo Option */}
              <div className="pt-3 border-t border-stone-100 text-center space-y-2">
                <span className="text-[11px] text-stone-400">
                  Or explore immediately with pre-loaded data:
                </span>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  id="login-priya-demo-inner-btn"
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-rose-900 bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>🌸 Continue as Priya Sharma (Guest Demo)</span>
                </button>
              </div>

              {/* Trust & Privacy assurance */}
              <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero third-party trackers • Confidential client storage</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Login Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-rose-100/60 text-xs text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[11px] text-stone-400">
          Sakhi Care is an educational menstrual and wellness tracking platform. It does not replace professional medical advice.
        </p>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => setDownloadModalOpen(true)}
            id="login-footer-download-app-btn"
            className="hover:text-rose-600 font-semibold text-rose-800 flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Download App</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="hover:text-rose-600 underline"
          >
            Privacy Policy & Medical Disclaimer
          </button>
          <span>•</span>
          <span>Version 1.0</span>
        </div>
      </footer>

    </div>
  );
};
