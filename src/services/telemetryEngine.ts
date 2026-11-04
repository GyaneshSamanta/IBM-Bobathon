import { GeoPoint, RouteResult } from '../types/corridor';
import { AlertState, TelemetryState } from '../types/telemetry';
import { calculateHaversineDistanceMeters } from './offlineStorage';
import { sirenService } from './audioSiren';

export class TelemetryEngine {
  private state: TelemetryState = {
    currentPosition: null,
    activeNodeIndex: 0,
    isStationary: false,
    stationaryDurationSeconds: 0,
    isOffCorridor: false,
    deviationMeters: 0,
    alertState: 'normal',
    countdownRemainingSeconds: 30,
    sirenActive: false,
    covertModeActive: false,
  };

  private activeRoute: RouteResult | null = null;
  private previousPosition: GeoPoint | null = null;
  private listeners: ((state: TelemetryState) => void)[] = [];
  private countdownTimer: number | null = null;
  private wakeLockSentinel: unknown = null;

  subscribe(listener: (state: TelemetryState) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  setRoute(route: RouteResult) {
    this.activeRoute = route;
    if (route.pathCoordinates.length > 0) {
      const startCoord = route.pathCoordinates[0];
      this.state.currentPosition = { lat: startCoord[0], lng: startCoord[1] };
      this.state.activeNodeIndex = 0;
    }
    this.notify();
  }

  updatePosition(newPos: GeoPoint) {
    if (!this.activeRoute) {
      this.state.currentPosition = newPos;
      this.notify();
      return;
    }

    // Check stationary threshold
    if (this.previousPosition) {
      const movedMeters = calculateHaversineDistanceMeters(this.previousPosition, newPos);
      if (movedMeters < 4) {
        this.state.isStationary = true;
        this.state.stationaryDurationSeconds += 2; // Simulated interval update
      } else {
        this.state.isStationary = false;
        this.state.stationaryDurationSeconds = 0;
      }
    }
    this.previousPosition = newPos;
    this.state.currentPosition = newPos;

    // Check corridor deviation
    let minDistanceToRoute = Infinity;
    let closestIndex = 0;

    this.activeRoute.pathCoordinates.forEach(([lat, lng], idx) => {
      const dist = calculateHaversineDistanceMeters(newPos, { lat, lng });
      if (dist < minDistanceToRoute) {
        minDistanceToRoute = dist;
        closestIndex = idx;
      }
    });

    this.state.deviationMeters = minDistanceToRoute;
    this.state.activeNodeIndex = closestIndex;

    // Corridor envelope: 35 meters
    if (minDistanceToRoute > 35) {
      this.state.isOffCorridor = true;
      if (this.state.alertState === 'normal') {
        this.triggerAlert('deviation_alert');
      }
    } else {
      this.state.isOffCorridor = false;
    }

    // Stagnation threshold: 180 seconds stationary
    if (this.state.stationaryDurationSeconds >= 180 && this.state.alertState === 'normal') {
      this.triggerAlert('caution_stagnation');
    }

    this.notify();
  }

  triggerAlert(type: AlertState) {
    this.state.alertState = type;
    this.state.countdownRemainingSeconds = 30;

    // Trigger subtle haptic vibration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    if (this.countdownTimer) clearInterval(this.countdownTimer);

    this.countdownTimer = window.setInterval(() => {
      if (this.state.countdownRemainingSeconds > 0) {
        this.state.countdownRemainingSeconds -= 1;
        this.notify();
      } else {
        // Countdown expired: Auto-escalate to SOS active
        this.escalateToSos();
      }
    }, 1000);

    this.notify();
  }

  escalateToSos() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.state.alertState = 'sos_active';
    this.state.sirenActive = true;
    sirenService.startSiren();

    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 800]);
    }

    this.notify();
  }

  cancelAlert() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.state.alertState = 'normal';
    this.state.countdownRemainingSeconds = 30;
    this.state.stationaryDurationSeconds = 0;
    this.state.sirenActive = false;
    sirenService.stopSiren();
    this.notify();
  }

  toggleSiren(): boolean {
    if (this.state.sirenActive) {
      sirenService.stopSiren();
      this.state.sirenActive = false;
    } else {
      sirenService.startSiren();
      this.state.sirenActive = true;
      this.state.alertState = 'sos_active';
    }
    this.notify();
    return this.state.sirenActive;
  }

  toggleCovertMode(): boolean {
    this.state.covertModeActive = !this.state.covertModeActive;
    this.notify();
    return this.state.covertModeActive;
  }

  async acquireWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
        this.wakeLockSentinel = await nav.wakeLock.request('screen');
        console.log('[KAAVALU Telemetry] Screen Wake Lock active.');
      }
    } catch (err) {
      console.warn('[KAAVALU Telemetry] Wake lock error:', err);
    }
  }

  releaseWakeLock() {
    if (this.wakeLockSentinel) {
      const sentinel = this.wakeLockSentinel as { release?: () => Promise<void> };
      sentinel.release?.();
      this.wakeLockSentinel = null;
    }
  }

  getState(): TelemetryState {
    return { ...this.state };
  }
}

export const telemetryEngine = new TelemetryEngine();
