# KAAVALU project rules

- **70/30 architecture:** safety routing, telemetry, siren and SMS dispatch run fully offline; the watsonx Granite copilot is an online enhancement with a deterministic offline fallback.
- **No secrets in code:** watsonx credentials come from `VITE_*` env vars (see `.env.example`).
- **Routing:** the safety route uses safety-weighted A*; the baseline shortest route uses Dijkstra (no heuristic) because declared segment lengths can undercut straight-line distance.
- **Data:** every corridor needs a dark shortcut shorter than its lit route, coordinates within Bengaluru (lat 12.80–13.10, lng 77.50–77.80) and 24/7 sanctuaries.
- **UI:** dark Carbon-inspired tokens in `tailwind.config.js`; all copy localised in Kannada, English, Hindi and Nepali.
- **Validation:** `npm run build` must pass with zero TypeScript errors.
