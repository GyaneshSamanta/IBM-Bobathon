# IBM Bob: Development Tasks & Workspace Guide

> **Project:** KAAVALU (ಕಾವಲು) — Bengaluru Safe Night Transit Companion  
> **Challenge:** IBM Bobathon: Build for Bengaluru  
> **Theme:** Theme 3: Safer Communities, Stronger Futures  
> **Authoring Assistant:** IBM Bob  

---

## 🛠️ Minor Last-Minute Tasks for Bob

To finalize the repository before submission, IBM Bob can execute the following targeted micro-tasks directly:

### Task 1: Verify Carbon Design Tokens
* **Objective:** Ensure all color classes in `tailwind.config.js` map to IBM Carbon Gray 100 midnight palette.
* **Command:** `npm run build`
* **Expected Result:** Clean compile in `< 1.5s` with 0 TypeScript errors.

### Task 2: Validate 8-Corridor Street Geometries
* **Objective:** Verify that each corridor in `src/data/bengaluruCorridors.ts` has:
  * Safe route distance physically longer than dark shortcut distance (so Dijkstra strictly identifies the dark shortcut as shortest, while Safety A* selects the safe lit road).
  * Valid latitude/longitude bounds within Greater Bengaluru (`12.80` to `13.10` Lat, `77.50` to `77.80` Lng).
  * Verified 24/7 sanctuaries (HP, Shell, BPCL, Apollo Pharmacy, Bengaluru City Police Posts).

### Task 3: PWA Manifest & Offline Cache Sync Check
* **Objective:** Inspect `public/manifest.json` and `src/services/offlineStorage.ts` to ensure `kaavalu_corridors_v4` is synchronized.
* **Verification:** Open DevTools Application tab $\rightarrow$ IndexedDB $\rightarrow$ verify 8 corridors present offline.

### Task 4: Run Final Build & Commit
* **Commit Message Suggestion:** `chore(bob): final build verification, Carbon design token audit, and offline asset validation`

---

## 🏗️ Repository Architecture Overview

```text
├── .bob/                       # IBM Bob configuration & architectural rules
│   ├── config.json             # Bob project configuration
│   └── rules.md                # 70/30 offline architecture & Carbon standards
├── BOB.md                      # This file (Bob developer instructions)
├── SUBMISSION.md               # Pre-filled official submission copy & answers
├── Competition-Guidelines      # Hackathon challenge guidelines & rubric
├── PITCH_SCRIPT.md             # 2.5-minute timed winning pitch script
├── EVALUATION_RUBRIC.md        # 20/20 rubric self-assessment breakdown
├── public/                     # PWA icons, manifest, audio chimes
├── src/
│   ├── components/             # React Carbon UI components
│   │   ├── Header.tsx          # Minimalist header with language switcher
│   │   ├── SearchRouteBar.tsx  # Dynamic search bar with 8 hub chips
│   │   ├── InteractiveMap.tsx  # Street-conforming Leaflet map (0 API key)
│   │   ├── RouteOptionsCard.tsx# Glanceable metric pills & safe haven badges
│   │   ├── SentinelHUD.tsx     # Turn-by-turn guidance & unified offline HUD
│   │   ├── GuidedDemoDirector.tsx # 5-stage auto-scroll & spotlight director
│   │   ├── VoiceCopilotSheet.tsx  # watsonx Granite natural language assistant
│   │   ├── SanctuaryListSheet.tsx # 24/7 verified haven cards
│   │   ├── DemoControlPanel.tsx   # Presenter simulation toolbox
│   │   ├── CovertScreen.tsx       # OLED black pocket transit screen
│   │   └── StagnationAlertModal.tsx # Dead-man stop detector modal
│   ├── data/
│   │   └── bengaluruCorridors.ts  # 8 authentic Bengaluru corridors
│   ├── services/
│   │   ├── safetyRouter.ts        # Safety-Weighted A* & Dijkstra engines
│   │   ├── offlineStorage.ts      # IndexedDB offline corridor storage
│   │   ├── watsonxService.ts      # watsonx Granite agent + offline neural fallback
│   │   ├── emergencyDispatcher.ts # Native SMS & 112 distress dispatcher
│   │   ├── audioSiren.ts          # Web Audio synthesizer chimes & sirens
│   │   └── telemetryEngine.ts     # Dead-man stagnation & accelerometer telemetry
│   ├── i18n/
│   │   └── translations.ts        # 4 languages: Kannada, English, Hindi, Nepali
│   └── types/
│       ├── corridor.ts            # Corridor, RoadNode, RoadSegment, Sanctuary types
│       ├── copilot.ts             # watsonx Agent assessment schema
│       └── telemetry.ts          # Sensor state schema
└── tailwind.config.js          # Carbon design tokens & squircle curvature
```
