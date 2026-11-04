import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  batteryLevel?: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
}) => {
  return (
    <header className="w-full h-13 px-4 py-3 flex items-center justify-between select-none border-b border-white/[0.06]">
      {/* Brand (No box, clean modern typography, no redundant translations) */}
      <div className="flex items-center space-x-2.5">
        <Shield className="w-4 h-4 text-carbon-green" />
        <div className="flex items-baseline space-x-1.5">
          <span className="font-bold text-sm tracking-wide text-carbon-textPrimary font-sans">
            {language === 'kn' ? 'ಕಾವಲು' : 'KAAVALU'}
          </span>
          <span className="text-[11px] text-carbon-textHelper font-medium tracking-normal">
            Safe Transit
          </span>
        </div>
      </div>

      {/* Right Controls: Soft Squircle Pills */}
      <div className="flex items-center space-x-2">
        {/* Soft Status Pill */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            isOnline
              ? 'bg-carbon-green/10 border-carbon-green/25 text-carbon-green-light'
              : 'bg-carbon-yellow/10 border-carbon-yellow/25 text-carbon-yellow-light'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-carbon-green animate-pulse' : 'bg-carbon-yellow'
            }`}
          />
          <span>{isOnline ? 'Protected' : 'Offline'}</span>
        </div>

        {/* Soft Language Pill */}
        <div className="flex items-center bg-carbon-layer01 border border-white/[0.08] rounded-xl px-2.5 py-1">
          <Globe className="w-3.5 h-3.5 text-carbon-textSecondary mr-1.5" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-xs text-carbon-textPrimary font-medium focus:outline-none cursor-pointer"
            aria-label="Language selector"
          >
            <option value="en" className="bg-[#151c27] text-white">EN</option>
            <option value="kn" className="bg-[#151c27] text-white">ಕನ್ನಡ</option>
            <option value="hi" className="bg-[#151c27] text-white">हिंदी</option>
            <option value="ne" className="bg-[#151c27] text-white">नेपाली</option>
          </select>
        </div>
      </div>
    </header>
  );
};
