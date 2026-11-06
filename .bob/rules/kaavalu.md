# KAAVALU project rules

- **Offline-first:** safety routing, dead-man telemetry, siren, SMS dispatch and the threat copilot run fully on device. No network call is needed for any safety feature.
- **No secrets, no cloud keys:** the app ships with no credentials. Any future cloud AI (for example IBM watsonx.ai) must read keys from environment variables and stay optional.
- **Routing:** the safe route uses safety-weighted A* (admissible heuristic: 0.55 x straight-line distance); the baseline shortest route uses plain Dijkstra.
- **Data is generated, not hand-edited:** `src/data/bengaluruCorridors.ts` is produced by `npm run build:data` from OpenStreetMap. Change `scripts/corridor-meta.json` or the generator instead. A corridor is only kept if its shortcut is shorter and clearly less lit than the safe route.
- **Havens:** only police stations and places OSM tags as 24/7 (fuel, pharmacy, emergency hospital).
- **UI:** dark Carbon-inspired tokens in `tailwind.config.js`; copy localised in Kannada, English, Hindi and Nepali. Never hardcode route numbers in UI copy; compute them from route data.
- **Validation:** `npm run build` must pass with zero TypeScript errors.
