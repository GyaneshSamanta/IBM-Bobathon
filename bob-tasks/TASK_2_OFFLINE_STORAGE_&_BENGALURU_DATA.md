# Task 2: Offline Storage & Bengaluru Transit Datasets

## Context
KAAVALU operates on a **70% deterministic offline core**. To function in Airplane Mode or cellular blackouts (like underpasses in Bengaluru), all road networks, street lighting tags, and verified 24/7 sanctuaries must be stored locally in browser **IndexedDB**.

## Objective
Author the IndexedDB storage layer and pre-seed curated real-world Bengaluru transit corridor datasets with OpenStreetMap tags (`lit=yes`, `amenity=fuel`, `amenity=pharmacy`, `police`).

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 2 of KAAVALU (ಕಾವಲು): Offline Storage & Bengaluru Datasets.

Please implement the local data models, seed data, and IndexedDB service:

1. Create TypeScript types in `src/types/corridor.ts`:
   - `GeoPoint`: { lat: number, lng: number }
   - `Sanctuary`:
     - id: string
     - name: string
     - nameKn: string (Kannada label)
     - type: 'petrol_bunk' | 'pharmacy' | 'police_kiosk' | 'hospital'
     - lat: number
     - lng: number
     - address: string
     - isOpen24x7: boolean
     - isStaffed: boolean
     - phone?: string
   - `RoadNode`:
     - id: string
     - name: string
     - lat: number
     - lng: number
     - isLit: boolean
   - `RoadSegment`:
     - id: string
     - fromNodeId: string
     - toNodeId: string
     - distanceMeters: number
     - isLit: boolean
     - hasActiveFrontage: boolean
     - surfaceType: 'paved' | 'dirt_trail' | 'main_road'
   - `TransitCorridor`:
     - id: string
     - name: string
     - nameKn: string
     - area: string
     - startNodeId: string
     - endNodeId: string
     - nodes: RoadNode[]
     - segments: RoadSegment[]
     - sanctuaries: Sanctuary[]

2. Create Curated Bengaluru Corridor Seed Data in `src/data/bengaluruCorridors.ts`:
   Include high-fidelity data for 4 critical Bengaluru transit corridors:
   - **Corridor 1: Whitefield Metro to Nallurahalli / Borewell Road**
     - Contains both a well-lit arterial route (passing Shell Petrol Bunk and Apollo 24/7 Pharmacy) and an unlit shortcut through a dirt trail / empty plot.
   - **Corridor 2: Bellandur Outer Ring Road (Ecospace to Green Glen Layout)**
     - Highlights underpass dark spots and 24/7 lit petrol bunks along ORR.
   - **Corridor 3: Kammanahalli Main Road to HRBR Layout**
     - Highlights late-night hospitality and nursing home sanctuaries.
   - **Corridor 4: Indiranagar Metro to Defence Colony**
     - Highlights Bengaluru City Police (BCP) Suraksha Kiosk and MedPlus 24/7.

3. Implement IndexedDB Storage Service in `src/services/offlineStorage.ts`:
   - Use `idb-keyval` for persistent local storage.
   - On first load, check if database is seeded. If not, seed with the curated Bengaluru corridors.
   - Functions to export:
     - `initOfflineStorage(): Promise<void>`
     - `getAllCorridors(): Promise<TransitCorridor[]>`
     - `getCorridorById(id: string): Promise<TransitCorridor | undefined>`
     - `getNearbySanctuaries(lat: number, lng: number, radiusMeters?: number): Promise<Sanctuary[]>`
     - `getStorageQuota(): Promise<{ usedBytes: number, totalBytes: number, formattedUsed: string }>`

4. Unit & Verification Tests:
   - Create a test utility or component check that initializes the DB, verifies all 4 corridors are saved in IndexedDB, and queries the nearest sanctuary from Whitefield coordinates (`12.9698, 77.7499`).
```

---

## Verification Criteria
- [ ] `src/types/corridor.ts` defines all corridor, node, segment, and sanctuary interfaces.
- [ ] `src/data/bengaluruCorridors.ts` contains realistic coordinates and lighting attributes for Bengaluru.
- [ ] `src/services/offlineStorage.ts` successfully seeds and reads from IndexedDB.
- [ ] Storage quota report confirms cache is under 2MB.
