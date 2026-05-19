import type { TopicCategory } from "./types";
import type { ClassifierModel } from "./ensembleClassifier";
import { getFeatureTerms, tokenize } from "./tokenizer";
import { TOPIC_CATEGORIES } from "./types";

export function classifyNaiveBayes(
  input: string,
  model: ClassifierModel
): Record<TopicCategory, number> {
  const processed = tokenize(input);
  const terms = getFeatureTerms(processed);
  const scores = {} as Record<TopicCategory, number>;

  for (const cat of TOPIC_CATEGORIES) {
    let logScore = Math.log(model.categoryPriors[cat] ?? 1e-9);
    const weights = model.categoryTokenWeights[cat] ?? {};
    for (const term of terms) {
      if (weights[term] !== undefined) logScore += weights[term];
    }
    scores[cat] = logScore;
  }
  return scores;
}
