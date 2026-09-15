import React from 'react';
import { useSakhi } from '../context/SakhiContext';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowUpRight,
  Download
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setPrivacyModalOpen, setDownloadModalOpen } = useSakhi();

  return (
    <footer className="bg-stone-50 border-t border-rose-100/80 pt-12 pb-16 text-stone-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-4 h-4 fill-white/80" />
              </div>
              <span className="font-display text-xl font-bold text-rose-950">
                Sakhi Care
              </span>
            </div>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              “Your health. Your cycle. Your Sakhi.” A caring, private, and empowering women’s wellness companion for tracking periods, pregnancy, moods, and holistic health.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Local-First & Private
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Doctor-Friendly
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setDownloadModalOpen(true)}
                id="footer-download-app-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-100/70 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download & Install Sakhi Care</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-950">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Home Sanctuary
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Daily Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('period')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Period & Cycle Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pregnancy')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Pregnancy Journey (W1–40)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mood')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Moods & Gentle Self-Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:text-rose-600 transition-colors"
                >
                  Doctor Health Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-950">
              Privacy & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-rose-600 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-rose-600 transition-colors text-left"
                >
                  Terms of Wellness Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-rose-600 transition-colors text-left"
                >
                  Clinical Medical Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hover:text-rose-600 transition-colors text-left"
                >
                  Data Backup & Export
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-2">
          <p className="leading-relaxed">
            <strong>Medical Disclaimer:</strong> Sakhi Care is designed for educational, self-awareness, and menstrual wellness tracking purposes only. Sakhi Care does not provide medical diagnoses, treatment plans, or emergency care, and does not substitute for the consultation, evaluation, or advice of a qualified healthcare provider.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-stone-400">
            <div>
              © {new Date().getFullYear()} Sakhi Care. All rights reserved. Crafted with care for women worldwide.
            </div>
            <div className="flex items-center gap-1 text-rose-500">
              <span>Made with respect, privacy, and compassion</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 inline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
