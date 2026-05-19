"use client";

import { motion } from "framer-motion";
import { Suspense, type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AtlasWorkspaceProvider } from "@/context/AtlasWorkspaceContext";
import AuthModal from "@/components/auth/AuthModal";
import UnsavedChangesDialog from "@/components/library/UnsavedChangesDialog";
import Navbar from "@/components/layout/Navbar";

function ProvidersInner({ children }: { children: ReactNode }) {
  return (
    <AtlasWorkspaceProvider>
      <Navbar />
      {children}
      <AuthModal />
      <UnsavedChangesDialog />
    </AtlasWorkspaceProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <motion.div className="flex min-h-screen items-center justify-center bg-atlas-bg text-atlas-muted">
            Loading TaliinAtlas...
          </motion.div>
        }
      >
        <ProvidersInner>{children}</ProvidersInner>
      </Suspense>
    </AuthProvider>
  );
}
