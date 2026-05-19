import type { CategoryScore } from "./types";

export function normalizeScores(scores: CategoryScore[]): CategoryScore[] {
  const max = Math.max(...scores.map((s) => s.score), 1e-9);
  const expScores = scores.map((s) => Math.exp((s.score - max) * 2));
  const sum = expScores.reduce((a, b) => a + b, 0) || 1;
  return scores.map((s, i) => ({
    ...s,
    confidence: Math.round((expScores[i] / sum) * 1000) / 1000,
  }));
}

export function buildAlternatives(
  scores: CategoryScore[],
  topCategory: string,
  limit = 3
): Array<{ category: CategoryScore["category"]; confidence: number }> {
  return scores
    .filter((s) => s.category !== topCategory)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
    .map((s) => ({ category: s.category, confidence: s.confidence }));
}
