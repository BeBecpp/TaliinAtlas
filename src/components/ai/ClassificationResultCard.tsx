"use client";

import type { ClassificationResult } from "@/lib/ml/types";
import MatchedSignals from "./MatchedSignals";

interface ClassificationResultCardProps {
  result: ClassificationResult | null;
}

export default function ClassificationResultCard({
  result,
}: ClassificationResultCardProps) {
  if (!result) return null;

  const label = result.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="rounded-xl border border-atlas-primary/25 bg-atlas-primary/5 p-4">
      <p className="text-sm font-semibold text-atlas-text">
        Predicted: <span className="text-atlas-primary">{label}</span> (
        {Math.round(result.confidence * 100)}%)
      </p>
      <p className="mt-1 text-xs text-atlas-muted">{result.explanation}</p>
      <MatchedSignals signals={result.matchedSignals} className="mt-2" />
      {result.alternatives.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[10px] uppercase text-atlas-muted">Alternatives</p>
          <div className="flex flex-wrap gap-2">
            {result.alternatives.map((alt) => (
              <span
                key={alt.category}
                className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-atlas-muted"
              >
                {alt.category} ({Math.round(alt.confidence * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-2 text-[10px] text-atlas-muted">
        Tokens: {result.tokens.join(", ") || "—"}
      </p>
    </div>
  );
}
