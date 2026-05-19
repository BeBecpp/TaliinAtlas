"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Library, Search, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  deleteAtlas,
  duplicateAtlas,
  filterAtlases,
  getAtlasesByUser,
  renameAtlas,
  sortAtlases,
  toggleFavorite,
} from "@/lib/storage/savedAtlasStorage";
import type { SavedAtlas, SavedAtlasSort } from "@/types/savedAtlas";
import SavedAtlasCard from "./SavedAtlasCard";
import RenameAtlasDialog from "./RenameAtlasDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function MyAtlases() {
  const { user, isAuthenticated, isReady, openAuthModal } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SavedAtlasSort>("recent");
  const [refreshKey, setRefreshKey] = useState(0);
  const [renameTarget, setRenameTarget] = useState<SavedAtlas | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedAtlas | null>(null);

  const atlases = useMemo(() => {
    if (!user) return [];
    const list = getAtlasesByUser(user.id);
    return sortAtlases(filterAtlases(list, query, favoritesOnly), sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, query, favoritesOnly, sort, refreshKey]);

  const bump = () => setRefreshKey((k) => k + 1);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-atlas-muted">
        Loading your vault...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <motion.div
          className="glass-card rounded-2xl border border-dashed border-white/10 p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Library className="mx-auto mb-4 h-12 w-12 text-atlas-primary/60" />
          <h2 className="mb-2 text-xl font-bold text-atlas-text">My Learning Worlds</h2>
          <p className="mb-6 text-sm text-atlas-muted">
            Create a free local profile to save your atlases on this device.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            className="rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Create a local learner profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-2 text-atlas-cyan">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-widest">Personal vault</span>
        </div>
        <h1 className="text-3xl font-bold text-atlas-text md:text-4xl">My Learning Worlds</h1>
        <p className="mt-2 text-atlas-muted">Your saved atlases — continue anytime on this device.</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-atlas-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your atlases..."
            className="w-full rounded-xl border border-white/10 bg-atlas-card/60 py-2.5 pl-10 pr-4 text-sm text-atlas-text outline-none focus:border-atlas-primary/40"
          />
        </div>
        <button
          type="button"
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
            favoritesOnly
              ? "border-atlas-warning/40 bg-atlas-warning/10 text-atlas-warning"
              : "border-white/10 text-atlas-muted hover:text-atlas-text"
          }`}
        >
          <Star className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
          Favorites
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SavedAtlasSort)}
          className="rounded-xl border border-white/10 bg-atlas-card/60 px-4 py-2.5 text-sm text-atlas-text outline-none"
        >
          <option value="recent">Recent</option>
          <option value="title">Title</option>
          <option value="progress">Progress</option>
        </select>
      </div>

      {atlases.length === 0 ? (
        <motion.div
          className="glass-card rounded-2xl border border-dashed border-white/10 p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Library className="mx-auto mb-4 h-14 w-14 text-atlas-muted/40" />
          <p className="text-lg text-atlas-muted">Your learning worlds will appear here.</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-cyan px-6 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Generate your first atlas
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atlases.map((atlas) => (
            <SavedAtlasCard
              key={atlas.id}
              atlas={atlas}
              onOpen={() => router.push(`/?saved=${atlas.id}`)}
              onRename={() => setRenameTarget(atlas)}
              onDuplicate={() => {
                if (user) duplicateAtlas(atlas.id, user.id);
                bump();
              }}
              onDelete={() => setDeleteTarget(atlas)}
              onToggleFavorite={() => {
                if (user) toggleFavorite(atlas.id, user.id);
                bump();
              }}
            />
          ))}
        </div>
      )}

      <RenameAtlasDialog
        open={Boolean(renameTarget)}
        currentTitle={renameTarget?.title ?? ""}
        onClose={() => setRenameTarget(null)}
        onConfirm={(title) => {
          if (renameTarget && user) renameAtlas(renameTarget.id, user.id, title);
          bump();
        }}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAtlas(deleteTarget.id);
          bump();
        }}
      />
    </div>
  );
}
