import { GeoPoint, Sanctuary } from './corridor';

export type AlertState = 'normal' | 'caution_stagnation' | 'deviation_alert' | 'sos_active';

export interface TelemetryState {
  currentPosition: GeoPoint | null;
  activeNodeIndex: number;
  isStationary: boolean;
  stationaryDurationSeconds: number;
  isOffCorridor: boolean;
  deviationMeters: number;
  alertState: AlertState;
  countdownRemainingSeconds: number;
  sirenActive: boolean;
  covertModeActive: boolean;
}

export interface IncidentData {
  userName: string;
  phoneNumber?: string;
  location: GeoPoint;
  corridorName: string;
  threatDetails?: string;
  nearestSanctuary?: Sanctuary;
  timestamp: string;
  batteryPercentage: number;
}
