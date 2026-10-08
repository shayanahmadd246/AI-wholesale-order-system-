import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const PWAOfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xl border border-amber-500">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — Using Cached Data</span>
    </div>
  );
};
