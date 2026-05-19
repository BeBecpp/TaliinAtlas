"use client";

import { motion } from "framer-motion";
import { Compass, Loader2, Map, Sparkles, Zap } from "lucide-react";
import type { LearningMode } from "@/types/atlas";
import { exampleTopics } from "@/data/sampleAtlas";

interface HeroSectionProps {
  topic: string;
  onTopicChange: (value: string) => void;
  learningMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  onGenerate: () => void;
  atlasLoaded: boolean;
  isGenerating?: boolean;
}

const modes: { id: LearningMode; label: string; icon: typeof Map }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "guided", label: "Guided", icon: Map },
  { id: "challenge", label: "Challenge", icon: Zap },
];

export default function HeroSection({
  topic,
  onTopicChange,
  learningMode,
  onModeChange,
  onGenerate,
  atlasLoaded,
  isGenerating = false,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-8 md:px-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-atlas-primary/20 blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-10 top-32 h-64 w-64 rounded-full bg-atlas-cyan/15 blur-[90px]"
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-atlas-primary/30 bg-atlas-primary/10">
            <Sparkles className="h-5 w-5 text-atlas-primary" />
          </div>
          <span className="text-sm font-medium tracking-widest text-atlas-cyan uppercase">
            TaliinAtlas
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-atlas-text md:text-5xl"
        >
          Turn any topic into an{" "}
          <span className="bg-gradient-to-r from-atlas-primary via-atlas-cyan to-atlas-primary bg-clip-text text-transparent">
            explorable learning world.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 max-w-2xl text-base text-atlas-muted md:text-lg"
        >
          TaliinAtlas transforms messy notes and learning goals into an interactive
          knowledge map where concepts unlock step by step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl border border-white/10 p-5 md:p-6"
        >
          <label className="mb-2 block text-sm font-medium text-atlas-muted">
            Learning topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Learn JavaScript Async"
            className="mb-4 w-full rounded-xl border border-white/10 bg-atlas-bg/80 px-4 py-3 text-atlas-text placeholder:text-atlas-muted/60 outline-none transition focus:border-atlas-primary/50 focus:ring-2 focus:ring-atlas-primary/20"
          />

          <label className="mb-2 block text-sm font-medium text-atlas-muted">
            Learning mode
          </label>
          <motion.div
            className="mb-5 flex flex-wrap gap-2"
            layout
          >
            {modes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onModeChange(id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  learningMode === id
                    ? "border-atlas-primary bg-atlas-primary/20 text-atlas-text shadow-glow"
                    : "border-white/10 bg-atlas-bg/50 text-atlas-muted hover:border-atlas-primary/30 hover:text-atlas-text"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan px-6 py-3.5 font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-70 md:w-auto md:min-w-[220px]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Map className="h-5 w-5" />
              )}
              {isGenerating
                ? "ML Engine generating..."
                : atlasLoaded
                  ? "Regenerate Atlas"
                  : "Generate Atlas"}
            </span>
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </button>

          <div className="mt-5">
            <p className="mb-2 text-xs text-atlas-muted">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    onTopicChange(chip);
                  }}
                  className="rounded-full border border-white/10 bg-atlas-bg/60 px-3 py-1.5 text-xs text-atlas-muted transition hover:border-atlas-cyan/40 hover:text-atlas-cyan"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
