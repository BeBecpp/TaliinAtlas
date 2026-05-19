"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Map } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AtlasMap from "@/components/AtlasMap";
import LessonPanel from "@/components/LessonPanel";
import ProgressPanel from "@/components/ProgressPanel";
import ExportButton from "@/components/ExportButton";
import AIEngineBadge from "@/components/ai/AIEngineBadge";
import SaveAtlasButton from "@/components/library/SaveAtlasButton";
import { useAtlasWorkspace } from "@/context/AtlasWorkspaceContext";

export default function AtlasExperience() {
  const {
    topic,
    setTopic,
    learningMode,
    setLearningMode,
    atlasLoaded,
    atlas,
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    feedback,
    stats,
    fogOpacity,
    prerequisiteTitles,
    handleGenerate,
    handleQuizAnswer,
    handleExport,
    handleReset,
    engineMeta,
    isGenerating,
    generateError,
  } = useAtlasWorkspace();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <>
      <HeroSection
        topic={topic}
        onTopicChange={setTopic}
        learningMode={learningMode}
        onModeChange={setLearningMode}
        onGenerate={handleGenerate}
        atlasLoaded={atlasLoaded}
        isGenerating={isGenerating}
      />

      {generateError && (
        <div className="mx-auto mb-4 max-w-[1600px] px-4 md:px-8">
          <p className="rounded-xl border border-atlas-warning/30 bg-atlas-warning/10 px-4 py-2 text-sm text-atlas-warning">
            {generateError} — loaded fallback atlas.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {atlasLoaded ? (
          <motion.section
            key="atlas"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mx-auto max-w-[1600px] px-4 pb-16 md:px-8"
          >
            <AIEngineBadge engine={engineMeta} loading={isGenerating} />
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-atlas-text md:text-2xl">
                  <Map className="h-6 w-6 text-atlas-primary" />
                  {atlas.topic}
                </h2>
                <p className="text-sm text-atlas-muted">{atlas.description}</p>
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <SaveAtlasButton />
                <ExportButton onExport={handleExport} onReset={handleReset} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
              <div id="progress" className="scroll-mt-24 lg:col-span-3">
                <ProgressPanel stats={stats} topic={atlas.topic} />
              </div>

              <div className="lg:col-span-5">
                <AtlasMap
                  atlas={atlas}
                  nodes={nodes}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  fogOpacity={fogOpacity}
                />
              </div>

              <div className="hidden lg:col-span-4 lg:block">
                <LessonPanel
                  node={selectedNode}
                  prerequisiteTitles={prerequisiteTitles}
                  onClose={() => setSelectedNodeId(null)}
                  onQuizAnswer={handleQuizAnswer}
                  feedback={feedback}
                />
                {!selectedNode && (
                  <motion.div className="glass-card flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center">
                    <Map className="mb-3 h-10 w-10 text-atlas-muted/50" />
                    <p className="text-sm text-atlas-muted">
                      Select an available node on the map to open its lesson and quiz.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {selectedNode && (
              <div className="mt-4 lg:hidden">
                <LessonPanel
                  node={selectedNode}
                  prerequisiteTitles={prerequisiteTitles}
                  onClose={() => setSelectedNodeId(null)}
                  onQuizAnswer={handleQuizAnswer}
                  feedback={feedback}
                />
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-lg px-4 pb-24 text-center"
          >
            <motion.div
              className="glass-card rounded-2xl border border-dashed border-white/10 p-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Map className="mx-auto mb-4 h-12 w-12 text-atlas-primary/60" />
              <p className="text-atlas-muted">
                Enter a topic and click{" "}
                <span className="font-medium text-atlas-cyan">Generate Atlas</span>{" "}
                to reveal your knowledge map.
              </p>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
