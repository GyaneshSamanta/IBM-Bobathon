import React, { useState } from 'react';
import {
  WifiOff,
  Play,
  Pause,
  AlertCircle,
  EyeOff,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Smartphone,
  Clapperboard,
} from 'lucide-react';
import { LanguageCode } from '../i18n/translations';

const VOICE_SCENARIOS: { lang: LanguageCode; label: string; text: string }[] = [
  { lang: 'kn', label: 'ಕನ್ನಡ', text: 'ಒಂದು ಆಟೋ ನನ್ನ ಹಿಂದೆ ತುಂಬಾ ನಿಧಾನವಾಗಿ ಬರ್ತಾ ಇದೆ, ಭಯ ಆಗ್ತಿದೆ.' },
  { lang: 'ne', label: 'नेपाली', text: 'एउटा केटाले मलाई पछ्याइरहेको छ, बाटो धेरै अँध्यारो छ।' },
  { lang: 'hi', label: 'हिंदी', text: 'गली में लाइट बंद है और 3 लड़के खड़े हैं।' },
  { lang: 'en', label: 'English', text: 'Suspicious auto trailing me with headlights turned off.' },
];

interface DemoControlPanelProps {
  isOnline: boolean;
  onToggleAirplaneMode: () => void;
  isSimulatingWalk: boolean;
  onToggleSimulatedWalk: () => void;
  onResetPosition: () => void;
  onTriggerStagnation: () => void;
  onTriggerDeviation: () => void;
  onToggleCovert: () => void;
  isCovertActive: boolean;
  isSirenActive: boolean;
  onToggleSiren: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onTriggerScenario: (text: string, lang: LanguageCode) => void;
  isAutoPilotRunning: boolean;
  autoPilotStageText: string;
  onStartAutoPilot: () => void;
  onStopAutoPilot: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  isOnline,
  onToggleAirplaneMode,
  isSimulatingWalk,
  onToggleSimulatedWalk,
  onResetPosition,
  onTriggerStagnation,
  onTriggerDeviation,
  onToggleCovert,
  isCovertActive,
  isSirenActive,
  onToggleSiren,
  isPhoneFrame,
  onTogglePhoneFrame,
  onTriggerScenario,
  isAutoPilotRunning,
  autoPilotStageText,
  onStartAutoPilot,
  onStopAutoPilot,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside aria-label="Pitch Demo Controls" className="w-full bg-carbon-layer01 border border-white/[0.08] rounded-2xl p-3 shadow-soft-sm select-none">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 ${isAutoPilotRunning ? 'bg-carbon-green animate-ping' : 'bg-carbon-blue'}`} />
          <h2 className="text-xs font-semibold text-carbon-textPrimary flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-carbon-blue" />
            Pitch Presentation & Demo Simulator
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-carbon-textSecondary text-xs">
          <span>{isExpanded ? 'Hide Tools' : 'Show Tools'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isExpanded && (
        <div className="pt-3 mt-2 space-y-3 border-t border-white/[0.06]">
          {/* Main 45s Pitch Auto-Pilot Button */}
          <div className="p-3 bg-carbon-layer02 rounded-xl border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Clapperboard className="w-4 h-4 text-carbon-blue-light" />
              <div>
                <span className="text-xs font-bold text-carbon-textPrimary block">
                  {isAutoPilotRunning ? 'Demo in Progress' : '45-Second Guided Pitch Demo'}
                </span>
                <span className="text-[11px] text-carbon-textSecondary">
                  {isAutoPilotRunning ? autoPilotStageText : 'Simulates route selection, transit, cellular failure, and safe haven arrival'}
                </span>
              </div>
            </div>

            <button
              onClick={isAutoPilotRunning ? onStopAutoPilot : onStartAutoPilot}
              className={`h-9 px-3.5 rounded-xl font-semibold text-xs flex items-center space-x-1.5 transition-all active:scale-95 text-white ${
                isAutoPilotRunning
                  ? 'bg-carbon-red hover:bg-carbon-red-hover shadow-soft-sm'
                  : 'bg-carbon-blue hover:bg-carbon-blue-hover shadow-soft-sm'
              }`}
            >
              {isAutoPilotRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPilotRunning ? 'Stop Demo' : 'Start Demo'}</span>
            </button>
          </div>

          {/* Quick Simulation Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Cellular Failure Toggle */}
            <button
              onClick={onToggleAirplaneMode}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                !isOnline
                  ? 'bg-carbon-yellow/20 border-carbon-yellow/50 text-carbon-yellow'
                  : 'bg-carbon-layer02 border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{isOnline ? 'Simulate 0 Signal' : 'Restore Signal'}</span>
            </button>

            {/* Walk Simulation Toggle */}
            <button
              onClick={onToggleSimulatedWalk}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                isSimulatingWalk
                  ? 'bg-carbon-green/20 border-carbon-green/50 text-carbon-green-light'
                  : 'bg-carbon-layer02 border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              {isSimulatingWalk ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulatingWalk ? 'Pause Walk' : 'Simulate Walk'}</span>
            </button>

            {/* Siren Alarm Toggle */}
            <button
              onClick={onToggleSiren}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                isSirenActive
                  ? 'bg-carbon-red border-carbon-red text-white'
                  : 'bg-carbon-layer02 border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSirenActive ? 'Stop Siren' : 'Test Siren'}</span>
            </button>

            {/* Reset Walk Position */}
            <button
              onClick={onResetPosition}
              className="p-2.5 rounded-xl bg-carbon-layer02 hover:bg-carbon-layer03 border border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary text-xs font-medium flex items-center justify-center space-x-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Start</span>
            </button>
          </div>

          {/* One-Click Voice Threat Scenarios */}
          <div>
            <span className="text-[11px] text-carbon-textSecondary block mb-1.5">Voice threat scenarios (one click)</span>
            <div className="grid grid-cols-4 gap-2">
              {VOICE_SCENARIOS.map((sc) => (
                <button
                  key={sc.lang}
                  onClick={() => onTriggerScenario(sc.text, sc.lang)}
                  title={sc.text}
                  className="p-2 rounded-xl bg-carbon-layer02 hover:bg-carbon-layer03 border border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary text-xs font-medium transition-all active:scale-95"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls */}
          <div className="flex flex-wrap gap-y-2 items-center justify-between pt-1 text-xs text-carbon-textSecondary border-t border-carbon-borderSubtle/60">
            <button
              onClick={onTriggerStagnation}
              className="hover:text-carbon-textPrimary transition-colors flex items-center space-x-1"
            >
              <AlertCircle className="w-3 h-3 text-carbon-yellow" />
              <span>Test Stopped Walk Alert</span>
            </button>

            <button
              onClick={onTriggerDeviation}
              className="hover:text-carbon-textPrimary transition-colors flex items-center space-x-1"
            >
              <AlertCircle className="w-3 h-3 text-carbon-red" />
              <span>Trigger Deviation</span>
            </button>

            <button
              onClick={onToggleCovert}
              className="hover:text-carbon-textPrimary transition-colors flex items-center space-x-1"
            >
              <EyeOff className="w-3 h-3 text-carbon-blue" />
              <span>{isCovertActive ? 'Exit Disguise' : 'Pocket Black Screen'}</span>
            </button>

            <button
              onClick={onTogglePhoneFrame}
              className="hover:text-carbon-textPrimary transition-colors flex items-center space-x-1"
            >
              <Smartphone className="w-3 h-3 text-carbon-textSecondary" />
              <span>{isPhoneFrame ? 'Desktop View' : 'Phone View'}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
