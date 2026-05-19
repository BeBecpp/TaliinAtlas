"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Play, Sparkles } from "lucide-react";
import ClassificationResultCard from "@/components/ai/ClassificationResultCard";
import AIModelDebugPanel from "@/components/ai/AIModelDebugPanel";
import type { ClassificationResult } from "@/lib/ml/types";

export default function AILabPanel() {
  const [input, setInput] = useState("Learn React Hooks");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runClassification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (data.success) setResult(data.classification);
      else setError(data.error ?? "Classification failed");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 py-10 md:px-8"
    >
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-atlas-cyan">
          <FlaskConical className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-widest">Diagnostics</span>
        </div>
        <h1 className="text-3xl font-bold text-atlas-text">AI Lab</h1>
        <p className="mt-2 text-atlas-muted">
          Inspect the local ML/NLP pipeline — tokenizer, ensemble classifier, and model artifact.
        </p>
      </div>

      <div className="glass-card mb-6 rounded-2xl border border-atlas-primary/25 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-atlas-text">
          <Sparkles className="h-4 w-4 text-atlas-primary" />
          Model artifact
        </h2>
        <AIModelDebugPanel />
      </div>

      <div className="glass-card rounded-2xl border border-atlas-cyan/20 p-6">
        <label className="mb-2 block text-sm font-medium text-atlas-muted">
          Test classification input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-xl border border-white/10 bg-atlas-bg/80 px-4 py-3 text-sm text-atlas-text outline-none focus:border-atlas-cyan/40"
          placeholder="e.g. Learn async await and promises"
        />
        <button
          type="button"
          onClick={runClassification}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Play className="h-4 w-4" />
          {loading ? "Running pipeline..." : "Run classification"}
        </button>
        {error && <p className="mt-3 text-sm text-atlas-warning">{error}</p>}
        <motion.div className="mt-4">
          <ClassificationResultCard result={result} />
        </motion.div>
      </div>

      <p className="mt-6 text-center text-xs text-atlas-muted">
        Pipeline: normalize → tokenize → TF-IDF + Naive Bayes + centroid ensemble → template select
      </p>
    </motion.div>
  );
}
