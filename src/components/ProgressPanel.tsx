"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Target,
  TrendingUp,
  Unlock,
} from "lucide-react";
import type { ProgressStats } from "@/types/atlas";

interface ProgressPanelProps {
  stats: ProgressStats;
  topic: string;
}

export default function ProgressPanel({ stats, topic }: ProgressPanelProps) {
  const items = [
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-atlas-completed",
    },
    {
      label: "Unlocked",
      value: stats.unlocked,
      icon: Unlock,
      color: "text-atlas-cyan",
    },
    {
      label: "Locked",
      value: stats.locked,
      icon: Lock,
      color: "text-atlas-locked",
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card flex flex-col gap-4 rounded-2xl border border-white/10 p-5"
    >
      <motion.div className="flex items-center gap-2" layout>
        <TrendingUp className="h-5 w-5 text-atlas-primary" />
        <h2 className="text-lg font-semibold text-atlas-text">Progress</h2>
      </motion.div>

      <p className="text-xs text-atlas-muted line-clamp-2">{topic}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-atlas-muted">Mastery</span>
          <span className="font-bold text-atlas-primary">{stats.masteryPercent}%</span>
        </div>
        <motion.div className="h-2 overflow-hidden rounded-full bg-atlas-bg">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-atlas-primary to-atlas-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${stats.masteryPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {items.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-white/5 bg-atlas-bg/50 p-3 text-center"
          >
            <Icon className={`mx-auto mb-1 h-4 w-4 ${color}`} />
            <p className="text-lg font-bold text-atlas-text">{value}</p>
            <p className="text-[10px] uppercase tracking-wide text-atlas-muted">
              {label}
            </p>
          </div>
        ))}
      </div>

      {stats.nextRecommended && (
        <div className="rounded-xl border border-atlas-cyan/20 bg-atlas-cyan/5 p-3">
          <motion.div className="mb-1 flex items-center gap-1 text-xs font-medium text-atlas-cyan">
            <Target className="h-3.5 w-3.5" />
            Next recommended
          </motion.div>
          <p className="text-sm font-medium text-atlas-text">
            {stats.nextRecommended.title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-atlas-muted">
            Level {stats.nextRecommended.level}
            <ArrowRight className="h-3 w-3" />
            Start learning
          </p>
        </div>
      )}
    </motion.aside>
  );
}
