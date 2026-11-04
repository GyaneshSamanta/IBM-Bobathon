# 🤖 IBM Bob Development Task Instructions

This directory contains individual, prompt-ready engineering task specifications designed for **IBM Bob**.

Each file is structured as a complete, self-contained prompt that you can copy and paste directly into IBM Bob (or reference in Bob's task composer).

---

## 📋 Task Sequence

1. **[TASK_1_PROJECT_SCAFFOLDING_&_PWA.md](./TASK_1_PROJECT_SCAFFOLDING_&_PWA.md)**
   *Core scaffolding:* Vite + React + TypeScript + Tailwind CSS + Lucide icons + PWA Service Worker caching.

2. **[TASK_2_OFFLINE_STORAGE_&_BENGALURU_DATA.md](./TASK_2_OFFLINE_STORAGE_&_BENGALURU_DATA.md)**
   *Offline Data Layer:* IndexedDB local vector cache + curated Bengaluru corridor data (Whitefield, Bellandur, Kammanahalli, Indiranagar, Koramangala) with street lighting tags and sanctuary POIs.

3. **[TASK_3_SAFETY_WEIGHTED_ASTAR_ROUTING.md](./TASK_3_SAFETY_WEIGHTED_ASTAR_ROUTING.md)**
   *Spatial Safety Math:* Custom client-side A* pathfinding algorithm that penalizes unlit streets and prioritizes verified 24/7 sanctuaries.

4. **[TASK_4_DEADMAN_TELEMETRY_&_OFFLINE_SOS.md](./TASK_4_DEADMAN_TELEMETRY_&_OFFLINE_SOS.md)**
   *Autonomous Telemetry:* 35-meter corridor geofence, 180-second stagnation detector, native cellular SMS URI generator, and client-side Web Audio pulsing siren (105 dB).

5. **[TASK_5_WATSONX_AGENTIC_COPILOT.md](./TASK_5_WATSONX_AGENTIC_COPILOT.md)**
   *AI Intelligence:* IBM watsonx.ai Granite integration for natural-language situational assessment + deterministic offline fallback engine for ₹0 cost / Airplane mode.

6. **[TASK_6_QUADLINGUAL_PWA_INTERFACE.md](./TASK_6_QUADLINGUAL_PWA_INTERFACE.md)**
   *Inclusion UI:* Implementation of the high-contrast dark mobile interface supporting **ಕನ್ನಡ (Kannada)**, **English**, **हिंदी (Hindi)**, and **नेपाली (Nepali)**.

7. **[TASK_7_DEMO_HARNESS_&_VERIFICATION.md](./TASK_7_DEMO_HARNESS_&_VERIFICATION.md)**
   *Demo & Pitch Engine:* Dual presentation view (iPhone simulator + full screen), live Airplane Mode toggle, simulated GPS movement, and automated verification test suite.

---

## 💡 Best Practices When Working with IBM Bob

- Run tasks in exact numerical order (1 through 7).
- After Bob completes each task, run `npm run dev` to verify the application builds without errors.
- Commit your progress to Git after every task:
  ```bash
  git add .
  git commit -m "feat(phase-X): implemented by IBM Bob"
  ```
- All code runs client-side with zero paid infrastructure dependencies, guaranteeing complete compliance with the 100% Free Stack criteria.
