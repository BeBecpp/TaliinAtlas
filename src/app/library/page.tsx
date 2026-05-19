"use client";

import { motion } from "framer-motion";
import MyAtlases from "@/components/library/MyAtlases";

export default function LibraryPage() {
  return (
    <main className="relative min-h-screen bg-atlas-bg bg-stars pb-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div className="absolute left-1/3 top-20 h-72 w-72 rounded-full bg-atlas-primary/5 blur-[100px]" />
      </div>
      <MyAtlases />
    </main>
  );
}
