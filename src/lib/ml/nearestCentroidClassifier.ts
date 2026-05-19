import type { TopicCategory } from "./types";
import type { ClassifierModel } from "./ensembleClassifier";
import { getFeatureTerms, tokenize } from "./tokenizer";
import { vectorizeInput } from "./featureExtractor";
import { TOPIC_CATEGORIES } from "./types";

function cosineSimilarity(
  a: Record<string, number>,
  aMag: number,
  b: Record<string, number>,
  bMag: number
): number {
  let dot = 0;
  for (const key of Object.keys(a)) {
    if (b[key]) dot += a[key] * b[key];
  }
  return dot / (aMag * bMag || 1);
}

export function classifyNearestCentroid(
  input: string,
  model: ClassifierModel
): Record<TopicCategory, number> {
  const processed = tokenize(input);
  const terms = getFeatureTerms(processed);
  const vector = vectorizeInput(terms, model.vocabulary, model.idf);
  let magSq = 0;
  for (const v of Object.values(vector)) magSq += v * v;
  const magnitude = Math.sqrt(magSq) || 1;

  const scores = {} as Record<TopicCategory, number>;
  for (const centroid of model.categoryCentroids) {
    scores[centroid.category] = cosineSimilarity(
      vector,
      magnitude,
      centroid.vector,
      centroid.magnitude
    );
  }
  for (const cat of TOPIC_CATEGORIES) {
    if (scores[cat] === undefined) scores[cat] = 0;
  }
  return scores;
}
