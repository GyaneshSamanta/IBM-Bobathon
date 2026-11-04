import React from 'react';
import { AlertOctagon, ShieldCheck, Volume2, VolumeX, MessageSquareWarning } from 'lucide-react';
import { AlertState } from '../types/telemetry';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface StagnationAlertModalProps {
  alertState: AlertState;
  countdownSeconds: number;
  onCancelAlert: () => void;
  onTriggerSos: () => void;
  sirenActive: boolean;
  onToggleSiren: () => void;
  language: LanguageCode;
}

export const StagnationAlertModal: React.FC<StagnationAlertModalProps> = ({
  alertState,
  countdownSeconds,
  onCancelAlert,
  onTriggerSos,
  sirenActive,
  onToggleSiren,
  language,
}) => {
  if (alertState === 'normal') return null;

  const t = TRANSLATIONS[language];
  const isSos = alertState === 'sos_active';

  return (
    <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-carbon-layer01 border-2 border-carbon-red p-6 shadow-carbon-lg text-center space-y-4">
        {/* Pulsing Alert Icon */}
        <div className="w-14 h-14 mx-auto bg-carbon-red/20 border border-carbon-red flex items-center justify-center">
          <AlertOctagon className="w-7 h-7 text-carbon-red" />
        </div>

        {/* Title & Countdown */}
        <div>
          <h2 className="text-base font-bold text-carbon-textPrimary tracking-tight">
            {isSos ? t.sosAlert : t.stagnationWarning}
          </h2>
          <p className="text-xs text-carbon-textSecondary mt-1 leading-relaxed">
            {t.stagnationDesc}
          </p>

          {!isSos && (
            <div className="mt-3 flex items-center justify-center space-x-2">
              <span className="text-3xl font-bold text-carbon-red font-mono">
                {countdownSeconds}s
              </span>
              <span className="text-xs text-carbon-textHelper text-left leading-tight">
                before automatic<br />emergency alert
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* I am safe / Cancel button */}
          <button
            onClick={onCancelAlert}
            className="w-full h-11 font-medium text-xs bg-carbon-green hover:bg-carbon-green-hover text-white flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.cancelAlert}</span>
          </button>

          {/* Trigger Siren & SMS */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleSiren}
              className={`h-10 text-xs font-medium border flex items-center justify-center space-x-1.5 transition-all ${
                sirenActive
                  ? 'bg-carbon-red text-white border-carbon-red'
                  : 'bg-carbon-layer02 border-carbon-borderSubtle text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              {sirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{sirenActive ? 'Silence' : 'Alarm'}</span>
            </button>

            <button
              onClick={onTriggerSos}
              className="h-10 text-xs font-medium bg-carbon-red hover:bg-carbon-red-hover text-white flex items-center justify-center space-x-1.5 transition-all"
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              <span>SOS (112)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
