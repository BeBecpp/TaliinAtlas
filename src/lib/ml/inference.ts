import type { ClassificationResult, TaliinAtlasModelArtifact } from "./types";
import { classifyWithEnsemble, type ClassifierModel } from "./ensembleClassifier";
import { trainFullModel } from "./modelTrainer";

let memoryModel: TaliinAtlasModelArtifact | null = null;

/** In-memory model for serverless/API when disk artifact unavailable at import time. */
export function getInMemoryModel(): TaliinAtlasModelArtifact {
  if (!memoryModel) memoryModel = trainFullModel();
  return memoryModel;
}

export function classifyInput(
  input: string,
  model?: ClassifierModel
): ClassificationResult {
  const m = model ?? getInMemoryModel();
  return classifyWithEnsemble(input, m);
}

export function getModelInfoFromArtifact(model: TaliinAtlasModelArtifact) {
  return {
    name: model.modelName,
    version: model.version,
    trainedAt: model.trainedAt,
    trainingExampleCount: model.trainingExampleCount,
    vocabularySize: model.vocabularySize,
    categories: model.categories,
    evaluation: model.evaluation,
    provider: "custom-ml" as const,
  };
}
