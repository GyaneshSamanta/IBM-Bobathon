import React from 'react';
import { TransitCorridor } from '../types/corridor';
import { Footprints, Bus, AlertTriangle, ArrowUpDown, Compass } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';

interface SearchRouteBarProps {
  corridors: TransitCorridor[];
  activeCorridor: TransitCorridor;
  onSelectCorridor: (c: TransitCorridor) => void;
  activeMode: 'walk_safe' | 'walk_dark' | 'transit';
  onSelectMode: (mode: 'walk_safe' | 'walk_dark' | 'transit') => void;
  language: LanguageCode;
  displayFromText?: string;
  displayToText?: string;
}

export const SearchRouteBar: React.FC<SearchRouteBarProps> = ({
  corridors,
  activeCorridor,
  onSelectCorridor,
  activeMode,
  onSelectMode,
  displayFromText,
  displayToText,
}) => {
  const startNode =
    activeCorridor.nodes.find((n) => n.id === activeCorridor.startNodeId) || activeCorridor.nodes[0];
  const endNode =
    activeCorridor.nodes.find((n) => n.id === activeCorridor.endNodeId) ||
    activeCorridor.nodes[activeCorridor.nodes.length - 1];

  const fromValue = displayFromText !== undefined ? displayFromText : (startNode?.name || 'Start Point');
  const toValue = displayToText !== undefined ? displayToText : (endNode?.name || 'Destination');

  const handleNextCorridor = () => {
    const currentIdx = corridors.findIndex((c) => c.id === activeCorridor.id);
    const nextIdx = (currentIdx + 1) % corridors.length;
    onSelectCorridor(corridors[nextIdx]);
  };

  const getCorridorShortLabel = (corridor: TransitCorridor) => {
    if (corridor.id.includes('indiranagar')) return 'Indiranagar';
    if (corridor.id.includes('whitefield')) return 'Whitefield';
    if (corridor.id.includes('bellandur')) return 'Bellandur';
    if (corridor.id.includes('koramangala')) return 'Koramangala';
    if (corridor.id.includes('electronic-city')) return 'E-City';
    if (corridor.id.includes('hsr')) return 'HSR Layout';
    if (corridor.id.includes('mgroad')) return 'MG Road';
    if (corridor.id.includes('manyata')) return 'Manyata';
    return corridor.name.split(' ')[0];
  };

  return (
    <div className="p-3.5 space-y-2.5">
      {/* Curved Squircle Input Card (No harsh boxes, soft modern look) */}
      <div className="bg-carbon-layer01 border border-white/[0.08] rounded-2xl p-3 space-y-2.5 shadow-soft-sm">
        {/* From Field */}
        <div className="flex items-center space-x-3 bg-carbon-layer02 rounded-xl px-3 py-2 border border-white/[0.04] transition-colors hover:border-white/[0.1]">
          <div className="w-5 h-5 rounded-full bg-carbon-green flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-carbon-textHelper uppercase block font-semibold tracking-wider">From (Origin)</span>
            {displayFromText !== undefined ? (
              <div className="text-xs font-semibold text-carbon-textPrimary truncate">
                {fromValue}
              </div>
            ) : (
              <select
                value={activeCorridor.id}
                onChange={(e) => {
                  const found = corridors.find((c) => c.id === e.target.value);
                  if (found) onSelectCorridor(found);
                }}
                className="w-full bg-transparent text-xs font-semibold text-carbon-textPrimary focus:outline-none cursor-pointer truncate"
              >
                {corridors.map((c) => {
                  const originNode = c.nodes.find((n) => n.id === c.startNodeId) || c.nodes[0];
                  return (
                    <option key={`from-${c.id}`} value={c.id} className="bg-[#151c27] text-white">
                      {getCorridorShortLabel(c)} • {originNode?.name || c.name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>

        {/* Delicate Divider with Squircle Swap Button */}
        <div className="relative pl-6 pr-6">
          <div className="border-t border-white/[0.06]" />
          <button
            type="button"
            onClick={handleNextCorridor}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-carbon-layer02 hover:bg-carbon-layer03 border border-white/[0.08] rounded-xl text-carbon-textSecondary hover:text-carbon-blue-light transition-all active:scale-95 shadow-soft-sm"
            title="Switch Destination Corridor (Next Route)"
            aria-label="Switch destination route"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-carbon-blue-light" />
          </button>
        </div>

        {/* To Field */}
        <div className="flex items-center space-x-3 bg-carbon-layer02 rounded-xl px-3 py-2 border border-white/[0.04] transition-colors hover:border-white/[0.1]">
          <div className="w-5 h-5 rounded-full bg-carbon-blue flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white shadow-sm">
            B
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-carbon-textHelper uppercase block font-semibold tracking-wider">To (Destination)</span>
            {displayToText !== undefined ? (
              <div className="text-xs font-semibold text-carbon-textPrimary truncate">
                {toValue}
              </div>
            ) : (
              <select
                value={activeCorridor.id}
                onChange={(e) => {
                  const found = corridors.find((c) => c.id === e.target.value);
                  if (found) onSelectCorridor(found);
                }}
                className="w-full bg-transparent text-xs font-semibold text-carbon-textPrimary focus:outline-none cursor-pointer truncate"
              >
                {corridors.map((c) => {
                  const destNode = c.nodes.find((n) => n.id === c.endNodeId) || c.nodes[c.nodes.length - 1];
                  return (
                    <option key={`to-${c.id}`} value={c.id} className="bg-[#151c27] text-white">
                      {getCorridorShortLabel(c)} • {destNode?.name || c.name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Quick Bengaluru Corridors Chips (Horizontal scrollable squircle pill selector) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-1 text-[10px] font-semibold text-carbon-textHelper pl-1 pr-1 flex-shrink-0">
          <Compass className="w-3 h-3 text-carbon-blue-light" />
          <span>Hubs:</span>
        </div>
        {corridors.map((c) => {
          const isSelected = c.id === activeCorridor.id;
          return (
            <button
              key={`chip-${c.id}`}
              type="button"
              onClick={() => onSelectCorridor(c)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                isSelected
                  ? 'bg-carbon-blue/20 border-carbon-blue/50 text-carbon-blue-light shadow-sm'
                  : 'bg-carbon-layer01 border-white/[0.06] text-carbon-textSecondary hover:text-carbon-textPrimary hover:bg-carbon-layer02'
              }`}
            >
              {getCorridorShortLabel(c)}
            </button>
          );
        })}
      </div>

      {/* Mode Switcher Pills (Rounded squircle tabs with soft glowing borders) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Mode 1: Safe Walk */}
        <button
          type="button"
          onClick={() => onSelectMode('walk_safe')}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none border ${
            activeMode === 'walk_safe'
              ? 'bg-carbon-green/15 border-carbon-green/40 text-carbon-green-light shadow-glow-green'
              : 'bg-carbon-layer01 border-white/[0.06] text-carbon-textSecondary hover:bg-carbon-layer02 hover:text-carbon-textPrimary'
          }`}
        >
          <Footprints className="w-3.5 h-3.5 text-carbon-green" />
          <span>Safe Walk</span>
        </button>

        {/* Mode 2: Public Transit */}
        <button
          type="button"
          onClick={() => onSelectMode('transit')}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none border ${
            activeMode === 'transit'
              ? 'bg-carbon-blue/15 border-carbon-blue/40 text-carbon-blue-light shadow-glow-blue'
              : 'bg-carbon-layer01 border-white/[0.06] text-carbon-textSecondary hover:bg-carbon-layer02 hover:text-carbon-textPrimary'
          }`}
        >
          <Bus className="w-3.5 h-3.5 text-carbon-blue-light" />
          <span>Transit</span>
        </button>

        {/* Mode 3: Dark Shortcut */}
        <button
          type="button"
          onClick={() => onSelectMode('walk_dark')}
          className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all select-none border ${
            activeMode === 'walk_dark'
              ? 'bg-carbon-red/15 border-carbon-red/40 text-carbon-red-light shadow-glow-red'
              : 'bg-carbon-layer01 border-white/[0.06] text-carbon-textSecondary hover:bg-carbon-layer02 hover:text-carbon-textPrimary'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-carbon-red-light" />
          <span>Dark Cut</span>
        </button>
      </div>
    </div>
  );
};
