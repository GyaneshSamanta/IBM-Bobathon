export interface GeoPoint {
  lat: number;
  lng: number;
}

export type SanctuaryType = 'petrol_bunk' | 'pharmacy' | 'police_kiosk' | 'hospital';

export interface Sanctuary {
  id: string;
  name: string;
  nameKn: string;
  nameHi?: string;
  nameNe?: string;
  type: SanctuaryType;
  lat: number;
  lng: number;
  address: string;
  isOpen24x7: boolean;
  isStaffed: boolean;
  lightingRating: number; // 1 to 5 stars
  contactNumber: string;
  description: string;
}

export interface RoadNode {
  id: string;
  name: string;
  nameKn?: string;
  lat: number;
  lng: number;
  isLit: boolean;
  cctvCovered?: boolean;
}

export interface RoadSegment {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  isLit: boolean;
  hasActiveFrontage: boolean; // open shops, streetlights, residential watchmen
  surfaceType: 'paved_main' | 'secondary_road' | 'dirt_trail' | 'isolated_underpass';
  speedLimitKmh?: number;
  streetName: string;
}

export interface PublicTransitInfo {
  lineName: string;
  vehicleType: 'BMTC Bus' | 'Metro Feeder' | 'Shared Auto';
  boardingStop: string;
  alightingStop: string;
  departureFrequencyText: string;
  rideDurationMinutes: number;
  walkToStopMinutes: number;
  walkFromStopMinutes: number;
  safetyRating: string;
}

export interface TransitCorridor {
  id: string;
  name: string;
  nameKn: string;
  nameHi?: string;
  nameNe?: string;
  area: string;
  description: string;
  startNodeId: string;
  endNodeId: string;
  center: GeoPoint;
  zoom: number;
  nodes: RoadNode[];
  segments: RoadSegment[];
  sanctuaries: Sanctuary[];
  publicTransit?: PublicTransitInfo;
}

export interface RouteResult {
  id: string;
  name: string;
  nameKn?: string;
  type: 'safe_corridor' | 'shortest_risk' | 'public_transit';
  nodes: RoadNode[];
  pathCoordinates: [number, number][]; // [lat, lng] pairs for Leaflet polyline
  totalDistanceMeters: number;
  estimatedDurationMinutes: number;
  litPercentage: number; // 0 to 100%
  safetyScore: number; // 0 to 100
  sanctuariesAlongRoute: Sanctuary[];
  whyRecommended: string;
  whyAvoid?: string;
  color: string;
}
