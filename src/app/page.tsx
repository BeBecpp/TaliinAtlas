"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AtlasExperience from "@/components/AtlasExperience";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-atlas-bg">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-atlas-muted"
        >
          Loading TaliinAtlas...
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-atlas-bg bg-stars">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-atlas-primary/5 blur-[120px]" />
        <motion.div
          className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-atlas-cyan/5 blur-[100px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      <AtlasExperience />
    </main>
  );
}
