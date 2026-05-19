import { TRAINING_EXAMPLES } from "@/data/ml/trainingExamples";
import type { ModelEvaluation, TopicCategory } from "./types";
import { classifyWithEnsemble, type ClassifierModel } from "./ensembleClassifier";
import { TOPIC_CATEGORIES } from "./types";

export function deterministicSplit<T>(items: T[], testRatio = 0.2): { train: T[]; test: T[] } {
  const test: T[] = [];
  const train: T[] = [];
  items.forEach((item, i) => {
    if (i % Math.round(1 / testRatio) === 0) test.push(item);
    else train.push(item);
  });
  return { train, test };
}

export function evaluateModel(model: ClassifierModel): ModelEvaluation {
  const { test } = deterministicSplit(TRAINING_EXAMPLES, 0.2);
  let correct = 0;
  let top2 = 0;

  const confusionMatrix = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, {} as Partial<Record<TopicCategory, number>>])
  ) as ModelEvaluation["confusionMatrix"];

  const categoryStats = Object.fromEntries(
    TOPIC_CATEGORIES.map((c) => [c, { support: 0, correct: 0, precision: 0, recall: 0 }])
  ) as ModelEvaluation["categoryMetrics"];

  for (const ex of test) {
    categoryStats[ex.category].support++;
    const result = classifyWithEnsemble(ex.input, model);
    confusionMatrix[ex.category][result.category] =
      (confusionMatrix[ex.category][result.category] ?? 0) + 1;

    if (result.category === ex.category) {
      correct++;
      categoryStats[ex.category].correct++;
    }
    const altCats = [result.category, ...result.alternatives.map((a) => a.category)];
    if (altCats.slice(0, 2).includes(ex.category)) top2++;
  }

  for (const cat of TOPIC_CATEGORIES) {
    const predicted = test.filter(
      (ex) => classifyWithEnsemble(ex.input, model).category === cat
    ).length;
    const truePositive = categoryStats[cat].correct;
    categoryStats[cat].precision = predicted ? truePositive / predicted : 0;
    categoryStats[cat].recall = categoryStats[cat].support
      ? truePositive / categoryStats[cat].support
      : 0;
  }

  return {
    accuracy: test.length ? correct / test.length : 0,
    top2Accuracy: test.length ? top2 / test.length : 0,
    categoryMetrics: categoryStats,
    confusionMatrix,
  };
}
