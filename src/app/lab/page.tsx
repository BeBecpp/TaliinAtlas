"use client";

import AILabPanel from "@/components/lab/AILabPanel";

export default function LabPage() {
  return (
    <main className="relative min-h-screen bg-atlas-bg bg-stars pb-16">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-0 h-80 w-80 rounded-full bg-atlas-primary/10 blur-[120px]" />
      </div>
      <AILabPanel />
    </main>
  );
}
