import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteResult, Sanctuary, GeoPoint } from '../types/corridor';
import { Navigation, WifiOff } from 'lucide-react';

interface InteractiveMapProps {
  safeRoute: RouteResult;
  shortestRoute: RouteResult;
  transitRoute?: RouteResult;
  userPosition: GeoPoint | null;
  sanctuaries: Sanctuary[];
  center: GeoPoint;
  zoom: number;
  isOnline: boolean;
  onSelectSanctuary: (sanc: Sanctuary) => void;
  activeMode: 'walk_safe' | 'walk_dark' | 'transit';
  isNetworkFailed?: boolean;
  isTransitActive?: boolean;
  startName?: string;
  endName?: string;
  showRoutes?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  safeRoute,
  shortestRoute,
  transitRoute,
  userPosition,
  sanctuaries,
  center,
  zoom,
  isOnline,
  onSelectSanctuary,
  activeMode = 'walk_safe',
  isNetworkFailed = false,
  isTransitActive = false,
  startName = 'Metro Station',
  endName = 'Destination',
  showRoutes = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const safePolylineRef = useRef<L.Polyline | null>(null);
  const safeGlowPolylineRef = useRef<L.Polyline | null>(null);
  const dangerPolylineRef = useRef<L.Polyline | null>(null);
  const transitPolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const sanctuaryMarkersRef = useRef<L.Marker[]>([]);

  // 1. Initialize Leaflet Map with OpenStreetMap Standard Tiles + Carbon Dark Filter (Zero API Key / Zero Watermarks)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const osmTileLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          className: 'carbon-map-tiles',
        }
      );

      osmTileLayer.addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // 2. Pan & Zoom Updates
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, { animate: true });
    }
  }, [center.lat, center.lng, zoom]);

  // 3. Render Smooth Polylines Following Streets & Alleys
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (safeGlowPolylineRef.current) map.removeLayer(safeGlowPolylineRef.current);
    if (safePolylineRef.current) map.removeLayer(safePolylineRef.current);
    if (dangerPolylineRef.current) map.removeLayer(dangerPolylineRef.current);
    if (transitPolylineRef.current) map.removeLayer(transitPolylineRef.current);

    // If routes are hidden (e.g. during simulated typing), do not draw lines
    if (!showRoutes) return;

    // 1. Safe Route (Soft Emerald Line)
    if (safeRoute.pathCoordinates && safeRoute.pathCoordinates.length > 0) {
      const isSelected = activeMode === 'walk_safe';
      safeGlowPolylineRef.current = L.polyline(safeRoute.pathCoordinates, {
        color: '#10b981',
        weight: isSelected ? 12 : 6,
        opacity: isSelected ? 0.35 : 0.15,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      safePolylineRef.current = L.polyline(safeRoute.pathCoordinates, {
        color: '#10b981',
        weight: isSelected ? 5.5 : 3.5,
        opacity: isSelected ? 1.0 : 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // 2. Dark Shortcut (Soft Coral Red Dashed)
    if (shortestRoute.pathCoordinates && shortestRoute.pathCoordinates.length > 0) {
      const isSelected = activeMode === 'walk_dark';
      dangerPolylineRef.current = L.polyline(shortestRoute.pathCoordinates, {
        color: '#ef4444',
        weight: isSelected ? 5 : 3.5,
        opacity: isSelected ? 0.95 : 0.55,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // 3. Public Transit (Soft Sky Blue)
    if (transitRoute && activeMode === 'transit' && transitRoute.pathCoordinates.length > 0) {
      transitPolylineRef.current = L.polyline(transitRoute.pathCoordinates, {
        color: '#38bdf8',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // Auto-fit bounds when routes become visible
    if (showRoutes && safeRoute.pathCoordinates.length > 1) {
      const bounds = L.latLngBounds(safeRoute.pathCoordinates);
      map.flyToBounds(bounds, { padding: [35, 35], duration: 0.8 });
    }
  }, [safeRoute, shortestRoute, transitRoute, activeMode, showRoutes]);

  // 4. Compact Google Maps Style Origin & Destination Markers (No text overlap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (startMarkerRef.current) map.removeLayer(startMarkerRef.current);
    if (endMarkerRef.current) map.removeLayer(endMarkerRef.current);

    if (safeRoute.pathCoordinates && safeRoute.pathCoordinates.length > 0) {
      const startCoord = safeRoute.pathCoordinates[0];
      const endCoord = safeRoute.pathCoordinates[safeRoute.pathCoordinates.length - 1];

      // Origin Pin: Clean green circle with inner white core
      const startIcon = L.divIcon({
        className: 'origin-marker',
        html: `
          <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #10b981; border: 2.5px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; font-weight: bold; font-family: 'IBM Plex Sans', sans-serif;">
              A
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      startMarkerRef.current = L.marker(startCoord, { icon: startIcon, zIndexOffset: 800 }).addTo(map);
      startMarkerRef.current.bindPopup(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; padding: 2px;">
          <div style="font-size: 10px; color: #10b981; font-weight: 700; text-transform: uppercase;">Origin</div>
          <div style="font-size: 12px; font-weight: 600; color: #f8fafc;">${startName}</div>
        </div>
      `);

      // Destination Pin: Only show if routes are ready / destination entered
      if (showRoutes) {
        const endIcon = L.divIcon({
          className: 'dest-marker',
          html: `
            <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #3b82f6; border: 2.5px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; font-weight: bold; font-family: 'IBM Plex Sans', sans-serif;">
                B
              </div>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        endMarkerRef.current = L.marker(endCoord, { icon: endIcon, zIndexOffset: 800 }).addTo(map);
        endMarkerRef.current.bindPopup(`
          <div style="font-family: 'IBM Plex Sans', sans-serif; padding: 2px;">
            <div style="font-size: 10px; color: #38bdf8; font-weight: 700; text-transform: uppercase;">Destination</div>
            <div style="font-size: 12px; font-weight: 600; color: #f8fafc;">${endName}</div>
          </div>
        `);
      }
    }
  }, [safeRoute, startName, endName, showRoutes]);

  // 5. Render Safe Havens / Sanctuaries (Rounded squircle tiles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    sanctuaryMarkersRef.current.forEach((m) => map.removeLayer(m));
    sanctuaryMarkersRef.current = [];

    sanctuaries.forEach((sanc) => {
      let iconColor = '#10b981';
      let iconEmoji = '⛽';

      if (sanc.type === 'petrol_bunk') {
        iconColor = '#10b981';
        iconEmoji = '⛽';
      } else if (sanc.type === 'pharmacy') {
        iconColor = '#38bdf8';
        iconEmoji = '💊';
      } else if (sanc.type === 'police_kiosk') {
        iconColor = '#22d3ee';
        iconEmoji = '🛡️';
      } else if (sanc.type === 'hospital') {
        iconColor = '#ef4444';
        iconEmoji = '🏥';
      }

      const customIcon = L.divIcon({
        className: 'sanctuary-pin',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #151c27;
            border: 1.5px solid ${iconColor};
            box-shadow: 0 4px 12px rgba(0,0,0,0.7);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${iconEmoji}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([sanc.lat, sanc.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; padding: 2px;">
          <div style="font-size: 12px; font-weight: 700; color: #f8fafc; margin-bottom: 2px;">${sanc.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 3px;">${sanc.address}</div>
          <div style="font-size: 10px; color: #10b981; font-weight: 600;">✓ Open 24/7 • Staff on duty</div>
        </div>
      `);
      marker.on('click', () => onSelectSanctuary(sanc));
      sanctuaryMarkersRef.current.push(marker);
    });
  }, [sanctuaries, onSelectSanctuary]);

  // 6. User Position Live Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userPosition) return;

    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'user-pin',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(56, 189, 248, 0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(56, 189, 248, 0.4);"></div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #38bdf8; border: 2.5px solid #ffffff; box-shadow: 0 0 10px #38bdf8;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
    }
  }, [userPosition]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && userPosition) {
      mapInstanceRef.current.setView([userPosition.lat, userPosition.lng], 16, { animate: true });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, { animate: true });
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[310px] bg-carbon-bg overflow-hidden transition-all duration-300 rounded-2xl border ${
        isNetworkFailed ? 'border-carbon-red shadow-glow-red' : 'border-white/[0.08]'
      }`}
    >
      <div ref={mapContainerRef} className="w-full h-full min-h-[310px] z-0" />

      {/* Network Failure Pill Banner: ONLY rendered if transit SentinelHUD is NOT active to eliminate double banner overlap */}
      {isNetworkFailed && !isTransitActive && (
        <div className="absolute top-3 inset-x-3 z-[440] bg-carbon-red text-white px-3 py-2 rounded-xl border border-carbon-red/40 shadow-soft-lg flex items-center justify-between animate-fade-in text-xs font-semibold backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-3.5 h-3.5 animate-pulse flex-shrink-0" />
            <span>Cellular signal lost • Kaavalu running 100% offline</span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-black/30">
            Offline
          </span>
        </div>
      )}

      {/* Recenter Button (Rounded Squircle) */}
      <button
        type="button"
        onClick={handleRecenter}
        aria-label="Recenter map"
        className="absolute bottom-3 right-3 z-[400] p-2 bg-carbon-layer01/90 hover:bg-carbon-layer02 text-carbon-textPrimary border border-white/[0.1] rounded-xl transition-all shadow-soft-sm active:scale-95 backdrop-blur-md"
        title="Recenter location"
      >
        <Navigation className="w-4 h-4 text-carbon-blue-light" />
      </button>

      {/* Subtle Bottom-Left Legend (Rounded Squircle) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-carbon-layer01/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.08] shadow-soft-sm flex items-center space-x-3 text-[11px]">
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-1.5 bg-carbon-green rounded-full" />
          <span className="text-carbon-textPrimary font-medium">Safe Lit Road</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-0.5 border-b-2 border-dashed border-carbon-red" />
          <span className="text-carbon-textSecondary">Dark Alley (Avoid)</span>
        </div>
      </div>
    </div>
  );
};
