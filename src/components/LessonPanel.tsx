"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import type { AtlasNodeData, ExplainMode, NodeStatus } from "@/types/atlas";

interface LessonPanelProps {
  node: AtlasNodeData | null;
  prerequisiteTitles: string[];
  onClose: () => void;
  onQuizAnswer: (nodeId: string, optionIndex: number) => void;
  feedback: { type: "success" | "error"; message: string } | null;
}

const explainButtons: { mode: ExplainMode; label: string }[] = [
  { mode: "simple", label: "Explain simply" },
  { mode: "example", label: "Give example" },
  { mode: "eli12", label: "Explain like I'm 12" },
  { mode: "mongolian", label: "Explain in Mongolian" },
];

const statusLabels: Record<NodeStatus, string> = {
  locked: "Locked",
  available: "Available",
  completed: "Completed",
};

function getLocalExplanation(node: AtlasNodeData, mode: ExplainMode): string {
  if (mode === "default") return node.explanation;
  const variants = node.explainVariants;
  switch (mode) {
    case "simple":
      return variants?.simple ?? "In simple terms: " + node.explanation.slice(0, 120) + "...";
    case "example":
      return variants?.example ?? "See the code example below and trace each step.";
    case "eli12":
      return variants?.eli12 ?? "Imagine each concept is a level in a game.";
    case "mongolian":
      return variants?.mongolian ?? "Монгол тайлбар: " + node.summary;
    default:
      return node.explanation;
  }
}

export default function LessonPanel({
  node,
  prerequisiteTitles,
  onClose,
  onQuizAnswer,
  feedback,
}: LessonPanelProps) {
  const [explainMode, setExplainMode] = useState<ExplainMode>("default");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setExplainMode("default");
  }, [node?.id]);

  useEffect(() => {
    if (!node) {
      setExplanation("");
      return;
    }
    if (explainMode === "default") {
      setExplanation(node.explanation);
      return;
    }

    let cancelled = false;
    setExplainLoading(true);
    fetch("/api/ai/explain-node", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node, mode: explainMode }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setExplanation(data.success ? data.explanation : getLocalExplanation(node, explainMode));
      })
      .catch(() => {
        if (!cancelled) setExplanation(getLocalExplanation(node, explainMode));
      })
      .finally(() => {
        if (!cancelled) setExplainLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [node, explainMode]);

  const handleOptionClick = (index: number) => {
    if (!node || node.status === "completed") return;
    setSelectedOption(index);
    onQuizAnswer(node.id, index);
  };

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="glass-card flex h-full max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-white/10 md:max-h-none"
        >
          <div className="flex items-start justify-between border-b border-white/10 p-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-atlas-primary" />
                <span className="text-xs uppercase tracking-wide text-atlas-muted">
                  Level {node.level}
                </span>
              </div>
              <h2 className="text-lg font-bold text-atlas-text">{node.title}</h2>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                  node.status === "completed"
                    ? "bg-atlas-completed/20 text-atlas-completed"
                    : node.status === "available"
                      ? "bg-atlas-primary/20 text-atlas-primary"
                      : "bg-atlas-locked/20 text-atlas-locked"
                }`}
              >
                {statusLabels[node.status]}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-atlas-muted transition hover:bg-white/10 hover:text-atlas-text"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
                  feedback.type === "success"
                    ? "border-atlas-completed/30 bg-atlas-completed/10 text-atlas-completed"
                    : "border-atlas-warning/30 bg-atlas-warning/10 text-atlas-warning"
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            <p className="mb-4 text-sm text-atlas-muted">{node.summary}</p>

            <div className="mb-4">
              <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-atlas-text">
                <Sparkles className="h-4 w-4 text-atlas-cyan" />
                AI explanation modes
              </h3>
              <div className="flex flex-wrap gap-2">
                {explainButtons.map(({ mode, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setExplainMode(mode)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                      explainMode === mode
                        ? "border-atlas-cyan bg-atlas-cyan/15 text-atlas-cyan"
                        : "border-white/10 text-atlas-muted hover:border-atlas-primary/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {explainMode !== "default" && (
                  <button
                    type="button"
                    onClick={() => setExplainMode("default")}
                    className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-atlas-muted"
                  >
                    Default
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-white/5 bg-atlas-bg/50 p-3">
              <h3 className="mb-2 text-sm font-semibold text-atlas-text">Explanation</h3>
              <p className="text-sm leading-relaxed text-atlas-muted">
                {explainLoading ? "Generating explanation..." : explanation}
              </p>
            </div>

            <motion.div className="mb-4" layout>
              <h3 className="mb-2 text-sm font-semibold text-atlas-text">Example</h3>
              <pre className="overflow-x-auto rounded-xl border border-atlas-primary/20 bg-atlas-bg p-3 text-xs leading-relaxed text-atlas-cyan">
                <code>{node.example}</code>
              </pre>
            </motion.div>

            {prerequisiteTitles.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-atlas-text">Prerequisites</h3>
                <ul className="space-y-1">
                  {prerequisiteTitles.map((title) => (
                    <li
                      key={title}
                      className="flex items-center gap-2 text-sm text-atlas-muted"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-atlas-completed" />
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-atlas-primary/20 bg-atlas-primary/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-atlas-text">Quiz</h3>
              <p className="mb-3 text-sm text-atlas-muted">{node.quizQuestion}</p>
              <div className="space-y-2">
                {node.quizOptions.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect =
                    node.status === "completed" && index === node.correctAnswer;
                  const isWrong =
                    isSelected &&
                    index !== node.correctAnswer &&
                    feedback?.type === "error";

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={node.status === "completed"}
                      onClick={() => handleOptionClick(index)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                        isCorrect
                          ? "border-atlas-completed bg-atlas-completed/15 text-atlas-completed"
                          : isWrong
                            ? "border-atlas-warning/50 bg-atlas-warning/10 text-atlas-warning"
                            : isSelected
                              ? "border-atlas-primary bg-atlas-primary/15 text-atlas-text"
                              : "border-white/10 bg-atlas-bg/60 text-atlas-muted hover:border-atlas-primary/40"
                      } disabled:cursor-default`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {node.status === "completed" && (
                <p className="mt-3 flex items-center gap-1 text-xs text-atlas-completed">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Concept mastered
                </p>
              )}
              {node.status === "locked" && (
                <p className="mt-3 flex items-center gap-1 text-xs text-atlas-locked">
                  <Lock className="h-3.5 w-3.5" />
                  Complete prerequisites to unlock quiz
                </p>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
