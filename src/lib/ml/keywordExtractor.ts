import { CATEGORY_DEFINITIONS } from "@/data/ml/categoryDefinitions";
import type { ProcessedText, TopicCategory } from "./types";

export function extractMatchedSignals(
  processed: ProcessedText,
  category: TopicCategory
): string[] {
  const def = CATEGORY_DEFINITIONS.find((c) => c.id === category);
  if (!def) return processed.signals.slice(0, 6);

  const matched: string[] = [];
  for (const kw of def.signalKeywords) {
    const k = kw.toLowerCase();
    if (
      processed.normalized.includes(k) ||
      processed.tokens.some((t) => t.includes(k) || k.includes(t))
    ) {
      matched.push(kw);
    }
  }
  for (const t of processed.tokens) {
    if (matched.length >= 8) break;
    if (!matched.includes(t)) matched.push(t);
  }
  return matched.slice(0, 8);
}
