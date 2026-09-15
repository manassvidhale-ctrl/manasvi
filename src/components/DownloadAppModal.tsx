import React, { useState } from 'react';
import { useSakhi } from '../context/SakhiContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  Share2,
  PlusSquare,
  FileDown,
  Sparkles,
  X,
  ShieldCheck,
  Zap,
  Globe,
  HardDriveDownload,
  Printer
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { user, periods, dailyLogs } = useSakhi();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'export'>('install');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
      }
    }
  };

  const handleDownloadBackupData = () => {
    try {
      const exportData = {
        app: 'Sakhi Care',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        user: user || { name: 'Guest' },
        cyclePeriods: periods,
        dailyHealthLogs: dailyLogs,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `sakhi-care-health-backup-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportNotice('Health backup data downloaded successfully!');
      setTimeout(() => setExportNotice(''), 4000);
    } catch {
      setExportNotice('Unable to export data at this time.');
    }
  };

  const handlePrintDoctorReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-rose-100/80 flex items-center justify-between bg-gradient-to-r from-rose-50/80 via-white to-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 id="download-modal-title" className="font-display text-xl font-bold text-rose-950 flex items-center gap-2">
                Download Sakhi Care
                <Sparkles className="w-4 h-4 text-rose-400" />
              </h2>
              <p className="text-xs text-stone-500">
                Install as a mobile or desktop app & backup your records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="download-modal-close-btn"
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-100 flex gap-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install on Device (App)</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Data & Code</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {activeTab === 'install' ? (
            <div className="space-y-6">
              {/* App Identity Banner */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                <img
                  src="/icon.svg"
                  alt="Sakhi Care App Icon"
                  className="w-14 h-14 rounded-2xl shadow-sm border border-rose-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-rose-950">Sakhi Care</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                      PWA v1.0
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Fast, offline-ready companion for your home screen. No app store download needed.
                  </p>
                </div>
              </div>

              {/* Install Trigger / Status */}
              {isInstalled || installSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Sakhi Care is installed on this device!</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      You can launch it anytime directly from your Home Screen or Applications list.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white space-y-3 shadow-md shadow-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-100">
                      Ready to install
                    </span>
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">1-Click Quick Install</h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      Click below to add Sakhi Care directly to your phone or desktop home screen.
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    id="pwa-native-install-button"
                    className="w-full py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Sakhi Care Now</span>
                  </button>
                </div>
              ) : null}

              {/* Step-by-Step Device Guidance */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Installation Guides By Device
                </span>

                {/* iOS Guide */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span>iPhone & iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside pl-1">
                    <li>
                      Open this site in <strong className="text-stone-800">Safari</strong>.
                    </li>
                    <li className="flex items-center gap-1.5 flex-wrap">
                      <span>Tap the</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-200 text-[11px] font-semibold text-stone-700">
                        <Share2 className="w-3 h-3" /> Share
                      </span>
                      <span>button in the toolbar.</span>
                    </li>
                    <li className="flex items-center gap-1.5 flex-wrap">
                      <span>Scroll down and tap</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-200 text-[11px] font-semibold text-stone-700">
                        <PlusSquare className="w-3 h-3" /> Add to Home Screen
                      </span>
                    </li>
                    <li>Tap <strong>Add</strong> at the top right. Sakhi Care will appear as a standalone app!</li>
                  </ol>
                </div>

                {/* Android Guide */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Android (Chrome / Samsung Internet)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside pl-1">
                    <li>Tap the <strong>three dots (⋮)</strong> menu in the upper right.</li>
                    <li>Select <strong className="text-stone-800">"Install app"</strong> or <strong className="text-stone-800">"Add to Home screen"</strong>.</li>
                    <li>Confirm the prompt. Sakhi Care will install to your app drawer.</li>
                  </ol>
                </div>

                {/* Desktop Guide */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    <span>Desktop (Chrome / Edge on Mac & Windows)</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Look for the <strong className="text-stone-800">Install Sakhi Care</strong> icon (a computer with a down arrow) on the right side of your browser address bar and click it to install.
                  </p>
                </div>
              </div>

              {/* Offline & Privacy Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">Offline Capable</span>
                    <span className="text-[11px] text-stone-500">Track logs and cycles even without cellular data.</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-purple-950 block">Private Storage</span>
                    <span className="text-[11px] text-stone-500">Data stays locally safe on your physical device.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notice */}
              {exportNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{exportNotice}</span>
                </div>
              )}

              {/* Data Export Card */}
              <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <HardDriveDownload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-rose-950">Download Personal Health Passport (JSON)</h3>
                    <p className="text-[11px] text-stone-500">
                      Save a permanent backup of your tracked periods, symptoms, and moods.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadBackupData}
                  id="download-json-backup-btn"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Health Data Backup (.json)</span>
                </button>
              </div>

              {/* Doctor Report Card */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">Print / Save Doctor Consultation PDF</h3>
                    <p className="text-[11px] text-stone-500">
                      Generate a print-ready report for your gynecologist or healthcare visit.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePrintDoctorReport}
                  id="download-doctor-pdf-btn"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print or Save Doctor Report (PDF)</span>
                </button>
              </div>

              {/* Project Source Code Download Guide */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <Globe className="w-4 h-4 text-stone-600" />
                  <span>Download App Codebase (ZIP / GitHub)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  To download the full source code of this React + TypeScript application:
                </p>
                <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside pl-1">
                  <li>In Google AI Studio, locate the <strong>Settings</strong> or <strong>Share</strong> menu at the top.</li>
                  <li>Click <strong className="text-stone-800">"Export to ZIP"</strong> or <strong className="text-stone-800">"Push to GitHub"</strong>.</li>
                  <li>Extract the files and run <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">npm install && npm run dev</code>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Private client storage • Zero ad networks</span>
          </div>
          <button
            onClick={onClose}
            id="download-modal-done-btn"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
