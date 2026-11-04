import { GeoPoint, Sanctuary } from './corridor';

export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TelemetryContext {
  currentPosition: GeoPoint;
  activeCorridorId: string;
  activeRouteType: 'safe_corridor' | 'shortest_risk';
  isMoving: boolean;
  speedMps: number;
  batteryLevel: number;
  isStationaryDurationSec: number;
  nearestSanctuaries: Sanctuary[];
  preferredLanguage: 'kn' | 'en' | 'hi' | 'ne';
}

export interface AgentAssessmentResult {
  threatLevel: ThreatSeverity;
  threatCategory: 'suspicious_vehicle' | 'unlit_road' | 'physical_pursuit' | 'general_fear' | 'medical_distress' | 'lost_off_path';
  spokenAdvice: string; // Spoken or read back in user's active language
  tacticalAction: string; // Concrete tactical physical action (e.g., "Enter Shell forecourt 60m ahead")
  targetSanctuaryId: string | null;
  targetSanctuaryName?: string;
  recommendedAction: 'divert_to_sanctuary' | 'continue_on_corridor' | 'sound_alarm_and_sos' | 'call_police';
  structuredDispatchBrief: string; // Structured text for WhatsApp / SMS emergency dispatch
  confidenceScore: number;
  timestamp: string;
}
