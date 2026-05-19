"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAtlasWorkspace } from "@/context/AtlasWorkspaceContext";

export default function SaveAtlasButton() {
  const { requireAuth } = useAuth();
  const { atlasLoaded, savedAtlasId, isUnsaved, saveCurrentAtlas } = useAtlasWorkspace();
  const [savedFlash, setSavedFlash] = useState(false);

  if (!atlasLoaded) return null;

  const handleSave = () => {
    if (!requireAuth(() => {})) return;
    const ok = saveCurrentAtlas(false);
    if (ok) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  };

  const handleSaveAsNew = () => {
    if (!requireAuth(() => {})) return;
    saveCurrentAtlas(true);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isUnsaved && (
        <span className="rounded-full border border-atlas-warning/40 bg-atlas-warning/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-atlas-warning">
          Unsaved
        </span>
      )}
      <button
        type="button"
        onClick={handleSave}
        className="flex items-center gap-2 rounded-xl border border-atlas-primary/40 bg-atlas-primary/15 px-4 py-2 text-sm font-medium text-atlas-primary transition hover:shadow-glow"
      >
        {savedFlash ? (
          <BookmarkCheck className="h-4 w-4 text-atlas-completed" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {savedAtlasId ? "Update Atlas" : "Save this Atlas"}
      </button>
      {savedAtlasId && (
        <button
          type="button"
          onClick={handleSaveAsNew}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-atlas-muted hover:border-atlas-cyan/30 hover:text-atlas-cyan"
        >
          Save as new
        </button>
      )}
    </div>
  );
}
