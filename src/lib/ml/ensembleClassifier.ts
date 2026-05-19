import { getCategoryDefinition } from "@/data/ml/categoryDefinitions";
import { extractMatchedSignals } from "./keywordExtractor";
import { classifyNaiveBayes } from "./naiveBayesClassifier";
import { classifyNearestCentroid } from "./nearestCentroidClassifier";
import type { ClassificationResult, TaliinAtlasModelArtifact, TopicCategory } from "./types";
import { buildAlternatives, normalizeScores } from "./confidence";
import { tokenize } from "./tokenizer";
import { TOPIC_CATEGORIES } from "./types";

function minMaxNormalize(scores: Record<TopicCategory, number>): Record<TopicCategory, number> {
  const vals = TOPIC_CATEGORIES.map((c) => scores[c]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const out = {} as Record<TopicCategory, number>;
  for (const cat of TOPIC_CATEGORIES) {
    out[cat] = (scores[cat] - min) / range;
  }
  return out;
}

export type ClassifierModel = Omit<TaliinAtlasModelArtifact, "evaluation">;

export function classifyWithEnsemble(
  input: string,
  model: ClassifierModel
): ClassificationResult {
  const nb = minMaxNormalize(classifyNaiveBayes(input, model));
  const nc = minMaxNormalize(classifyNearestCentroid(input, model));

  const combined = TOPIC_CATEGORIES.map((category) => ({
    category,
    score: nb[category] * 0.55 + nc[category] * 0.45,
    confidence: 0,
  }));

  const normalized = normalizeScores(combined);
  const top = [...normalized].sort((a, b) => b.confidence - a.confidence)[0];
  const processed = tokenize(input);
  const matchedSignals = extractMatchedSignals(processed, top.category);
  const def = getCategoryDefinition(top.category);

  return {
    category: top.category,
    confidence: top.confidence,
    alternatives: buildAlternatives(normalized, top.category),
    matchedSignals,
    tokens: processed.tokens,
    explanation: `Ensemble classifier (Naive Bayes + TF-IDF centroid) detected "${def.label}" with ${Math.round(top.confidence * 100)}% confidence based on ${processed.tokens.length} tokens and ${matchedSignals.length} domain signals.`,
  };
}
