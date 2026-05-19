"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-atlas-primary/30 bg-atlas-primary/10 px-2 py-1.5 pl-1.5 text-sm text-atlas-text transition hover:border-atlas-cyan/40"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-atlas-primary to-atlas-cyan text-sm font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[100px] truncate sm:inline">{user.name}</span>
        <ChevronDown className={`h-4 w-4 text-atlas-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-atlas-card/95 shadow-xl backdrop-blur-xl"
          >
            <div className="border-b border-white/10 px-4 py-3">
              <p className="truncate text-sm font-medium text-atlas-text">{user.name}</p>
              <p className="truncate text-xs text-atlas-muted">{user.email}</p>
            </div>
            <nav className="p-1">
              <Link
                href="/library"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-atlas-muted hover:bg-white/5 hover:text-atlas-text"
              >
                <BookOpen className="h-4 w-4" />
                My Atlases
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-atlas-muted hover:bg-white/5 hover:text-atlas-text"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-atlas-warning hover:bg-atlas-warning/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
            <div className="border-t border-white/10 px-3 py-2">
              <p className="flex items-center gap-1 text-[10px] text-atlas-muted">
                <Sparkles className="h-3 w-3" />
                Local demo profile
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
