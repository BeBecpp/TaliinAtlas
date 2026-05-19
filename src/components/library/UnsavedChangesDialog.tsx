"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useAtlasWorkspace } from "@/context/AtlasWorkspaceContext";

export default function UnsavedChangesDialog() {
  const {
    showUnsavedDialog,
    cancelLeaveUnsaved,
    confirmLeaveUnsaved,
    saveCurrentAtlas,
  } = useAtlasWorkspace();

  const handleSaveAndLeave = () => {
    if (saveCurrentAtlas()) confirmLeaveUnsaved();
  };

  return (
    <AnimatePresence>
      {showUnsavedDialog && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-atlas-bg/80 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-atlas-warning/30 bg-atlas-card p-6 shadow-glow"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 shrink-0 text-atlas-warning" />
              <div>
                <h3 className="font-semibold text-atlas-text">Unsaved changes</h3>
                <p className="mt-1 text-sm text-atlas-muted">
                  You have unsaved changes. Save this atlas before leaving?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveAndLeave}
                className="flex-1 rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan py-2.5 text-sm font-medium text-white"
              >
                Save & continue
              </button>
              <button
                type="button"
                onClick={confirmLeaveUnsaved}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-atlas-muted"
              >
                Leave without saving
              </button>
              <button
                type="button"
                onClick={cancelLeaveUnsaved}
                className="flex-1 rounded-xl border border-atlas-cyan/30 py-2.5 text-sm text-atlas-cyan"
              >
                Stay
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
