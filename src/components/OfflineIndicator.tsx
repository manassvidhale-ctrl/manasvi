import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-stone-900/90 text-white px-4 py-2 text-xs font-medium shadow-xl backdrop-blur-xs border border-stone-700 animate-fade-in">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>Offline Mode — Sakhi Care is using cached local storage</span>
    </div>
  );
};
