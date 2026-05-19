"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react";
import type { AtlasNodeData, NodeStatus } from "@/types/atlas";

export type AtlasFlowNodeData = {
  node: AtlasNodeData;
  selected: boolean;
  onSelect: (id: string) => void;
};

const statusConfig: Record<
  NodeStatus,
  { border: string; glow: string; badge: string; label: string }
> = {
  locked: {
    border: "border-atlas-locked/50",
    glow: "",
    badge: "bg-atlas-locked/20 text-atlas-locked",
    label: "Locked",
  },
  available: {
    border: "border-atlas-primary",
    glow: "shadow-glow",
    badge: "bg-atlas-primary/20 text-atlas-primary",
    label: "Available",
  },
  completed: {
    border: "border-atlas-completed",
    glow: "shadow-glow-green",
    badge: "bg-atlas-completed/20 text-atlas-completed",
    label: "Completed",
  },
};

function StatusIcon({ status, isMastery }: { status: NodeStatus; isMastery?: boolean }) {
  if (isMastery) return <Crown className="h-4 w-4 text-atlas-warning" />;
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-atlas-completed" />;
  if (status === "available") return <Sparkles className="h-4 w-4 text-atlas-cyan" />;
  return <Lock className="h-4 w-4 text-atlas-locked" />;
}

function AtlasNodeComponent({ data }: NodeProps<AtlasFlowNodeData>) {
  const { node, selected, onSelect } = data;
  const config = statusConfig[node.status];
  const isLocked = node.status === "locked";
  const isMastery = node.isMastery;

  const handleClick = () => {
    if (!isLocked) onSelect(node.id);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-atlas-cyan/50 !bg-atlas-cyan"
      />
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isLocked ? 0.55 : 1, scale: 1 }}
        whileHover={!isLocked ? { scale: 1.03 } : undefined}
        onClick={handleClick}
        className={`
          relative w-[200px] rounded-xl border-2 bg-atlas-card/90 p-3 backdrop-blur-md
          ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}
          transition-all duration-300
          ${config.border} ${config.glow}
          ${selected ? "ring-2 ring-atlas-cyan ring-offset-2 ring-offset-atlas-bg" : ""}
          ${isMastery ? "border-atlas-warning/80 bg-gradient-to-br from-atlas-card via-atlas-card to-amber-950/30" : ""}
        `}
      >
        {isMastery && (
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-atlas-warning/30 via-atlas-primary/20 to-atlas-cyan/30 opacity-60"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-atlas-primary/5 to-atlas-cyan/5"
          animate={
            node.status === "available"
              ? { opacity: [0.3, 0.6, 0.3] }
              : { opacity: 0.2 }
          }
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <motion.div className="relative z-10">
          <motion.div
            className="mb-2 flex items-center justify-between"
            layout
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isMastery
                  ? "bg-atlas-warning/20"
                  : node.status === "completed"
                    ? "bg-atlas-completed/20"
                    : node.status === "available"
                      ? "bg-atlas-primary/20"
                      : "bg-atlas-locked/15"
              }`}
            >
              {isMastery ? (
                <Crown className="h-4 w-4 text-atlas-warning" />
              ) : (
                <BookOpen
                  className={`h-4 w-4 ${
                    node.status === "completed"
                      ? "text-atlas-completed"
                      : node.status === "available"
                        ? "text-atlas-primary"
                        : "text-atlas-locked"
                  }`}
                />
              )}
            </div>
            <StatusIcon status={node.status} isMastery={isMastery} />
          </motion.div>

          <h3 className="mb-1 text-sm font-semibold leading-tight text-atlas-text">
            {node.title}
          </h3>
          <p className="mb-2 text-xs text-atlas-muted">Level {node.level}</p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${config.badge}`}
          >
            {isMastery ? "Mastery" : config.label}
          </span>
        </motion.div>
      </motion.div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-atlas-primary/50 !bg-atlas-primary"
      />
    </>
  );
}

export default memo(AtlasNodeComponent);
