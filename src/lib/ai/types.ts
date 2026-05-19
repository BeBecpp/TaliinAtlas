import type { AtlasData } from "@/types/atlas";
import type { ClassificationResult, TopicCategory } from "@/lib/ml/types";

export type GenerationMode =
  | "Beginner"
  | "Intermediate"
  | "Fast Review"
  | "Exam Prep"
  | "Coding Practice";

export type AIProvider = "custom-ml" | "ollama" | "cloud-ai-placeholder";

export interface AIEngineMeta {
  name: "TaliinAtlas Custom ML Engine";
  provider: "custom-ml";
  modelVersion: string;
  category: TopicCategory;
  confidence: number;
  alternatives: Array<{ category: TopicCategory; confidence: number }>;
  matchedSignals: string[];
  tokens: string[];
  trainingExampleCount: number;
  vocabularySize: number;
  explanation: string;
}

export interface GeneratedAtlasResult {
  atlas: AtlasData & { recommendedPath?: string[] };
  engine: AIEngineMeta;
  classification: ClassificationResult;
}

export interface ConceptBlueprint {
  id: string;
  title: string;
  level: number;
  isMastery?: boolean;
}

export interface AtlasTemplate {
  category: TopicCategory;
  titlePattern: string;
  descriptionPattern: string;
  finalGoal: string;
  concepts: ConceptBlueprint[];
}
