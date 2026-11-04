import React from 'react';
import { ArrowUpRight, AlertTriangle, WifiOff } from 'lucide-react';
import { Sanctuary, RouteResult } from '../types/corridor';
import { TelemetryState } from '../types/telemetry';

interface SentinelHUDProps {
  isTransitActive: boolean;
  activeRoute: RouteResult;
  telemetry: TelemetryState;
  nearestSanctuary: Sanctuary | null;
  isDiversionActive: boolean;
  isNetworkFailed?: boolean;
}

export const SentinelHUD: React.FC<SentinelHUDProps> = ({
  isTransitActive,
  nearestSanctuary,
  isDiversionActive,
  isNetworkFailed = false,
}) => {
  if (!isTransitActive) return null;

  return (
    <div className="absolute top-2.5 inset-x-2.5 z-[450] animate-fade-in pointer-events-none">
      <div
        className={`backdrop-blur-md rounded-2xl p-2.5 shadow-soft-md pointer-events-auto transition-all duration-300 border ${
          isNetworkFailed
            ? 'bg-[#181116]/95 border-carbon-red/50 shadow-glow-red'
            : isDiversionActive
            ? 'bg-carbon-layer01/95 border-carbon-yellow/40 shadow-soft-md'
            : 'bg-carbon-layer01/95 border-white/[0.1] shadow-soft-md'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          {/* Turn / Guidance / Offline Icon */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              isNetworkFailed
                ? 'bg-carbon-red/20 text-carbon-red-light border border-carbon-red/40'
                : isDiversionActive
                ? 'bg-carbon-yellow/20 text-carbon-yellow border border-carbon-yellow/40'
                : 'bg-carbon-green/20 text-carbon-green-light border border-carbon-green/40'
            }`}
          >
            {isNetworkFailed ? (
              <WifiOff className="w-4 h-4 animate-pulse" />
            ) : isDiversionActive ? (
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
          </div>

          {/* Turn-by-Turn Instruction */}
          <div className="flex-1 min-w-0">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider block ${
                isNetworkFailed
                  ? 'text-carbon-red-light'
                  : isDiversionActive
                  ? 'text-carbon-yellow-light'
                  : 'text-carbon-textHelper'
              }`}
            >
              {isNetworkFailed
                ? '0 Signal • Offline Edge AI Active'
                : isDiversionActive
                ? 'Emergency Haven Guidance'
                : 'Live Turn Guidance'}
            </span>
            <div className="text-xs font-bold text-carbon-textPrimary truncate">
              {isNetworkFailed || isDiversionActive
                ? `Proceed directly to ${nearestSanctuary?.name || 'Safe Haven'}`
                : `Walk straight on Main Road (${
                    nearestSanctuary ? `Pass ${nearestSanctuary.name.split(' ')[0]} ahead` : 'Lit Path'
                  })`}
            </div>
          </div>

          {/* Status Pill Badge */}
          <div
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 font-bold border ${
              isNetworkFailed
                ? 'bg-carbon-red/20 border-carbon-red/40 text-carbon-red-light'
                : isDiversionActive
                ? 'bg-carbon-yellow/20 border-carbon-yellow/40 text-carbon-yellow'
                : 'bg-carbon-green/15 border-carbon-green/30 text-carbon-green-light'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isNetworkFailed
                  ? 'bg-carbon-red animate-ping'
                  : isDiversionActive
                  ? 'bg-carbon-yellow animate-ping'
                  : 'bg-carbon-green animate-pulse'
              }`}
            />
            <span>{isNetworkFailed ? 'Offline' : isDiversionActive ? 'Diverting' : 'Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
