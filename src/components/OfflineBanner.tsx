import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-stone-900/95 text-stone-100 border border-amber-500/40 p-3.5 rounded-sm shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="p-2 bg-amber-500/20 text-amber-400 rounded-full shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div>
        <h5 className="font-serif text-sm font-normal text-stone-100">
          Atelier Offline Mode Active
        </h5>
        <p className="text-[11px] text-stone-400">
          Your saved items, cart, and cached creations are preserved offline.
        </p>
      </div>
    </div>
  );
};
