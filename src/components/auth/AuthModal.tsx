"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Wand2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    authMessage,
    closeAuthModal,
    setAuthModalMode,
    continueAsDemo,
  } = useAuth();

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-atlas-bg/80 backdrop-blur-sm"
            onClick={closeAuthModal}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-atlas-primary/30 bg-atlas-card/95 shadow-glow backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-atlas-primary/10 via-transparent to-atlas-cyan/10" />
            <div className="relative p-6">
              <button
                type="button"
                onClick={closeAuthModal}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-atlas-muted hover:bg-white/10 hover:text-atlas-text"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-atlas-primary/40 bg-atlas-primary/15 shadow-glow">
                  <Sparkles className="h-5 w-5 text-atlas-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-atlas-text">TaliinAtlas</h2>
                  <p className="text-xs text-atlas-muted">Personal knowledge vault</p>
                </div>
              </div>

              <p className="mb-2 text-sm font-medium text-atlas-text">
                {authModalMode === "login" ? "Welcome back" : "Create a local learner profile"}
              </p>
              {authMessage && (
                <p className="mb-4 rounded-lg border border-atlas-cyan/20 bg-atlas-cyan/5 px-3 py-2 text-xs text-atlas-cyan">
                  {authMessage}
                </p>
              )}
              <p className="mb-4 text-xs text-atlas-muted">
                Demo auth only — data stays on this device. Not production security.
              </p>

              <div className="mb-4 flex rounded-xl border border-white/10 bg-atlas-bg/60 p-1">
                <button
                  type="button"
                  onClick={() => setAuthModalMode("login")}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    authModalMode === "login"
                      ? "bg-atlas-primary/25 text-atlas-text"
                      : "text-atlas-muted"
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalMode("register")}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    authModalMode === "register"
                      ? "bg-atlas-primary/25 text-atlas-text"
                      : "text-atlas-muted"
                  }`}
                >
                  Register
                </button>
              </div>

              {authModalMode === "login" ? <LoginForm /> : <RegisterForm />}

              <div className="mt-5 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={continueAsDemo}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-atlas-cyan/30 bg-atlas-cyan/10 py-2.5 text-sm font-medium text-atlas-cyan transition hover:bg-atlas-cyan/20"
                >
                  <Wand2 className="h-4 w-4" />
                  Continue as Demo Learner
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
