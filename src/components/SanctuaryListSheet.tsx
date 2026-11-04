import React from 'react';
import { Sanctuary } from '../types/corridor';
import { Shield, Fuel, Cross, Phone, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface SanctuaryListSheetProps {
  sanctuaries: Sanctuary[];
  selectedSanctuary: Sanctuary | null;
  onSelectSanctuary: (sanc: Sanctuary) => void;
  language: LanguageCode;
}

export const SanctuaryListSheet: React.FC<SanctuaryListSheetProps> = ({
  sanctuaries,
  selectedSanctuary,
  onSelectSanctuary,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const getSanctuaryIcon = (type: Sanctuary['type']) => {
    switch (type) {
      case 'petrol_bunk':
        return <Fuel className="w-4 h-4 text-carbon-green" />;
      case 'pharmacy':
        return <Cross className="w-4 h-4 text-carbon-blue-light" />;
      case 'police_kiosk':
        return <Shield className="w-4 h-4 text-carbon-cyan" />;
      default:
        return <Shield className="w-4 h-4 text-carbon-red" />;
    }
  };

  return (
    <div className="bg-carbon-layer01 border border-white/[0.08] rounded-2xl p-3.5 space-y-3 shadow-soft-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-carbon-textPrimary uppercase tracking-wider flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-carbon-green" />
            {t.sanctuaryTab} ({sanctuaries.length})
          </h3>
          <p className="text-xs text-carbon-textSecondary mt-0.5">
            Verified open places with security guards or active staff
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-carbon-green/10 text-carbon-green-light border border-carbon-green/20">
          24/7 Verified
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
        {sanctuaries.map((sanc) => {
          const isSelected = selectedSanctuary?.id === sanc.id;
          const name = language === 'kn' ? sanc.nameKn : sanc.name;

          return (
            <div
              key={sanc.id}
              onClick={() => onSelectSanctuary(sanc)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-carbon-layer02 border-carbon-green shadow-glow-green'
                  : 'bg-carbon-layer02/60 border-white/[0.06] hover:bg-carbon-layer02'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 rounded-lg bg-carbon-layer01 border border-white/[0.06] mt-0.5">
                    {getSanctuaryIcon(sanc.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-carbon-textPrimary leading-tight">
                      {name}
                    </h4>
                    <p className="text-[11px] text-carbon-textSecondary mt-0.5 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      {sanc.address}
                    </p>

                    <div className="flex items-center space-x-2 mt-1.5 text-[11px] text-carbon-green font-medium">
                      <span className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Open 24/7
                      </span>
                      <span className="text-carbon-textHelper">• Staff on duty</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSanctuary(sanc);
                    }}
                    className="p-2 bg-carbon-layer01 hover:bg-carbon-layer03 border border-white/[0.08] rounded-lg text-carbon-textPrimary transition-colors"
                    title="Navigate to this haven"
                    aria-label="Navigate to this haven"
                  >
                    <Navigation className="w-3.5 h-3.5 text-carbon-blue-light" />
                  </button>
                  <a
                    href={`tel:${sanc.contactNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-carbon-layer01 hover:bg-carbon-green/20 border border-white/[0.08] rounded-lg text-carbon-green transition-colors"
                    title={t.callSanctuary}
                    aria-label="Call haven"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
