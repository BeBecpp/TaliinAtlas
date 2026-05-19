import type { AtlasProgress } from "@/types/atlas";
import {
  loadProgress as loadLegacyProgress,
  resetProgress as resetLegacyProgress,
  saveProgress as saveLegacyProgress,
} from "@/lib/atlasProgress";

/**
 * Temporary / guest progress keyed by template atlas id.
 * Saved atlases store progress inside SavedAtlas records instead.
 */
export function loadGuestProgress(atlasId: string): AtlasProgress | null {
  return loadLegacyProgress(atlasId);
}

export function saveGuestProgress(
  atlasId: string,
  nodeStatuses: AtlasProgress["nodeStatuses"]
): void {
  saveLegacyProgress(atlasId, nodeStatuses);
}

export function clearGuestProgress(atlasId: string): void {
  resetLegacyProgress(atlasId);
}
