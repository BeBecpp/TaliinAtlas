import { sampleAtlas } from "@/data/sampleAtlas";
import type { GeneratedAtlasResult, GenerationMode } from "./types";
import type { ClassificationResult } from "@/lib/ml/types";

export function buildFallbackAtlas(
  input: string,
  classification: ClassificationResult,
  mode: GenerationMode
): GeneratedAtlasResult {
  const atlas = {
    ...sampleAtlas,
    id: `fallback-${Date.now().toString(36)}`,
    topic: input.trim() || sampleAtlas.topic,
    description: `A structured study atlas generated in ${mode} mode. Category hint: ${classification.category}.`,
    nodes: sampleAtlas.nodes.map((n) => ({ ...n })),
    edges: [...sampleAtlas.edges],
    recommendedPath: sampleAtlas.nodes.filter((n) => !n.isMastery).map((n) => n.id),
  };

  return {
    atlas,
    classification,
    engine: {
      name: "TaliinAtlas Custom ML Engine",
      provider: "custom-ml",
      modelVersion: "fallback",
      category: classification.category,
      confidence: classification.confidence,
      alternatives: classification.alternatives,
      matchedSignals: classification.matchedSignals,
      tokens: classification.tokens,
      trainingExampleCount: 0,
      vocabularySize: 0,
      explanation: classification.explanation + " (fallback template applied)",
    },
  };
}
