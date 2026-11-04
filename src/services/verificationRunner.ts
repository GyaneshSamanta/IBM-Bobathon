import { calculateCorridorRoutes } from './safetyRouter';
import { BENGALURU_CORRIDORS } from '../data/bengaluruCorridors';
import { evaluateOfflineCopilot } from './offlineCopilot';
import { formatDistressMessage } from './emergencyDispatcher';
import { getAllCorridors, getNearbySanctuaries, getStorageQuota } from './offlineStorage';
import { sirenService } from './audioSiren';

const mark = (ok: boolean) => (ok ? '✓' : '✗');

export async function runSentinelSelfCheck() {
  const startTime = performance.now();

  try {
    const corridor = BENGALURU_CORRIDORS[0];

    // 1. IndexedDB Local Cache
    const stored = await getAllCorridors();
    const quota = await getStorageQuota();
    const nearby = await getNearbySanctuaries(12.9698, 77.7499, 2000);
    const storageOk = stored.length === BENGALURU_CORRIDORS.length && quota.usedBytes < 2 * 1024 * 1024;

    // 2. Safety Router Benchmark (< 35ms, safe route >= 90% lit)
    const t0 = performance.now();
    const { safeRoute, shortestRoute } = calculateCorridorRoutes(corridor);
    const routeMs = performance.now() - t0;
    const routerOk = routeMs < 35 && safeRoute.litPercentage >= 90;

    // 3. Copilot Fallback Check
    const copilotTest = evaluateOfflineCopilot('ಆಟೋ ನನ್ನ ಹಿಂದೆ ಬರುತ್ತಿದೆ', {
      currentPosition: { lat: 12.9702, lng: 77.7475 },
      activeCorridorId: corridor.id,
      activeRouteType: 'safe_corridor',
      isMoving: true,
      speedMps: 1.2,
      batteryLevel: 90,
      isStationaryDurationSec: 0,
      nearestSanctuaries: corridor.sanctuaries,
      preferredLanguage: 'kn',
    });
    const copilotOk = copilotTest.targetSanctuaryId !== null && copilotTest.threatLevel !== 'LOW';

    // 4. Dispatch Formatter Check
    const smsSample = formatDistressMessage({
      userName: 'Self-Check User',
      location: { lat: 12.9702, lng: 77.7475 },
      corridorName: 'Whitefield Corridor',
      timestamp: new Date().toLocaleTimeString(),
      batteryPercentage: 90,
    });
    const smsUri = `sms:112?body=${encodeURIComponent(smsSample)}`;
    const smsOk = smsUri.startsWith('sms:112') && smsSample.length > 0;

    // 5. Web Audio Siren (synthesized; no asset files)
    const sirenOk = typeof sirenService.playCautionTone === 'function' && typeof AudioContext !== 'undefined';

    const results = [storageOk, routerOk, copilotOk, smsOk, sirenOk];
    const passed = results.filter(Boolean).length;
    const totalMs = (performance.now() - startTime).toFixed(1);

    console.log(
      `%c[KAAVALU SENTINEL SELF-CHECK]%c\n` +
      `${mark(storageOk)} IndexedDB Local Cache: ${storageOk ? 'READY' : 'FAILED'} (${stored.length} corridors, ${quota.formattedUsed}, ${nearby.length} havens near Whitefield)\n` +
      `${mark(routerOk)} Client-Side A* Safety Router: ${routerOk ? 'PASSED' : 'FAILED'} (${routeMs.toFixed(1)}ms, safe ${safeRoute.litPercentage}% lit vs shortcut ${shortestRoute.litPercentage}%)\n` +
      `${mark(copilotOk)} Offline Threat Copilot: ${copilotOk ? 'READY' : 'FAILED'} (${copilotTest.threatLevel} / ${copilotTest.threatCategory})\n` +
      `${mark(smsOk)} Zero-Cost SMS URI Protocol: ${smsOk ? 'READY' : 'FAILED'} (${smsSample.length} chars payload)\n` +
      `${mark(sirenOk)} Web Audio Siren Synthesizer: ${sirenOk ? 'READY' : 'UNSUPPORTED'}\n` +
      `${passed === 5 ? 'All 5 Sentinel Subsystems Operational.' : `${passed}/5 Sentinel Subsystems Operational.`} (${totalMs}ms) Built for IBM Bobathon.`,
      'color: #24A148; font-weight: bold; font-size: 13px;',
      'color: #8D99AE; font-size: 11px; font-family: monospace;'
    );
  } catch (err) {
    console.warn('[KAAVALU Sentinel Audit] Subsystem check encountered an exception:', err);
  }
}
