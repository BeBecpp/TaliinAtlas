import { classifyInput } from "@/lib/ml/inference";
import { getModel } from "@/lib/ml/modelLoader";
import type { TopicCategory } from "@/lib/ml/types";
import { getTemplate } from "./atlasTemplates";
import { planGraph } from "./graphPlanner";
import { normalizeAtlas } from "./atlasNormalizer";
import { buildFallbackAtlas } from "./fallbackAtlas";
import type { GeneratedAtlasResult, GenerationMode } from "./types";
export function generationModeFromString(mode?: string): GenerationMode {
  const valid: GenerationMode[] = [
    "Beginner",
    "Intermediate",
    "Fast Review",
    "Exam Prep",
    "Coding Practice",
  ];
  if (mode && valid.includes(mode as GenerationMode)) return mode as GenerationMode;
  return "Beginner";
}

export function generateWithCustomML(
  input: string,
  mode: GenerationMode = "Beginner"
): GeneratedAtlasResult {
  const model = getModel();
  const classification = classifyInput(input, model);
  const category: TopicCategory = classification.category;

  try {
    const template = getTemplate(category);
    const { atlas, recommendedPath } = planGraph(template, input, mode);
    const normalized = normalizeAtlas({ ...atlas, recommendedPath });

    return {
      atlas: normalized,
      classification,
      engine: {
        name: "TaliinAtlas Custom ML Engine",
        provider: "custom-ml",
        modelVersion: model.version,
        category,
        confidence: classification.confidence,
        alternatives: classification.alternatives,
        matchedSignals: classification.matchedSignals,
        tokens: classification.tokens,
        trainingExampleCount: model.trainingExampleCount,
        vocabularySize: model.vocabularySize,
        explanation: classification.explanation,
      },
    };
  } catch (err) {
    console.error("Atlas generation error, using fallback:", err);
    return buildFallbackAtlas(input, classification, mode);
  }
}
