import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenModal?: () => void;
  className?: string;
  variant?: 'nav' | 'primary' | 'outline' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  className = '',
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted && onOpenModal) {
        onOpenModal();
      }
    } else if (onOpenModal) {
      onOpenModal();
    }
  };

  if (isInstalled) {
    return null;
  }

  if (variant === 'nav') {
    return (
      <button
        onClick={handleClick}
        id="pwa-install-nav-btn"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${className}`}
        title="Download / Install Sakhi Care on your device"
      >
        <Download className="w-3.5 h-3.5 text-rose-500" />
        <span className="hidden xs:inline sm:inline">Download App</span>
      </button>
    );
  }

  if (variant === 'primary') {
    return (
      <button
        onClick={handleClick}
        id="pwa-install-primary-btn"
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Download & Install App</span>
        <Sparkles className="w-3.5 h-3.5 text-rose-200" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      id="pwa-install-outline-btn"
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-stone-700 hover:text-rose-900 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors shadow-2xs ${className}`}
    >
      <Download className="w-3.5 h-3.5 text-rose-500" />
      <span>Install App</span>
    </button>
  );
};
