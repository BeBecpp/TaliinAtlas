"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-atlas-bg/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-atlas-warning/30 bg-atlas-card p-5"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="mb-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-atlas-warning" />
              <div>
                <h3 className="font-semibold text-atlas-text">Delete atlas?</h3>
                <p className="mt-1 text-sm text-atlas-muted">
                  &ldquo;{title}&rdquo; will be removed from your personal vault on this device.
                </p>
              </div>
              <button type="button" onClick={onClose} className="ml-auto text-atlas-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
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
                  onConfirm();
                  onClose();
                }}
                className="flex-1 rounded-xl bg-atlas-warning/90 py-2 text-sm font-medium text-atlas-bg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
