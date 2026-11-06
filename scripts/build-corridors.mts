/**
 * Generates src/data/bengaluruCorridors.ts from real OpenStreetMap data.
 *
 *   npm run build:data
 *
 * For every corridor in scripts/corridor-meta.json it:
 *   1. downloads the walkable street graph, lighting tags, open shops and 24/7 havens (Overpass API),
 *   2. runs the app's own router on the FULL street graph to find the shortest and the safest walk,
 *   3. keeps only the streets those two walks use (contracted, with true along-street lengths),
 *   4. re-runs the router on the compact corridor and checks it reproduces the same result.
 *
 * Data (c) OpenStreetMap contributors, ODbL. Raw Overpass responses are cached in scripts/.cache.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { calculateCorridorRoutes } from '../src/services/safetyRouter';
import type { RoadNode, RoadSegment, Sanctuary, SanctuaryType, TransitCorridor } from '../src/types/corridor';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'bengaluruCorridors.ts');
const UA = 'kaavalu-bobathon/1.0 (https://github.com/GyaneshSamanta/IBM-Bobathon)';
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const PAD_DEG = 0.0045; // ~500 m search margin around the start/end pair
const SIMPLIFY_TOLERANCE_M = 20; // shape points closer than this to a straight line are dropped
const FRONTAGE_RADIUS_M = 30; // an open shop/eatery within this distance makes a street "active"
const SANCTUARY_NEAR_ROUTE_M = 120;
const ENTRANCE_SHIFTS_M = [250, 450, 700]; // how far an entrance may move from the named landmark (widened only if needed)
const MIN_LIT_GAP = 15; // the shortcut must be at least this many %-points less lit than the safe walk
const PAIR_CANDIDATES = 7;

// ---------- Overpass ----------
fs.mkdirSync(CACHE_DIR, { recursive: true });

async function overpass(query: string): Promise<any> {
  const file = path.join(CACHE_DIR, createHash('md5').update(query).digest('hex') + '.json');
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));

  for (let attempt = 0; attempt < 8; attempt++) {
    const url = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'User-Agent': UA, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(90_000),
      });
      const text = await res.text();
      if (res.ok && text.startsWith('{')) {
        fs.writeFileSync(file, text);
        return JSON.parse(text);
      }
      console.error(`  retry ${attempt} ${url} -> ${res.status}`);
    } catch (e: any) {
      console.error(`  retry ${attempt} ${url} -> ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  throw new Error('Overpass unavailable');
}

// ---------- geometry ----------
const rad = (d: number) => (d * Math.PI) / 180;
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

/** Douglas-Peucker over a list of points, returns the indices to keep. */
function simplifyIndices(pts: { lat: number; lng: number }[], tolM: number): number[] {
  const lat0 = pts[0].lat;
  const xy = pts.map((p) => ({
    x: (p.lng - pts[0].lng) * Math.cos(rad(lat0)) * 111320,
    y: (p.lat - lat0) * 110540,
  }));
  const keep = new Set<number>([0, pts.length - 1]);
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    let maxD = 0;
    let idx = -1;
    const dx = xy[b].x - xy[a].x;
    const dy = xy[b].y - xy[a].y;
    const len = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * xy[i].x - dx * xy[i].y + xy[b].x * xy[a].y - xy[b].y * xy[a].x) / len;
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (idx !== -1 && maxD > tolM) {
      keep.add(idx);
      stack.push([a, idx], [idx, b]);
    }
  }
  return [...keep].sort((p, q) => p - q);
}

// ---------- OSM tag interpretation ----------
const ARTERIAL = new Set(['trunk', 'primary', 'secondary', 'tertiary', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link']);
const UNPAVED = new Set(['unpaved', 'dirt', 'ground', 'earth', 'grass', 'gravel', 'sand', 'mud', 'compacted', 'fine_gravel']);

interface EdgeAttr {
  isLit: boolean;
  lightingSource: 'osm' | 'assumed';
  surfaceType: RoadSegment['surfaceType'];
  streetName: string;
}

function interpretWay(tags: Record<string, string>): EdgeAttr {
  const hw = tags.highway;
  let isLit: boolean;
  let lightingSource: 'osm' | 'assumed' = 'osm';
  if (tags.lit === 'yes' || tags.lit === '24/7' || tags.lit === 'automatic') isLit = true;
  else if (tags.lit === 'no' || tags.lit === 'disused') isLit = false;
  else {
    lightingSource = 'assumed';
    // Arterials and mapped sidewalks/crossings sit under street lighting; anything else with no
    // lighting evidence is treated as unlit at night (fail-safe).
    isLit = ARTERIAL.has(hw) || (hw === 'footway' && (tags.footway === 'sidewalk' || tags.footway === 'crossing'));
  }

  let surfaceType: RoadSegment['surfaceType'] = 'secondary_road';
  if (tags.tunnel === 'yes' || tags.tunnel === 'building_passage' || (tags.layer && Number(tags.layer) < 0)) surfaceType = 'isolated_underpass';
  else if (hw === 'track' || hw === 'path' || (tags.surface && UNPAVED.has(tags.surface))) surfaceType = 'dirt_trail';
  else if (ARTERIAL.has(hw) || (hw === 'footway' && tags.footway === 'sidewalk')) surfaceType = 'paved_main';

  const streetName =
    tags.name ||
    tags['name:en'] ||
    (hw === 'steps' ? 'Steps' : hw === 'footway' || hw === 'path' ? 'Footpath' : hw === 'service' ? 'Service lane' : hw === 'track' ? 'Track' : 'Lane');
  return { isLit, lightingSource, surfaceType, streetName };
}

const FRONTAGE_AMENITY = 'restaurant|cafe|fast_food|bar|pub|ice_cream|food_court|marketplace|pharmacy|fuel|atm|bank|clinic|hospital|police|cinema';
const HAVEN_TYPE: Record<string, SanctuaryType> = { fuel: 'petrol_bunk', pharmacy: 'pharmacy', police: 'police_kiosk', hospital: 'hospital' };

// ---------- per-corridor build ----------
interface Meta {
  id: string;
  start: { name: string; nameKn?: string; lat: number; lng: number };
  end: { name: string; nameKn?: string; lat: number; lng: number };
  [k: string]: any;
}

interface GEdge {
  a: number;
  b: number;
  len: number;
  attr: EdgeAttr;
  frontage: boolean;
}

async function buildCorridor(meta: Meta, prefix: string) {
  const south = Math.min(meta.start.lat, meta.end.lat) - PAD_DEG;
  const north = Math.max(meta.start.lat, meta.end.lat) + PAD_DEG;
  const west = Math.min(meta.start.lng, meta.end.lng) - PAD_DEG;
  const east = Math.max(meta.start.lng, meta.end.lng) + PAD_DEG;
  const bbox = [south, west, north, east].map((n) => n.toFixed(5)).join(',');

  const streets = await overpass(
    `[out:json][timeout:120];way[highway][highway!~"^(motorway|motorway_link|proposed|construction|raceway|bus_guideway|elevator|corridor|platform|bridleway|cycleway)$"][foot!="no"][access!~"^(private|no)$"](${bbox});out body;>;out skel qt;`
  );
  const shops = await overpass(
    `[out:json][timeout:90];(node[shop](${bbox});node[amenity~"^(${FRONTAGE_AMENITY})$"](${bbox}););out;`
  );
  const havens = await overpass(
    `[out:json][timeout:90];nwr[amenity~"^(fuel|pharmacy|police|hospital)$"](${bbox});out center tags;`
  );

  // --- street graph ---
  const osmNodes = new Map<number, { lat: number; lng: number }>();
  for (const el of streets.elements) if (el.type === 'node') osmNodes.set(el.id, { lat: el.lat, lng: el.lon });

  const poiPoints = shops.elements.map((e: any) => ({ lat: e.lat, lng: e.lon }));
  const hasFrontage = (mid: { lat: number; lng: number }) => {
    for (const p of poiPoints) {
      if (Math.abs(p.lat - mid.lat) > 0.0004 || Math.abs(p.lng - mid.lng) > 0.0004) continue;
      if (haversine(mid, p) <= FRONTAGE_RADIUS_M) return true;
    }
    return false;
  };

  const edges = new Map<string, GEdge>();
  for (const el of streets.elements) {
    if (el.type !== 'way') continue;
    const attr = interpretWay(el.tags || {});
    for (let i = 1; i < el.nodes.length; i++) {
      const a = el.nodes[i - 1];
      const b = el.nodes[i];
      const pa = osmNodes.get(a);
      const pb = osmNodes.get(b);
      if (!pa || !pb || a === b) continue;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (edges.has(key)) continue;
      const mid = { lat: (pa.lat + pb.lat) / 2, lng: (pa.lng + pb.lng) / 2 };
      edges.set(key, { a, b, len: Math.max(1, haversine(pa, pb)), attr, frontage: hasFrontage(mid) });
    }
  }

  // largest connected component only
  const parent = new Map<number, number>();
  const find = (x: number): number => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r)!;
    while (parent.get(x) !== r) {
      const n = parent.get(x)!;
      parent.set(x, r);
      x = n;
    }
    return r;
  };
  for (const e of edges.values()) {
    if (!parent.has(e.a)) parent.set(e.a, e.a);
    if (!parent.has(e.b)) parent.set(e.b, e.b);
    parent.set(find(e.a), find(e.b));
  }
  const sizes = new Map<number, number>();
  for (const id of parent.keys()) sizes.set(find(id), (sizes.get(find(id)) || 0) + 1);
  const mainRoot = [...sizes.entries()].sort((x, y) => y[1] - x[1])[0][0];
  const inMain = (id: number) => parent.has(id) && find(id) === mainRoot;

  const snapM: number[] = [];
  const snap = (p: { lat: number; lng: number }) => {
    let best = -1;
    let bestD = Infinity;
    for (const [id, pos] of osmNodes) {
      if (!inMain(id)) continue;
      const d = haversine(p, pos);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    }
    if (bestD > 350) throw new Error(`${meta.id}: no walkable node within 350 m of ${JSON.stringify(p)} (nearest ${bestD.toFixed(0)} m)`);
    snapM.push(Math.round(bestD));
    return best;
  };
  let startOsm = snap(meta.start);
  let endOsm = snap(meta.end);

  // --- 24/7 havens ---
  const candidates: Sanctuary[] = [];
  for (const el of havens.elements) {
    const t = el.tags || {};
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;
    const kind = HAVEN_TYPE[t.amenity];
    const hours = String(t.opening_hours || '');
    const is247 = /24\s*\/\s*7/.test(hours);
    // Police stations are staffed round the clock. Everything else must say so explicitly in OSM:
    // hospitals need emergency=yes (or 24/7 hours) so clinics and dental/eye centres are excluded,
    // fuel stations and pharmacies need opening_hours=24/7.
    const qualifies = kind === 'police_kiosk' || (kind === 'hospital' && (t.emergency === 'yes' || is247)) || ((kind === 'petrol_bunk' || kind === 'pharmacy') && is247);
    if (!qualifies) continue;
    const name = t.name || t['name:en'] || (kind === 'police_kiosk' ? 'Police station' : kind === 'hospital' ? 'Hospital' : kind === 'pharmacy' ? '24/7 Pharmacy' : '24/7 Fuel station');
    const address = [t['addr:housename'], t['addr:street'], t['addr:suburb']].filter(Boolean).join(', ') || `OpenStreetMap ${t.amenity} @ ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    candidates.push({
      id: `${prefix}-${t.amenity}-${el.id}`,
      name,
      nameKn: t['name:kn'] || name,
      type: kind,
      lat: +lat.toFixed(6),
      lng: +lng.toFixed(6),
      address,
      isOpen24x7: true,
      isStaffed: true,
      lightingRating: 4,
      contactNumber: t.phone || t['contact:phone'] || '112',
      description: `${t.amenity} mapped in OpenStreetMap${is247 ? ' (opening_hours=24/7)' : ' (emergency service)'}.`,
    });
  }

  // --- full-graph corridor, routed with the app's own router ---
  const nodeIds = [...parent.keys()].filter(inMain);
  const fullNodes: RoadNode[] = nodeIds.map((id) => ({ id: `o${id}`, name: 'Junction', lat: osmNodes.get(id)!.lat, lng: osmNodes.get(id)!.lng, isLit: true }));
  const fullSegments: RoadSegment[] = [...edges.values()]
    .filter((e) => inMain(e.a))
    .map((e, i) => ({
      id: `e${i}`,
      fromNodeId: `o${e.a}`,
      toNodeId: `o${e.b}`,
      distanceMeters: Math.max(1, Math.round(e.len)),
      isLit: e.attr.isLit,
      hasActiveFrontage: e.frontage,
      surfaceType: e.attr.surfaceType,
      streetName: e.attr.streetName,
    }));

  // --- pick the entrances (within ENTRANCE_SHIFT_M of each landmark) that give an honest contrast ---
  // Landmarks are just a hint: the nearest snapped node is not always where the dark/lit choice exists.
  const nearby = (target: { lat: number; lng: number }, anchor: number, shiftM: number) => {
    const pool = nodeIds
      .map((id) => ({ id, d: haversine(target, osmNodes.get(id)!) }))
      .filter((x) => x.d <= shiftM)
      .sort((a, b) => a.d - b.d);
    const picked = [anchor];
    for (const c of pool) {
      if (picked.length >= PAIR_CANDIDATES) break;
      if (picked.every((p) => haversine(osmNodes.get(p)!, osmNodes.get(c.id)!) > 60)) picked.push(c.id);
    }
    return picked;
  };
  const probe = { id: meta.id, nodes: fullNodes, segments: fullSegments, sanctuaries: [] as Sanctuary[] };
  let bestPair = { s: startOsm, e: endOsm, score: -Infinity, litGap: 0, saved: 0 };
  for (const shiftM of ENTRANCE_SHIFTS_M) {
    for (const sCand of nearby(meta.start, startOsm, shiftM)) {
      for (const eCand of nearby(meta.end, endOsm, shiftM)) {
        if (haversine(osmNodes.get(sCand)!, osmNodes.get(eCand)!) < 700) continue;
        const r = calculateCorridorRoutes({ ...probe, startNodeId: `o${sCand}`, endNodeId: `o${eCand}` } as unknown as TransitCorridor);
        const litGap = r.safeRoute.litPercentage - r.shortestRoute.litPercentage;
        const saved = r.safeRoute.totalDistanceMeters - r.shortestRoute.totalDistanceMeters;
        if (saved < 60 || litGap < MIN_LIT_GAP || r.safeRoute.litPercentage < 75) continue;
        // reward a clear lit/unlit gap and a shortcut that actually saves minutes; stay near 1-2.5 km walks
        const score = litGap + Math.min(saved, 400) / 10 - Math.abs(r.safeRoute.totalDistanceMeters - 1500) / 100;
        if (score > bestPair.score) bestPair = { s: sCand, e: eCand, score, litGap, saved };
      }
    }
    if (bestPair.score > -Infinity) break;
  }
  if (bestPair.score > -Infinity) {
    startOsm = bestPair.s;
    endOsm = bestPair.e;
  } else {
    console.warn(`  ! ${meta.id}: no entrance pair with a real lit/unlit contrast; keeping landmark entrances`);
  }

  const fullCorridor = {
    id: meta.id,
    startNodeId: `o${startOsm}`,
    endNodeId: `o${endOsm}`,
    nodes: fullNodes,
    segments: fullSegments,
    sanctuaries: candidates,
  } as unknown as TransitCorridor;
  const first = calculateCorridorRoutes(fullCorridor);

  // keep havens that are on / next to the safe walk (nearest first)
  const safePts = first.safeRoute.pathCoordinates.map(([lat, lng]) => ({ lat, lng }));
  const distToSafe = (s: Sanctuary) => Math.min(...safePts.map((p) => haversine(p, s)));
  const ranked = candidates.map((s) => ({ s, d: distToSafe(s) })).sort((a, b) => a.d - b.d);
  let chosen = ranked.filter((r) => r.d <= SANCTUARY_NEAR_ROUTE_M).slice(0, 4);
  if (chosen.length < 2) chosen = ranked.filter((r) => r.d <= 450).slice(0, Math.max(2, chosen.length));
  const sanctuaries = chosen.map((r) => r.s);
  fullCorridor.sanctuaries = sanctuaries;
  const full = calculateCorridorRoutes(fullCorridor);

  // --- compact: union of the two walks, contracted ---
  const edgeBetween = new Map<string, GEdge>();
  for (const e of edges.values()) edgeBetween.set(e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`, e);
  const toOsm = (id: string) => Number(id.slice(1));
  const used = new Map<string, GEdge>();
  for (const route of [full.safeRoute, full.shortestRoute]) {
    for (let i = 1; i < route.nodes.length; i++) {
      const a = toOsm(route.nodes[i - 1].id);
      const b = toOsm(route.nodes[i].id);
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      used.set(k, edgeBetween.get(k)!);
    }
  }
  const adj = new Map<number, GEdge[]>();
  for (const e of used.values()) {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a)!.push(e);
    adj.get(e.b)!.push(e);
  }
  const isJunction = (n: number) => adj.get(n)!.length !== 2 || n === startOsm || n === endOsm;
  const sig = (e: GEdge) => `${e.attr.isLit}|${e.attr.surfaceType}|${e.frontage}`;

  const keptNodes = new Set<number>([startOsm, endOsm]);
  const outEdges: { a: number; b: number; len: number; e: GEdge }[] = [];
  const seen = new Set<GEdge>();
  for (const j of adj.keys()) {
    if (!isJunction(j)) continue;
    for (const first0 of adj.get(j)!) {
      if (seen.has(first0)) continue;
      // walk the chain to the next junction
      const chainNodes = [j];
      const chainEdges: GEdge[] = [];
      let cur = j;
      let e: GEdge | undefined = first0;
      while (e && !seen.has(e)) {
        seen.add(e);
        const next = e.a === cur ? e.b : e.a;
        chainNodes.push(next);
        chainEdges.push(e);
        cur = next;
        if (isJunction(cur)) break;
        e = adj.get(cur)!.find((x) => x !== e);
      }
      // split at attribute changes, then simplify each piece
      let start = 0;
      for (let i = 1; i <= chainEdges.length; i++) {
        if (i === chainEdges.length || sig(chainEdges[i]) !== sig(chainEdges[start])) {
          const piece = chainNodes.slice(start, i + 1);
          const keepIdx = simplifyIndices(piece.map((n) => osmNodes.get(n)!), SIMPLIFY_TOLERANCE_M);
          for (let k = 1; k < keepIdx.length; k++) {
            const from = keepIdx[k - 1];
            const to = keepIdx[k];
            let len = 0;
            for (let m = from; m < to; m++) len += chainEdges[start + m].len;
            const attrEdge = chainEdges.slice(start + from, start + to).sort((x, y) => y.len - x.len)[0];
            outEdges.push({ a: piece[from], b: piece[to], len, e: attrEdge });
            keptNodes.add(piece[from]);
            keptNodes.add(piece[to]);
          }
          start = i;
        }
      }
    }
  }

  const order = [startOsm, ...[...keptNodes].filter((n) => n !== startOsm && n !== endOsm), endOsm];
  const idOf = new Map<number, string>(order.map((n, i) => [n, `${prefix}-n${i + 1}`]));
  const segs: RoadSegment[] = outEdges.map((o, i) => ({
    id: `${prefix}-s${i + 1}`,
    fromNodeId: idOf.get(o.a)!,
    toNodeId: idOf.get(o.b)!,
    distanceMeters: Math.max(1, Math.round(o.len)),
    isLit: o.e.attr.isLit,
    hasActiveFrontage: o.e.frontage,
    surfaceType: o.e.attr.surfaceType,
    streetName: o.e.attr.streetName,
    lightingSource: o.e.attr.lightingSource,
  }));
  const nameFor = (n: number) => {
    const s = segs.find((x) => x.fromNodeId === idOf.get(n) || x.toNodeId === idOf.get(n));
    return s ? s.streetName : 'Junction';
  };
  const litAt = (n: number) => segs.filter((x) => x.fromNodeId === idOf.get(n) || x.toNodeId === idOf.get(n)).every((x) => x.isLit);
  const nodes: RoadNode[] = order.map((n) => ({
    id: idOf.get(n)!,
    name:
      n === startOsm
        ? (haversine(meta.start, osmNodes.get(n)!) > 60 ? `Near ${meta.start.name}` : meta.start.name)
        : n === endOsm
        ? (haversine(meta.end, osmNodes.get(n)!) > 60 ? `Near ${meta.end.name}` : meta.end.name)
        : nameFor(n),
    lat: +osmNodes.get(n)!.lat.toFixed(6),
    lng: +osmNodes.get(n)!.lng.toFixed(6),
    isLit: litAt(n),
  }));

  const { start, end, ...rest } = meta;
  const corridor: TransitCorridor = {
    ...(rest as any),
    startNodeId: idOf.get(startOsm)!,
    endNodeId: idOf.get(endOsm)!,
    nodes,
    segments: segs,
    sanctuaries,
  };

  // --- verify the compact corridor reproduces the full-graph result ---
  const check = calculateCorridorRoutes(corridor);
  const explicit = segs.filter((s) => (s as any).lightingSource === 'osm').reduce((a, s) => a + s.distanceMeters, 0);
  const total = segs.reduce((a, s) => a + s.distanceMeters, 0);
  return {
    corridor,
    stats: {
      id: meta.id,
      osmEdges: fullSegments.length,
      nodes: nodes.length,
      segments: segs.length,
      sanctuaries: sanctuaries.length,
      candidates: candidates.length,
      fullSafe: full.safeRoute.totalDistanceMeters,
      fullShort: full.shortestRoute.totalDistanceMeters,
      safe: check.safeRoute.totalDistanceMeters,
      short: check.shortestRoute.totalDistanceMeters,
      safeLit: check.safeRoute.litPercentage,
      shortLit: check.shortestRoute.litPercentage,
      safeHavens: check.safeRoute.sanctuariesAlongRoute.length,
      safePts: check.safeRoute.pathCoordinates.length,
      shortPts: check.shortestRoute.pathCoordinates.length,
      osmTaggedPct: Math.round((explicit / total) * 100),
      shiftM: `${Math.round(haversine(meta.start, osmNodes.get(startOsm)!))}/${Math.round(haversine(meta.end, osmNodes.get(endOsm)!))}`,
    },
  };
}

// ---------- main ----------
function formatCorridor(c: any): string {
  const lines = Object.entries(c).map(([k, v]) => {
    if (k === 'nodes' || k === 'segments' || k === 'sanctuaries') {
      return `    ${k}: [\n${(v as any[]).map((x) => '      ' + JSON.stringify(x)).join(',\n')}\n    ]`;
    }
    return `    ${k}: ${JSON.stringify(v)}`;
  });
  return `  {\n${lines.join(',\n')}\n  }`;
}

const metas: Meta[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'corridor-meta.json'), 'utf8'));
const only = process.argv[2];
const prefixes = ['in', 'wf', 'bel', 'km', 'hsr', 'mg'];
const built: TransitCorridor[] = [];
const rows: any[] = [];
for (const [i, meta] of metas.entries()) {
  if (only && meta.id !== only) continue;
  process.stderr.write(`> ${meta.id}\n`);
  const { corridor, stats } = await buildCorridor(meta, prefixes[i]);
  built.push(corridor);
  rows.push(stats);
}
console.table(rows);

if (!only) {
  const bad = rows.filter((r) => !(r.short < r.safe) || !(r.shortLit < r.safeLit) || Math.abs(r.safe - r.fullSafe) > 0.02 * r.fullSafe || Math.abs(r.short - r.fullShort) > 0.02 * r.fullShort);
  if (bad.length) console.warn('\nCorridors failing contrast / reproducibility checks:', bad.map((b) => b.id));
  const header =
    `import { TransitCorridor } from '../types/corridor';\n\n` +
    `// GENERATED by scripts/build-corridors.mts (npm run build:data) - do not edit by hand.\n` +
    `// Street geometry, lighting tags and havens: (c) OpenStreetMap contributors, ODbL.\n` +
    `// Segment lengths are measured along the street. Segments with lightingSource 'assumed' had no\n` +
    `// lit=* tag in OSM and are treated as unlit unless they are arterials or mapped sidewalks.\n`;
  fs.writeFileSync(OUT_FILE, `${header}export const BENGALURU_CORRIDORS: TransitCorridor[] = [\n${built.map(formatCorridor).join(',\n')}\n];\n`);
  console.log(`\nWrote ${OUT_FILE} (${(fs.statSync(OUT_FILE).size / 1024).toFixed(0)} KB)`);
}
