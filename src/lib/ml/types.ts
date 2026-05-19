export const TOPIC_CATEGORIES = [
  "react",
  "javascript-async",
  "git",
  "database",
  "programming-basics",
  "web-development",
  "algorithms",
  "system-design-basics",
  "study-generic",
  "math-basics",
] as const;

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export interface TrainingExample {
  id: string;
  input: string;
  category: TopicCategory;
  tags: string[];
  difficultyHint?: "beginner" | "intermediate" | "advanced";
}

export interface ProcessedText {
  raw: string;
  normalized: string;
  tokens: string[];
  bigrams: string[];
  signals: string[];
}

export interface CategoryScore {
  category: TopicCategory;
  score: number;
  confidence: number;
}

export interface ClassificationResult {
  category: TopicCategory;
  confidence: number;
  alternatives: Array<{ category: TopicCategory; confidence: number }>;
  matchedSignals: string[];
  tokens: string[];
  explanation: string;
}

export interface CategoryCentroid {
  category: TopicCategory;
  vector: Record<string, number>;
  magnitude: number;
}

export interface ModelEvaluation {
  accuracy: number;
  top2Accuracy: number;
  categoryMetrics: Record<
    TopicCategory,
    { support: number; correct: number; precision: number; recall: number }
  >;
  confusionMatrix: Record<TopicCategory, Partial<Record<TopicCategory, number>>>;
}

export interface TaliinAtlasModelArtifact {
  modelName: string;
  version: string;
  trainedAt: string;
  categories: TopicCategory[];
  trainingExampleCount: number;
  vocabularySize: number;
  categoryPriors: Record<TopicCategory, number>;
  idf: Record<string, number>;
  categoryTokenWeights: Record<TopicCategory, Record<string, number>>;
  categoryCentroids: CategoryCentroid[];
  vocabulary: string[];
  evaluation: ModelEvaluation;
}
