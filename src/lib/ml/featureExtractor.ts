import { TRAINING_EXAMPLES } from "@/data/ml/trainingExamples";
import type { TrainingExample, TopicCategory, TaliinAtlasModelArtifact } from "./types";
import { getFeatureTerms, tokenize } from "./tokenizer";
import { TOPIC_CATEGORIES } from "./types";

const SMOOTHING = 1.0;

export function buildVocabulary(examples: TrainingExample[]): string[] {
  const vocab = new Set<string>();
  for (const ex of examples) {
    const processed = tokenize(ex.input);
    for (const term of getFeatureTerms(processed)) vocab.add(term);
    for (const tag of ex.tags) vocab.add(tag.toLowerCase());
  }
  return [...vocab].sort();
}

export function computeIdf(
  examples: TrainingExample[],
  vocabulary: string[]
): Record<string, number> {
  const docFreq: Record<string, number> = {};
  for (const term of vocabulary) docFreq[term] = 0;

  for (const ex of examples) {
    const processed = tokenize(ex.input);
    const terms = new Set([...getFeatureTerms(processed), ...ex.tags.map((t) => t.toLowerCase())]);
    for (const term of terms) {
      if (docFreq[term] !== undefined) docFreq[term]++;
    }
  }

  const n = examples.length;
  const idf: Record<string, number> = {};
  for (const term of vocabulary) {
    const df = docFreq[term] ?? 0;
    idf[term] = Math.log((n + 1) / (df + 1)) + 1;
  }
  return idf;
}

export function computeCategoryPriors(
  examples: TrainingExample[]
): Record<TopicCategory, number> {
  const counts = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, 0])
  ) as Record<TopicCategory, number>;
  for (const ex of examples) counts[ex.category]++;
  const total = examples.length;
  const priors = {} as Record<TopicCategory, number>;
  for (const cat of TOPIC_CATEGORIES) {
    priors[cat] = (counts[cat] + SMOOTHING) / (total + SMOOTHING * TOPIC_CATEGORIES.length);
  }
  return priors;
}

export function computeCategoryTokenWeights(
  examples: TrainingExample[],
  vocabulary: string[]
): Record<TopicCategory, Record<string, number>> {
  const weights = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, {} as Record<string, number>])
  ) as Record<TopicCategory, Record<string, number>>;

  const catDocCount = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, 0])
  ) as Record<TopicCategory, number>;
  const catTermCount = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, {} as Record<string, number>])
  ) as Record<TopicCategory, Record<string, number>>;

  for (const ex of examples) {
    catDocCount[ex.category]++;
    const processed = tokenize(ex.input);
    const terms = [...getFeatureTerms(processed), ...ex.tags.map((t) => t.toLowerCase())];
    for (const term of terms) {
      if (!vocabulary.includes(term)) continue;
      catTermCount[ex.category][term] = (catTermCount[ex.category][term] ?? 0) + 1;
    }
  }

  for (const cat of TOPIC_CATEGORIES) {
    const denom =
      Object.values(catTermCount[cat]).reduce((a, b) => a + b, 0) +
      SMOOTHING * vocabulary.length;
    for (const term of vocabulary) {
      const count = catTermCount[cat][term] ?? 0;
      weights[cat][term] = Math.log((count + SMOOTHING) / (denom || 1));
    }
  }
  return weights;
}

export function computeCategoryCentroids(
  examples: TrainingExample[],
  vocabulary: string[],
  idf: Record<string, number>
): TaliinAtlasModelArtifact["categoryCentroids"] {
  const sums = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, {} as Record<string, number>])
  ) as Record<TopicCategory, Record<string, number>>;
  const counts = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, 0])
  ) as Record<TopicCategory, number>;

  for (const ex of examples) {
    counts[ex.category]++;
    const processed = tokenize(ex.input);
    const terms = [...getFeatureTerms(processed), ...ex.tags.map((t) => t.toLowerCase())];
    const tf: Record<string, number> = {};
    for (const term of terms) tf[term] = (tf[term] ?? 0) + 1;
    for (const term of vocabulary) {
      const weight = (tf[term] ?? 0) * (idf[term] ?? 1);
      sums[ex.category][term] = (sums[ex.category][term] ?? 0) + weight;
    }
  }

  return TOPIC_CATEGORIES.map((category) => {
    const vector: Record<string, number> = {};
    let magnitudeSq = 0;
    for (const term of vocabulary) {
      const v = (sums[category][term] ?? 0) / Math.max(counts[category], 1);
      vector[term] = v;
      magnitudeSq += v * v;
    }
    return { category, vector, magnitude: Math.sqrt(magnitudeSq) || 1 };
  });
}

export function vectorizeInput(
  processedTerms: string[],
  vocabulary: string[],
  idf: Record<string, number>
): Record<string, number> {
  const tf: Record<string, number> = {};
  for (const term of processedTerms) tf[term] = (tf[term] ?? 0) + 1;
  const vector: Record<string, number> = {};
  for (const term of vocabulary) {
    vector[term] = (tf[term] ?? 0) * (idf[term] ?? 1);
  }
  return vector;
}

export function trainModelFromExamples(
  examples: TrainingExample[] = TRAINING_EXAMPLES
): Omit<TaliinAtlasModelArtifact, "evaluation"> {
  const vocabulary = buildVocabulary(examples);
  const idf = computeIdf(examples, vocabulary);
  const categoryPriors = computeCategoryPriors(examples);
  const categoryTokenWeights = computeCategoryTokenWeights(examples, vocabulary);
  const categoryCentroids = computeCategoryCentroids(examples, vocabulary, idf);

  return {
    modelName: "TaliinAtlas Custom ML Engine",
    version: "0.1.0",
    trainedAt: new Date().toISOString(),
    categories: [...TOPIC_CATEGORIES],
    trainingExampleCount: examples.length,
    vocabularySize: vocabulary.length,
    categoryPriors,
    idf,
    categoryTokenWeights,
    categoryCentroids,
    vocabulary,
  };
}
