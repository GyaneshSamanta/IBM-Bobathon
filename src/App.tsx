import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchRouteBar } from './components/SearchRouteBar';
import { InteractiveMap } from './components/InteractiveMap';
import { RouteOptionsCard } from './components/RouteOptionsCard';
import { VoiceCopilotSheet } from './components/VoiceCopilotSheet';
import { SanctuaryListSheet } from './components/SanctuaryListSheet';
import { StagnationAlertModal } from './components/StagnationAlertModal';
import { CovertScreen } from './components/CovertScreen';
import { DemoControlPanel } from './components/DemoControlPanel';
import { SentinelHUD } from './components/SentinelHUD';
import { GuidedDemoDirector, DemoStep } from './components/GuidedDemoDirector';

import { TransitCorridor, RouteResult, Sanctuary, GeoPoint } from './types/corridor';
import { AgentAssessmentResult, TelemetryContext } from './types/copilot';
import { TelemetryState } from './types/telemetry';
import { LanguageCode, TRANSLATIONS } from './i18n/translations';

import { initOfflineStorage } from './services/offlineStorage';
import { calculateCorridorRoutes, calculateSanctuaryDiversionRoute } from './services/safetyRouter';
import { telemetryEngine } from './services/telemetryEngine';
import { evaluateOfflineCopilot } from './services/offlineCopilot';
import { dispatchNativeSms, shareDistressAlert } from './services/emergencyDispatcher';
import { sirenService } from './services/audioSiren';
import { launchSafeArrivalConfetti } from './utils/confetti';
import { BENGALURU_CORRIDORS } from './data/bengaluruCorridors';
import { Shield, MessageSquare, AlertOctagon, EyeOff, Map } from 'lucide-react';

const DEMO_STAGES: DemoStep[] = [
  {
    stepNumber: 1,
    totalSteps: 5,
    stageName: 'Searching Transit Points',
    actionSummary: 'Simulating Origin & Destination input',
    pmInsight: 'Civic Context: Standard GPS apps prioritize distance. Night commuters need lighting and haven proximity.',
    phase: 'typing',
  },
  {
    stepNumber: 2,
    totalSteps: 5,
    stageName: 'Evaluating Routes (A* vs Dijkstra)',
    actionSummary: 'Comparing 8m unlit shortcut vs 17m 100% lit safe avenue',
    pmInsight: 'Algorithmic Safety: Shortest path cuts through dark alleys. Safety A* penalizes unlit segments to guarantee lighted passage.',
    phase: 'routing',
  },
  {
    stepNumber: 3,
    totalSteps: 5,
    stageName: 'Walking Along Lit Main Road',
    actionSummary: 'Live turn-by-turn guidance past HP Fuel Oasis',
    pmInsight: 'Continuous Telemetry: 70% offline edge guardian provides turn-by-turn HUD without requiring anxious screen staring.',
    phase: 'walking',
  },
  {
    stepNumber: 4,
    totalSteps: 5,
    stageName: 'Cellular Dead Zone & Threat Rerouting',
    actionSummary: '0 signal. Offline AI diverts directly into HP forecourt',
    pmInsight: 'Offline Resiliency: In cellular blackouts, Kaavalu operates 100% locally on device with zero API keys or credit cards.',
    phase: 'emergency',
  },
  {
    stepNumber: 5,
    totalSteps: 5,
    stageName: 'Safe Haven Reached • Threat Resolved',
    actionSummary: 'Safely arrived at 24/7 staffed haven',
    pmInsight: 'Measurable Impact: Zero women stranded in dark alleys. Verified human haven network provides real physical safety.',
    phase: 'success',
  },
];

export const App: React.FC = () => {
  // English is default
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isNetworkFailed, setIsNetworkFailed] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(88);

  const [activeTab, setActiveTab] = useState<'route' | 'sanctuaries' | 'copilot'>('route');
  const [activeMode, setActiveMode] = useState<'walk_safe' | 'walk_dark' | 'transit'>('walk_safe');

  const [corridors, setCorridors] = useState<TransitCorridor[]>(BENGALURU_CORRIDORS);
  const [activeCorridor, setActiveCorridor] = useState<TransitCorridor>(BENGALURU_CORRIDORS[0]);

  const [safeRoute, setSafeRoute] = useState<RouteResult>(() => calculateCorridorRoutes(BENGALURU_CORRIDORS[0]).safeRoute);
  const [shortestRoute, setShortestRoute] = useState<RouteResult>(() => calculateCorridorRoutes(BENGALURU_CORRIDORS[0]).shortestRoute);
  const [transitRoute, setTransitRoute] = useState<RouteResult | undefined>(() => calculateCorridorRoutes(BENGALURU_CORRIDORS[0]).transitRoute);

  const [userPosition, setUserPosition] = useState<GeoPoint | null>(() => ({
    lat: BENGALURU_CORRIDORS[0].nodes[0].lat,
    lng: BENGALURU_CORRIDORS[0].nodes[0].lng,
  }));
  const [selectedSanctuary, setSelectedSanctuary] = useState<Sanctuary | null>(null);
  const [isDiversionActive, setIsDiversionActive] = useState<boolean>(false);

  const [isTransitActive, setIsTransitActive] = useState<boolean>(false);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryState>(telemetryEngine.getState());

  const [latestAssessment, setLatestAssessment] = useState<AgentAssessmentResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Simulated typing state for interactive demo
  const [simulatedFromText, setSimulatedFromText] = useState<string | undefined>(undefined);
  const [simulatedToText, setSimulatedToText] = useState<string | undefined>(undefined);
  const [demoShowRoutes, setDemoShowRoutes] = useState<boolean>(true);

  // Spotlight and Auto-scroll state for pitch demo
  const [spotlightTarget, setSpotlightTarget] = useState<'search' | 'routing' | 'walking' | 'emergency' | 'success' | null>(null);
  const [emergencyToast, setEmergencyToast] = useState<string | null>(null);

  // Section DOM Refs for smooth auto-scrolling
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const activeTabPanelRef = useRef<HTMLDivElement>(null);

  // Guided Demo State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [demoProgress, setDemoProgress] = useState<number>(0);
  const [isDemoPaused, setIsDemoPaused] = useState<boolean>(false);
  const demoIntervalRef = useRef<number | null>(null);
  const demoTimeInStepRef = useRef<number>(0);

  const walkTimerRef = useRef<number | null>(null);
  const walkStepRef = useRef<number>(0);

  const t = TRANSLATIONS[language];

  // Initialize Offline Storage & Telemetry
  useEffect(() => {
    initOfflineStorage().then((data) => {
      setCorridors(data);
      if (data.length > 0) setActiveCorridor(data[0]);
    });

    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> }).getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
      }).catch(() => {});
    }

    const unsubscribe = telemetryEngine.subscribe((state) => {
      setTelemetry(state);
      if (state.currentPosition) {
        setUserPosition(state.currentPosition);
      }
    });

    return () => unsubscribe();
  }, []);

  // Recalculate routes on corridor change
  useEffect(() => {
    const { safeRoute: safe, shortestRoute: shortest, transitRoute: transit } = calculateCorridorRoutes(activeCorridor);
    setSafeRoute(safe);
    setShortestRoute(shortest);
    setTransitRoute(transit);
    setIsDiversionActive(false);
    telemetryEngine.setRoute(safe);

    if (safe.pathCoordinates.length > 0) {
      setUserPosition({ lat: safe.pathCoordinates[0][0], lng: safe.pathCoordinates[0][1] });
      walkStepRef.current = 0;
    }
  }, [activeCorridor]);

  // Handle Walking Simulation
  useEffect(() => {
    if (isSimulatingWalk) {
      const activeCoords =
        activeMode === 'walk_dark'
          ? shortestRoute.pathCoordinates
          : safeRoute.pathCoordinates;

      walkTimerRef.current = window.setInterval(() => {
        walkStepRef.current = (walkStepRef.current + 1) % activeCoords.length;
        const [lat, lng] = activeCoords[walkStepRef.current];
        telemetryEngine.updatePosition({ lat, lng });
        sirenService.playRadarPing();
      }, 1500);
    } else if (walkTimerRef.current) {
      clearInterval(walkTimerRef.current);
      walkTimerRef.current = null;
    }

    return () => {
      if (walkTimerRef.current) clearInterval(walkTimerRef.current);
    };
  }, [isSimulatingWalk, activeMode, safeRoute, shortestRoute]);

  // Offline Threat Assessment & Haven Rerouting
  const handleAssessThreat = async (text: string) => {
    setIsLoadingAi(true);
    const context: TelemetryContext = {
      currentPosition: userPosition || { lat: activeCorridor.center.lat, lng: activeCorridor.center.lng },
      activeCorridorId: activeCorridor.id,
      activeRouteType: activeMode === 'walk_dark' ? 'shortest_risk' : 'safe_corridor',
      isMoving: isSimulatingWalk,
      speedMps: 1.2,
      batteryLevel,
      isStationaryDurationSec: telemetry.stationaryDurationSeconds,
      nearestSanctuaries: activeCorridor.sanctuaries,
      preferredLanguage: language,
    };

    try {
      const result = evaluateOfflineCopilot(text, context);
      setLatestAssessment(result);

      if ((result.threatLevel === 'HIGH' || result.threatLevel === 'CRITICAL') && activeCorridor.sanctuaries.length > 0) {
        const targetSanc = activeCorridor.sanctuaries[0];
        setSelectedSanctuary(targetSanc);

        const evasionRoute = calculateSanctuaryDiversionRoute(
          activeCorridor,
          userPosition || { lat: activeCorridor.center.lat, lng: activeCorridor.center.lng },
          targetSanc
        );

        setSafeRoute(evasionRoute);
        setIsDiversionActive(true);
        sirenService.playSafetyChime();
      }
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleToggleTransit = () => {
    const nextState = !isTransitActive;
    setIsTransitActive(nextState);
    if (nextState) {
      telemetryEngine.acquireWakeLock();
      setIsSimulatingWalk(true);
      sirenService.playSafetyChime();
    } else {
      telemetryEngine.releaseWakeLock();
      setIsSimulatingWalk(false);
    }
  };

  const handleDispatchSms = () => {
    const incidentData = {
      userName: 'Priya S.',
      phoneNumber: '112',
      location: userPosition || { lat: activeCorridor.center.lat, lng: activeCorridor.center.lng },
      corridorName: activeCorridor.name,
      threatDetails: latestAssessment ? latestAssessment.spokenAdvice : 'Stagnation in dim area',
      nearestSanctuary: selectedSanctuary || activeCorridor.sanctuaries[0],
      timestamp: new Date().toLocaleTimeString(),
      batteryPercentage: batteryLevel,
    };

    dispatchNativeSms('112', incidentData);
  };

  const handleShareDispatch = (brief: string) => {
    const incidentData = {
      userName: 'Priya S.',
      location: userPosition || { lat: activeCorridor.center.lat, lng: activeCorridor.center.lng },
      corridorName: activeCorridor.name,
      threatDetails: brief,
      nearestSanctuary: selectedSanctuary || activeCorridor.sanctuaries[0],
      timestamp: new Date().toLocaleTimeString(),
      batteryPercentage: batteryLevel,
    };

    shareDistressAlert(incidentData);
  };

  const handleResetPosition = useCallback(() => {
    walkStepRef.current = 0;
    const { safeRoute: originalSafe } = calculateCorridorRoutes(activeCorridor);
    setSafeRoute(originalSafe);
    setIsDiversionActive(false);

    if (originalSafe.pathCoordinates.length > 0) {
      telemetryEngine.updatePosition({
        lat: originalSafe.pathCoordinates[0][0],
        lng: originalSafe.pathCoordinates[0][1],
      });
    }
    telemetryEngine.cancelAlert();
  }, [activeCorridor]);

  const handleTriggerStagnation = () => {
    telemetryEngine.triggerAlert('caution_stagnation');
    sirenService.playCautionTone();
  };

  const handleTriggerDeviation = () => {
    if (userPosition) {
      telemetryEngine.updatePosition({
        lat: userPosition.lat + 0.0006,
        lng: userPosition.lng + 0.0006,
      });
      sirenService.playCautionTone();
    }
  };

  // Helper to simulate realistic character-by-character typing
  const animateTyping = (text: string, onUpdate: (val: string) => void, onComplete: () => void) => {
    let currentIdx = 0;
    const interval = window.setInterval(() => {
      currentIdx++;
      onUpdate(text.substring(0, currentIdx));
      if (currentIdx >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 40);
  };

  // Choreographed Guided Demo Execution with Simulated Typing & Route Selection
  const executeDemoStep = useCallback((stepIdx: number) => {
    setDemoStepIndex(stepIdx);
    demoTimeInStepRef.current = 0;

    switch (stepIdx) {
      case 0: // Step 1: Simulate typing origin and destination
        setActiveCorridor(BENGALURU_CORRIDORS[0]); // Indiranagar
        setIsNetworkFailed(false);
        setIsOnline(true);
        setIsTransitActive(false);
        setIsSimulatingWalk(false);
        setActiveMode('walk_safe');
        setActiveTab('route');
        handleResetPosition();
        setEmergencyToast(null);

        setSpotlightTarget('search');
        setTimeout(() => searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);

        setDemoShowRoutes(false);
        setSimulatedFromText('');
        setSimulatedToText('');

        animateTyping('Indiranagar • Indiranagar Metro Gate 1', (val) => setSimulatedFromText(val), () => {
          setTimeout(() => {
            animateTyping('Indiranagar • Defence Colony Park Ave', (val) => setSimulatedToText(val), () => {
              setDemoShowRoutes(true);
              sirenService.playRadarPing();
            });
          }, 300);
        });
        break;

      case 1: // Step 2: Route comparison (shows dark cut then selects safe lit road)
        setDemoShowRoutes(true);
        setSimulatedFromText(undefined);
        setSimulatedToText(undefined);
        setSpotlightTarget('routing');
        setTimeout(() => activeTabPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);

        setActiveMode('walk_dark');
        setTimeout(() => {
          setActiveMode('walk_safe');
          sirenService.playSafetyChime();
        }, 3000);
        break;

      case 2: // Step 3: Walking the lit corridor with Sentinel
        setSpotlightTarget('walking');
        setTimeout(() => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);

        setActiveMode('walk_safe');
        setIsTransitActive(true);
        setIsSimulatingWalk(true);
        sirenService.playSafetyChime();
        break;

      case 3: // Step 4: Dead zone network drop & offline threat reroute
        setSpotlightTarget('emergency');
        setIsNetworkFailed(true);
        setIsOnline(false);
        setActiveTab('copilot');
        sirenService.playCautionTone();

        setEmergencyToast('🚨 Cellular Outage (0 Signal) • Offline Edge Haven Diversion Active');
        setTimeout(() => setEmergencyToast(null), 6500);

        setTimeout(() => {
          handleAssessThreat('A suspicious auto is trailing me with headlights turned off.');
        }, 1500);
        break;

      case 4: // Step 5: Safe Sanctuary Forecourt Arrival
        setSpotlightTarget('success');
        setIsSimulatingWalk(false);
        setIsTransitActive(false);
        setIsNetworkFailed(false);
        setActiveTab('sanctuaries');
        launchSafeArrivalConfetti();
        sirenService.playSafetyChime();

        setEmergencyToast(`✓ Safe Haven Reached: ${BENGALURU_CORRIDORS[0].sanctuaries[0]?.name ?? 'Nearest haven'} • Threat Cleared & Emergency Contacts Notified`);
        setTimeout(() => setEmergencyToast(null), 5500);
        setTimeout(() => activeTabPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
        break;

      default:
        break;
    }
  }, [handleResetPosition]);

  const handleStartGuidedDemo = () => {
    setIsDemoActive(true);
    setIsDemoPaused(false);
    setDemoProgress(0);
    executeDemoStep(0);

    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);

    const stepDurationsSec = [6, 7, 9, 13, 7];
    const totalDurationSec = stepDurationsSec.reduce((a, b) => a + b, 0);
    let elapsedOverall = 0;

    demoIntervalRef.current = window.setInterval(() => {
      if (isDemoPaused) return;

      elapsedOverall += 0.5;
      demoTimeInStepRef.current += 0.5;

      const progress = Math.min(100, (elapsedOverall / totalDurationSec) * 100);
      setDemoProgress(progress);

      setDemoStepIndex((currentIdx) => {
        const stepLimit = stepDurationsSec[currentIdx] || 7;
        if (demoTimeInStepRef.current >= stepLimit && currentIdx < DEMO_STAGES.length - 1) {
          const nextIdx = currentIdx + 1;
          executeDemoStep(nextIdx);
          return nextIdx;
        } else if (currentIdx >= DEMO_STAGES.length - 1 && demoTimeInStepRef.current >= stepLimit) {
          handleStopGuidedDemo();
          return currentIdx;
        }
        return currentIdx;
      });
    }, 500);
  };

  const handleStopGuidedDemo = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setIsDemoActive(false);
    setIsDemoPaused(false);
    setIsNetworkFailed(false);
    setIsOnline(true);
    setIsTransitActive(false);
    setIsSimulatingWalk(false);
    setDemoShowRoutes(true);
    setSpotlightTarget(null);
    setEmergencyToast(null);
    setSimulatedFromText(undefined);
    setSimulatedToText(undefined);
    handleResetPosition();
  };

  const handleSkipNextDemoStep = () => {
    if (demoStepIndex < DEMO_STAGES.length - 1) {
      executeDemoStep(demoStepIndex + 1);
    } else {
      handleStopGuidedDemo();
    }
  };

  const startNode =
    activeCorridor.nodes.find((n) => n.id === activeCorridor.startNodeId) || activeCorridor.nodes[0];
  const endNode =
    activeCorridor.nodes.find((n) => n.id === activeCorridor.endNodeId) ||
    activeCorridor.nodes[activeCorridor.nodes.length - 1];

  return (
    <div className="min-h-screen bg-carbon-bg text-carbon-textPrimary flex flex-col items-center justify-start p-2 sm:p-5 font-sans">
      {/* Covert OLED Screen */}
      <CovertScreen
        isActive={telemetry.covertModeActive}
        onExit={() => telemetryEngine.toggleCovertMode()}
        language={language}
      />

      {/* Dead-man Stagnation / Caution Alert Modal */}
      <StagnationAlertModal
        alertState={telemetry.alertState}
        countdownSeconds={telemetry.countdownRemainingSeconds}
        onCancelAlert={() => telemetryEngine.cancelAlert()}
        onTriggerSos={handleDispatchSms}
        sirenActive={telemetry.sirenActive}
        onToggleSiren={() => telemetryEngine.toggleSiren()}
        language={language}
      />

      {/* Floating Pitch Emergency Alert Toast */}
      {emergencyToast && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-[999] animate-fade-in select-none">
          <div className="p-3 bg-[#181116]/95 border border-carbon-red/60 rounded-2xl shadow-soft-lg backdrop-blur-md flex items-center space-x-3 text-xs font-semibold text-white">
            <div className="w-8 h-8 rounded-xl bg-carbon-red/20 border border-carbon-red/40 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-4 h-4 text-carbon-red-light animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-carbon-red-light tracking-wider">Automated Safety Event</div>
              <div className="text-xs text-white truncate">{emergencyToast}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full transition-all duration-300 ${isPhoneFrame ? 'max-w-[420px]' : 'max-w-4xl'}`}>
        {/* Sleek Demo Stage Pill Bar */}
        {isDemoActive && (
          <div className="mb-2.5 w-full">
            <GuidedDemoDirector
              currentStep={DEMO_STAGES[demoStepIndex]}
              progressPercent={demoProgress}
              isPaused={isDemoPaused}
              onTogglePause={() => setIsDemoPaused(!isDemoPaused)}
              onSkipNext={handleSkipNextDemoStep}
              onStop={handleStopGuidedDemo}
            />
          </div>
        )}

        {/* Consumer Phone Frame (Squircle Curves, Soft Colors) */}
        <div
          className={`w-full bg-carbon-bg overflow-hidden flex flex-col transition-all ${
            isPhoneFrame
              ? 'rounded-[28px] sm:rounded-[36px] border border-white/[0.08] shadow-soft-lg my-1 sm:my-2'
              : 'rounded-2xl border border-white/[0.08] shadow-soft-lg'
          }`}
        >
          {/* Minimalist Header */}
          <Header
            language={language}
            onLanguageChange={(l) => setLanguage(l)}
            isOnline={isOnline && !isNetworkFailed}
            batteryLevel={batteryLevel}
          />

          {/* Top Search & Destination Input Bar with Spotlight */}
          <div
            ref={searchSectionRef}
            className={`transition-all duration-500 rounded-2xl ${
              spotlightTarget === 'search'
                ? 'ring-2 ring-carbon-blue shadow-[0_0_26px_rgba(59,130,246,0.4)] scale-[1.008]'
                : ''
            }`}
          >
            <SearchRouteBar
              corridors={corridors}
              activeCorridor={activeCorridor}
              onSelectCorridor={(c) => setActiveCorridor(c)}
              activeMode={activeMode}
              onSelectMode={(m) => setActiveMode(m)}
              language={language}
              displayFromText={simulatedFromText}
              displayToText={simulatedToText}
            />
          </div>

          {/* Map Viewport Area (Rounded Squircle Map Container with Spotlight) */}
          <div
            ref={mapSectionRef}
            className={`relative w-full h-64 sm:h-72 px-3.5 transition-all duration-500 rounded-2xl ${
              spotlightTarget === 'walking'
                ? 'ring-2 ring-carbon-green shadow-[0_0_28px_rgba(16,185,129,0.35)] scale-[1.005]'
                : ''
            }`}
          >
            <SentinelHUD
              isTransitActive={isTransitActive}
              activeRoute={safeRoute}
              telemetry={telemetry}
              nearestSanctuary={selectedSanctuary || activeCorridor.sanctuaries[0]}
              isDiversionActive={isDiversionActive}
              isNetworkFailed={isNetworkFailed}
            />

            <InteractiveMap
              safeRoute={safeRoute}
              shortestRoute={shortestRoute}
              transitRoute={transitRoute}
              userPosition={userPosition}
              sanctuaries={activeCorridor.sanctuaries}
              center={activeCorridor.center}
              zoom={activeCorridor.zoom}
              isOnline={isOnline && !isNetworkFailed}
              onSelectSanctuary={(s) => {
                setSelectedSanctuary(s);
                setActiveTab('sanctuaries');
              }}
              activeMode={activeMode}
              isNetworkFailed={isNetworkFailed}
              isTransitActive={isTransitActive}
              showRoutes={isDemoActive ? demoShowRoutes : true}
              startName={startNode?.name || 'Start Point'}
              endName={endNode?.name || 'Destination'}
            />
          </div>

          {/* Segmented Squircle Bottom Tabs (Route / Havens / Assistant) */}
          <div className="mx-3.5 mt-3.5 p-1 bg-carbon-layer01 border border-white/[0.06] rounded-2xl flex items-center space-x-1 shadow-soft-sm">
            <button
              type="button"
              onClick={() => setActiveTab('route')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none ${
                activeTab === 'route'
                  ? 'bg-carbon-layer02 text-white shadow-soft-sm border border-white/[0.08]'
                  : 'text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-carbon-blue-light" />
              <span>Route</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sanctuaries')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none ${
                activeTab === 'sanctuaries'
                  ? 'bg-carbon-layer02 text-white shadow-soft-sm border border-white/[0.08]'
                  : 'text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-carbon-green-light" />
              <span>Safe Havens</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('copilot')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none ${
                activeTab === 'copilot'
                  ? 'bg-carbon-layer02 text-white shadow-soft-sm border border-white/[0.08]'
                  : 'text-carbon-textSecondary hover:text-carbon-textPrimary'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-carbon-cyan" />
              <span>Safety Assistant</span>
            </button>
          </div>

          {/* Active Tab Panel with Spotlight */}
          <div
            ref={activeTabPanelRef}
            className={`p-3.5 bg-carbon-bg space-y-3 transition-all duration-500 rounded-2xl ${
              spotlightTarget === 'routing'
                ? 'ring-2 ring-carbon-green shadow-[0_0_26px_rgba(16,185,129,0.35)] scale-[1.008]'
                : spotlightTarget === 'emergency'
                ? 'ring-2 ring-carbon-red shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-[1.008]'
                : spotlightTarget === 'success'
                ? 'ring-2 ring-carbon-green shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-[1.008]'
                : ''
            }`}
          >
            {activeTab === 'route' && (
              <RouteOptionsCard
                activeCorridor={activeCorridor}
                safeRoute={safeRoute}
                shortestRoute={shortestRoute}
                transitRoute={transitRoute}
                activeMode={activeMode}
                onSelectMode={(m) => setActiveMode(m)}
                isTransitActive={isTransitActive}
                onToggleTransit={handleToggleTransit}
                language={language}
              />
            )}

            {activeTab === 'sanctuaries' && (
              <SanctuaryListSheet
                sanctuaries={activeCorridor.sanctuaries}
                selectedSanctuary={selectedSanctuary}
                onSelectSanctuary={(s) => setSelectedSanctuary(s)}
                language={language}
              />
            )}

            {activeTab === 'copilot' && (
              <VoiceCopilotSheet
                onAssessDistress={handleAssessThreat}
                isLoading={isLoadingAi}
                latestAssessment={latestAssessment}
                onShareDispatch={handleShareDispatch}
                language={language}
              />
            )}

            {/* Permanent SOS & Disguise Bar (Soft Squircles) */}
            <div className="pt-1 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDispatchSms}
                className="flex-1 h-12 rounded-xl bg-carbon-red hover:bg-carbon-red-hover active:bg-carbon-red-active text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-soft-md transition-all active:scale-[0.98]"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>🚨 EMERGENCY SOS (112)</span>
              </button>

              <button
                type="button"
                onClick={() => telemetryEngine.toggleCovertMode()}
                className="h-12 px-3.5 rounded-xl bg-carbon-layer01 hover:bg-carbon-layer02 border border-white/[0.08] text-carbon-textSecondary hover:text-carbon-textPrimary flex items-center justify-center transition-all active:scale-95 shadow-soft-sm"
                title="Black Screen Pocket Mode"
                aria-label="Black screen pocket mode"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Simulator Drawer (Bottom) */}
        <div className="mt-3 w-full">
          <DemoControlPanel
            isOnline={isOnline && !isNetworkFailed}
            onToggleAirplaneMode={() => {
              setIsNetworkFailed(!isNetworkFailed);
              setIsOnline(!isOnline);
            }}
            isSimulatingWalk={isSimulatingWalk}
            onToggleSimulatedWalk={() => setIsSimulatingWalk(!isSimulatingWalk)}
            onResetPosition={handleResetPosition}
            onTriggerStagnation={handleTriggerStagnation}
            onTriggerDeviation={handleTriggerDeviation}
            onToggleCovert={() => telemetryEngine.toggleCovertMode()}
            isCovertActive={telemetry.covertModeActive}
            isSirenActive={telemetry.sirenActive}
            onToggleSiren={() => telemetryEngine.toggleSiren()}
            isPhoneFrame={isPhoneFrame}
            onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
            onTriggerScenario={(txt, l) => {
              setLanguage(l);
              handleAssessThreat(txt);
            }}
            isAutoPilotRunning={isDemoActive}
            autoPilotStageText={DEMO_STAGES[demoStepIndex]?.stageName || ''}
            onStartAutoPilot={handleStartGuidedDemo}
            onStopAutoPilot={handleStopGuidedDemo}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
