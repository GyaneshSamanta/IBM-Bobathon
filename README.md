# 🛡️ KAAVALU (ಕಾವಲು)
### The Offline-First Safe Night Transit Guardian for Bengaluru
**Track:** IBM Bobathon — Theme 3: Safer Communities, Stronger Futures  
**Built with:** IBM Bob & IBM watsonx.ai (Granite-3-8b-instruct)  
**Live Demo:** Local PWA on `http://localhost:5173/`

---

## 🌟 Overview
**KAAVALU (ಕಾವಲು)** (*Kannada for 'The Sentinel' or 'Vigil'*) is an offline-first safe night transit guardian engineered for women walking home after dark in Bengaluru. 

While conventional mapping apps fail when cellular connectivity drops in flyover underpasses, unlit bottlenecks, and back-alleys, KAAVALU operates on a **70/30 Hybrid Architecture**:
*   **70% Deterministic Offline Core:** Runs 100% locally on device with zero cloud reliance. Evaluates OpenStreetMap street grids and lighting infrastructure (`lit=yes`, active commercial frontage, sanctuary proximity) using custom **Safety-Weighted A\*** pathfinding. Automatically compares routes against Dijkstra's shortest path to reject dangerous unlit shortcuts. Features dead-man stagnation telemetry, zero-cost native carrier SMS dispatch, and a client-side Web Audio pulsing siren (105 dB).
*   **30% Agentic AI Copilot (IBM watsonx.ai Granite):** When online, an IBM Granite-powered agent interprets natural-language voice distress in **Kannada (ಕನ್ನಡ), English, Hindi (हिंदी), and Nepali (नेपाली)**, dynamically rerouting commuters to verified 24/7 sanctuaries (petrol forecourts, 24/7 pharmacies, police kiosks, emergency hospitals) with structured situational dispatch briefs.
*   **₹0 Offline Neural Fallback:** Even with zero connectivity and zero credit cards, Kaavalu's embedded offline neural classifier provides immediate, deterministic threat evaluation and haven diversion without cloud latency.

---

## 🚀 Key Highlights & Hackathon Features

1. **8 Authentic Bengaluru Corridors:**
   - Indiranagar (Metro Gate 1 $\rightarrow$ Defence Colony Park Ave)
   - Whitefield IT Hub (Kadugodi Metro $\rightarrow$ Nallurahalli Lake View Gate)
   - Bellandur Outer Ring Road (Ecospace Skywalk $\rightarrow$ Green Glen Layout Gate 1)
   - Koramangala (Sony World Junction $\rightarrow$ 5th Block Gate)
   - Electronic City Phase 1 (Infosys Gate 1 $\rightarrow$ Neeladri Township)
   - HSR Layout (BDA Complex 14th Main $\rightarrow$ 27th Main Sector 1 Park)
   - MG Road / Church Street (MG Road Metro $\rightarrow$ Residency Road Galleria)
   - Manyata Tech Park (Main Gate 1 Terminal $\rightarrow$ Thanisandra Main Road Junction)

2. **Street-Conforming Geometry:**
   - Both Safe Lit Corridors and Dark Shortcut paths follow actual road turns, pedestrian lanes, and canal bunds along the OpenStreetMap grid with 0 diagonal cross-building cuts.

3. **Modern Squircle Carbon Design:**
   - Deep midnight Gray 100 palette (`#0c1017`, `#151c27`), soft glowing borders (`border-white/[0.08]`), squircle curvature (`24px` cards, `16px` inputs, `rounded-full` pills), and IBM Plex Sans + IBM Plex Mono typography.

4. **Guided Pitch Demo with Auto-Scroll & Spotlights:**
   - Built-in 45-second 5-stage interactive pitch simulator.
   - Automatically scrolls the screen, shines an animated spotlight ring on active cards, auto-types Origin and Destination, dynamically plots routes on destination entry completion, walks step-by-step with Sentinel HUD, simulates cellular outage, stages emergency SMS dispatch, and celebrates safe haven arrival.

---

## 📂 Repository Structure

```text
├── .bob/                       # IBM Bob configuration & architectural rules
│   ├── config.json             # Bob project configuration
│   └── rules.md                # 70/30 offline architecture & Carbon standards
├── BOB.md                      # Bob developer instructions & last-mile micro-tasks
├── SUBMISSION.md               # Pre-filled official submission copy & answers
├── Competition-Guidelines      # Official hackathon guidelines & scoring criteria
├── PITCH_SCRIPT.md             # 2.5-minute timed winning pitch script
├── EVALUATION_RUBRIC.md        # 20/20 rubric self-assessment breakdown
├── public/                     # PWA icons, manifest, audio assets
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

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production (TypeScript check + Vite bundler)
npm run build
```

The application is accessible locally at `http://localhost:5173/`.
