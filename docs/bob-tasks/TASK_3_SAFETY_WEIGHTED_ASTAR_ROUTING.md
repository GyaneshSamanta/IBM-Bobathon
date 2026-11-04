# Task 3: Client-Side Safety-Weighted A* Pathfinding Engine

## Context
Standard navigation apps minimize distance ($\min \sum d$). In Bengaluru after 10:30 PM, this frequently routes women through unlit back-alleys, empty construction plots, or dark underpasses just to save 2 minutes.

KAAVALU minimizes **Exposure Risk** using an offline client-side A* pathfinding algorithm:
$$\text{Cost}(e) = \text{Length}(e) \times \Big( 1.0 + w_{\text{unlit}} + w_{\text{isolation}} - w_{\text{sanctuary}} \Big)$$

## Objective
Author the offline client-side graph builder and A* pathfinding engine that runs in `< 30ms` inside the browser without calling any remote routing API.

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 3 of KAAVALU (ಕಾವಲು): Safety-Weighted A* Routing Engine.

Please implement the spatial routing algorithms in `src/services/safetyRouter.ts`:

1. Define Route Comparison Types in `src/types/routing.ts`:
   - `RouteResult`:
     - id: string
     - name: string
     - type: 'safe_corridor' | 'shortest_risk'
     - nodes: RoadNode[]
     - pathCoordinates: [number, number][] // [lat, lng]
     - totalDistanceMeters: number
     - estimatedDurationMinutes: number
     - litPercentage: number // e.g. 94%
     - safetyScore: number // 0 to 100
     - sanctuariesAlongRoute: Sanctuary[]
     - whyRecommended: string
     - whyAvoid?: string

2. Implement the A* Pathfinding Engine in `src/services/safetyRouter.ts`:
   - Function: `calculateRoutes(corridor: TransitCorridor, startNodeId: string, endNodeId: string): { safeRoute: RouteResult, shortestRoute: RouteResult }`
   - **Route 1: Safe Corridor (Safety-Weighted A*)**:
     - Graph edge weight calculation:
       - Base weight = edge distance (meters).
       - If `!segment.isLit`, add penalty: `distance * 2.5`.
       - If `segment.surfaceType === 'dirt_trail'`, add penalty: `distance * 1.5`.
       - If edge passes within 60m of an open 24/7 sanctuary, apply safety discount: `distance * -0.4`.
       - Heuristic: Haversine distance to target node.
     - Result: Guides user along illuminated main roads passing verified open sanctuaries.
   - **Route 2: Shortest Distance Route (Standard Navigation Baseline)**:
     - Edge weight = pure physical distance (meters).
     - Result: Shows the path standard navigation apps would recommend, which cuts through dark alleys.

3. Metric Calculations:
   - Calculate exact `litPercentage`: `(sum of lit segment distance / total distance) * 100`.
   - Calculate `safetyScore`: A normalized score (0-100) taking into account lighting, surface quality, and sanctuary coverage.
   - Calculate walking duration assuming average urban night walking speed of 1.2 m/s (4.3 km/h).

4. Performance & Offline Guarantee:
   - The entire calculation must execute synchronously or within `< 35ms` inside browser memory without any network fetches.
   - Export helper `findClosestNode(corridor: TransitCorridor, lat: number, lng: number): RoadNode`.

5. Unit Test Suite in `src/services/__tests__/safetyRouter.test.ts`:
   - Test that for the Whitefield corridor, `safeRoute.litPercentage > 90%` while `shortestRoute.litPercentage < 55%`.
   - Test that calculation completes in under 50ms.
```

---

## Verification Criteria
- [ ] `src/services/safetyRouter.ts` implements both standard and safety-weighted A* pathfinding.
- [ ] `safeRoute` favors illuminated roads and open sanctuaries even if 2-3 minutes longer.
- [ ] Execution completes locally in `< 35ms` with zero network requests.
- [ ] Returns metrics: `totalDistanceMeters`, `litPercentage`, `safetyScore`, `sanctuariesAlongRoute`.
