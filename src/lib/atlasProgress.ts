import type { AtlasData, AtlasNodeData, AtlasProgress, NodeStatus, ProgressStats } from "@/types/atlas";

const STORAGE_PREFIX = "taliin-atlas-progress:";

export function getStorageKey(atlasId: string): string {
  return `${STORAGE_PREFIX}${atlasId}`;
}

export function loadProgress(atlasId: string): AtlasProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getStorageKey(atlasId));
    if (!raw) return null;
    return JSON.parse(raw) as AtlasProgress;
  } catch {
    return null;
  }
}

export function saveProgress(atlasId: string, nodeStatuses: Record<string, NodeStatus>): void {
  if (typeof window === "undefined") return;
  const payload: AtlasProgress = {
    atlasId,
    nodeStatuses,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(getStorageKey(atlasId), JSON.stringify(payload));
}

export function resetProgress(atlasId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getStorageKey(atlasId));
}

export function applyProgressToNodes(
  nodes: AtlasNodeData[],
  progress: AtlasProgress | null
): AtlasNodeData[] {
  if (!progress) return nodes.map((n) => ({ ...n }));
  return nodes.map((node) => ({
    ...node,
    status: progress.nodeStatuses[node.id] ?? node.status,
  }));
}

export function getNodeStatuses(nodes: AtlasNodeData[]): Record<string, NodeStatus> {
  return Object.fromEntries(nodes.map((n) => [n.id, n.status]));
}

export function completeNodeAndUnlock(
  nodes: AtlasNodeData[],
  nodeId: string
): AtlasNodeData[] {
  const target = nodes.find((n) => n.id === nodeId);
  if (!target) return nodes;

  const unlockIds = new Set(target.unlocks);

  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, status: "completed" as NodeStatus };
    }
    if (unlockIds.has(node.id) && node.status === "locked") {
      return { ...node, status: "available" as NodeStatus };
    }
    return node;
  });
}

export function computeProgressStats(nodes: AtlasNodeData[]): ProgressStats {
  const completed = nodes.filter((n) => n.status === "completed").length;
  const unlocked = nodes.filter(
    (n) => n.status === "available" || n.status === "completed"
  ).length;
  const locked = nodes.filter((n) => n.status === "locked").length;
  const total = nodes.length;
  const masteryPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const nextRecommended =
    nodes.find((n) => n.status === "available") ??
    nodes.find((n) => n.status === "locked") ??
    null;

  return {
    completed,
    unlocked,
    locked,
    total,
    masteryPercent,
    nextRecommended,
  };
}

export function buildAtlasExport(atlas: AtlasData, nodes: AtlasNodeData[]): AtlasData {
  return {
    ...atlas,
    nodes,
  };
}

export function initializeAtlasNodes(atlas: AtlasData): AtlasNodeData[] {
  const saved = loadProgress(atlas.id);
  if (saved) {
    return applyProgressToNodes(atlas.nodes, saved);
  }
  return atlas.nodes.map((n) => ({ ...n }));
}
