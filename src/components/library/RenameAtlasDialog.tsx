"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface RenameAtlasDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export default function RenameAtlasDialog({
  open,
  currentTitle,
  onClose,
  onConfirm,
}: RenameAtlasDialogProps) {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    if (open) setTitle(currentTitle);
  }, [open, currentTitle]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-atlas-bg/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-atlas-card p-5 shadow-glow"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-atlas-text">Rename atlas</h3>
              <button type="button" onClick={onClose} className="text-atlas-muted hover:text-atlas-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 w-full rounded-xl border border-white/10 bg-atlas-bg px-4 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-primary/50"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-atlas-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm(title);
                  onClose();
                }}
                className="flex-1 rounded-xl bg-atlas-primary py-2 text-sm font-medium text-white"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
