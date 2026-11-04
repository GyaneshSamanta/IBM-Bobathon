import React from 'react';
import {
  Play,
  Pause,
  ChevronRight,
  X,
  ShieldCheck,
  WifiOff,
  Footprints,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

export interface DemoStep {
  stepNumber: number;
  totalSteps: number;
  stageName: string;
  actionSummary: string;
  pmInsight: string;
  phase: 'typing' | 'routing' | 'walking' | 'emergency' | 'success';
}

interface GuidedDemoDirectorProps {
  currentStep: DemoStep;
  progressPercent: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onSkipNext: () => void;
  onStop: () => void;
}

export const GuidedDemoDirector: React.FC<GuidedDemoDirectorProps> = ({
  currentStep,
  progressPercent,
  isPaused,
  onTogglePause,
  onSkipNext,
  onStop,
}) => {
  const getPhaseIcon = () => {
    switch (currentStep.phase) {
      case 'typing':
        return <Search className="w-3.5 h-3.5 text-carbon-blue-light" />;
      case 'routing':
        return <Sparkles className="w-3.5 h-3.5 text-carbon-yellow-light" />;
      case 'walking':
        return <Footprints className="w-3.5 h-3.5 text-carbon-green-light" />;
      case 'emergency':
        return <WifiOff className="w-3.5 h-3.5 text-carbon-red-light animate-pulse" />;
      case 'success':
        return <ShieldCheck className="w-3.5 h-3.5 text-carbon-green-light" />;
      default:
        return <Footprints className="w-3.5 h-3.5 text-carbon-blue-light" />;
    }
  };

  const getPhaseBadgeColor = () => {
    switch (currentStep.phase) {
      case 'emergency':
        return 'bg-carbon-red/15 border-carbon-red/30 text-carbon-red-light';
      case 'success':
        return 'bg-carbon-green/15 border-carbon-green/30 text-carbon-green-light';
      case 'routing':
        return 'bg-carbon-yellow/15 border-carbon-yellow/30 text-carbon-yellow-light';
      default:
        return 'bg-carbon-blue/15 border-carbon-blue/30 text-carbon-blue-light';
    }
  };

  const getProgressBarColor = () => {
    switch (currentStep.phase) {
      case 'emergency':
        return 'bg-carbon-red';
      case 'success':
        return 'bg-carbon-green';
      default:
        return 'bg-carbon-blue';
    }
  };

  return (
    <div className="w-full bg-carbon-layer01/95 border border-white/[0.08] rounded-2xl p-3 shadow-soft-md relative overflow-hidden select-none animate-fade-in backdrop-blur-md">
      {/* Top Progress Line with smooth glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-carbon-layer02">
        <div
          className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Bar: Stage Status & Controls */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Left: Step Badge & Title */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`p-1.5 rounded-xl border flex items-center justify-center flex-shrink-0 ${getPhaseBadgeColor()}`}>
            {getPhaseIcon()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-carbon-blue-light">
                Demo Step {currentStep.stepNumber}/{currentStep.totalSteps}:
              </span>
              <span className="text-xs font-bold text-carbon-textPrimary truncate">
                {currentStep.stageName}
              </span>
            </div>
            <p className="text-[11px] text-carbon-textSecondary truncate">
              {currentStep.actionSummary}
            </p>
          </div>
        </div>

        {/* Right: Modern Squircle Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 pl-2">
          <button
            type="button"
            onClick={onTogglePause}
            className="p-1.5 bg-carbon-layer02 hover:bg-carbon-layer03 text-carbon-textPrimary border border-white/[0.08] rounded-xl transition-all active:scale-95 shadow-soft-sm"
            title={isPaused ? 'Resume Pitch Demo' : 'Pause Pitch Demo'}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-carbon-green" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onSkipNext}
            className="p-1.5 bg-carbon-layer02 hover:bg-carbon-layer03 text-carbon-textPrimary border border-white/[0.08] rounded-xl transition-all active:scale-95 shadow-soft-sm"
            title="Next Demo Step"
            aria-label="Next step"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onStop}
            className="p-1.5 bg-carbon-layer02 hover:bg-carbon-red/20 text-carbon-textSecondary hover:text-carbon-red border border-white/[0.08] rounded-xl transition-all active:scale-95 shadow-soft-sm"
            title="Exit Demo"
            aria-label="Exit demo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom PM Context Callout Banner */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center space-x-2 text-[10px] text-carbon-textSecondary">
        <div className="w-4 h-4 rounded-full bg-carbon-blue/15 text-carbon-blue-light flex items-center justify-center flex-shrink-0 font-bold">
          <Info className="w-2.5 h-2.5" />
        </div>
        <span className="font-medium text-carbon-textHelper leading-tight line-clamp-1">
          <strong className="text-carbon-textSecondary font-semibold">PM Context:</strong> {currentStep.pmInsight}
        </span>
      </div>
    </div>
  );
};
