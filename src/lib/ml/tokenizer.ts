import { STOPWORDS } from "@/data/ml/stopwords";
import { CATEGORY_DEFINITIONS } from "@/data/ml/categoryDefinitions";
import type { ProcessedText } from "./types";
import { lightStem, normalizeText } from "./textNormalizer";

export function tokenize(input: string): ProcessedText {
  const raw = input.trim();
  const normalized = normalizeText(raw);
  const rawTokens = normalized.split(" ").filter(Boolean);

  const tokens = rawTokens
    .map(lightStem)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
  }

  const signalSet = new Set<string>();
  for (const def of CATEGORY_DEFINITIONS) {
    for (const kw of def.signalKeywords) {
      const stemmed = lightStem(kw.toLowerCase());
      if (tokens.includes(stemmed) || normalized.includes(kw.toLowerCase())) {
        signalSet.add(stemmed);
      }
    }
  }
  for (const t of tokens) {
    if (t.length >= 4) signalSet.add(t);
  }

  return {
    raw,
    normalized,
    tokens: [...new Set(tokens)],
    bigrams: [...new Set(bigrams)],
    signals: [...signalSet],
  };
}

export function getFeatureTerms(processed: ProcessedText): string[] {
  return [...processed.tokens, ...processed.bigrams];
}
