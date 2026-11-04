# Task 4: Passive Dead-Man Telemetry & Zero-Cost Offline SOS

## Context
In a real-world emergency, tapping complex UI menus is impossible: hands shake, phones are hidden in pockets, or attackers actively intimidate victims.
KAAVALU operates **passively** without requiring constant screen taps:
1. Dynamic 35-meter corridor envelope around the user's route.
2. Passive Stagnation Detection: If stationary for $> 180 \text{ seconds}$ in a caution zone, initiates a subtle haptic countdown.
3. Native Cellular SMS Dispatch (`sms:` protocol) with zero server or SMS gateway fees.
4. Client-side Web Audio 105 dB pulsing siren.
5. Covert OLED Black Mode.

## Objective
Author the autonomous telemetry engine, audio synthesizer, and native hardware integration services.

---

## Prompt to Give to IBM Bob

```markdown
You are building Phase 4 of KAAVALU (ಕಾವಲು): Passive Dead-Man Telemetry & Offline SOS.

Please implement the background telemetry and device integrations:

1. Telemetry & Stagnation Engine in `src/services/telemetryEngine.ts`:
   - State variables:
     - `currentPosition: GeoPoint | null`
     - `isStationary: boolean`
     - `stationaryDurationSeconds: number`
     - `isOffCorridor: boolean`
     - `alertState: 'normal' | 'caution_stagnation' | 'deviation_alert' | 'sos_active'`
     - `countdownRemainingSeconds: number` (e.g. 30 seconds before auto-alert)
   - Methods:
     - `startTracking(route: RouteResult, onAlertUpdate: (state: AlertState) => void)`
     - `updatePosition(newPos: GeoPoint)`:
       - Checks distance from nearest route node. If distance > 35m, flag corridor deviation.
       - Checks distance from previous position. If movement < 5m for consecutive updates, increment stationary timer.
       - If stationary > 180 seconds, trigger `caution_stagnation` and initiate 30s countdown.
     - `cancelAlert()`: resets the countdown and restores normal status.
     - `stopTracking()`: cleans up intervals and watchers.

2. Web Audio Emergency Siren Synthesizer in `src/services/audioSiren.ts`:
   - Uses native browser `AudioContext` (no external MP3/WAV files needed).
   - Generates an aggressive dual-tone police/emergency siren:
     - Modulates between 800 Hz and 1300 Hz every 350ms using an LFO or linear ramp oscillator.
     - Gain control to maximize output volume.
   - Methods:
     - `startSiren()`: starts the oscillator waveform.
     - `stopSiren()`: cleanly fades out and stops the oscillator.
     - `isPlaying(): boolean`

3. Native Cellular SMS Dispatcher in `src/services/emergencyDispatcher.ts`:
   - Builds a pre-formatted distress dispatch text including:
     - User name / identity.
     - Current coordinates (lat, lng) with OpenStreetMap / Google Maps clickable link.
     - Active transit corridor (e.g. "Whitefield Metro to Nallurahalli").
     - Nearest identified sanctuary (e.g. "Nearest safe point: Shell Bunk 80m East").
     - Timestamp and device battery status (via `navigator.getBattery()` if supported).
   - Function: `dispatchNativeSms(recipientPhone: string, situationData: IncidentData): void`:
     - Creates the native URI `sms:${recipientPhone}?body=${encodeURIComponent(text)}`.
     - Opens via `window.location.href = uri` or `window.open(uri)`.
     - Completely bypasses Twilio, cloud gateways, and requires ₹0 infrastructure.

4. Device Hardware Hooks in `src/hooks/useDeviceHardware.ts`:
   - **Haptic Pulse**: `triggerHaptic(pattern: number[])` using `navigator.vibrate`.
   - **Screen Wake Lock**: `acquireWakeLock()` using `navigator.wakeLock.request('screen')` to keep screen awake during transit.
   - **Battery Telemetry**: Reads battery level and charging state.

5. Covert Screen Mode Component (`src/components/CovertScreen.tsx`):
   - Fullscreen pure OLED black (`#000000`).
   - Disables standard bright UI to appear as if the phone is switched off.
   - Features a subtle single-pixel pulsing indicator (green = safe, amber = warning) so the user knows sentinel monitoring is active.
   - Quick triple-tap or long-press gesture to dismiss covert mode.
```

---

## Verification Criteria
- [ ] Stagnation detector accurately flags stationary condition (> 180s simulated).
- [ ] Web Audio siren synthesizes audible pulsing siren without any external audio asset files.
- [ ] `sms:` URL format correctly formats recipient and encoded body.
- [ ] Covert mode provides pure black screen with unlock gesture.
