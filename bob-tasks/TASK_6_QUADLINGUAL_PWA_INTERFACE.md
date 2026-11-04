# Task 6: Quad-Lingual PWA Interface & Wireframe Implementation

## Context
A woman walking home in Bengaluru at 11 PM needs an intuitive, high-contrast interface designed for immediate clarity.
KAAVALU supports **4 languages**:
1. **ಕನ್ನಡ (Kannada)** — Native state language of Karnataka.
2. **English** — Universal urban interface.
3. **हिंदी (Hindi)** — Widely understood across central and northern migrant workers.
4. **नेपाली (Nepali)** — Crucial inclusion for Bengaluru's 2.5 lakh Nepali hospitality, healthcare, and retail workforce.

The wireframe and visual structure are defined in `plan/Kaavalu-Wireframes.html`.

## Objective
Translate the wireframe prototype into production-grade React components with full quad-lingual localization and mobile-responsive layout.

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 6 of KAAVALU (ಕಾವಲು): Quad-Lingual PWA Interface.

Reference `plan/Kaavalu-Wireframes.html` for layout, styling, and color schemes.

Please build the component architecture:

1. Localization Engine in `src/i18n/translations.ts`:
   - Support 4 language keys: `kn` (Kannada), `en` (English), `hi` (Hindi), `ne` (Nepali).
   - Translations for all UI strings:
     - App title: "ಕಾವಲು — ಸುರಕ್ಷಿತ ಸಂಚಾರ ಸಂಗಾತಿ" / "Kaavalu — Safe Transit Companion"
     - Safe corridor badge: "🟢 ಸುರಕ್ಷಿತ ರಸ್ತೆ (ಬೆಳಕು ಇದೆ)" / "🟢 Safe Corridor (Well-Lit)"
     - Dark shortcut warning: "🔴 ಕತ್ತಲೆಯ ದಾರಿ (ಬೇಡ)" / "🔴 Dark Shortcut (Avoid)"
     - Start journey: "🚀 ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ" / "🚀 Start Protected Transit"
     - Sanctuary card: "🏪 60 ಮೀಟರ್‌ ಬಲಕ್ಕೆ ಶೆಲ್ ಪೆಟ್ರೋಲ್ ಬಂಕ್ ಇದೆ" / "🏪 Shell Fuel Station 60m right"
     - Offline ready: "📴 ಆಫ್‌ಲೈನ್ ನಕ್ಷೆ ಸಿದ್ಧವಾಗಿದೆ" / "📴 Offline Map Ready"
     - Threat input placeholder: "ಏನಾದರೂ ಅನುಮಾನವಿದೆಯೇ? ಮಾತನಾಡಿ..." / "Sense something suspicious? Speak or type..."
     - Siren trigger, covert mode, cancel buttons, and dispatch notices.
   - React Hook: `useTranslation()` with `language`, `setLanguage(lang)`, and `t(key: string): string`.

2. Component Architecture:
   - `src/components/Header.tsx`:
     - Kaavalu shield emblem + Kannada typography.
     - Quad-lingual language dropdown selector.
     - Live Online / Offline Airplane Mode badge (IndexedDB status).
   - `src/components/CorridorMapCanvas.tsx`:
     - Visual SVG/Canvas rendering representing Bengaluru transit route.
     - Shows Safe Corridor (emerald green stroke with lighting glow) vs Shortest Dark Route (dashed red path).
     - Renders dynamic animated user location marker with pulsing radar ring.
     - Renders Sanctuary POI pins (fuel bunk, pharmacy, police) with interactive tooltips.
   - `src/components/RouteSelectorCard.tsx`:
     - Side-by-side or stacked route comparison.
     - Displays metrics: Lighting % (94% vs 42%), Distance (1.4km vs 1.1km), Safety Score (92/100 vs 34/100).
   - `src/components/VoiceCopilotWidget.tsx`:
     - Floating audio/mic button.
     - Audio recording simulation + preset situational quick-triggers (e.g. "Auto following me", "Dark alley ahead").
     - Displays watsonx Granite-3B agent analysis card with tactical rerouting instructions.
   - `src/components/SanctuaryCard.tsx`:
     - Displays nearest safe haven details (name, distance, 24/7 lit status, verified staff, native call link).
   - `src/components/StagnationAlertModal.tsx`:
     - 30-second emergency countdown modal when stagnation or corridor deviation is detected.
     - Slide-to-cancel safety slider or button.
     - Direct button to trigger cellular SMS dispatch or stop siren.
   - `src/components/CovertScreen.tsx`:
     - Fullscreen OLED black overlay with stealth sentinel heartbeat pulse.

3. Main App Layout (`src/App.tsx`):
   - Integrates all components into a seamless mobile-first responsive layout.
   - Fits standard mobile viewport (390px - 430px) and centers elegantly on desktop presentation screens.
```

---

## Verification Criteria
- [ ] Language switches instantly across Kannada, English, Hindi, and Nepali without page reload.
- [ ] Safe Corridor vs Dark Shortcut comparison displays accurate lighting and safety metrics.
- [ ] Voice copilot widget allows triggering sample threats and displays watsonx tactical rerouting.
- [ ] Stagnation alert and covert mode overlays function cleanly.
