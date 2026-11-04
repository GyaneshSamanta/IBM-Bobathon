import React, { useState } from 'react';
import { Unlock } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface CovertScreenProps {
  isActive: boolean;
  onExit: () => void;
  language: LanguageCode;
}

export const CovertScreen: React.FC<CovertScreenProps> = ({
  isActive,
  onExit,
  language,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const t = TRANSLATIONS[language];

  if (!isActive) return null;

  const handleScreenTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount >= 3) {
      setTapCount(0);
      onExit();
    } else {
      setTimeout(() => setTapCount(0), 1200);
    }
  };

  return (
    <div
      onClick={handleScreenTap}
      className="fixed inset-0 z-[2000] bg-black cursor-pointer select-none flex flex-col items-center justify-between p-8"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="pt-8 text-center opacity-20 hover:opacity-80 transition-opacity">
        <span className="text-xs text-gray-500">
          Triple-tap anywhere to unlock
        </span>
      </div>

      {/* Subtle Sentinel Heartbeat Pulse (Only tiny indicator) */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-2 h-2 rounded-full bg-carbon-green/50 animate-subtle-pulse" />
        <span className="text-[10px] text-gray-600 tracking-wider uppercase">
          Kaavalu Active
        </span>
      </div>

      <div className="pb-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs flex items-center space-x-1.5 transition-colors border border-white/10"
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Exit Covert Mode</span>
        </button>
      </div>
    </div>
  );
};
