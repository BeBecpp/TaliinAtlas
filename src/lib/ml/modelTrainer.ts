import { TRAINING_EXAMPLES } from "@/data/ml/trainingExamples";
import type { TaliinAtlasModelArtifact } from "./types";
import { trainModelFromExamples } from "./featureExtractor";
import { evaluateModel } from "./modelEvaluator";

export function trainFullModel(
  examples = TRAINING_EXAMPLES
): TaliinAtlasModelArtifact {
  const base = trainModelFromExamples(examples);
  const evaluation = evaluateModel(base);
  return { ...base, evaluation };
}
