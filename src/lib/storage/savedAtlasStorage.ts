import type { AtlasData, AtlasNodeData, AtlasProgress, LearningMode } from "@/types/atlas";
import type { SavedAtlas, SavedAtlasSort } from "@/types/savedAtlas";
import { getNodeStatuses } from "@/lib/atlasProgress";

export const SAVED_ATLASES_KEY = "taliin_atlas_saved_atlases";

function readAll(): SavedAtlas[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_ATLASES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedAtlas[];
  } catch {
    return [];
  }
}

function writeAll(atlases: SavedAtlas[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_ATLASES_KEY, JSON.stringify(atlases));
}

export function getAtlasesByUser(userId: string): SavedAtlas[] {
  return readAll().filter((a) => a.userId === userId);
}

export function getAtlasById(id: string): SavedAtlas | undefined {
  return readAll().find((a) => a.id === id);
}

export function saveAtlas(record: SavedAtlas): SavedAtlas {
  const all = readAll();
  const index = all.findIndex((a) => a.id === record.id);
  if (index >= 0) all[index] = record;
  else all.push(record);
  writeAll(all);
  return record;
}

export function deleteAtlas(id: string): void {
  writeAll(readAll().filter((a) => a.id !== id));
}

export interface CreateSavedAtlasInput {
  userId: string;
  title: string;
  description: string;
  topicInput: string;
  mode: LearningMode;
  atlas: AtlasData;
  nodes: AtlasNodeData[];
  tags?: string[];
  favorite?: boolean;
}

export function createSavedAtlas(input: CreateSavedAtlasInput): SavedAtlas {
  const now = new Date().toISOString();
  const progress: AtlasProgress = {
    atlasId: input.atlas.id,
    nodeStatuses: getNodeStatuses(input.nodes),
    updatedAt: now,
  };
  const record: SavedAtlas = {
    id: crypto.randomUUID(),
    userId: input.userId,
    title: input.title,
    description: input.description,
    topicInput: input.topicInput,
    mode: input.mode,
    atlas: { ...input.atlas, nodes: input.nodes.map((n) => ({ ...n })) },
    progress,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    tags: input.tags ?? [],
    favorite: input.favorite ?? false,
  };
  return saveAtlas(record);
}

export function updateSavedAtlasFromWorkspace(
  id: string,
  data: {
    title?: string;
    description?: string;
    topicInput?: string;
    mode?: LearningMode;
    atlas: AtlasData;
    nodes: AtlasNodeData[];
    touchOpened?: boolean;
  }
): SavedAtlas | null {
  const existing = getAtlasById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: SavedAtlas = {
    ...existing,
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    topicInput: data.topicInput ?? existing.topicInput,
    mode: data.mode ?? existing.mode,
    atlas: { ...data.atlas, nodes: data.nodes.map((n) => ({ ...n })) },
    progress: {
      atlasId: data.atlas.id,
      nodeStatuses: getNodeStatuses(data.nodes),
      updatedAt: now,
    },
    updatedAt: now,
    lastOpenedAt: data.touchOpened ? now : existing.lastOpenedAt,
  };
  return saveAtlas(updated);
}

export function duplicateAtlas(id: string, userId: string): SavedAtlas | null {
  const source = getAtlasById(id);
  if (!source || source.userId !== userId) return null;

  const now = new Date().toISOString();
  const copy: SavedAtlas = {
    ...source,
    id: crypto.randomUUID(),
    title: `${source.title} (Copy)`,
    favorite: false,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    atlas: {
      ...source.atlas,
      nodes: source.atlas.nodes.map((n) => ({ ...n })),
    },
    progress: { ...source.progress, updatedAt: now },
  };
  return saveAtlas(copy);
}

export function toggleFavorite(id: string, userId: string): SavedAtlas | null {
  const atlas = getAtlasById(id);
  if (!atlas || atlas.userId !== userId) return null;
  return saveAtlas({
    ...atlas,
    favorite: !atlas.favorite,
    updatedAt: new Date().toISOString(),
  });
}

export function renameAtlas(id: string, userId: string, title: string): SavedAtlas | null {
  const atlas = getAtlasById(id);
  if (!atlas || atlas.userId !== userId) return null;
  return saveAtlas({
    ...atlas,
    title: title.trim() || atlas.title,
    updatedAt: new Date().toISOString(),
  });
}

export function sortAtlases(atlases: SavedAtlas[], sort: SavedAtlasSort): SavedAtlas[] {
  const list = [...atlases];
  switch (sort) {
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "progress": {
      return list.sort((a, b) => {
        const aDone = Object.values(a.progress.nodeStatuses).filter((s) => s === "completed").length;
        const bDone = Object.values(b.progress.nodeStatuses).filter((s) => s === "completed").length;
        return bDone - aDone;
      });
    }
    case "recent":
    default:
      return list.sort(
        (a, b) =>
          new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime()
      );
  }
}

export function filterAtlases(
  atlases: SavedAtlas[],
  query: string,
  favoritesOnly: boolean
): SavedAtlas[] {
  let result = atlases;
  if (favoritesOnly) result = result.filter((a) => a.favorite);
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.topicInput.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return result;
}

export function getMasteryPercent(atlas: SavedAtlas): number {
  const total = atlas.atlas.nodes.length;
  if (total === 0) return 0;
  const completed = Object.values(atlas.progress.nodeStatuses).filter(
    (s) => s === "completed"
  ).length;
  return Math.round((completed / total) * 100);
}

export function getCompletedCount(atlas: SavedAtlas): number {
  return Object.values(atlas.progress.nodeStatuses).filter((s) => s === "completed")
    .length;
}
