"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Copy,
  Pencil,
  Play,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type { SavedAtlas } from "@/types/savedAtlas";
import {
  getCompletedCount,
  getMasteryPercent,
} from "@/lib/storage/savedAtlasStorage";

interface SavedAtlasCardProps {
  atlas: SavedAtlas;
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export default function SavedAtlasCard({
  atlas,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onToggleFavorite,
}: SavedAtlasCardProps) {
  const mastery = getMasteryPercent(atlas);
  const completed = getCompletedCount(atlas);
  const total = atlas.atlas.nodes.length;
  const lastOpened = new Date(atlas.lastOpenedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition hover:border-atlas-primary/30"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-atlas-primary/10 blur-2xl transition group-hover:bg-atlas-cyan/15" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-atlas-text line-clamp-1">{atlas.title}</h3>
            <p className="mt-0.5 text-xs text-atlas-muted line-clamp-2">{atlas.description}</p>
          </div>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`shrink-0 rounded-lg p-1.5 transition ${
              atlas.favorite
                ? "text-atlas-warning"
                : "text-atlas-muted hover:text-atlas-warning"
            }`}
            aria-label={atlas.favorite ? "Remove favorite" : "Add favorite"}
          >
            <Star className={`h-4 w-4 ${atlas.favorite ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-atlas-muted">
              <TrendingUp className="h-3.5 w-3.5 text-atlas-cyan" />
              Mastery
            </span>
            <span className="font-semibold text-atlas-primary">{mastery}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-atlas-bg">
            <div
              className="h-full rounded-full bg-gradient-to-r from-atlas-primary to-atlas-cyan"
              style={{ width: `${mastery}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-atlas-muted">
            {completed} / {total} concepts completed
          </p>
        </div>

        <p className="mb-4 flex items-center gap-1 text-[10px] text-atlas-muted">
          <Calendar className="h-3 w-3" />
          Last opened {lastOpened}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-atlas-primary/80 to-atlas-cyan/80 py-2 text-xs font-semibold text-white min-w-[120px]"
          >
            <Play className="h-3.5 w-3.5" />
            Continue Learning
          </button>
          <button
            type="button"
            onClick={onRename}
            className="rounded-lg border border-white/10 p-2 text-atlas-muted hover:text-atlas-text"
            aria-label="Rename"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-lg border border-white/10 p-2 text-atlas-muted hover:text-atlas-cyan"
            aria-label="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-white/10 p-2 text-atlas-muted hover:text-atlas-warning"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
