import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { ActiveTab } from '../types';
import {
  Heart,
  Calendar,
  Baby,
  Smile,
  FileBarChart,
  User,
  Eye,
  EyeOff,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Home,
  LayoutDashboard,
  LogOut,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    logout,
    isDiscreetMode,
    toggleDiscreetMode,
    setAuthModalOpen,
    setAuthModalTab,
    setPrivacyModalOpen,
    setDownloadModalOpen
  } = useSakhi();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'period', label: 'Period Tracker', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pregnancy', label: 'Pregnancy', icon: <Baby className="w-4 h-4" /> },
    { id: 'mood', label: 'Mood', icon: <Smile className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-lg p-1"
            id="sakhi-care-logo-btn"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 via-rose-300 to-purple-300 flex items-center justify-center text-white shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/80" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-rose-950 flex items-center gap-1">
                Sakhi Care
                <Sparkles className="w-3.5 h-3.5 text-rose-400 opacity-80" />
              </span>
              <p className="text-[10px] text-rose-600/80 font-medium tracking-wide">
                Women's Wellness & Companion
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-menu">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-rose-100/90 text-rose-900 shadow-xs'
                      : 'text-stone-600 hover:text-rose-900 hover:bg-rose-50/70'
                  }`}
                >
                  <span className={isActive ? 'text-rose-600' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Discreet Mode Button */}
            <button
              onClick={toggleDiscreetMode}
              title={isDiscreetMode ? "Discreet Mode Active (Click to show health details)" : "Enable Discreet Mode (Hides cycle numbers in public)"}
              id="discreet-mode-toggle-btn"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isDiscreetMode
                  ? 'bg-purple-100 border-purple-300 text-purple-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {isDiscreetMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-purple-700" />
                  <span className="hidden sm:inline">Discreet</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden sm:inline">Privacy</span>
                </>
              )}
            </button>

            {/* Download App Button */}
            <button
              onClick={() => setDownloadModalOpen(true)}
              id="navbar-download-app-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Download or install the Sakhi Care app"
            >
              <Download className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Download App</span>
            </button>

            {/* Start Tracking Primary Button */}
            <button
              onClick={() => handleNavClick('period')}
              id="start-tracking-nav-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              Start Tracking
            </button>

            {/* Auth / Profile State */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('profile')}
                  id="user-profile-nav-btn"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 transition-colors"
                  title={`Logged in as ${user.name}`}
                >
                  <div className="w-7 h-7 rounded-full bg-rose-400 text-white font-semibold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-rose-950 truncate max-w-[90px]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={logout}
                  id="navbar-logout-btn"
                  title="Sign out to Login page"
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                id="login-nav-btn"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-rose-950 hover:bg-rose-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-5 space-y-1 shadow-md animate-fadeIn">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`mobile-nav-${item.id}`}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-100 text-rose-950 font-semibold'
                    : 'text-stone-700 hover:bg-rose-50'
                }`}
              >
                <span className={isActive ? 'text-rose-600' : 'text-stone-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-rose-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDownloadModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-rose-800 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              <Download className="w-4 h-4 text-rose-600" />
              Download & Install App
            </button>
            <button
              onClick={() => handleNavClick('period')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600"
            >
              <Calendar className="w-4 h-4" />
              Start Tracking Now
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPrivacyModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-stone-500 hover:text-stone-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Privacy Policy & Terms
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
