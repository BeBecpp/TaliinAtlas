import type { AtlasData, AtlasProgress, LearningMode } from "@/types/atlas";

export interface SavedAtlas {
  id: string;
  userId: string;
  title: string;
  description: string;
  topicInput: string;
  mode: LearningMode;
  atlas: AtlasData;
  progress: AtlasProgress;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  tags: string[];
  favorite: boolean;
}

export type SavedAtlasSort = "recent" | "title" | "progress";
