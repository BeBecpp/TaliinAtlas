"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Layers } from "lucide-react";

interface ModelInfo {
  name: string;
  version: string;
  trainedAt: string;
  trainingExampleCount: number;
  vocabularySize: number;
  categories: string[];
  evaluation?: {
    accuracy: number;
    top2Accuracy: number;
  };
}

export default function AIModelDebugPanel() {
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ai/model-info")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setModel(data.model);
        else setError(data.error ?? "Failed to load");
      })
      .catch(() => setError("Network error"));
  }, []);

  if (error) {
    return <p className="text-sm text-atlas-warning">{error}</p>;
  }

  if (!model) {
    return <p className="text-sm text-atlas-muted">Loading model artifact...</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-atlas-bg/50 p-3">
        <Database className="mb-2 h-4 w-4 text-atlas-cyan" />
        <p className="text-xs text-atlas-muted">Training examples</p>
        <p className="text-lg font-bold text-atlas-text">{model.trainingExampleCount}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-atlas-bg/50 p-3">
        <Layers className="mb-2 h-4 w-4 text-atlas-primary" />
        <p className="text-xs text-atlas-muted">Vocabulary</p>
        <p className="text-lg font-bold text-atlas-text">{model.vocabularySize}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-atlas-bg/50 p-3">
        <Activity className="mb-2 h-4 w-4 text-atlas-completed" />
        <p className="text-xs text-atlas-muted">Test accuracy</p>
        <p className="text-lg font-bold text-atlas-text">
          {model.evaluation
            ? `${Math.round(model.evaluation.accuracy * 100)}%`
            : "—"}
        </p>
      </div>
    </div>
  );
}
