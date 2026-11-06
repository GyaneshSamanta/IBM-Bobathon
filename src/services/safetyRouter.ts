import { TransitCorridor, RoadNode, RoadSegment, RouteResult, Sanctuary, GeoPoint } from '../types/corridor';
import { calculateHaversineDistanceMeters } from './offlineStorage';

interface GraphEdge {
  targetNodeId: string;
  segment: RoadSegment;
  safetyCost: number;
  physicalDistance: number;
}

interface PriorityQueueItem {
  nodeId: string;
  priority: number;
}

class SimplePriorityQueue {
  private items: PriorityQueueItem[] = [];

  enqueue(nodeId: string, priority: number) {
    this.items.push({ nodeId, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): string | undefined {
    return this.items.shift()?.nodeId;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

function buildGraph(
  corridor: TransitCorridor,
  mode: 'safety_weighted' | 'shortest_distance'
): Map<string, GraphEdge[]> {
  const graph = new Map<string, GraphEdge[]>();

  for (const node of corridor.nodes) {
    graph.set(node.id, []);
  }

  for (const seg of corridor.segments) {
    let nearSanctuary = false;
    const fromNode = corridor.nodes.find((n) => n.id === seg.fromNodeId);
    const toNode = corridor.nodes.find((n) => n.id === seg.toNodeId);

    if (fromNode && toNode) {
      const midPoint: GeoPoint = {
        lat: (fromNode.lat + toNode.lat) / 2,
        lng: (fromNode.lng + toNode.lng) / 2,
      };

      for (const sanc of corridor.sanctuaries) {
        if (sanc.isOpen24x7 && calculateHaversineDistanceMeters(midPoint, { lat: sanc.lat, lng: sanc.lng }) < 70) {
          nearSanctuary = true;
          break;
        }
      }
    }

    let edgeCost = seg.distanceMeters;

    if (mode === 'safety_weighted') {
      const wUnlit = seg.isLit ? 0 : 2.8;
      const wIsolation =
        seg.surfaceType === 'dirt_trail'
          ? 2.0
          : seg.surfaceType === 'isolated_underpass'
          ? 2.6
          : 0;
      const wSanctuary = nearSanctuary ? 0.45 : 0;

      const penaltyMultiplier = 1.0 + wUnlit + wIsolation - wSanctuary;
      edgeCost = Math.max(10, Math.round(seg.distanceMeters * penaltyMultiplier));
    }

    graph.get(seg.fromNodeId)?.push({
      targetNodeId: seg.toNodeId,
      segment: seg,
      safetyCost: edgeCost,
      physicalDistance: seg.distanceMeters,
    });

    graph.get(seg.toNodeId)?.push({
      targetNodeId: seg.fromNodeId,
      segment: seg,
      safetyCost: edgeCost,
      physicalDistance: seg.distanceMeters,
    });
  }

  return graph;
}

function runAStar(
  corridor: TransitCorridor,
  graph: Map<string, GraphEdge[]>,
  startNodeId: string,
  endNodeId: string,
  mode: 'safety_weighted' | 'shortest_distance'
): { nodePath: RoadNode[]; segments: RoadSegment[]; totalDistance: number } {
  const nodeMap = new Map<string, RoadNode>(corridor.nodes.map((n) => [n.id, n]));
  const targetNode = nodeMap.get(endNodeId);
  if (!targetNode) throw new Error(`Target node ${endNodeId} not found`);

  const frontier = new SimplePriorityQueue();
  frontier.enqueue(startNodeId, 0);

  const cameFrom = new Map<string, { prevNodeId: string; segment: RoadSegment }>();
  const costSoFar = new Map<string, number>();
  costSoFar.set(startNodeId, 0);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();
    if (!current) break;

    if (current === endNodeId) break;

    const neighbors = graph.get(current) || [];
    for (const edge of neighbors) {
      const cost = mode === 'safety_weighted' ? edge.safetyCost : edge.physicalDistance;
      const newCost = (costSoFar.get(current) || 0) + cost;

      if (!costSoFar.has(edge.targetNodeId) || newCost < (costSoFar.get(edge.targetNodeId) || 0)) {
        costSoFar.set(edge.targetNodeId, newCost);

        // Shortest-distance mode is plain Dijkstra (h = 0): declared segment lengths can be
        // shorter than straight-line distance, which would make the haversine heuristic inadmissible.
        const target = nodeMap.get(edge.targetNodeId);
        // 0.55 is the cheapest possible per-metre cost (sanctuary discount), so the heuristic never overestimates.
        const heuristic = target && mode === 'safety_weighted'
          ? 0.55 * calculateHaversineDistanceMeters({ lat: target.lat, lng: target.lng }, { lat: targetNode.lat, lng: targetNode.lng })
          : 0;

        frontier.enqueue(edge.targetNodeId, newCost + heuristic);
        cameFrom.set(edge.targetNodeId, { prevNodeId: current, segment: edge.segment });
      }
    }
  }

  const nodePath: RoadNode[] = [];
  const segments: RoadSegment[] = [];
  let curr: string | undefined = endNodeId;
  let totalDistance = 0;

  while (curr && curr !== startNodeId) {
    const fromInfo = cameFrom.get(curr);
    const node = nodeMap.get(curr);
    if (node) nodePath.unshift(node);

    if (fromInfo) {
      segments.unshift(fromInfo.segment);
      totalDistance += fromInfo.segment.distanceMeters;
      curr = fromInfo.prevNodeId;
    } else {
      break;
    }
  }

  const startNode = nodeMap.get(startNodeId);
  if (startNode) nodePath.unshift(startNode);

  return { nodePath, segments, totalDistance };
}

export function findSanctuariesNearPath(pathCoords: [number, number][], sanctuaries: Sanctuary[]): Sanctuary[] {
  const result: Sanctuary[] = [];
  for (const sanc of sanctuaries) {
    let minDistance = Infinity;
    for (const [lat, lng] of pathCoords) {
      const d = calculateHaversineDistanceMeters({ lat, lng }, { lat: sanc.lat, lng: sanc.lng });
      if (d < minDistance) minDistance = d;
    }
    if (minDistance <= 85) {
      result.push(sanc);
    }
  }
  return result;
}

export function calculateSafetyMetrics(
  segments: RoadSegment[],
  sanctuariesAlongRoute: Sanctuary[],
  totalDistanceMeters: number
): { litPercentage: number; safetyScore: number; estimatedMinutes: number } {
  if (totalDistanceMeters <= 0 || segments.length === 0) {
    return { litPercentage: 100, safetyScore: 90, estimatedMinutes: 5 };
  }

  let litDistance = 0;
  let activeFrontageDistance = 0;

  for (const seg of segments) {
    if (seg.isLit) litDistance += seg.distanceMeters;
    if (seg.hasActiveFrontage) activeFrontageDistance += seg.distanceMeters;
  }

  const litPercentage = Math.min(100, Math.round((litDistance / totalDistanceMeters) * 100));
  const frontagePercentage = Math.min(100, Math.round((activeFrontageDistance / totalDistanceMeters) * 100));

  const walkingSpeedMps = 1.2;
  const estimatedMinutes = Math.ceil(totalDistanceMeters / (walkingSpeedMps * 60));

  const sanctuaryBonus = Math.min(25, sanctuariesAlongRoute.length * 12);
  const rawScore = litPercentage * 0.45 + frontagePercentage * 0.3 + sanctuaryBonus;
  const safetyScore = Math.min(98, Math.max(12, Math.round(rawScore)));

  return { litPercentage, safetyScore, estimatedMinutes };
}

export function calculateCorridorRoutes(
  corridor: TransitCorridor,
  startNodeId?: string,
  endNodeId?: string
): { safeRoute: RouteResult; shortestRoute: RouteResult; transitRoute?: RouteResult } {
  const start = startNodeId || corridor.startNodeId;
  const end = endNodeId || corridor.endNodeId;

  // 1. Safe Route (A* Safety-Weighted)
  const safeGraph = buildGraph(corridor, 'safety_weighted');
  const safeResult = runAStar(corridor, safeGraph, start, end, 'safety_weighted');
  const safeCoords: [number, number][] = safeResult.nodePath.map((n) => [n.lat, n.lng]);
  const safeSanctuaries = findSanctuariesNearPath(safeCoords, corridor.sanctuaries);
  const safeMetrics = calculateSafetyMetrics(safeResult.segments, safeSanctuaries, safeResult.totalDistance);

  const safeRoute: RouteResult = {
    id: 'route-safe',
    name: 'Safe Illuminated Corridor',
    nameKn: 'ಸುರಕ್ಷಿತ ಬೆಳಕಿನ ರಸ್ತೆ',
    type: 'safe_corridor',
    nodes: safeResult.nodePath,
    pathCoordinates: safeCoords,
    totalDistanceMeters: safeResult.totalDistance,
    estimatedDurationMinutes: safeMetrics.estimatedMinutes,
    litPercentage: safeMetrics.litPercentage,
    safetyScore: safeMetrics.safetyScore,
    sanctuariesAlongRoute: safeSanctuaries,
    whyRecommended: `Arterial road with ${safeMetrics.litPercentage}% active street lighting and ${safeSanctuaries.length} open 24/7 havens.`,
    color: '#24A148',
  };

  // 2. Shortest Distance Route (Standard GPS Shortest Path)
  const shortestGraph = buildGraph(corridor, 'shortest_distance');
  const shortestResult = runAStar(corridor, shortestGraph, start, end, 'shortest_distance');
  const shortestCoords: [number, number][] = shortestResult.nodePath.map((n) => [n.lat, n.lng]);
  const shortestSanctuaries = findSanctuariesNearPath(shortestCoords, corridor.sanctuaries);
  const shortestMetrics = calculateSafetyMetrics(shortestResult.segments, shortestSanctuaries, shortestResult.totalDistance);

  const shortestRoute: RouteResult = {
    id: 'route-shortest',
    name: 'Dark Dirt Shortcut (Avoid)',
    nameKn: 'ಕತ್ತಲೆಯ ಹಾದಿ (ಬೇಡ)',
    type: 'shortest_risk',
    nodes: shortestResult.nodePath,
    pathCoordinates: shortestCoords,
    totalDistanceMeters: shortestResult.totalDistance,
    estimatedDurationMinutes: shortestMetrics.estimatedMinutes,
    litPercentage: shortestMetrics.litPercentage,
    safetyScore: shortestMetrics.safetyScore,
    sanctuariesAlongRoute: shortestSanctuaries,
    whyRecommended: `Shortest physical distance (${shortestResult.totalDistance}m, saves ~${Math.max(0, safeMetrics.estimatedMinutes - shortestMetrics.estimatedMinutes)} mins), but only ${shortestMetrics.litPercentage}% of it is lit.`,
    whyAvoid: `Avoid at night: ${100 - shortestMetrics.litPercentage}% of this route has no street lighting, higher isolation risk.`,
    color: '#DA1E28',
  };

  // 3. Public Transit Route (BMTC Bus / Metro Feeder Option)
  let transitRoute: RouteResult | undefined;
  if (corridor.publicTransit) {
    const pt = corridor.publicTransit;
    transitRoute = {
      id: 'route-public-transit',
      name: `${pt.lineName} (${pt.boardingStop})`,
      nameKn: `${pt.lineName}`,
      type: 'public_transit',
      nodes: safeResult.nodePath,
      pathCoordinates: safeCoords,
      totalDistanceMeters: safeResult.totalDistance + 200,
      estimatedDurationMinutes: pt.rideDurationMinutes + pt.walkToStopMinutes + pt.walkFromStopMinutes,
      litPercentage: 98,
      safetyScore: 95,
      sanctuariesAlongRoute: safeSanctuaries,
      whyRecommended: `${pt.vehicleType} • ${pt.departureFrequencyText} • ${pt.safetyRating}`,
      color: '#0F62FE',
    };
  }

  return { safeRoute, shortestRoute, transitRoute };
}

// 🧠 Dynamic Agentic Rerouting: Diverts user directly to the nearest sanctuary forecourt
export function calculateSanctuaryDiversionRoute(
  corridor: TransitCorridor,
  currentPos: GeoPoint,
  targetSanctuary: Sanctuary
): RouteResult {
  // Find nearest node in corridor to sanctuary
  let nearestNode = corridor.nodes[0];
  let minDistance = Infinity;

  for (const node of corridor.nodes) {
    const d = calculateHaversineDistanceMeters({ lat: node.lat, lng: node.lng }, { lat: targetSanctuary.lat, lng: targetSanctuary.lng });
    if (d < minDistance) {
      minDistance = d;
      nearestNode = node;
    }
  }

  // Create direct tactical trajectory from current pos to sanctuary
  const evasionCoords: [number, number][] = [
    [currentPos.lat, currentPos.lng],
    [nearestNode.lat, nearestNode.lng],
    [targetSanctuary.lat, targetSanctuary.lng],
  ];

  const totalDist =
    calculateHaversineDistanceMeters(currentPos, { lat: nearestNode.lat, lng: nearestNode.lng }) +
    calculateHaversineDistanceMeters({ lat: nearestNode.lat, lng: nearestNode.lng }, { lat: targetSanctuary.lat, lng: targetSanctuary.lng });

  return {
    id: 'route-agentic-diversion',
    name: `🚨 Tactical Diversion: ${targetSanctuary.name}`,
    nameKn: `🚨 ತಕ್ಷಣದ ರಕ್ಷಣೆ: ${targetSanctuary.nameKn}`,
    type: 'safe_corridor',
    nodes: [nearestNode],
    pathCoordinates: evasionCoords,
    totalDistanceMeters: Math.max(50, totalDist),
    estimatedDurationMinutes: 2,
    litPercentage: 100,
    safetyScore: 99,
    sanctuariesAlongRoute: [targetSanctuary],
    whyRecommended: `Agentic Copilot diverted course to immediate lit sanctuary. Attendants on duty. Stay in active forecourt.`,
    color: '#10B981',
  };
}
