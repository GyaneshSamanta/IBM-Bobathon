# Airplane Mode & Mobile Testing

Verifies the 70% offline core of KAAVALU works with zero connectivity.

## 1. Production build with Service Worker
The service worker only registers in production builds.

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

Open `http://127.0.0.1:4173/` once while online so assets are cached.

## 2. DevTools checks (Chrome)
1. **Console** – confirm the `[KAAVALU SENTINEL SELF-CHECK]` block shows all 5 subsystems operational.
2. **Application → Service Workers** – `sw.js` is activated; tick **Offline**, reload: the app must still load.
3. **Application → IndexedDB → keyval-store** – key `kaavalu_corridors_v4` holds **6 corridors**.
4. **Known limitation:** map background tiles are fetched from OpenStreetMap and are not cached by the service worker, so the basemap goes blank offline while the route, HUD, SOS and copilot keep working.
5. **Application → Cache Storage → kaavalu-v1** – `/`, `/index.html`, `/manifest.json` and hashed bundles are present.

## 3. In-app demo toggles
Open **Pitch Presentation & Demo Simulator** → **Show Tools**:

| Control | Expected |
|---|---|
| Simulate 0 Signal | Header flips to offline; copilot answers from the deterministic fallback |
| Simulate Walk | Marker walks the safe corridor |
| Test Stopped Walk Alert | Stagnation modal with 30 s countdown, caution tone |
| Trigger Deviation | Marker jumps >35 m off route, deviation alert |
| ಕನ್ನಡ / नेपाली / हिंदी / English | Language switches, assessment returns HIGH threat and diverts to a sanctuary |
| Test Siren | Pulsing Web Audio siren, no audio files |
| Pocket Black Screen | OLED black screen; triple-tap to unlock |

## 4. Physical phone
1. Run `npm run dev` (host is exposed on the LAN) and open the URL on the phone.
2. Add to Home Screen, enable Airplane Mode, relaunch.
3. SOS opens the native `sms:` composer prefilled with the distress message.
