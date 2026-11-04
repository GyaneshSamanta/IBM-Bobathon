import { get, set } from 'idb-keyval';
import { TransitCorridor, GeoPoint } from '../types/corridor';
import { BENGALURU_CORRIDORS } from '../data/bengaluruCorridors';

const DB_KEY_CORRIDORS = 'kaavalu_corridors_v4';
const DB_KEY_INIT_FLAG = 'kaavalu_initialized_v4';

export function calculateHaversineDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function initOfflineStorage(): Promise<TransitCorridor[]> {
  try {
    // Always keep IndexedDB synchronized with latest corridor datasets
    await set(DB_KEY_CORRIDORS, BENGALURU_CORRIDORS);
    await set(DB_KEY_INIT_FLAG, true);
    return BENGALURU_CORRIDORS;
  } catch (err) {
    console.warn('[KAAVALU OfflineStorage] IndexedDB storage fallback:', err);
    return BENGALURU_CORRIDORS;
  }
}

export async function getAllCorridors(): Promise<TransitCorridor[]> {
  try {
    const corridors = await get<TransitCorridor[]>(DB_KEY_CORRIDORS);
    return corridors || BENGALURU_CORRIDORS;
  } catch {
    return BENGALURU_CORRIDORS;
  }
}

export async function getCorridorById(id: string): Promise<TransitCorridor | undefined> {
  const corridors = await getAllCorridors();
  return corridors.find((c) => c.id === id);
}
