# Task 7: Airplane Mode Demo Harness & Verification Suite

## Context
For the **IBM Bobathon submission**, judges evaluate:
1. Working prototype functionality.
2. Undeniable proof of the **70% offline Airplane Mode execution**.
3. Real-time demonstration of the **30% watsonx agentic copilot**.
4. Smooth screen recording for the 5-minute pitch video.

To make pitch recording effortless without needing complex phone mirroring setups, we build an **Interactive Presentation Harness** directly into the web application (mirroring the layout in `plan/Kaavalu-Wireframes.html`).

## Objective
Author the pitch demo harness, interactive simulation controls, and automated verification test runner.

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 7 of KAAVALU (ಕಾವಲು): Airplane Mode Demo Harness & Verification.

Please implement the pitch demo controls and verification suite:

1. Presentation & Demo Controls in `src/components/DemoControlPanel.tsx`:
   - Collapsible floating / side control panel for the presenter:
     - **Toggle Airplane Mode**:
       - Switches simulated network state between `ONLINE (watsonx.ai Active)` and `OFFLINE (Airplane Mode / IndexedDB Active)`.
       - Demonstrates that safe routing, stagnation detection, Web Audio siren, and SMS drafting function 100% offline.
     - **Simulate Movement / Walk**:
       - Animate user marker moving step-by-step along the Safe Corridor or the Dark Alley.
     - **Trigger Stagnation (Fast-Forward)**:
       - Instantly fast-forwards the stagnation timer to 180 seconds to demonstrate the dead-man vibration and 30-second countdown alert.
     - **Trigger Deviation**:
       - Simulates user veering 60m off the safe corridor into an unlit alley.
     - **One-Click Voice Threat Scenarios**:
       - Kannada: "ಒಂದು ಆಟೋ ನನ್ನ ಹಿಂದೆ ತುಂಬಾ ನಿಧಾನವಾಗಿ ಬರ್ತಾ ಇದೆ, ಭಯ ಆಗ್ತಿದೆ."
       - Nepali: "एउटा केटाले मलाई पछ्याइरहेको छ, बाტო धेरै अँध्यारो छ।"
       - Hindi: "गली में लाइट बंद है और 3 लड़के खड़े हैं।"
       - English: "Suspicious auto trailing me with headlights turned off."
     - **View Toggle**:
       - Switch between "Centered iPhone Frame View" (perfect for recording crisp vertical mobile demos) and "Full Viewport Mode".

2. Automated Verification Script in `src/services/verificationRunner.ts`:
   - Runs a quick self-test of all core offline systems:
     - Checks IndexedDB storage initialization.
     - Asserts A* pathfinding computes in `< 35ms`.
     - Asserts safe route lit percentage is $\ge 90\%$.
     - Asserts watsonx fallback parses threat scenarios and suggests verified sanctuary.
     - Asserts SMS URI structure is valid.
   - Logs clean passing badges in the browser console:
     ```
     [KAAVALU SENTINEL SELF-CHECK]
     ✓ IndexedDB Local Vector Cache: READY (1.2 MB)
     ✓ Client-Side A* Safety Router: PASSED (18ms latency)
     ✓ watsonx Agentic Copilot: READY (Fallback active)
     ✓ Zero-Cost SMS URI Protocol: READY
     ✓ Web Audio Siren Synthesizer: READY
     All 5 Sentinel Subsystems Operational.
     ```

3. Production Build & Verification:
   - Ensure `npm run build` generates an optimized production bundle with zero errors.
   - Verify that the Service Worker caches all assets properly.
```

---

## Verification Criteria
- [ ] Presenter can toggle Airplane Mode with 1 click to show offline IndexedDB execution.
- [ ] Simulated walk, stagnation, and deviation triggers work reliably during screen recording.
- [ ] Multi-lingual speech presets instantly trigger watsonx agentic rerouting.
- [ ] Console logs confirm all 5 Sentinel subsystems pass self-check.
- [ ] `npm run build` generates a clean production build.
