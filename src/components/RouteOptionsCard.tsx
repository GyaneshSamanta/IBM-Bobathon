import React from 'react';
import { RouteResult, TransitCorridor } from '../types/corridor';
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Clock, MapPin, Zap, Fuel, Cross, Shield, Bus } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface RouteOptionsCardProps {
  activeCorridor: TransitCorridor;
  safeRoute: RouteResult;
  shortestRoute: RouteResult;
  transitRoute?: RouteResult;
  activeMode: 'walk_safe' | 'walk_dark' | 'transit';
  onSelectMode: (mode: 'walk_safe' | 'walk_dark' | 'transit') => void;
  isTransitActive: boolean;
  onToggleTransit: () => void;
  language: LanguageCode;
}

export const RouteOptionsCard: React.FC<RouteOptionsCardProps> = ({
  activeCorridor,
  safeRoute,
  shortestRoute,
  transitRoute,
  activeMode,
  onSelectMode,
  isTransitActive,
  onToggleTransit,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const pt = activeCorridor.publicTransit;

  const getSanctuaryBadgeIcon = (type: string) => {
    switch (type) {
      case 'petrol_bunk':
        return <Fuel className="w-3.5 h-3.5 text-carbon-green mr-1.5" />;
      case 'pharmacy':
        return <Cross className="w-3.5 h-3.5 text-carbon-blue-light mr-1.5" />;
      case 'police_kiosk':
        return <Shield className="w-3.5 h-3.5 text-carbon-cyan mr-1.5" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-carbon-textPrimary mr-1.5" />;
    }
  };

  return (
    <div className="bg-carbon-layer01 border border-white/[0.08] rounded-2xl p-3.5 space-y-3 shadow-soft-sm">
      {/* 1. Safe Route View (Clean glanceable squircle pills) */}
      {activeMode === 'walk_safe' && (
        <div className="p-3 bg-carbon-layer02/60 border border-carbon-green/30 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-carbon-green-light flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-carbon-green" />
              Safe Illuminated Route
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-carbon-green/15 text-carbon-green-light border border-carbon-green/25">
              Recommended
            </span>
          </div>

          {/* Metric Pills */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textPrimary">
              <Clock className="w-3.5 h-3.5 mr-1 text-carbon-textSecondary" />
              {safeRoute.estimatedDurationMinutes} mins
            </span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textSecondary">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {(safeRoute.totalDistanceMeters / 1000).toFixed(1)} km
            </span>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-carbon-green/10 border border-carbon-green/25 text-carbon-green-light">
              <Zap className="w-3.5 h-3.5 mr-1 text-carbon-green" />
              {safeRoute.litPercentage}% Well-Lit
            </span>
          </div>

          {/* Major Verified Havens Along Route */}
          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] text-carbon-textHelper uppercase block mb-1.5 font-medium tracking-wider">
              Verified Open Havens
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {activeCorridor.sanctuaries.map((sanc) => (
                <span
                  key={sanc.id}
                  className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textPrimary"
                >
                  {getSanctuaryBadgeIcon(sanc.type)}
                  {sanc.name.split('(')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Public Transit View */}
      {activeMode === 'transit' && pt && (
        <div className="p-3 bg-carbon-layer02/60 border border-carbon-blue/30 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-carbon-blue-light flex items-center">
              <Bus className="w-4 h-4 mr-1.5 text-carbon-blue-light" />
              {pt.lineName}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-carbon-blue/15 text-carbon-blue-light border border-carbon-blue/25">
              Fastest Transit
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textPrimary">
              <Clock className="w-3.5 h-3.5 mr-1 text-carbon-textSecondary" />
              {pt.rideDurationMinutes + pt.walkToStopMinutes + pt.walkFromStopMinutes} mins total
            </span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textSecondary">
              {pt.departureFrequencyText}
            </span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-carbon-blue/10 border border-carbon-blue/25 text-carbon-blue-light">
              Board at {pt.boardingStop}
            </span>
          </div>
        </div>
      )}

      {/* 3. Dark Shortcut View */}
      {activeMode === 'walk_dark' && (
        <div className="p-3 bg-carbon-layer02/60 border border-carbon-red/30 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-carbon-red-light flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-carbon-red-light" />
              Unlit Dirt Shortcut
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-carbon-red/15 text-carbon-red-light border border-carbon-red/25">
              High Risk
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-carbon-red/30 text-carbon-red-light">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {shortestRoute.estimatedDurationMinutes} mins (saves 9m)
            </span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textSecondary">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {(shortestRoute.totalDistanceMeters / 1000).toFixed(1)} km
            </span>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-carbon-red/10 border border-carbon-red/25 text-carbon-red-light">
              Only {shortestRoute.litPercentage}% Lit
            </span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-carbon-layer01 border border-white/[0.06] text-carbon-textHelper">
              0 Safe Havens
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectMode('walk_safe')}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-carbon-green/15 hover:bg-carbon-green/25 text-carbon-green-light border border-carbon-green/30 transition-all active:scale-[0.98]"
          >
            ← Switch to Safe Lit Route
          </button>
        </div>
      )}

      {/* Main Squircle Action Button */}
      <button
        type="button"
        onClick={onToggleTransit}
        className={`w-full h-12 rounded-xl flex items-center justify-center space-x-2 font-semibold text-xs transition-all active:scale-[0.98] select-none text-white shadow-soft-md ${
          isTransitActive
            ? 'bg-carbon-layer03 hover:bg-carbon-layer03/80 border border-white/[0.12]'
            : activeMode === 'walk_dark'
            ? 'bg-carbon-red hover:bg-carbon-red-hover shadow-glow-red'
            : 'bg-carbon-blue hover:bg-carbon-blue-hover shadow-glow-blue'
        }`}
      >
        {isTransitActive ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-carbon-green" />
            <span>{t.endTransit}</span>
          </>
        ) : (
          <>
            <span>{activeMode === 'transit' ? 'Start Transit Commute' : t.startTransit}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
