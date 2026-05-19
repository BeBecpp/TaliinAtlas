"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";

interface ExportButtonProps {
  onExport: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function ExportButton({
  onExport,
  onReset,
  disabled,
}: ExportButtonProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        type="button"
        onClick={onExport}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl border border-atlas-cyan/30 bg-atlas-cyan/10 px-4 py-2 text-sm font-medium text-atlas-cyan transition hover:bg-atlas-cyan/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-4 w-4" />
        Export Atlas JSON
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-atlas-bg/80 px-4 py-2 text-sm font-medium text-atlas-muted transition hover:border-atlas-warning/40 hover:text-atlas-warning disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Atlas
      </button>
    </motion.div>
  );
}
